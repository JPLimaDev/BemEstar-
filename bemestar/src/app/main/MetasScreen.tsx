import { View, Text, StyleSheet } from 'react-native';

export default function MetasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Metas e Progresso</Text>
      <Text>Acompanhamento de objetivos de sono, água e exercícios.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});