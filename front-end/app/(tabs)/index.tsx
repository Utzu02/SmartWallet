import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function App() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.introContainer}>
        <Text style={styles.introTitle}>De ce suntem unici?</Text>
        <Text style={styles.introText}>
          Aplicația noastră redefinește modul în care gestionezi documentele importante. Cu un design intuitiv și funcționalități avansate, îți oferim o soluție completă:
          {"\n\n"}- <Text style={styles.bold}>Scanare instantanee:</Text> Transformă rapid bonuri și facturi în documente digitale clare, direct de pe camera telefonului.
          {"\n\n"}- <Text style={styles.bold}>Import inteligent din email:</Text> Recuperează automat facturile primite pe email, economisind timp prețios.
          {"\n\n"}- <Text style={styles.bold}>Organizare simplificată:</Text> Toate documentele tale, într-un singur loc, accesibile oricând, oriunde.
          {"\n\n"}- <Text style={styles.bold}>Tehnologie de ultimă generație:</Text> Algoritmii noștri avansați asigură acuratețea și rapiditatea procesării.
          {"\n\n"}Cu aplicația noastră, te bucuri de mai mult timp liber și control deplin asupra finanțelor tale. Simplu. Rapid. Inteligent.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  introContainer: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  introTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  introText: {
    color: "white",
    fontSize: 16,
    lineHeight: 24, // Ajustare pentru o lectură echilibrată
    textAlign: "justify", // Aliniere justificată
  },
  bold: {
    fontWeight: "bold",
  },
});
