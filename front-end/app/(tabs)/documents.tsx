import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Documents() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents Page</Text>
      <Text style={styles.subtitle}>Here are your documents:</Text>
      <View style={styles.documentItem}>
        <Text style={styles.documentText}>Document 1</Text>
      </View>
      <View style={styles.documentItem}>
        <Text style={styles.documentText}>Document 2</Text>
      </View>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  documentItem: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  documentText: {
    fontSize: 16,
    color: '#333',
  },
});
