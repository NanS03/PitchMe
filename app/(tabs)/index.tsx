import { ResizeMode, Video } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

const { height, width } = Dimensions.get('window');
const MUX_PLAYBACK_ID = 'eIba00DzgnlfkOCoLHMarw00cn6M4dW00vJ7fmGlMQUZHs';

function OffreCard({ offre }: { offre: any }) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Video
        source={{ uri: `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8` }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted={false}
      />
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
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>❤️</Text>
            <Text style={styles.actionLabel}>J'aime</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🔖</Text>
            <Text style={styles.actionLabel}>Sauver</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
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
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  logo: {
    position: 'absolute',
    top: 55,
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    zIndex: 10,
  },
  card: {
    width,
    height: height - 70,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  infoBox: {
    flex: 1,
    marginRight: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  titre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  entreprise: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
  },
  bouton: {
    backgroundColor: '#7C5CFC',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  boutonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actions: {
    gap: 16,
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    marginTop: 2,
  },
});