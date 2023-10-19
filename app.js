/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './Components/App';
import Login from './Components/Login';
import UserReview from './Components/UserReview';
import RestaurantSearch from './Components/RestaurantSearch';
import RestaurantDetail from './Components/RestaurantDetail';
import RestaurantDetails from './Components/RestaurantDetails';
import Navbar from './Components/Navbar';
import NotificationScreen from './Components/NotificationScreen';
import Notifications from './Components/Notifications';

import {name as appName} from './app.json';

//import { enableScreens } from 'react-native-screens';



  

AppRegistry.registerComponent(appName, () => App);
//enableScreens();