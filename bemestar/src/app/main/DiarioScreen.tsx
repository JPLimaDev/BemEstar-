import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface Humor {
    name: string
    icone: string
    color: string
}


export default function DiarioScreen() {
  const [textoDiario, setTextoDiario] = useState('')
  const [humorSelecionado, setHumorSelecionado] = useState<Humor | null>(null)


  const opcoesHumor: Humor[] = [ 
    { name: 'Muito Feliz', icone: 'emoticon-happy', color: '#4CAF50' }, 
    { name: 'Normal', icone: 'emoticon-neutral', color: '#FFEB3B' }, 
    { name: 'Triste', icone: 'emoticon-sad', color: '#FF9800' }, 
    { name: 'Estressado', icone: 'emoticon-frown', color: '#F44336' }, 
  ]

  const salvarRegistro = () => {
    if (!humorSelecionado || textoDiario.trim() === '') {
      Alert.alert("Campos Obrigatórios", "Por favor, selecione seu humor e escreva seu registro antes de salvar.");
      return
    }
    
    //  Futuramente: Adicionar banco de dados para salvar os dados fornecidos.
    Alert.alert(
      "Diário Salvo!",
      `Humor: ${humorSelecionado.name}\nRegistro: ${textoDiario.substring(0, 50)}...`,
      [
        { text: "OK", onPress: () => {
            setTextoDiario('')
            setHumorSelecionado(null)
        }}
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Diário de Emoções</Text>
      <Text style={styles.dateText}>Hoje é: {new Date().toLocaleDateString('pt-BR')}</Text>

      {/* 1. SELEÇÃO DE HUMOR DO USUÁRIO */}
      <Text style={styles.sectionTitle}>Como você se sente?</Text>
      <View style={styles.humorContainer}>
        {opcoesHumor.map((humor) => (
          <Pressable
            key={humor.name}
            onPress={() => setHumorSelecionado(humor)}
            style={({ pressed }) => [
              styles.humorOption,
              humorSelecionado?.name === humor.name && styles.humorSelected,
              pressed && { opacity: 0.7 }
            ]}
          >
            <MaterialCommunityIcons 
              name={humor.icone as any} 
              size={30} 
              color={humor.color}
            />
            <Text style={styles.humorText}>{humor.name}</Text>
          </Pressable>
        ))}
      </View>

      {/* 2. REGISTRO DE TEXTO */}
      <Text style={styles.sectionTitle}>Seu Registro (Opcional)</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="O que aconteceu hoje? Quais são seus pensamentos?"
        value={textoDiario}
        onChangeText={setTextoDiario}
        textAlignVertical="top"
        maxLength={500}
      />
      <Text style={styles.charCount}>{textoDiario.length}/500 caracteres</Text>

      {/* 3. BOTÃO SALVAR */}
      <Pressable 
        onPress={salvarRegistro} 
        style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.8 }]}
      >
        <Text style={styles.saveButtonText}>Salvar Registro</Text>
      </Pressable>
      
      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  
  humorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  humorOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '23%', 
    backgroundColor: '#f9f9f9',
  },
  humorSelected: {
    borderColor: '#4CAF50', 
    borderWidth: 2,
    backgroundColor: '#e8f5e9', 
  },
  humorText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },

  textInput: {
    minHeight: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },

  saveButton: {
    backgroundColor: '#4CAF50', 
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});