import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const Categorii: React.FC = () => {
  const router = useRouter();

  const data = [
    { id: 'bonuri', name: 'Bonuri' },
    { id: 'facturi', name: 'Facturi' },
  ];

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => router.push(`categorii/${item.id}`)} // Navighează către ecranul categoriei
    >
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // 2 coloane
        columnWrapperStyle={styles.row} // Spațiere pe rânduri
        contentContainerStyle={styles.gridContainer}
      />
    </View>
  );
};

export default Categorii;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  gridContainer: {
    paddingVertical: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 20, // Distanța verticală dintre rânduri
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 150,
    maxWidth: '48%',
    height: 140, // Înălțime crescută
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
