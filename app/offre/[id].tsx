import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../supabase';

export default function OffreDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [offre, setOffre] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerOffre() {
      const { data } = await supabase.from('offres').select('*').eq('id', id).single();
      if (data) setOffre(data);
      setLoading(false);
    }
    chargerOffre();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C47FF" />
      </View>
    );
  }

  if (!offre) return null;

  const isOffre = offre.type === 'offre';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: offre.couleur || '#1A0A3E' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.companyDot}>
            <Text style={styles.companyInitiales}>
              {offre.entreprise?.slice(0, 2).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.entrepriseName}>{offre.entreprise}</Text>
            <Text style={styles.lieuText}>📍 {offre.lieu}</Text>
          </View>
        </View>
        <View style={[styles.typePill, { borderColor: isOffre ? '#6C47FF' : '#FF2D55' }]}>
          <View style={[styles.typeDot, { backgroundColor: isOffre ? '#6C47FF' : '#FF2D55' }]} />
          <Text style={styles.typeText}>{isOffre ? 'Offre' : 'Candidature'}</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Titre */}
        <Text style={styles.titre}>{offre.titre}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {offre.salaire && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>💰 {offre.salaire}</Text>
            </View>
          )}
          {offre.lieu && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>📍 {offre.lieu}</Text>
            </View>
          )}
          {offre.competences && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>🛠 {offre.competences}</Text>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNombre}>{offre.vues || 0}</Text>
            <Text style={styles.statLabel}>Vues</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Candidatures</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNombre}>0</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>À propos du poste</Text>
          <Text style={styles.description}>
            {isOffre
              ? `${offre.entreprise} recherche un(e) ${offre.titre} pour rejoindre son équipe${offre.lieu ? ` à ${offre.lieu}` : ''}. Ce poste est une opportunité unique de rejoindre une entreprise en pleine croissance.`
              : `${offre.entreprise} propose sa candidature pour un poste de ${offre.titre}${offre.lieu ? ` à ${offre.lieu}` : ''}. Profil motivé et passionné cherchant de nouvelles opportunités.`
            }
          </Text>
        </View>

        {offre.competences && (
          <View style={styles.section}>
            <Text style={styles.sectionTitre}>Compétences requises</Text>
            <View style={styles.competencesGrid}>
              {offre.competences.split(',').map((comp: string, i: number) => (
                <View key={i} style={styles.competencePill}>
                  <Text style={styles.competenceText}>{comp.trim()}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Entreprise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitre}>L'entreprise</Text>
          <View style={styles.entrepriseCard}>
            <View style={styles.entrepriseLogo}>
              <Text style={styles.entrepriseLogoText}>
                {offre.entreprise?.slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text style={styles.entrepriseNom}>{offre.entreprise}</Text>
              <Text style={styles.entrepriseLieu}>📍 {offre.lieu}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* CTA fixe en bas */}
      <View style={styles.bottomCta}>
        <TouchableOpacity
          style={[styles.ctaBtn, { backgroundColor: isOffre ? '#6C47FF' : '#FF2D55' }]}
          onPress={() => router.push('/postuler')}
        >
          <Text style={styles.ctaBtnText}>
            {isOffre ? '🎬 Postuler en vidéo' : '💬 Contacter'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1A2E' },
  loading: { flex: 1, backgroundColor: '#1A1A2E', alignItems: 'center', justifyContent: 'center' },

  header: {
    paddingTop: 60, paddingBottom: 24, paddingHorizontal: 16, gap: 16,
  },
  backBtn: { marginBottom: 8 },
  backIcon: { color: '#FFFFFF', fontSize: 24 },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  companyDot: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  companyInitiales: { color: '#FFFFFF', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  entrepriseName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  lieuText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  typePill: {
    alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  typeDot: { width: 6, height: 6, borderRadius: 3 },
  typeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },

  content: { flex: 1, padding: 20 },
  titre: { fontSize: 24, fontWeight: '900', color: '#F0F0F8', marginBottom: 16, letterSpacing: -0.5 },

  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tag: {
    backgroundColor: '#13131A', borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: '#2A2A3A',
  },
  tagText: { color: '#8888AA', fontSize: 13, fontWeight: '600' },

  statsRow: {
    flexDirection: 'row', backgroundColor: '#13131A',
    borderRadius: 16, padding: 16, marginBottom: 24,
    borderWidth: 1, borderColor: '#2A2A3A',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNombre: { color: '#F0F0F8', fontSize: 22, fontWeight: '800' },
  statLabel: { color: '#555570', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#2A2A3A' },

  section: { marginBottom: 24 },
  sectionTitre: { color: '#F0F0F8', fontSize: 16, fontWeight: '800', marginBottom: 10 },
  description: { color: '#8888AA', fontSize: 14, lineHeight: 22 },

  competencesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  competencePill: {
    backgroundColor: 'rgba(108,71,255,0.15)',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(108,71,255,0.3)',
  },
  competenceText: { color: '#a78bfa', fontSize: 13, fontWeight: '600' },

  entrepriseCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#13131A', borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: '#2A2A3A',
  },
  entrepriseLogo: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: '#2A2A3A', alignItems: 'center', justifyContent: 'center',
  },
  entrepriseLogoText: { color: '#7C5CFC', fontSize: 14, fontWeight: '900' },
  entrepriseNom: { color: '#F0F0F8', fontSize: 15, fontWeight: '700' },
  entrepriseLieu: { color: '#555570', fontSize: 12, marginTop: 2 },

  bottomCta: {
    padding: 16, paddingBottom: 24,
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1, borderTopColor: '#2A2A3A',
  },
  ctaBtn: {
    borderRadius: 100, paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
});