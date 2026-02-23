import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function DashboardScreen() {
  const [stats, setStats] = useState({ offres: 0, candidatures: 0, likes: 0, vues: 0 });
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerStats() {
      const { data: offresData } = await supabase.from('offres').select('*');
      const { count: likesCount } = await supabase.from('likes').select('*', { count: 'exact', head: true });
      const { count: candidaturesCount } = await supabase.from('offres').select('*', { count: 'exact', head: true }).eq('type', 'candidature');

      const totalVues = offresData?.reduce((acc, o) => acc + (o.vues || 0), 0) || 0;

      setStats({
        offres: offresData?.filter(o => o.type === 'offre').length || 0,
        candidatures: candidaturesCount || 0,
        likes: likesCount || 0,
        vues: totalVues,
      });

      setOffres(offresData || []);
      setLoading(false);
    }
    chargerStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7C5CFC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titre}>Dashboard RH 📊</Text>
      <Text style={styles.sousTitre}>Vue d'ensemble de vos recrutements</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: '#2D0A5E' }]}>
          <Text style={styles.statIcon}>📋</Text>
          <Text style={styles.statNombre}>{stats.offres}</Text>
          <Text style={styles.statLabel}>Offres actives</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#0A1A3E' }]}>
          <Text style={styles.statIcon}>👤</Text>
          <Text style={styles.statNombre}>{stats.candidatures}</Text>
          <Text style={styles.statLabel}>Candidatures</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#1A0A3E' }]}>
          <Text style={styles.statIcon}>❤️</Text>
          <Text style={styles.statNombre}>{stats.likes}</Text>
          <Text style={styles.statLabel}>Total likes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#0A2A2E' }]}>
          <Text style={styles.statIcon}>👁️</Text>
          <Text style={styles.statNombre}>{stats.vues}</Text>
          <Text style={styles.statLabel}>Total vues</Text>
        </View>
      </View>

      <Text style={styles.sectionTitre}>Mes offres publiées</Text>

      {offres.filter(o => o.type === 'offre').map(offre => (
        <View key={offre.id} style={styles.offreCard}>
          <View style={styles.offreHeader}>
            <View style={styles.offreInfo}>
              <Text style={styles.offreTitre}>{offre.titre}</Text>
              <Text style={styles.offreEntreprise}>{offre.entreprise}</Text>
              <Text style={styles.offreLieu}>📍 {offre.lieu}</Text>
            </View>
            <View style={styles.offreStats}>
              <Text style={styles.offreStatText}>👁️ {offre.vues || 0}</Text>
            </View>
          </View>
          <View style={styles.offreMeta}>
            {offre.salaire && <Text style={styles.metaText}>💰 {offre.salaire}</Text>}
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min((offre.vues || 0) * 5, 100)}%` as any }]} />
          </View>
          <Text style={styles.progressLabel}>Taux de visibilité</Text>
        </View>
      ))}

      <Text style={styles.sectionTitre}>Candidatures reçues</Text>

      {offres.filter(o => o.type === 'candidature').map(candidature => (
        <View key={candidature.id} style={[styles.offreCard, { borderLeftWidth: 3, borderLeftColor: '#FC5C7D' }]}>
          <Text style={styles.offreTitre}>{candidature.titre}</Text>
          <Text style={styles.offreEntreprise}>{candidature.entreprise}</Text>
          <Text style={styles.offreLieu}>📍 {candidature.lieu}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>💬 Contacter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#2A2A3A' }]}>
              <Text style={[styles.actionBtnText, { color: '#8888AA' }]}>👀 Voir profil</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    fontSize: 28,
  },
  statNombre: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  sectionTitre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 14,
    marginTop: 8,
  },
  offreCard: {
    backgroundColor: '#13131A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A3A',
  },
  offreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  offreInfo: {
    flex: 1,
  },
  offreTitre: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F0F0F8',
    marginBottom: 3,
  },
  offreEntreprise: {
    fontSize: 13,
    color: '#7C5CFC',
    marginBottom: 3,
  },
  offreLieu: {
    fontSize: 12,
    color: '#8888AA',
  },
  offreStats: {
    alignItems: 'flex-end',
  },
  offreStatText: {
    fontSize: 13,
    color: '#8888AA',
  },
  offreMeta: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#8888AA',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2A2A3A',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7C5CFC',
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    color: '#555570',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    backgroundColor: '#7C5CFC',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});