import React from "react"
import {View,Text,StyleSheet,Pressable,ImageBackground,Image} from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function HomeScreen() {
  const cards = [
  { 
    name: "Meditação",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=799&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  },
  {
    name: "Exercícios",
    image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
  },
  {
    name: "Nutrição",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TnV0cmklQzMlQTclQzMlQTNvfGVufDB8fDB8fHww", 
  },
  {
    name: "Sono",
    image: "https://plus.unsplash.com/premium_photo-1661397087554-2774b7e7332f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U29ub3xlbnwwfHwwfHx8MA%3D%3D",
  },
]

  return (
    <View style={{flex: 1}}>
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      }}
      style={styles.background}
      
    >
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, João 👋</Text>
          <Pressable>
            <Image
              source={{ uri: "https://i.pravatar.cc/100" }}
              style={styles.avatar}
            />
          </Pressable>
        </View>

       {/*Criação do banner Bem vindo*/}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Respire fundo. Hoje é um bom dia para cuidar de você 🌿
          </Text>
          <Pressable style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Iniciar Agora</Text>
          </Pressable>
        </View>

        {/*Grid - Meditação , exercicios leves, nutrição, sono*/}
        <View style = {styles.grid}>
          {cards.map((item, index) => (
            <Pressable key={index} style={styles.card}>
              <Image source={{uri : item.image}} style = {styles.cardImage}></Image>
              <Text style = {styles.cardText}>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode:'cover'
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2C3E50",
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  banner: {
    backgroundColor: "rgba(163, 217, 165, 0.9)",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  bannerText: {
    fontSize: 18,
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: "#2C3E50",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  bannerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
   grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  card: {
    width: "48%", 
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#e6ebf0ff",
  },
  iconMenuWrapper: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 30, 
  },
  iconMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    marginBottom: 10,
    borderRadius: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});

