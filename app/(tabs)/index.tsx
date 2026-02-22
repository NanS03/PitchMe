import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

const { height, width } = Dimensions.get('window');

function OffreCard({ offre }: { offre: any }) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [vues, setVues] = useState(offre.vues || 0);

  useEffect(() => {
    async function checkActions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: likeData } = await supabase
        .from('likes').select('*')
        .eq('user_id', user.id).eq('offre_id', offre.id);
      if (likeData && likeData.length > 0) setLiked(true);
      const { count } = await supabase
        .from('likes').select('*', { count: 'exact', head: true })
        .eq('offre_id', offre.id);
      setLikeCount(count || 0);
      const { data: sauvData } = await supabase
        .from('sauvegardes').select('*')
        .eq('user_id', user.id).eq('offre_id', offre.id);
      if (sauvData && sauvData.length > 0) setSauvegarde(true);

      await supabase.rpc('incrementer_vues', { offre_id: offre.id });
      setVues((v: number) => v + 1);
    }
    checkActions();
  }, []);

  async function toggleLike() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete()
        .eq('user_id', user.id).eq('offre_id', offre.id);
      setLiked(false);
      setLikeCount(c => c - 1);
    } else {
      await supabase.from('likes').insert({
        user_id: user.id, offre_id: offre.id,
        created_at: new Date().toISOString(),
      });
      setLiked(true);
      setLikeCount(c => c + 1);
    }
  }

  async function toggleSauvegarde() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (sauvegarde) {
      await supabase.from('sauvegardes').delete()
        .eq('user_id', user.id).eq('offre_id', offre.id);
      setSauvegarde(false);
    } else {
      await supabase.from('sauvegardes').insert({
        user_id: user.id, offre_id: offre.id,
        created_at: new Date().toISOString(),
      });
      setSauvegarde(true);
    }
  }

  async function partager() {
    await Share.share({
      message: `🎬 ${offre.titre} chez ${offre.entreprise} - ${offre.lieu} ${offre.salaire ? '| ' + offre.salaire : ''}\n\nVia PitchMe 🚀`,
    });
  }

  return (
    <View style={styles.card}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoIcon}>🎬</Text>
        <Text style={styles.videoHint}>Vidéo de présentation</Text>
      </View>

      <View style={styles.vuesBox}>
        <Text style={styles.vuesText}>👁️ {vues} vues</Text>
      </View>

      <View style={styles.overlay}>
        <View style={styles.infoBox}>
          <Text style={[styles.badgeText, { color: offre.type === 'offre' ? '#7C5CFC' : '#FC5C7D' }]}>
            {offre.type === 'offre' ? '● Offre' : '● Candidature'}
          </Text>
          <Text style={styles.titre}>{offre.titre}</Text>
          <Text style={styles.entreprise}>{offre.entreprise}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>📍 {offre.lieu}</Text>
            {offre.salaire ? <Text style={styles.meta}>💰 {offre.salaire}</Text> : null}
          </View>
          <TouchableOpacity
            style={styles.bouton}
            onPress={() => router.push('/postuler')}
          >
            <Text style={styles.boutonText}>
              {offre.type === 'offre' ? '🎬 Postuler en vidéo' : '💬 Contacter'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={toggleLike}>
            <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
            <Text style={styles.actionLabel}>{likeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={toggleSauvegarde}>
            <Text style={styles.actionIcon}>{sauvegarde ? '🔖' : '🏷️'}</Text>
            <Text style={styles.actionLabel}>Sauver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={partager}>
            <Text style={styles.actionIcon}>↗️</Text>
            <Text style={styles.actionLabel}>Partager</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [offres, setOffres] = useState<any[]>([]);

  useEffect(() => {
    async function chargerOffres() {
      const { data } = await supabase.from('offres').select('*');
      if (data) setOffres(data);
    }
    chargerOffres();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>PitchMe</Text>
      <FlatList
        data={offres}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 70}
        decelerationRate="fast"
        renderItem={({ item }) => <OffreCard offre={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  logo: {
    position: 'absolute', top: 55, alignSelf: 'center',
    fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', zIndex: 10,
  },
  card: { width, height: height - 70, backgroundColor: '#1A1A2E' },
  videoPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  videoIcon: { fontSize: 80, marginBottom: 12 },
  videoHint: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  vuesBox: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  vuesText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'flex-end',
    padding: 16, paddingBottom: 24, backgroundColor: 'rgba(0,0,0,0.4)',
  },
  infoBox: { flex: 1, marginRight: 12 },
  badgeText: { fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  titre: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  entreprise: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 12, flexWrap: 'wrap' },
  meta: {
    fontSize: 12, color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 8,
    paddingVertical: 3, borderRadius: 100,
  },
  bouton: {
    backgroundColor: '#7C5CFC', borderRadius: 100,
    paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start',
  },
  boutonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  actions: { gap: 16, alignItems: 'center' },
  actionBtn: { alignItems: 'center' },
  actionIcon: { fontSize: 32 },
  actionLabel: { color: '#FFFFFF', fontSize: 11, marginTop: 2 },
});