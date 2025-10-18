import React from 'react'
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { MeditationAudio } from '../../data/meditationData'

interface AudioSelectorProps {
  audios: MeditationAudio[]
  selectedAudioId: string | null
  onSelect: (audio: MeditationAudio) => void
}

const AudioSelector: React.FC<AudioSelectorProps> = ({ audios, selectedAudioId, onSelect }) => {
  
  const renderItem = ({ item }: { item: MeditationAudio }) => {
    const isSelected = item.id === selectedAudioId
    
    return (
      <Pressable 
        onPress={() => onSelect(item)}
        style={({ pressed }) => [
          styles.itemContainer, 
          isSelected && styles.itemSelected,
          { opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <Feather 
          name={isSelected ? "check-circle" : "circle"} 
          size={20} 
          color={isSelected ? '#6A1B9A' : '#999'} 
          style={styles.icon}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDuration}>
          {item.durationSeconds / 60} min
        </Text>
      </Pressable>
    );
  };
  
  return (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>Escolha a Meditação</Text>
      <FlatList
        data={audios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: '100%',
    maxHeight: 250, 
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E6E0F8',
  },
  itemSelected: {
    borderColor: '#6A1B9A',
    borderWidth: 2,
    backgroundColor: '#F3E5F5', 
  },
  icon: {
    marginRight: 15,
  },
  itemName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  itemDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A1B9A',
  },
});

export default AudioSelector