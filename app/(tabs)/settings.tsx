import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useGame } from '@/lib/game/GameContext';
import { PlayerId } from '@/lib/game/types';

const WIN_OPTIONS = [5, 7, 10, 12, 15];

export default function SettingsScreen() {
  const { state, startGame, dispatch } = useGame();
  const [winThreshold, setWinThreshold] = useState(state.winThreshold);
  const [playerNames, setPlayerNames] = useState<Record<PlayerId, string>>({
    ...state.playerNames,
  });

  const handleSave = () => {
    // Persist settings: update player names and win threshold
    // They'll take effect on next new game start
    dispatch({ type: 'UPDATE_SETTINGS', winThreshold, playerNames });
    Alert.alert(
      'Настройки сохранены',
      'Изменения применены. Начните новую игру, чтобы они вступили в силу.',
      [{ text: 'OK' }]
    );
  };

  const updateName = (id: PlayerId, name: string) => {
    setPlayerNames(prev => ({ ...prev, [id]: name }));
  };

  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.pageTitle}>Настройки</Text>

        {/* Win threshold */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Очки для победы</Text>
          <Text style={styles.sectionSub}>Матч заканчивается, когда команда набирает это количество очков</Text>
          <View style={styles.optionsRow}>
            {WIN_OPTIONS.map(opt => (
              <Pressable
                key={opt}
                style={[styles.optionBtn, winThreshold === opt && styles.optionBtnActive]}
                onPress={() => setWinThreshold(opt)}
              >
                <Text style={[styles.optionText, winThreshold === opt && styles.optionTextActive]}>
                  {opt}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Player names */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Имена игроков</Text>

          {([0, 1, 2, 3] as PlayerId[]).map(id => {
            const positions = ['Вы (низ)', 'Левый', 'Партнёр (верх)', 'Правый'];
            const teams = ['Команда МЫ', 'Команда ОНИ', 'Команда МЫ', 'Команда ОНИ'];
            const teamColors = ['#4CAF50', '#E53935', '#4CAF50', '#E53935'];
            return (
              <View key={id} style={styles.nameRow}>
                <View style={styles.nameMeta}>
                  <Text style={styles.positionLabel}>{positions[id]}</Text>
                  <Text style={[styles.teamLabel, { color: teamColors[id] }]}>{teams[id]}</Text>
                </View>
                <TextInput
                  style={styles.nameInput}
                  value={playerNames[id]}
                  onChangeText={text => updateName(id, text)}
                  placeholder="Имя игрока"
                  placeholderTextColor="#2E7D4F"
                  maxLength={12}
                  returnKeyType="done"
                />
              </View>
            );
          })}
        </View>

        {/* Team info */}
        <View style={styles.teamInfoCard}>
          <Text style={styles.sectionTitle}>Команды</Text>
          <View style={styles.teamInfoRow}>
            <View style={[styles.teamDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.teamInfoText}>МЫ: Вы + Партнёр (по диагонали)</Text>
          </View>
          <View style={styles.teamInfoRow}>
            <View style={[styles.teamDot, { backgroundColor: '#E53935' }]} />
            <Text style={styles.teamInfoText}>ОНИ: Левый + Правый</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.85 }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Сохранить</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    color: '#F5C842',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 4,
  },
  section: {
    backgroundColor: '#1A5C32',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E7D4F',
    gap: 12,
  },
  sectionTitle: {
    color: '#F5C842',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionSub: {
    color: '#A8C5A0',
    fontSize: 12,
    lineHeight: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  optionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1,
    borderColor: '#2E7D4F',
    minWidth: 52,
    alignItems: 'center',
  },
  optionBtnActive: {
    backgroundColor: '#F5C842',
    borderColor: '#F5C842',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  optionTextActive: {
    color: '#0A3D1F',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  nameMeta: {
    width: 100,
  },
  positionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  teamLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  nameInput: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2E7D4F',
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  teamInfoCard: {
    backgroundColor: '#1A5C32',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2E7D4F',
    gap: 10,
  },
  teamInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  teamDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  teamInfoText: {
    color: '#FFFFFF',
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#F5C842',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#0A3D1F',
    fontSize: 16,
    fontWeight: '800',
  },
});
