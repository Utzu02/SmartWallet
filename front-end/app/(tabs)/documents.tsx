import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from './App';
import { useRouter } from 'expo-router';

type DocumentScannerProps = NativeStackScreenProps<RootStackParamList, 'Acasă'>;

const DocumentScanner: React.FC<DocumentScannerProps> = ({ navigation }) => {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentMode, setCurrentMode] = useState<string | null>(null); // "bon" sau "factura"

  const handleReportButtonPress = () => {
    Alert.alert(
      'În curs de implementare',
      'Această funcționalitate va fi disponibilă în curând!',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const requestPermissions = async (
    permissionType: () => Promise<{ status: ImagePicker.PermissionStatus }>
  ): Promise<boolean> => {
    const { status } = await permissionType();
    if (status !== 'granted') {
      Alert.alert(
        'Permisiuni necesare',
        'Te rugăm să activezi permisiunile necesare din setările dispozitivului.',
        [
          { text: 'Anulează', style: 'cancel' },
          { text: 'Deschide Setări', onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
    return true;
  };

  const handleOpenModal = (mode: string) => {
    setCurrentMode(mode); // Stochează modul curent: "bon" sau "factura"
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Începe să scanezi</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal('bon')}>
        <Text style={styles.addButtonText}>Adaugă un bon</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal('factura')}>
        <Text style={styles.addButtonText}>Adaugă o factură</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push('Categorii')}>
        <Text style={styles.addButtonText}>Gestionează categoriile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleReportButtonPress}>
        <Text style={styles.addButtonText}>Vizualizează raportul de decont</Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Selectează o opțiune pentru {currentMode === 'bon' ? 'bon' : 'factură'}
              </Text>
              <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
                <Text style={styles.modalButtonText}>Deschide Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
                <Text style={styles.modalButtonText}>Selectează din Galerie</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default DocumentScanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  image: {
    width: 200,
    height: 300,
    marginVertical: 20,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: 10, // Spațiu uniform între butoane
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
