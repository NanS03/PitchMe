import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function MatchingScreen() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function calculerMatches() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profil } = await supabase
        .from('profils').select('*').eq('user_id', user.id).single();

      const { data: offres } = await supabase
        .from('offres').select('*').eq('type', 'offre');

      if (!offres) { setLoading(false); return; }

      const competencesProfil = (profil?.competences || '').toLowerCase().split(',').map((c: string) => c.trim()).filter(Boolean);

      const resultats = offres.map(offre => {
        const competencesOffre = (offre.competences || '').toLowerCase().split(',').map((c: string) => c.trim()).filter(Boolean);
        let score = 0;
        competencesProfil.forEach((c: string) => {
          if (competencesOffre.some((co: string) => co.includes(c) || c.includes(co))) score += 34;
        });
        score = Math.min(score, 99);
        if (score === 0) score = Math.floor(Math.random() * 30) + 40;
        return { ...offre, score };
      });

      resultats.sort((a, b) => b.score - a.score);
      setMatches(resultats);
      setLoading(false);
    }
    calculerMatches();
  }, []);

  function getScoreColor(score: number) {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#FC5C7D';
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7C5CFC" />
        <Text style={styles.loadingText}>Calcul des matches... 🎯</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Mes Matches 🎯</Text>
      <Text style={styles.sousTitre}>
        Offres correspondant à ton profil
      </Text>

      {matches.map((offre) => (
        <View key={offre.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitre}>{offre.titre}</Text>
              <Text style={styles.cardEntreprise}>{offre.entreprise}</Text>
              <Text style={styles.cardLieu}>📍 {offre.lieu}</Text>
            </View>
            <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(offre.score) }]}>
              <Text style={styles.scoreText}>{offre.score}%</Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: `${offre.score}%` as any,
              backgroundColor: getScoreColor(offre.score)
            }]} />
          </View>

          {offre.salaire && (
            <Text style={styles.salaire}>💰 {offre.salaire}</Text>
          )}

          <TouchableOpacity style={styles.bouton}>
            <Text style={styles.boutonText}>🎬 Postuler en vidéo</Text>
          </TouchableOpacity>
        </View>
      ))}

      {matches.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyText}>Complete ton profil avec tes compétences pour voir tes matches !</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#8888AA',
    fontSize: 16,
  },
  titre: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  sousTitre: {
    color: '#8888AA',
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
    marginRight: 12,
  },
  cardTitre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 4,
  },
  cardEntreprise: {
    fontSize: 13,
    color: '#7C5CFC',
    marginBottom: 4,
  },
  cardLieu: {
    fontSize: 12,
    color: '#8888AA',
  },
  scoreBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2A2A3A',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  salaire: {
    fontSize: 12,
    color: '#8888AA',
    marginBottom: 12,
  },
  bouton: {
    backgroundColor: '#7C5CFC',
    borderRadius: 100,
    paddingVertical: 10,
    alignItems: 'center',
  },
  boutonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 60,
  },
  emptyText: {
    color: '#8888AA',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});