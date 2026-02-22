import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  async function handleAuth() {
    console.log('Bouton cliqué !', email, password);
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        console.log('Résultat:', data, error);
        if (error) {
          Alert.alert('Erreur', error.message);
        } else {
          Alert.alert('Compte créé !', 'Vérifie ton email 🎉');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log('Résultat:', data, error);
        if (error) {
          Alert.alert('Erreur', error.message);
        } else {
          router.replace('/(tabs)');
        }
      }
    } catch (e) {
      console.log('Exception:', e);
      Alert.alert('Erreur réseau', 'Vérifie ta connexion internet');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PitchMe</Text>
      <Text style={styles.tagline}>
        {mode === 'login' ? 'Content de te revoir 👋' : 'Crée ton compte 🚀'}
      </Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#555570"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor="#555570"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={handleAuth}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          <Text style={styles.switchText}>
            {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7C5CFC',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#8888AA',
    marginBottom: 40,
  },
  form: {
    width: '100%',
    gap: 12,
  },
  input: {
    backgroundColor: '#13131A',
    borderRadius: 14,
    padding: 16,
    color: '#F0F0F8',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  btn: {
    backgroundColor: '#7C5CFC',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#7C5CFC',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 8,
  },
});