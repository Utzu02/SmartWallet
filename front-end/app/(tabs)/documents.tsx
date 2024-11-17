import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import DocumentScanner from "react-native-document-scanner-plugin";
import { PDFDocument, rgb } from 'pdf-lib';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const Documents = () => {
  const [scannedImages, setScannedImages] = useState([]);

  const openScanner = async () => {
    try {
      const { scannedImages } = await DocumentScanner.scanDocument();
      if (scannedImages.length > 0) {
        setScannedImages(scannedImages);
        Alert.alert('Scan complet', 'Documentul a fost scanat cu succes!');
      }
    } catch (error) {
      console.error('Eroare la scanare:', error);
      Alert.alert('Eroare', 'Nu s-a putut scana documentul.');
    }
  };

  const createPDF = async () => {
    try {
      const pdfDoc = await PDFDocument.create();

      for (const image of scannedImages) {
        const imageBytes = await FileSystem.readAsStringAsync(image.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const embeddedImage = await pdfDoc.embedJpg(imageBytes);
        const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);

        page.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: embeddedImage.width,
          height: embeddedImage.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const pdfPath = `${FileSystem.documentDirectory}scanned_document.pdf`;

      await FileSystem.writeAsStringAsync(pdfPath, pdfBytes, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert('PDF generat', 'Documentul a fost salvat ca PDF!');
      sharePDF(pdfPath);
    } catch (error) {
      console.error('Eroare la generarea PDF-ului:', error);
      Alert.alert('Eroare', 'Nu s-a putut crea PDF-ul.');
    }
  };

  const sharePDF = async (pdfPath) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath);
    } else {
      Alert.alert('Eroare', 'Partajarea nu este disponibilă pe acest dispozitiv.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Deschide Scanner" onPress={openScanner} />
      {scannedImages.length > 0 && <Button title="Creează PDF" onPress={createPDF} />}
    </View>
  );
};

export default Documents;


