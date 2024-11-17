import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Categorii: React.FC = () => {
  const router = useRouter();

  const initialData = [
    { id: 'bonuri', name: 'Bonuri' },
    { id: 'facturi', name: 'Facturi' },
    { id: 'add', name: '+' },
  ];

  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('categories');
        if (storedData) {
          setData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Eroare la încărcarea datelor:', error);
      }
    };

    loadData();
  }, []);

  const saveData = async (categories: any) => {
    try {
      await AsyncStorage.setItem('categories', JSON.stringify(categories));
    } catch (error) {
      console.error('Eroare la salvarea datelor:', error);
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      Alert.alert('Eroare', 'Te rugăm să introduci un nume pentru categorie.');
      return;
    }

    const newCategory = {
      id: newCategoryName.toLowerCase(),
      name: newCategoryName,
    };

    const updatedData = [
      ...data.slice(0, -1),
      newCategory,
      data[data.length - 1],
    ];

    setData(updatedData);
    saveData(updatedData);
    setNewCategoryName('');
    setModalVisible(false);
    
  };

  const handleSelectItem = (id: string) => {
    if (id === 'add') return; // Evită selecția itemului cu plus
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleDeleteItems = () => {
    const updatedData = data.filter(
      (item) => !selectedItems.includes(item.id) && item.id !== 'add'
    );
    setData([...updatedData, data[data.length - 1]]);
    saveData(updatedData);
    setSelectedItems([]);
    setIsDeleting(false);
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => {
    const isSelected = selectedItems.includes(item.id);
    
    if (item.id === 'add') {
      return (
        <TouchableOpacity
          style={[
            styles.gridItem,
            styles.addItem,
            isDeleting && styles.disabledAddItem, // Aplica stilul dezactivat în timpul ștergerii
          ]}
          onPress={() => !isDeleting && setModalVisible(true)} // Dezactivăm interacțiunea în timpul ștergerii
          disabled={isDeleting}
        >
          <Text style={styles.addText}>{item.name}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[
          styles.gridItem,
          isDeleting && isSelected && styles.selectedItem,
        ]}
        onPress={() =>
          isDeleting ? handleSelectItem(item.id) : router.push(`categorii/${item.id}`)
        }
      >
        <Text style={styles.itemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContainer}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setIsDeleting(!isDeleting)}
        >
          <Text style={styles.buttonText}>
            {isDeleting ? 'Anulează' : 'Șterge'}
          </Text>
        </TouchableOpacity>
        {isDeleting && selectedItems.length > 0 && (
          <TouchableOpacity style={styles.confirmDeleteButton} onPress={handleDeleteItems}>
            <Text style={styles.buttonText}>Confirmă</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)}
          accessible={false}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Adaugă o categorie nouă</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Numele categoriei"
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                />
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    { opacity: newCategoryName.trim() ? 1 : 0.5 },
                  ]}
                  onPress={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                >
                  <Text style={styles.confirmButtonText}>Confirmă</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    setNewCategoryName('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Anulează</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    marginBottom: 20,
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 150,
    maxWidth: '48%',
    height: 140,
  },
  selectedItem: {
    backgroundColor: '#ffcccc',
  },
  disabledAddItem: {
    backgroundColor: 'rgba(128, 128, 128, 0.2)', // Gri mai transparent
    opacity: 0.6,
  },
  itemText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addItem: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff4d4d',
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmDeleteButton: {
    flex: 1,
    backgroundColor: '#ff0000', // Confirmă în roșu
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#ddd',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
