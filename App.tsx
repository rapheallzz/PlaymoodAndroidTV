import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './src/app/store';
import AppNavigator from './src/navigation/AppNavigator';
import { setUser } from './src/features/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MovieScreen from './src/screens/MovieScreen';
import ChannelScreen from './src/screens/ChannelScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const navigation = useNavigation();

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser) {
                dispatch(setUser(JSON.parse(storedUser)));
            }
        };
        checkUser();
    }, [dispatch]);

    return (
        <Stack.Navigator
            initialRouteName={user ? "Home" : "Login"}
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Movie" component={MovieScreen} />
            <Stack.Screen name="Channel" component={ChannelScreen} />
        </Stack.Navigator>
    );
}

export default function App() {
  return (
    <Provider store={store}>
        <NavigationContainer>
            <AppContent />
        </NavigationContainer>
    </Provider>
  );
}
