import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView,Pressable,Alert} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import * as Location from 'expo-location'
import * as Constants from 'expo-constants'
import { auth } from '../../config/firebase'


interface UserProfile {
  name: string
  email: string
  avatarUrl: string
  goalsCompleted: number
}


interface MenuItemProps {
  iconName: keyof typeof Feather.glyphMap
  title: string
  onPress: () => void
  isDestructive?: boolean
}


const MenuItem: React.FC<MenuItemProps> = ({ iconName, title, onPress, isDestructive = false }) => (
  <Pressable 
    onPress={onPress} 
    style={({ pressed }) => [
      styles.menuItem,
      { backgroundColor: pressed ? '#E0E0E0' : '#FFFFFF' } 
    ]}
  >
    <View style={styles.menuItemContent}>
      <Feather name={iconName} size={20} color={isDestructive ? '#F44336' : '#333'} style={styles.menuIcon} />
      <Text style={[styles.menuTitle, isDestructive && styles.destructiveText]}>
        {title}
      </Text>
    </View>
    <Feather name="chevron-right" size={20} color="#CCC" />
  </Pressable>
)


const MOCKED_USER: UserProfile = {
  name: "João Silva",
  email: "joao.silva@exemplo.com",
  avatarUrl: "https://i.pravatar.cc/150?img=68",
  goalsCompleted: 15,
}

const ProfileScreen: React.FC = () => {
  const router = useRouter()
  const [locationName, setLocationName] = useState<string>('Seu Local')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      
      if (status !== 'granted') {
        setErrorMsg('Permissão negada')
        return
      }
      
      let location = await Location.getCurrentPositionAsync({})
      
      let geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      if (geocode && geocode.length > 0) {
        const city = geocode[0].city || geocode[0].subregion
        if (city) {
          setLocationName(city)
        } else {
          setLocationName('Seu Local')
        }
      }

    })()
  }, [])

  const handleLogout = () => {
    Alert.alert("Sair", "Você tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Sair", 
        style: "destructive", 
        onPress: () => {
          auth.signOut();
          console.log("Usuário saiu!") 
          router.replace('/')
        } 
      }
    ])
  }

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.locationText}>
          {errorMsg ? 'Olá!' : `📍 ${locationName}`}
        </Text>
        
        <Pressable 
          onPress={() => Alert.alert("Ação", "Abrir seletor de fotos para alterar o avatar.")}
          style={styles.avatarContainer}
        >
          <Image 
            style={styles.avatar}
            source={{ uri: MOCKED_USER.avatarUrl }}
            contentFit="cover"
          />
          <View style={styles.editIconContainer}>
            <Feather name="camera" size={16} color="#FFF" />
          </View>
        </Pressable>

      
        <Text style={styles.userName}>{MOCKED_USER.name}</Text>
        <Text style={styles.userEmail}>{MOCKED_USER.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{MOCKED_USER.goalsCompleted}</Text>
          <Text style={styles.statLabel}>Metas Concluídas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>30</Text>
          <Text style={styles.statLabel}>Dias Ativos</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Geral</Text>
        <MenuItem 
          iconName="settings" 
          title="Configurações da Conta" 
          onPress={() => Alert.alert("Navegação", "Navegar para a tela de Configurações.")}
        />
        <MenuItem 
          iconName="bell" 
          title="Notificações" 
          onPress={() => Alert.alert("Navegação", "Navegar para a tela de Notificações.")}
        />
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <MenuItem 
          iconName="help-circle" 
          title="Central de Ajuda" 
          onPress={() => Alert.alert("Ação", "Abrir o link de Suporte.")}
        />
        <MenuItem 
          iconName="info" 
          title="Sobre o App" 
          onPress={() => Alert.alert("Ação", "Mostrar versão e créditos.")}
        />
      </View>
      
  
      <View style={[styles.menuSection, styles.logoutSection]}>
        <MenuItem 
          iconName="log-out" 
          title="Sair" 
          onPress={handleLogout}
          isDestructive={true} 
        />
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  
  
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  

  locationText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 15,
    fontWeight: '600',
  },
  
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 5,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
    paddingVertical: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },

  menuSection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#999',
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingLeft: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  destructiveText: {
    color: '#F44336',
    fontWeight: '500',
  },
  logoutSection: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  }
})

export default ProfileScreen
