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
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [localIp, setLocalIp] = useState("");

  useEffect(() => {
    const fetchIp = async () => {
      Linking.getInitialURL().then((url) => {
        const ip = url?.split("//")[1].split(":")[0];
        setLocalIp(ip ?? "");
        console.log(ip);
      });
    };

    fetchIp();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    try {
      console.log(localIp);
      const response = await fetch(`http://${localIp}:8080/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify({ email, token: data.token })
        );
        setIsLoggedIn(true);
        Alert.alert("Success", `Logged in with email: ${email}`);
      } else {
        Alert.alert("Error", data.message || "Login failed");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Something went wrong. Please try again.");
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
    try {
      const response = await fetch(`http://${localIp}:8080/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // Save the user data in SecureStore after successful signup
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify({ email, token: data.token })
        );
        setIsLoggedIn(true);
        Alert.alert("Success", `Account created for email: ${email}`);
      } else {
        Alert.alert("Error", data.message || "Signup failed");
      }
    } catch (e) {
      console.log("AAA", e);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync("userData");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    Alert.alert("Logged out", "You have been logged out.");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {isLoggedIn ? (
            <>
              <Text style={styles.title}>Welcome</Text>
              <Text style={styles.subtitle}>Logged in as: {email}</Text>
              <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
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
                <Text style={styles.buttonText}>
                  {isSignup ? "Sign Up" : "Login"}
                </Text>
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
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
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
