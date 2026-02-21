import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PostulerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [enregistrement, setEnregistrement] = useState(false);

  if (cameraVisible) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front">
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraTimer}>
              {enregistrement ? '🔴 En cours...' : 'Prêt à filmer'}
            </Text>
            <View style={styles.cameraButtons}>
              <TouchableOpacity
                style={styles.recordButton}
                onPress={() => {
                  if (!enregistrement) {
                    setEnregistrement(true);
                    setTimeout(() => {
                      setEnregistrement(false);
                      setCameraVisible(false);
                      Alert.alert('Vidéo enregistrée !', 'Ta candidature vidéo est prête à être envoyée 🎉');
                    }, 5000);
                  }
                }}
              >
                <Text style={styles.recordButtonText}>
                  {enregistrement ? '⏹ Stop' : '⏺ Filmer'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCameraVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.retour}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>Postuler en vidéo 🎬</Text>

      <View style={styles.offreCard}>
        <Text style={styles.offreEntreprise}>Ekino Paris</Text>
        <Text style={styles.offreTitre}>Product Designer Senior</Text>
        <View style={styles.offreMeta}>
          <Text style={styles.offereMetaText}>📍 Paris 9e</Text>
          <Text style={styles.offereMetaText}>💰 55-70k€</Text>
        </View>
      </View>

      <Text style={styles.sectionTitre}>Ta vidéo de candidature</Text>
      <Text style={styles.sectionSub}>Enregistre une vidéo de 30-60 secondes</Text>

      <TouchableOpacity
        style={styles.recordBtn}
        onPress={async () => {
          if (!permission?.granted) {
            await requestPermission();
          } else {
            setCameraVisible(true);
          }
        }}
      >
        <Text style={styles.recordIcon}>🎙</Text>
        <Text style={styles.recordLabel}>Enregistrer ma vidéo</Text>
        <Text style={styles.recordHint}>30 sec max</Text>
      </TouchableOpacity>

      <Text style={styles.conseilsTitre}>✦ Conseils pour se démarquer</Text>
      <Text style={styles.conseil}>✓ Commence par ton prénom et ton poste</Text>
      <Text style={styles.conseil}>✓ Cite une réalisation concrète</Text>
      <Text style={styles.conseil}>✓ Explique pourquoi cette entreprise</Text>
      <Text style={styles.conseil}>✓ Termine par un call-to-action</Text>

      <TouchableOpacity style={styles.envoyerBtn}>
        <Text style={styles.envoyerText}>📤 Envoyer ma candidature</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 20,
    paddingTop: 60,
  },
  retour: {
    color: '#7C5CFC',
    fontSize: 16,
    marginBottom: 20,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 20,
  },
  offreCard: {
    backgroundColor: '#2D0A5E',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#7C5CFC',
  },
  offreEntreprise: {
    color: '#7C5CFC',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
  },
  offreTitre: {
    color: '#F0F0F8',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  offreMeta: {
    flexDirection: 'row',
    gap: 10,
  },
  offereMetaText: {
    color: '#8888AA',
    fontSize: 13,
    backgroundColor: '#1A1A2E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  sectionTitre: {
    color: '#F0F0F8',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  sectionSub: {
    color: '#8888AA',
    fontSize: 14,
    marginBottom: 16,
  },
  recordBtn: {
    backgroundColor: '#2A2A3A',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FC5C7D',
  },
  recordIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  recordLabel: {
    color: '#F0F0F8',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  recordHint: {
    color: '#8888AA',
    fontSize: 13,
  },
  conseilsTitre: {
    color: '#5CF4C8',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  conseil: {
    color: '#8888AA',
    fontSize: 14,
    marginBottom: 6,
  },
  envoyerBtn: {
    backgroundColor: '#FC5C7D',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  envoyerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    padding: 30,
  },
  cameraTimer: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  cameraButtons: {
    gap: 12,
  },
  recordButton: {
    backgroundColor: '#FC5C7D',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  recordButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});