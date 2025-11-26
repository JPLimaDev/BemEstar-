import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const items = [
  {
    id: "1",
    name: "Plano Premium",
    price: 29.90,
    image: "https://cdn-icons-png.flaticon.com/512/813/813322.png"
  },
  {
    id: "2",
    name: "Itens de Meditação",
    price: 9.90,
    image: "https://cdn-icons-png.flaticon.com/512/2769/2769979.png"
  },
  {
    id: "3",
    name: "Plano de Treino Avançado",
    price: 19.90,
    image: "https://cdn-icons-png.flaticon.com/512/2947/2947668.png"
  }
];

export default function StoreScreen() {
  const router = useRouter();

  const addToCart = async (item: any) => {
    try {
      const stored = await AsyncStorage.getItem("cart");
      let cart = stored ? JSON.parse(stored) : [];

      const exists = cart.find((c: any) => c.id === item.id);

      if (exists) {
        exists.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      Alert.alert("Adicionado!", `${item.name} foi para o carrinho.`);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível adicionar ao carrinho");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loja de Itens 🛒</Text>

      <Pressable 
        style={styles.cartButton}
        onPress={() => router.push("/shopping/CartScreen")}
      >
        <Text style={styles.cartButtonText}>Ver Carrinho</Text>
      </Pressable>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => addToCart(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  card: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
    elevation: 2,
  },
  cartButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center"
  },
  cartButtonText: {
    color: "#fff",
    fontWeight: "bold"
  },
  image: { width: 60, height: 60, marginRight: 15 },
  itemName: { fontSize: 18, fontWeight: "600" },
  price: { fontSize: 16, color: "#4CAF50" },
});
