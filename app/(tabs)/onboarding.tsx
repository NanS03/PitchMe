import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { height, width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    emoji: '🎬',
    titre: 'Bienvenue sur PitchMe',
    description: 'La première app de recrutement par vidéo. Montre qui tu es en 60 secondes.',
    couleur: '#1A0A3E',
    accent: '#6C47FF',
  },
  {
    id: 2,
    emoji: '📱',
    titre: 'Swipe les offres',
    description: 'Scroll les offres et candidatures comme sur TikTok. Simple, rapide, efficace.',
    couleur: '#0A1A3E',
    accent: '#2D6AFF',
  },
  {
    id: 3,
    emoji: '🚀',
    titre: 'Poste ton pitch',
    description: 'Enregistre une vidéo de 60s pour te démarquer. Fini les CVs ennuyeux !',
    couleur: '#1A0A2E',
    accent: '#FF2D55',
  },
  {
    id: 4,
    emoji: '🎯',
    titre: 'Trouve le match parfait',
    description: 'Notre algo trouve les offres qui correspondent vraiment à ton profil.',
    couleur: '#0A2A1A',
    accent: '#00C851',
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  function suivant() {
    if (isLast) {
      router.replace('/login');
    } else {
      setCurrent(c => c + 1);
    }
  }

  function passer() {
    router.replace('/login');
  }

  return (
    <View style={[styles.container, { backgroundColor: slide.couleur }]}>
      {/* Skip */}
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={passer}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      {/* Contenu */}
      <View style={styles.content}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.titre}>{slide.titre}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      {/* Dots */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === current
                ? { backgroundColor: slide.accent, width: 24 }
                : { backgroundColor: 'rgba(255,255,255,0.3)' }
            ]}
          />
        ))}
      </View>

      {/* Bouton */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: slide.accent }]}
        onPress={suivant}
      >
        <Text style={styles.btnText}>
          {isLast ? '🚀 Commencer' : 'Continuer →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  skipBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
  },
  skipText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 90,
    marginBottom: 10,
  },
  titre: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    width: 8,
  },
  btn: {
    width: '100%',
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
});