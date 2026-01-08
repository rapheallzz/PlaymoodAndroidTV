import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Image, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../features/authSlice';
import { AppDispatch, RootState } from '../app/store';
import FocusableTouchableOpacity from '../components/FocusableTouchableOpacity';

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

  const emailInputStyle = {
    borderColor: emailFocused ? '#fff' : '#333',
  };

  const passwordInputStyle = {
    borderColor: passwordFocused ? '#fff' : '#333',
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../../assets/playmood_logo.png')} />
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={[styles.input, emailInputStyle]}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, passwordInputStyle]}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <FocusableTouchableOpacity onPress={handleLogin} disabled={isLoading}>
          <View style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </View>
        </FocusableTouchableOpacity>
        {isError && <Text style={styles.errorText}>{message}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  form: {
    width: 400,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#333',
    color: '#fff',
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 2,
  },
  button: {
    padding: 15,
    backgroundColor: '#541011',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default LoginScreen;
