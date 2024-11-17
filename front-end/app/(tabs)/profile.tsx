import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asigură-te că ai instalat react-native-vector-icons

export default function ProfilePage() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Iconiță rotundă de utilizator */}
        <View style={styles.userIcon}>
          <Icon name="person" size={30} color="#fff" />
        </View>
        <Text style={styles.title}>Profile Page</Text>
      </View>

      <Text style={styles.subtitle}>Welcome, User!</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row', // Aliniază iconița și textul pe orizontală
    alignItems: 'center', // Aliniază vertical
    marginBottom: 20, // Spațiu sub header
  },
  userIcon: {
    backgroundColor: '#007bff',
    borderRadius: 30, // Jumătate din dimensiunea laturii pentru un cerc perfect
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Spațiu între iconiță și text
    elevation: 5, // Umbră pe Android
    shadowColor: '#000', // Umbră pe iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
