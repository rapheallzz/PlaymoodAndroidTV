import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';
import { login, reset } from '../features/authSlice';
import { AppDispatch, RootState } from '../app/store';
import FocusableTouchableOpacity from '../components/FocusableTouchableOpacity';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #000;
`;

const Logo = styled.Image`
  width: 200px;
  height: 100px;
  resize-mode: contain;
  margin-bottom: 40px;
`;

const Form = styled.View`
  width: 400px;
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
`;

const Title = styled.Text`
  font-size: 28px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

// The styled component no longer needs to know about focus state.
const StyledInput = styled.TextInput`
  height: 50px;
  background-color: #333;
  color: #fff;
  padding: 0 15px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 16px;
  border-width: 2px;
  border-color: #333; /* Set a default */
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 18px;
  text-align: center;
`;

const ErrorText = styled.Text`
  color: #ff4d4d;
  text-align: center;
  margin-top: 10px;
`;

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    if (isSuccess || user) {
      navigation.navigate('Home');
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigation, dispatch]);

  const handleLogin = () => {
    if (email && password) {
      dispatch(login({ email, password }));
    }
  };

  // Dynamic styles for the inputs
  const emailInputStyle = {
    borderColor: emailFocused ? '#fff' : '#333',
  };

  const passwordInputStyle = {
    borderColor: passwordFocused ? '#fff' : '#333',
  };

  return (
    <Container>
      <Logo source={require('../../assets/playmood_logo.png')} />
      <Form>
        <Title>Login</Title>
        <StyledInput
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          style={emailInputStyle}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <StyledInput
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
          style={passwordInputStyle}
        />
        <FocusableTouchableOpacity onPress={handleLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <View style={{ padding: 15, backgroundColor: '#541011', borderRadius: 5 }}>
              <ButtonText>Login</ButtonText>
            </View>
          )}
        </FocusableTouchableOpacity>
        {isError && <ErrorText>{message}</ErrorText>}
      </Form>
    </Container>
  );
};

export default LoginScreen;
