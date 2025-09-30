import { View, Text, StyleSheet } from 'react-native';

export default function TelaTeste() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        A barra de navegação **DEVE** estar visível aqui embaixo!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});