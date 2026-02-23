import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function ProfilScreen() {
  const [user, setUser] = useState<any>(null);
  const [profil, setProfil] = useState<any>(null);
  const [nom, setNom] = useState('');
  const [poste, setPoste] = useState('');
  const [bio, setBio] = useState('');
  const [lieu, setLieu] = useState('');
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function chargerProfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      const { data } = await supabase
        .from('profils').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfil(data);
        setNom(data.nom || '');
        setPoste(data.poste || '');
        setBio(data.bio || '');
        setLieu(data.lieu || '');
      }
    }
    chargerProfil();
  }, []);

  async function sauvegarderProfil() {
    if (!user) return;
    setLoading(true);
    if (profil) {
      await supabase.from('profils').update({ nom, poste, bio, lieu })
        .eq('user_id', user.id);
    } else {
      await supabase.from('profils').insert({
        user_id: user.id, nom, poste, bio, lieu,
        created_at: new Date().toISOString(),
      });
    }
    setLoading(false);
    setEditMode(false);
    Alert.alert('✅ Profil sauvegardé !');
  }

  async function seDeconnecter() {
    await supabase.auth.signOut();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nom ? nom.charAt(0).toUpperCase() : '👤'}
          </Text>
        </View>
        {!editMode ? (
          <>
            <Text style={styles.nom}>{nom || 'Ton nom'}</Text>
            <Text style={styles.poste}>{poste || 'Ton poste'}</Text>
            <Text style={styles.lieu}>{lieu ? `📍 ${lieu}` : ''}</Text>
            <Text style={styles.bio}>{bio || 'Ta bio...'}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
              <Text style={styles.editBtnText}>✏️ Modifier le profil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.sectionTitre}>Modifier le profil</Text>

            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={nom}
              onChangeText={setNom}
              placeholder="ex: Alexi Dupont"
              placeholderTextColor="#555570"
            />

            <Text style={styles.label}>Poste</Text>
            <TextInput
              style={styles.input}
              value={poste}
              onChangeText={setPoste}
              placeholder="ex: Product Designer"
              placeholderTextColor="#555570"
            />

            <Text style={styles.label}>Lieu</Text>
            <TextInput
              style={styles.input}
              value={lieu}
              onChangeText={setLieu}
              placeholder="ex: Paris / Remote"
              placeholderTextColor="#555570"
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={bio}
              onChangeText={setBio}
              placeholder="Parle de toi..."
              placeholderTextColor="#555570"
              multiline
            />

            <TouchableOpacity style={styles.saveBtn} onPress={sauvegarderProfil} disabled={loading}>
              <Text style={styles.saveBtnText}>{loading ? 'Sauvegarde...' : '✅ Sauvegarder'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitre}>Mon compte</Text>
        <Text style={styles.email}>📧 {user?.email}</Text>
        <TouchableOpacity style={styles.deconnexionBtn} onPress={seDeconnecter}>
          <Text style={styles.deconnexionText}>🚪 Se déconnecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#7C5CFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  nom: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  poste: {
    fontSize: 16,
    color: '#7C5CFC',
    marginBottom: 4,
  },
  lieu: {
    fontSize: 13,
    color: '#8888AA',
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    color: '#8888AA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  editBtn: {
    backgroundColor: '#2A2A3A',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  editBtnText: {
    color: '#F0F0F8',
    fontWeight: '600',
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  email: {
    color: '#8888AA',
    fontSize: 14,
    marginBottom: 20,
  },
  label: {
    color: '#555570',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    backgroundColor: '#13131A',
    borderRadius: 14,
    padding: 14,
    color: '#F0F0F8',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2A2A3A',
    width: '100%',
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: '#7C5CFC',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelBtn: {
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  cancelBtnText: {
    color: '#8888AA',
    fontSize: 14,
  },
  deconnexionBtn: {
    backgroundColor: '#2A2A3A',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  deconnexionText: {
    color: '#FC5C7D',
    fontWeight: '600',
    fontSize: 15,
  },
});