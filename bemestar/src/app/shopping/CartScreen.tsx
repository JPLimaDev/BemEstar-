import React, { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../config/firebase";
import { updateDoc, doc, arrayUnion } from "firebase/firestore";


export default function CartScreen() {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const data = await AsyncStorage.getItem("cart");
    setCart(data ? JSON.parse(data) : []);
  };

  const increase = async (id: string) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updated);
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
  };

  const decrease = async (id: string) => {
    const updated = cart
      .map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updated);
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = async (id: string) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const finalizePurchase = async () => {
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado.");
      return;
    }

    try {
      const ref = doc(db, "usuarios", user.uid);

      await updateDoc(ref, {
        compras: arrayUnion({
          items: cart,
          total,
          date: new Date().toISOString(),
        }),
      });

      await AsyncStorage.removeItem("cart");
      setCart([]);

      Alert.alert("Compra concluída 🎉", "Obrigado pela sua compra!");
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível finalizar");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seu Carrinho 🛒</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
              <View style={styles.row}>
                <Pressable onPress={() => decrease(item.id)} style={styles.qtdBtn}>
                  <Text>-</Text>
                </Pressable>
                <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
                <Pressable onPress={() => increase(item.id)} style={styles.qtdBtn}>
                  <Text>+</Text>
                </Pressable>
              </View>

              <Pressable onPress={() => removeItem(item.id)}>
                <Text style={styles.remove}>Remover</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>

      <Pressable style={styles.finishBtn} onPress={finalizePurchase}>
        <Text style={styles.finishText}>Finalizar Compra</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  card: { flexDirection: "row", marginBottom: 15, backgroundColor: "#FFF", padding: 10, borderRadius: 10 },
  image: { width: 60, height: 60, marginRight: 10 },
  name: { fontSize: 18, fontWeight: "600" },
  price: { fontSize: 16, color: "#4CAF50" },
  row: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtdBtn: {
    backgroundColor: "#eee",
    padding: 5,
    borderRadius: 5
  },
  remove: { color: "red", marginTop: 5 },
  total: { fontSize: 22, fontWeight: "bold", marginTop: 20 },
  finishBtn: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center"
  },
  finishText: { color: "#fff", fontWeight: "bold" },
});
