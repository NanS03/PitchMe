import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function PostulerScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [etape, setEtape] = useState<'intro' | 'message' | 'succes'>('intro');

  async function envoyer() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Erreur', 'Tu dois être connecté pour postuler');
      setLoading(false);
      return;
    }
    await supabase.from('candidatures').insert({
      candidat_id: user.id,
      offre_id: 1,
      video_url: 'pending',
      message,
      created_at: new Date().toISOString(),
    });
    setLoading(false);
    setEtape('succes');
  }

  if (etape === 'succes') {
    return (
      <View style={styles.container}>
        <View style={styles.succesBox}>
          <Text style={styles.succesEmoji}>🎉</Text>
          <Text style={styles.succesTitre}>Candidature envoyée !</Text>
          <Text style={styles.succesDesc}>Le recruteur va recevoir ta candidature et reviendra vers toi sous 48h.</Text>
          <TouchableOpacity style={styles.retourBtn} onPress={() => router.replace('/')}>
            <Text style={styles.retourBtnText}>← Retour au feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (etape === 'message') {
    return (
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setEtape('intro')}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.titre}>Ta candidature 📝</Text>
        <Text style={styles.sousTitre}>Complète ta candidature avec un message et ton CV</Text>

        {/* Bandeau vidéo manquante */}
        <View style={styles.videoBanner}>
          <Text style={styles.videoBannerEmoji}>🎬</Text>
          <View style={styles.videoBannerText}>
            <Text style={styles.videoBannerTitre}>+70% de chances avec une vidéo !</Text>
            <Text style={styles.videoBannerSub}>Les candidatures vidéo sont 3x plus vues par les recruteurs</Text>
          </View>
          <TouchableOpacity onPress={() => setEtape('intro')}>
            <Text style={styles.videoBannerBtn}>Ajouter</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Message au recruteur</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Bonjour, je suis très intéressé par ce poste car..."
          placeholderTextColor="#555570"
          multiline
          value={message}
          onChangeText={setMessage}
          maxLength={300}
        />
        <Text style={styles.counter}>{message.length}/300</Text>

        {/* CV Upload */}
        <Text style={styles.label}>CV (optionnel)</Text>
        <TouchableOpacity style={styles.cvUpload}>
          <Text style={styles.cvUploadIcon}>📄</Text>
          <View>
            <Text style={styles.cvUploadText}>Ajouter mon CV</Text>
            <Text style={styles.cvUploadSub}>PDF, Word — max 5MB</Text>
          </View>
          <Text style={styles.cvUploadArrow}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.envoyerBtn, loading && { opacity: 0.6 }]}
          onPress={envoyer}
          disabled={loading}
        >
          <Text style={styles.envoyerBtnText}>
            {loading ? 'Envoi...' : '🚀 Envoyer ma candidature'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.introContent}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.titre}>Postuler 🎬</Text>

      {/* Stat incitative */}
      <View style={styles.statBanner}>
        <Text style={styles.statEmoji}>📊</Text>
        <Text style={styles.statText}>Les candidatures vidéo ont <Text style={styles.statHighlight}>3x plus de chances</Text> d'obtenir un entretien</Text>
      </View>

      {/* Bouton vidéo — mis en avant */}
      <TouchableOpacity style={styles.recordBtn}>
        <View style={styles.recordIcon}>
          <Text style={styles.recordIconText}>🎬</Text>
        </View>
        <View style={styles.recordBtnInfo}>
          <Text style={styles.recordBtnText}>Enregistrer mon pitch vidéo</Text>
          <Text style={styles.recordBtnSub}>⭐ Recommandé · Disponible sur iPhone</Text>
        </View>
        <View style={styles.recordBadge}>
          <Text style={styles.recordBadgeText}>TOP</Text>
        </View>
      </TouchableOpacity>

      {/* Tips */}
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitre}>💡 Conseils pour un bon pitch</Text>
        <Text style={styles.tipItem}>✅ Présente-toi en 10 secondes</Text>
        <Text style={styles.tipItem}>✅ Explique pourquoi CE poste t'intéresse</Text>
        <Text style={styles.tipItem}>✅ Cite 2-3 compétences clés</Text>
        <Text style={styles.tipItem}>⏱ Maximum 60 secondes</Text>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou sans vidéo</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity style={styles.sansVideoBtn} onPress={() => setEtape('message')}>
        <Text style={styles.sansVideoBtnText}>📝 Postuler avec un message + CV</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  introContent: { padding: 24, paddingTop: 60 },
  backBtn: { marginBottom: 24 },
  backText: { color: '#FFFFFF', fontSize: 24 },
  titre: { fontSize: 26, fontWeight: '900', color: '#F0F0F8', marginBottom: 16, letterSpacing: -0.5 },
  sousTitre: { fontSize: 15, color: '#8888AA', marginBottom: 20, lineHeight: 22 },

  statBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(108,71,255,0.1)', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: 'rgba(108,71,255,0.2)', marginBottom: 20,
  },
  statEmoji: { fontSize: 24 },
  statText: { flex: 1, color: '#8888AA', fontSize: 13, lineHeight: 18 },
  statHighlight: { color: '#a78bfa', fontWeight: '700' },

  recordBtn: {
    backgroundColor: '#6C47FF', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16,
  },
  recordIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  recordIconText: { fontSize: 26 },
  recordBtnInfo: { flex: 1 },
  recordBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  recordBtnSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  recordBadge: {
    backgroundColor: '#FFD60A', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  recordBadgeText: { color: '#000', fontSize: 10, fontWeight: '900' },

  tipsBox: {
    backgroundColor: '#13131A', borderRadius: 16, padding: 16,
    marginBottom: 20, borderWidth: 1, borderColor: '#2A2A3A', gap: 8,
  },
  tipsTitre: { color: '#F0F0F8', fontWeight: '700', fontSize: 14, marginBottom: 4 },
  tipItem: { color: '#8888AA', fontSize: 13, lineHeight: 20 },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#2A2A3A' },
  dividerText: { color: '#555570', fontSize: 12 },

  sansVideoBtn: {
    borderWidth: 1, borderColor: '#2A2A3A', borderRadius: 100,
    paddingVertical: 14, alignItems: 'center',
  },
  sansVideoBtnText: { color: '#F0F0F8', fontSize: 15, fontWeight: '600' },

  label: {
    color: '#555570', fontSize: 11, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase',
    marginHorizontal: 24, marginBottom: 8, marginTop: 16,
  },
  messageInput: {
    backgroundColor: '#13131A', borderRadius: 16, padding: 16,
    color: '#F0F0F8', fontSize: 15, borderWidth: 1, borderColor: '#2A2A3A',
    height: 140, textAlignVertical: 'top', marginHorizontal: 24,
  },
  counter: { color: '#555570', fontSize: 12, textAlign: 'right', marginRight: 24, marginBottom: 8 },

  cvUpload: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#13131A', borderRadius: 16, padding: 16,
    marginHorizontal: 24, marginBottom: 24,
    borderWidth: 1, borderColor: '#2A2A3A', borderStyle: 'dashed',
  },
  cvUploadIcon: { fontSize: 28 },
  cvUploadText: { color: '#F0F0F8', fontSize: 14, fontWeight: '600' },
  cvUploadSub: { color: '#555570', fontSize: 12, marginTop: 2 },
  cvUploadArrow: { marginLeft: 'auto', color: '#6C47FF', fontSize: 22, fontWeight: '800' },

  envoyerBtn: {
    backgroundColor: '#6C47FF', borderRadius: 100, paddingVertical: 16,
    alignItems: 'center', marginHorizontal: 24,
  },
  envoyerBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },

  videoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(108,71,255,0.1)', borderRadius: 14, padding: 12,
    marginHorizontal: 24, marginBottom: 8,
    borderWidth: 1, borderColor: 'rgba(108,71,255,0.3)',
  },
  videoBannerEmoji: { fontSize: 22 },
  videoBannerText: { flex: 1 },
  videoBannerTitre: { color: '#a78bfa', fontSize: 13, fontWeight: '700' },
  videoBannerSub: { color: '#555570', fontSize: 11, marginTop: 2 },
  videoBannerBtn: { color: '#6C47FF', fontSize: 13, fontWeight: '800' },

  succesBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16 },
  succesEmoji: { fontSize: 80 },
  succesTitre: { fontSize: 26, fontWeight: '900', color: '#F0F0F8', textAlign: 'center' },
  succesDesc: { fontSize: 15, color: '#8888AA', textAlign: 'center', lineHeight: 22 },
  retourBtn: {
    backgroundColor: '#6C47FF', borderRadius: 100,
    paddingVertical: 14, paddingHorizontal: 28, marginTop: 16,
  },
  retourBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});