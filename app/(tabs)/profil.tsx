import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function ProfilScreen() {
  const [user, setUser] = useState<any>(null);
  const [profil, setProfil] = useState<any>(null);
  const [nom, setNom] = useState('');
  const [poste, setPoste] = useState('');
  const [bio, setBio] = useState('');
  const [lieu, setLieu] = useState('');
  const [competences, setCompetences] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function chargerProfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);
      const { data } = await supabase.from('profils').select('*').eq('user_id', user.id).single();
      if (data) {
        setProfil(data);
        setNom(data.nom || '');
        setPoste(data.poste || '');
        setBio(data.bio || '');
        setLieu(data.lieu || '');
        setCompetences(data.competences || '');
        setPhoto(data.photo_url || null);
      }
    }
    chargerProfil();
  }, []);

  async function choisirPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission refusée', 'Autorise l\'accès à ta galerie dans les réglages');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }

  async function sauvegarderProfil() {
    if (!user) return;
    setLoading(true);
    const updates = { nom, poste, bio, lieu, competences, photo_url: photo };
    if (profil) {
      await supabase.from('profils').update(updates).eq('user_id', user.id);
    } else {
      await supabase.from('profils').insert({ user_id: user.id, ...updates, created_at: new Date().toISOString() });
    }
    setLoading(false);
    setEditMode(false);
    Alert.alert('✅ Profil sauvegardé !');
  }

  async function seDeconnecter() {
    await supabase.auth.signOut();
  }

  const initiale = nom ? nom.charAt(0).toUpperCase() : '?';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        {/* Avatar cliquable */}
        <TouchableOpacity onPress={choisirPhoto} style={styles.avatarContainer}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initiale}</Text>
            </View>
          )}
          <View style={styles.avatarEditBadge}>
            <Text style={styles.avatarEditIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        {!editMode ? (
          <>
            <Text style={styles.nom}>{nom || 'Ton nom'}</Text>
            <Text style={styles.poste}>{poste || 'Ton poste'}</Text>
            {lieu ? <Text style={styles.lieu}>📍 {lieu}</Text> : null}
            {bio ? <Text style={styles.bio}>{bio}</Text> : null}

            {competences ? (
              <View style={styles.competencesRow}>
                {competences.split(',').map((c, i) => (
                  <View key={i} style={styles.competencePill}>
                    <Text style={styles.competenceText}>{c.trim()}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
              <Text style={styles.editBtnText}>✏️ Modifier le profil</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.editForm}>
            <Text style={styles.editTitre}>Modifier le profil</Text>

            <Text style={styles.label}>NOM COMPLET</Text>
            <TextInput style={styles.input} value={nom} onChangeText={setNom} placeholder="ex: Alexi Dupont" placeholderTextColor="#555570" />

            <Text style={styles.label}>POSTE</Text>
            <TextInput style={styles.input} value={poste} onChangeText={setPoste} placeholder="ex: Product Designer" placeholderTextColor="#555570" />

            <Text style={styles.label}>LIEU</Text>
            <TextInput style={styles.input} value={lieu} onChangeText={setLieu} placeholder="ex: Paris / Remote" placeholderTextColor="#555570" />

            <Text style={styles.label}>BIO</Text>
            <TextInput style={[styles.input, { height: 90 }]} value={bio} onChangeText={setBio} placeholder="Parle de toi..." placeholderTextColor="#555570" multiline />

            <Text style={styles.label}>COMPÉTENCES (séparées par des virgules)</Text>
            <TextInput style={styles.input} value={competences} onChangeText={setCompetences} placeholder="ex: React, Design, Figma" placeholderTextColor="#555570" />

            <TouchableOpacity style={styles.saveBtn} onPress={sauvegarderProfil} disabled={loading}>
              <Text style={styles.saveBtnText}>{loading ? 'Sauvegarde...' : '✅ Sauvegarder'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditMode(false)}>
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!editMode && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Candidatures</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Matches</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Vues</Text>
          </View>
        </View>
      )}

      {!editMode && (
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>Mon compte</Text>
          <View style={styles.emailRow}>
            <Text style={styles.emailIcon}>📧</Text>
            <Text style={styles.emailText}>{user?.email}</Text>
          </View>
          <TouchableOpacity style={styles.deconnexionBtn} onPress={seDeconnecter}>
            <Text style={styles.deconnexionText}>🚪 Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D14' },
  header: { alignItems: 'center', padding: 24, paddingTop: 60 },
  avatarContainer: { marginBottom: 16, position: 'relative' },
  avatar: {
    width: 88, height: 88, borderRadius: 28,
    backgroundColor: '#6C47FF', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(108,71,255,0.3)',
  },
  avatarImage: {
    width: 88, height: 88, borderRadius: 28,
    borderWidth: 3, borderColor: 'rgba(108,71,255,0.3)',
  },
  avatarText: { fontSize: 36, color: '#FFFFFF', fontWeight: '900' },
  avatarEditBadge: {
    position: 'absolute', bottom: -4, right: -4,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#1A1A2E', borderWidth: 2, borderColor: '#0D0D14',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEditIcon: { fontSize: 14 },
  nom: { fontSize: 24, fontWeight: '900', color: '#F0F0F8', letterSpacing: -0.5, marginBottom: 4 },
  poste: { fontSize: 15, color: '#6C47FF', fontWeight: '600', marginBottom: 4 },
  lieu: { fontSize: 13, color: '#555570', marginBottom: 12 },
  bio: { fontSize: 14, color: '#8888AA', textAlign: 'center', lineHeight: 20, marginBottom: 14, paddingHorizontal: 20 },
  competencesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 16 },
  competencePill: {
    backgroundColor: 'rgba(108,71,255,0.15)', borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(108,71,255,0.3)',
  },
  competenceText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  editBtn: {
    backgroundColor: '#1A1A2E', borderRadius: 100,
    paddingVertical: 10, paddingHorizontal: 24,
    borderWidth: 1, borderColor: '#2A2A3A',
  },
  editBtnText: { color: '#F0F0F8', fontWeight: '600', fontSize: 14 },
  editForm: { width: '100%', gap: 4 },
  editTitre: { fontSize: 20, fontWeight: '900', color: '#F0F0F8', marginBottom: 16, alignSelf: 'flex-start' },
  label: { color: '#555570', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, marginBottom: 6, marginTop: 8 },
  input: {
    backgroundColor: '#13131A', borderRadius: 14, padding: 14,
    color: '#F0F0F8', fontSize: 15, borderWidth: 1, borderColor: '#2A2A3A', width: '100%',
  },
  saveBtn: { backgroundColor: '#6C47FF', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 16 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  cancelBtn: { padding: 12, alignItems: 'center' },
  cancelBtnText: { color: '#555570', fontSize: 14 },
  statsRow: {
    flexDirection: 'row', backgroundColor: '#13131A',
    marginHorizontal: 20, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#2A2A3A', marginBottom: 24,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNombre: { fontSize: 22, fontWeight: '900', color: '#F0F0F8' },
  statLabel: { fontSize: 11, color: '#555570', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#2A2A3A' },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitre: { fontSize: 16, fontWeight: '800', color: '#F0F0F8', marginBottom: 12 },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  emailIcon: { fontSize: 16 },
  emailText: { color: '#8888AA', fontSize: 14 },
  deconnexionBtn: {
    backgroundColor: '#13131A', borderRadius: 14, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: '#2A2A3A',
  },
  deconnexionText: { color: '#FF2D55', fontWeight: '700', fontSize: 15 },
});