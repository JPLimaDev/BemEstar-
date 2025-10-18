import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useKeepAwake } from 'expo-keep-awake'
import { Audio } from 'expo-av'
import AudioSelector from '../components/AudioSelector'
import { AVAILABLE_AUDIOS, MeditationAudio } from '../../data/meditationData' 


type TimerState = 'idle' | 'running' | 'paused' | 'finished'

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')
  return `${formattedMinutes}:${formattedSeconds}`
}


const INITIAL_DURATION_SECONDS = 0

const MeditationScreen: React.FC = () => {
  useKeepAwake()

  const [selectedAudio, setSelectedAudio] = useState<MeditationAudio | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(INITIAL_DURATION_SECONDS)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [soundObject, setSoundObject] = useState<Audio.Sound | null>(null)
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const intervalRef = useRef<number | null>(null)

  const handleSelectAudio = useCallback(async (audio: MeditationAudio) => {
   
      await handleReset()

      setSelectedAudio(audio)
      setRemainingTime(audio.durationSeconds)
      
      setIsAudioLoading(true)
      try {
        const { sound } = await Audio.Sound.createAsync(
            { uri: audio.uri },
            { shouldPlay: false }
        )
        setSoundObject(sound)
      } catch (error) {
          Alert.alert("Erro de Áudio", "Não foi possível carregar o arquivo de áudio.")
          setSoundObject(null)
          setSelectedAudio(null)
      } finally {
        setIsAudioLoading(false)
      }
      
  }, [soundObject])
  

  useEffect(() => {
    if (!selectedAudio && AVAILABLE_AUDIOS.length > 0) {
        handleSelectAudio(AVAILABLE_AUDIOS[0])
    }
    
 
    return () => {
      const unloadSound = async () => {
        if (soundObject) {
          await soundObject.unloadAsync()
        }
      }
      unloadSound()
    }
  }, []) 


  const handleReset = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (soundObject) {
        await soundObject.stopAsync()
        await soundObject.setPositionAsync(0)
        await soundObject.unloadAsync()
        setSoundObject(null)
    }

    
    setRemainingTime(selectedAudio ? selectedAudio.durationSeconds : 0)
    setTimerState('idle')
  }
  
  const handleStartPause = async () => {
   
    if (!selectedAudio || isAudioLoading) return
    
    if (timerState === 'running') {
  
      setTimerState('paused')
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (soundObject) await soundObject.pauseAsync()

    } else if (timerState === 'paused' || timerState === 'idle') {
      
      setTimerState('running')
      if (soundObject) await soundObject.playAsync()
    }
  }

  
  
  useEffect(() => {
    if (timerState === 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      
    
      intervalRef.current = setInterval(() => { 
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
          
            if (intervalRef.current) clearInterval(intervalRef.current)
            setTimerState('finished')
            
            
            if (soundObject) soundObject.stopAsync()

            Alert.alert("Meditação Concluída!", "Você completou sua sessão.")
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

    } else 
      if (intervalRef.current) clearInterval(intervalRef.current)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
}, [timerState, soundObject])


  let controlIcon: keyof typeof Feather.glyphMap = 'play'
  if (timerState === 'running') controlIcon = 'pause'
  if (timerState === 'finished') controlIcon = 'check-circle'

  let statusText = 'PRONTO'
  if (isAudioLoading) statusText = 'CARREGANDO...'
  if (timerState === 'running') statusText = 'MEDITANDO'
  if (timerState === 'paused') statusText = 'PAUSADO'
  if (timerState === 'finished') statusText = 'CONCLUÍDO'

  const isControlDisabled = isAudioLoading || !selectedAudio || timerState === 'finished'

  return (
    <View style={styles.container}>
      
     
      <AudioSelector
        audios={AVAILABLE_AUDIOS}
        selectedAudioId={selectedAudio?.id || null}
        onSelect={handleSelectAudio}
      />
      
      <Text style={styles.title}>
        {selectedAudio ? selectedAudio.name : 'Selecione um Áudio'}
      </Text>
      <Text style={styles.subtitle}>
        {selectedAudio ? 'Duração: ' + (selectedAudio.durationSeconds / 60) + ' min' : 'Tempo: --:--'}
      </Text>

    
      <View style={styles.timerCircle}>
        <Text style={styles.timerText}>
          {formatTime(remainingTime)}
        </Text>
        <Text style={styles.statusText}>
            {statusText}
        </Text>
      </View>


      <View style={styles.controls}>
        
      
        <Pressable 
          onPress={handleReset}
          style={({ pressed }) => [styles.smallButton, { opacity: pressed ? 0.7 : 1 }]}
          disabled={isControlDisabled || timerState === 'idle'}
        >
          <Feather name="rotate-ccw" size={24} color="#6A1B9A" />
        </Pressable>

        <Pressable 
          onPress={handleStartPause}
          style={({ pressed }) => [
            styles.mainButton, 
            { opacity: pressed ? 0.7 : 1, backgroundColor: isControlDisabled ? '#AAA' : '#6A1B9A'}
          ]}
          disabled={isControlDisabled}
        >
          <Feather name={controlIcon} size={40} color="#FFFFFF" />
        </Pressable>

        <View style={styles.smallButtonPlaceholder} />

      </View>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6E0F8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 0, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
    marginTop: 20, 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  timerText: {
    fontSize: 50,
    fontWeight: '300',
    color: '#6A1B9A',
  },
  statusText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 40,
  },
  mainButton: {
    backgroundColor: '#6A1B9A',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  smallButton: {
    backgroundColor: '#FFFFFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6A1B9A',
  },
  smallButtonPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  }
})

export default MeditationScreen