import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

const { height, width } = Dimensions.get('window');
const CATEGORIES = ['Suivis', 'Pour toi', 'Près de moi'];

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
      const { data: likeData } = await supabase.from('likes').select('*').eq('user_id', user.id).eq('offre_id', offre.id);
      if (likeData && likeData.length > 0) setLiked(true);
      const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('offre_id', offre.id);
      setLikeCount(count || 0);
      const { data: sauvData } = await supabase.from('sauvegardes').select('*').eq('user_id', user.id).eq('offre_id', offre.id);
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
      await supabase.from('likes').delete().eq('user_id', user.id).eq('offre_id', offre.id);
      setLiked(false); setLikeCount(c => c - 1);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, offre_id: offre.id, created_at: new Date().toISOString() });
      setLiked(true); setLikeCount(c => c + 1);
    }
  }

  async function toggleSauvegarde() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (sauvegarde) {
      await supabase.from('sauvegardes').delete().eq('user_id', user.id).eq('offre_id', offre.id);
      setSauvegarde(false);
    } else {
      await supabase.from('sauvegardes').insert({ user_id: user.id, offre_id: offre.id, created_at: new Date().toISOString() });
      setSauvegarde(true);
    }
  }

  async function partager() {
    await Share.share({ message: `${offre.titre} chez ${offre.entreprise} - ${offre.lieu}\n\nVia PitchMe` });
  }

  const initiales = offre.entreprise?.slice(0, 2).toUpperCase() || 'PM';
  const isOffre = offre.type === 'offre';

  return (
    <View style={styles.card}>
      <View style={[styles.cardBg, { backgroundColor: offre.couleur || '#0d0d1a' }]} />
      <View style={styles.cardOverlay} />

      <View style={styles.header}>
        <View style={styles.typePill}>
          <View style={[styles.typeDot, { backgroundColor: isOffre ? '#6C47FF' : '#FF2D55' }]} />
          <Text style={styles.typeText}>{isOffre ? 'Offre' : 'Candidature'}</Text>
        </View>
      </View>

      <View style={styles.playZone}>
        <View style={styles.playBtn}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>

      {/* Zone cliquable pour voir le détail */}
      <TouchableOpacity
        style={styles.bottomLeft}
        onPress={() => router.push(('/offre/' + offre.id) as any)}
        activeOpacity={0.9}
      >
        <View style={styles.companyRow}>
          <View style={styles.companyDot}>
            <Text style={styles.companyInitiales}>{initiales}</Text>
          </View>
          <Text style={styles.entrepriseName}>{offre.entreprise}</Text>
        </View>
        <Text style={styles.titre}>{offre.titre}</Text>
        <View style={styles.tagsRow}>
          {offre.lieu ? <View style={styles.tag}><Text style={styles.tagText}>📍 {offre.lieu}</Text></View> : null}
          {offre.salaire ? <View style={styles.tag}><Text style={styles.tagText}>{offre.salaire}</Text></View> : null}
        </View>
        <View style={[styles.cta, { backgroundColor: isOffre ? '#6C47FF' : '#FF2D55' }]}>
          <Text style={styles.ctaText}>{isOffre ? '🎬 Postuler en vidéo' : '💬 Contacter'}</Text>
        </View>
      </TouchableOpacity>

      {/* Actions droite */}
      <View style={styles.sideActions}>
        <View style={styles.sideAvatar}>
          <Text style={styles.sideAvatarInitiales}>{initiales}</Text>
          <View style={styles.followCircle}>
            <Text style={styles.followPlus}>+</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sideBtn} onPress={toggleLike}>
          <Text style={[styles.sideIcon, liked && { color: '#FF2D55' }]}>{liked ? '♥' : '♡'}</Text>
          <Text style={styles.sideLabel}>{likeCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn} onPress={toggleSauvegarde}>
          <Text style={[styles.sideIcon, sauvegarde && { color: '#FFD60A' }]}>⊡</Text>
          <Text style={styles.sideLabel}>{vues}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideBtn} onPress={partager}>
          <Text style={styles.sideIcon}>↑</Text>
          <Text style={styles.sideLabel}>Partager</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [offres, setOffres] = useState<any[]>([]);
  const [categorie, setCategorie] = useState('Pour toi');
  const router = useRouter();

  useEffect(() => {
    async function chargerOffres() {
      const { data } = await supabase.from('offres').select('*');
      if (data) setOffres(data);
    }
    chargerOffres();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} onPress={() => setCategorie(cat)} style={styles.catItem}>
              <Text style={[styles.catLabel, categorie === cat && styles.catLabelActive]}>{cat}</Text>
              {categorie === cat && <View style={styles.catLine} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.searchBtn} onPress={() => router.push('/recherche')}>
          <Text style={styles.searchIcon}>⌕</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={offres}
        keyExtractor={(item) => item.id.toString()}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 80}
        decelerationRate="fast"
        renderItem={({ item }) => <OffreCard offre={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    paddingTop: 52, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  catsRow: { paddingHorizontal: 20, paddingBottom: 12, gap: 24 },
  catItem: { alignItems: 'center', paddingBottom: 4 },
  catLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: '600' },
  catLabelActive: { color: '#FFFFFF', fontWeight: '800' },
  catLine: { height: 2, width: '100%', backgroundColor: '#FFFFFF', marginTop: 3, borderRadius: 1 },
  searchBtn: { paddingRight: 20, paddingBottom: 12 },
  searchIcon: { color: '#FFFFFF', fontSize: 24 },
  card: { width, height: height - 80, overflow: 'hidden' },
  cardBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  cardOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  header: { position: 'absolute', top: 100, left: 16 },
  typePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  typeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  playZone: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  playBtn: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  playIcon: { color: '#FFFFFF', fontSize: 20 },
  bottomLeft: { position: 'absolute', bottom: 28, left: 16, right: 80 },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  companyDot: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(108,71,255,0.3)',
    borderWidth: 1, borderColor: 'rgba(108,71,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  companyInitiales: { color: '#a78bfa', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  entrepriseName: { color: 'rgba(255,255,255,0.85)', fontWeight: '700', fontSize: 14 },
  titre: {
    color: '#FFFFFF', fontSize: 20, fontWeight: '900',
    lineHeight: 26, marginBottom: 10, letterSpacing: -0.5,
  },
  tagsRow: { flexDirection: 'row', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  tagText: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600' },
  cta: {
    borderRadius: 100, paddingVertical: 11, paddingHorizontal: 22,
    alignSelf: 'flex-start',
  },
  ctaText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  sideActions: {
    position: 'absolute', right: 10, bottom: 28,
    alignItems: 'center', gap: 22,
  },
  sideAvatar: { alignItems: 'center', marginBottom: 4, position: 'relative' },
  sideAvatarInitiales: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(108,71,255,0.35)',
    borderWidth: 2, borderColor: '#FFFFFF',
    textAlign: 'center', lineHeight: 42,
    color: '#FFFFFF', fontSize: 12, fontWeight: '900',
    overflow: 'hidden',
  },
  followCircle: {
    position: 'absolute', bottom: -7,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#FF2D55',
    alignItems: 'center', justifyContent: 'center',
  },
  followPlus: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', lineHeight: 18 },
  sideBtn: { alignItems: 'center', gap: 3 },
  sideIcon: { color: '#FFFFFF', fontSize: 30 },
  sideLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
});