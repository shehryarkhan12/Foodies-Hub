import express, { Router, json } from 'express';
import { connect, Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pkg from 'bcryptjs';
const { compareSync } = pkg;
import axios from 'axios';
const { get } = axios;

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

import cors from 'cors';
const router = Router();
import config from './config.json' assert { type: 'json' };
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';

const GOOGLE_API_KEY = 'AIzaSyCQtKBnMaLZwiP4nL1L22djZhxWIW1nofo';
const app = express();
const PORT = 4000;
const SECRET_KEY = '0325';  // Change this!

//import { initializeApp, credential as _credential, messaging } from 'firebase-admin';
//import serviceAccount from 'path/to/serviceAccountKey.json'; // Your Firebase config file




const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: Object, default: {} },
    resetCode: { type: String, default: null },
    resetCodeExpires: { type: Date, default: null }
});

const User = model('User', userSchema);
const restaurantSchema = new Schema({
    name: String,
    address: String,
    contactDetails: {
        phone: String,
        email: String,
        website: String
    },
    openingHours: {
        monday: String,
        tuesday: String,
        // ... (rest of the days)
    },
    images: [String], // URLs to images
    menus: [{
        name: String,
        items: [{
            name: String,
            description: String,
            price: Number
        }]
    }],
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    cuisine: String,
    priceRange: Number, // You can define this as per your requirements (e.g., 1-5)
    rating: Number,
    dietaryOptions: [String], // E.g., ["Vegetarian", "Vegan"]
});
const Restaurant = model('Restaurant', restaurantSchema);
restaurantSchema.index({ location: '2dsphere' });

const reviewSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    dateCreated: { type: Date, default: Date.now }
});
const Review = model('Review', reviewSchema);

const userTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fcmToken: { type: String, required: true }
});

const UserToken = model('UserToken', userTokenSchema);



// const nearbyRestaurants = await Restaurant.find({
//     location: {
//         $near: {
//             $geometry: {
//                 type: 'Point',
//                 coordinates: [longitude, latitude]
//             },
//             $maxDistance: 5000  // 5km
//         }
//     }
// });



app.use(cors());
app.use(json());
app.use(bodyParser.json());

app.get('/search', async (req, res) => {
    try {
        console.log("Received query parameters:", req.query);
        const { latitude, longitude, cuisine, priceRange, rating, dietaryOptions } = req.query;
        const filters = {};

        if (latitude && longitude){
        console.log(`Received latitude: ${latitude}, longitude: ${longitude}`);

        console.log("About to validate latitude and longitude");
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            return res.status(400).json({ error: 'Latitude and Longitude must be numbers' });
        }

     filters.location = {
        $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
            $maxDistance: 5000, // 5km
        },
    };
 }

        if (cuisine) filters.cuisine = cuisine;
        if (priceRange) {
            const price = parseFloat(priceRange);
            if (!isNaN(price)) {
                filters.priceRange = { $lte: price };
            } else {
                return res.status(400).json({ error: 'Invalid priceRange' });
            }
        }
        if (rating) filters.rating = { $gte: parseFloat(rating) };
        if (dietaryOptions) filters.dietaryOptions = { $in: dietaryOptions.split(',') };
        let restaurants = await Restaurant.find(filters);

        if (restaurants.length === 0) {
          // No local restaurants found, try fetching from Google Places API
          const googlePlacesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=restaurant&key=AIzaSyCQtKBnMaLZwiP4nL1L22djZhxWIW1nofo`)  
          .catch((error) => {
            console.error("Error in Google Places API call:", error);
          });
        if (googlePlacesResponse && googlePlacesResponse.data && googlePlacesResponse.data.results) {
            restaurants = googlePlacesResponse.data.results; // This is simplified; you might have to adjust it
          }
    }
        

        console.log("Filters used:", filters);
        console.log("Found restaurants:", restaurants);
        res.json(restaurants);
    } catch (error) {
        console.error("An internal error occurred:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/save-token', async (req, res) => {
    try {
        const { userId, fcmToken } = req.body;
        const userToken = new UserToken({ userId, fcmToken });
        await userToken.save();
        res.status(201).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/restaurant/:id', async (req, res) => {
    const restaurantId = req.params.id;
    try {
        const restaurant = await Restaurant.findById(restaurantId);
        res.json(restaurant);
    } catch (error) {
        res.status(400).json({ error: 'Restaurant not found' });
    }
});


app.post('/register', async (req, res) => {
    try {
        // Check if user already exists based on email or username
        let user = await User.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        user = new User({
            username: req.body.username,
            email: req.body.email,  // Add this line
            password: hashedPassword,
            // ... other fields
        });

        await user.save();

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



app.post('/login', async (req, res) => {
    console.log("Received login request:", req.body);  // Debugging line
    const user = await User.findOne({ username: req.body.username });
    console.log("User found:", user);  // Debugging line
    
    if (user && await compareSync(req.body.password, user.password)) {
        console.log("Password matched");  // Debugging line
        const token = jwt.sign({ id: user._id }, SECRET_KEY);
        return res.json({ token, profile: user.profile });
    }
    
    console.log("Invalid credentials");  // Debugging line
    res.status(400).send('Invalid credentials');
});

app.post('/reset-password', async (req, res) => {
    console.log("Received email for reset:", req.body.email);
    const { email } = req.body;

    let resetCode; // Declare it here so it's accessible throughout the function

    // Fetch all users for debugging
    try {
        const users = await User.find({});
        console.log("All users:", users);
    } catch (error) {
        console.error("Error fetching all users:", error);
    }
    try {
        const user = await User.findOne({ email: email.trim() });
    console.log("Found user:", user);
    if (!user) {
        console.log("User not found for email:", email);  // Log the email for debugging
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const resetCode = Math.floor(Math.random() * 10000) + 1000; // 4-digit code
    user.resetCode = resetCode;
    user.resetCodeExpires = Date.now() + 3600000; // Code expires in 1 hour
    user.email = email.trim();
    await user.save();
} catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ success: false, message: 'Database error' });
}
    
let resetCodeText = `Your password reset code is: ${resetCode}`; 

const msg = {
    to: email,
    from: 'shahryarinam34@gmail.com',
    subject: 'Password Reset Code',
    text: resetCodeText
};
  
  
    try {
        await sgMail.send(msg);
        res.json({ success: true, message: 'Reset code sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
  });
  
  app.post('/verify-reset-code', async (req, res) => {
    const { email, code } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (Date.now() > user.resetCodeExpires) {
        return res.status(400).json({ success: false, message: 'Reset code has expired' });
    }

    if (user.resetCode !== code) {
        return res.status(400).json({ success: false, message: 'Invalid reset code' });
    }

    res.json({ success: true, message: 'Code verified successfully' });
});

  
app.post('/set-new-password', async (req, res) => {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetCode = null; // Clear the reset code
    user.resetCodeExpires = null;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
});


export default router;

app.get('/checkUser/:username', async (req, res) => {
    try {
        console.log('Received request to check user'); // Debugging line
        const username = req.params.username;
        const user = await User.findOne({ username });
        res.json({ exists: !!user });
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Add a review
app.post('/review', async (req, res) => {
    try {
        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a review
app.put('/review/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        const updatedReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true });
        if (updatedReview) {
            res.json(updatedReview);
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a review
app.delete('/review/:id', async (req, res) => {
    const reviewId = req.params.id;
    try {
        const review = await Review.findByIdAndDelete(reviewId);
        if (review) {
            res.json({ message: 'Review deleted' });
        } else {
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/send-notification', async (req, res) => {
    try {
        const userToken = await UserToken.findOne({ userId: req.body.userId });
        if (userToken) {
            const payload = {
                notification: {
                    title: 'Your Notification Title',
                    body: 'Your Notification Body'
                }
            };

            await messaging().sendToDevice(userToken.fcmToken, payload);
            res.status(200).send();
        } else {
            res.status(404).send('User token not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/get-restaurant-data/:placeId', async (req, res) => {
    const placeId = req.params.placeId;

    try {
        const response = await get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`);
        
        if (response.data.result) {
            res.json(response.data.result);
        } else {
            res.status(400).send("Failed to fetch restaurant data");
        }
    } catch (error) {
        res.status(500).send("Server error");
    }
});


 connect(config.db,{useNewUrlParser:true, useUnifiedTopology:true})
 .then(()=>{ console.log("connected to db")})
 .catch((error)=>{console.log(error.message)});

// connect('mongodb://localhost:27017/userAuth', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });



app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
