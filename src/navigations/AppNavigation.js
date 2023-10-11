import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {NavigationContainer} from '@react-navigation/native'
import HomeScreen from '../screens/Home/HomeScreen';
import ProductScreen from '../screens/Product/ProductScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import AccountScreen from '../screens/Account/Account';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import OrderDetailsScreen from '../screens/OrderDetails/OrderDetailsScreen';
import AccountDetails from '../screens/Account/AccountDetails';
import AddressScreen from '../screens/Account/AddressScreen';
import OrderDetails from '../screens/Account/OrderDetails';
import WriteReviewScreen from '../screens/OrderDetails/WriteReviewScreen';

 const Stack = createStackNavigator();

function MainNavigator() {
  return(
    <Stack.Navigator
      screenOptions={{
          headerTitleStyle: {
            fontWeight: 'bold'
          }
      }}
    >
      <Stack.Screen name='Home' component={HomeScreen} />
      <Stack.Screen name='Product' component={ProductScreen}/>
      <Stack.Screen name='Cart' component={CartScreen} />
      <Stack.Screen name='Checkout' component={CheckoutScreen} />
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Register' component={RegisterScreen} />
      <Stack.Screen name='Account' component={AccountScreen} />
      <Stack.Screen name='Account Details' component={AccountDetails} />
      <Stack.Screen name='Address Details' component={AddressScreen} />
      <Stack.Screen name='Orders Details' component={OrderDetails} />
      <Stack.Screen name='Order Details' component={OrderDetailsScreen} />
      <Stack.Screen name='Review' component={WriteReviewScreen} />
    </Stack.Navigator>
  )
} 

 export default function AppContainer() {
  return(
    <NavigationContainer>
      <MainNavigator/>
    </NavigationContainer>
  )
} 
 

console.disableYellowBox = true;