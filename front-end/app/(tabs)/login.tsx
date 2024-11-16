import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
} from "react-native";
import * as Network from "expo-network";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [localIp, setLocalIp] = useState('');

  useEffect(() => {

      const fetchIp = async () => {
        Linking.getInitialURL().then((url) => {
            const ip = url?.split('//')[1].split(':')[0];
            setLocalIp(ip ?? '');
        });
      };
  
      fetchIp();
    }, []);

  const handleLogin = async () => {

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    console.log(email, password);
    try {
        console.log(localIp);
        const recievedData = await fetch(`http://${localIp}:8080/api/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email, 
                password: password
            })
        });
    
        console.log(await recievedData);
        Alert.alert("Success", `Logged in with email: ${email}`);

    } catch (e) {
        console.log(e);
    }
   
    
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    const recievedData = await fetch(`http://${localIp}:8080/api/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email, 
            password: password
        })
    });

    console.log(recievedData);

    Alert.alert("Success", `Account created for email: ${email}`);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {isSignup && (
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={isSignup ? handleSignup : handleLogin}
        >
          <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsSignup(!isSignup)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {isSignup
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 10,
  },
  toggleText: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "500",
  },
});
