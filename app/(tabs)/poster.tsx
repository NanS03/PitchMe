import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../supabase';

export default function PosterScreen() {
  const router = useRouter();
  const [titre, setTitre] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [lieu, setLieu] = useState('');
  const [salaire, setSalaire] = useState('');
  const [loading, setLoading] = useState(false);

  async function publierOffre() {
    if (!titre || !entreprise || !lieu) {
      Alert.alert('Erreur', 'Remplis au moins le titre, entreprise et lieu !');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('offres').insert({
      titre,
      entreprise,
      lieu,
      salaire,
      type: 'offre',
      couleur: '#2D0A5E',
      created_at: new Date().toISOString(),
    });
    if (error) {
      Alert.alert('Erreur', error.message);
    } else {
      Alert.alert('Offre publiée ! 🎉', 'Elle apparaît maintenant dans le feed !');
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Publier une offre 📢</Text>

      <Text style={styles.label}>Titre du poste *</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: Product Designer Senior"
        placeholderTextColor="#555570"
        value={titre}
        onChangeText={setTitre}
      />

      <Text style={styles.label}>Entreprise *</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: Ekino Paris"
        placeholderTextColor="#555570"
        value={entreprise}
        onChangeText={setEntreprise}
      />

      <Text style={styles.label}>Lieu *</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: Paris / Remote"
        placeholderTextColor="#555570"
        value={lieu}
        onChangeText={setLieu}
      />

      <Text style={styles.label}>Salaire</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: 45-55k€"
        placeholderTextColor="#555570"
        value={salaire}
        onChangeText={setSalaire}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={publierOffre}
        disabled={loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Publication...' : '🚀 Publier cette offre'}
        </Text>
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
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 24,
  },
  label: {
    color: '#8888AA',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#13131A',
    borderRadius: 14,
    padding: 16,
    color: '#F0F0F8',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    marginBottom: 16,
  },
  btn: {
    backgroundColor: '#7C5CFC',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});