import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

const { height, width } = Dimensions.get('window');

function OffreCard({ offre, isActive }: { offre: any, isActive: boolean }) {
  const router = useRouter();

  return (
    <View style={[styles.card, { backgroundColor: offre.couleur || '#2D0A5E' }]}>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoIcon}>🎬</Text>
        <Text style={styles.videoHint}>Vidéo de présentation</Text>
      </View>

      <View style={styles.overlay}>
        <View style={styles.infoBox}>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { color: offre.type === 'offre' ? '#7C5CFC' : '#FC5C7D' }]}>
              {offre.type === 'offre' ? '● Offre' : '● Candidature'}
            </Text>
          </View>
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
  const [activeIndex, setActiveIndex] = useState(0);

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
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / (height - 70));
          setActiveIndex(index);
        }}
        renderItem={({ item, index }) => (
          <OffreCard offre={item} isActive={index === activeIndex} />
        )}
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
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  card: {
    width,
    height: height - 70,
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoIcon: {
    fontSize: 80,
    marginBottom: 12,
  },
  videoHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
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
  },
  infoBox: {
    flex: 1,
    marginRight: 12,
  },
  badge: {
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  titre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
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