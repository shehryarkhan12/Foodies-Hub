import React, { useState } from 'react';
import styled from 'styled-components/native';
import { View, Text, TextInput, Alert } from 'react-native';


const Container = styled.View`
    flex: 1;
    padding: 20px;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
`;

const LogoContainer = styled.View`
    margin-bottom: 20px;
`;

const Logo = styled.Image`
    width: 100px;
    height: 100px;
`;

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Input = styled.TextInput`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
    width: 100%;
    padding: 15px;
    background-color: #ff0000;
    border-radius: 5px;
    align-items: center;
`;

const ButtonText = styled.Text`
    color: #ffffff;
    font-size: 18px;
`;

const FooterText = styled.Text`
    margin-top: 20px;
    text-align: center;
`;

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const handleSendCode = () => {
        // Endpoint URL
        console.log("Sending reset code for email:", email);
        const endpoint = "http://192.168.1.4:4000/reset-password";
    
        // Making a POST request to the backend
        fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                Alert.alert(`Code sent to ${email}`);
    
                // Navigate to OTP screen
                navigation.navigate('OTP');
            } else {
                // Handle any errors or failures in sending the email
                Alert.alert(data.message || "Failed to send code. Please try again.");
            }
        })
        .catch(error => {
            // Handle errors in the request itself
            Alert.alert("An error occurred. Please try again.");
            console.error("There was an error sending the reset code:", error);
        });
    };
    
    

    return (
        <Container>
            <LogoContainer>
                <Logo source={require('../Images/forgot-password.png')} />
            </LogoContainer>
            <Title>Forgot Password?</Title>
            <Input 
                placeholder="Enter Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <Button onPress={handleSendCode}>
                <ButtonText>Send Code</ButtonText>
            </Button>
            <FooterText>By Continuing you agree to</FooterText>
            <FooterText>Privacy Policy | Terms & Conditions | Content Policy</FooterText>
        </Container>
    );
}

export default ForgotPassword;
