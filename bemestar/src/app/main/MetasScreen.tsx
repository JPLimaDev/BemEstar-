import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Modal, TextInput, Button, Alert} from 'react-native';
import { Feather } from '@expo/vector-icons';

//Estruta Meta
interface Goal{
    id: string
    title: string
    completed: boolean
    type: 'diaria' | 'semanal' | 'mensal'
}


//Funções das metas
interface GoalItemProps{
    goal: Goal
    onToggle: (id:string) => void
    //onEdit: (id:string) => void
    onDelete: (id:string) => void
}

//Criação para exibe uma meta
const GoalItem: React.FC<GoalItemProps> = ({ goal, onToggle, onDelete}) => (
    <View style = {styles.goalItem}>
        <Text style = {[styles.goalTitle, goal.completed && styles.goalCompleted]}>
            {goal.title}
        </Text>

     <Pressable 
        onPress={() => onToggle(goal.id)} 
        style={({ pressed }) => [
          styles.actionButton,
          { opacity: pressed ? 0.5 : 1.0 } 
        ]}
      >     
        <Feather 
          name={goal.completed ? "check-circle" : "circle"} 
          size={24} 
          color={goal.completed ? "#4CAF50" : "gray"} 
        />
      </Pressable>


      <Pressable 
        onPress={() => onDelete(goal.id)} 
        style={({ pressed }) => [
          styles.actionButton,
          { opacity: pressed ? 0.5 : 1.0 }
        ]}
      >
        <Feather name="trash-2" size={20} color="#F44336" />
      </Pressable>
    </View>
)

const initialGoals: Goal[] = [
  { id: '1', title: 'Beber 2 litros de água', completed: false, type: 'diaria' },
  { id: '2', title: 'Fazer 30 minutos de exercício', completed: true, type: 'diaria' },
  { id: '3', title: 'Meditar por 15 minutos (Meta Semanal)', completed: false, type: 'semanal'},
]

const GoalsScreen: React.FC = () => {

  const [goals, setGoals] = useState<Goal[]>(initialGoals)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [newGoalTitle, setNewGoalTitle] = useState<string>('')

  // Lógica para adicionar uma nova meta 
  const addGoal = () => {
    if (newGoalTitle.trim().length === 0) {
      Alert.alert('Erro', 'O título da meta não pode estar vazio.');
      return
    } 

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: newGoalTitle,
      completed: false,
      type: 'diaria', // Padrão
    };
    setGoals([...goals, newGoal]);
    setNewGoalTitle('');
    setModalVisible(false);
  };

  // Lógica para marcar como concluída/pendente
  const toggleGoal = (id: string): void => {
    setGoals(
      goals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  // Lógica para deletar uma meta
  const deleteGoal = (id: string): void => {
    setGoals(goals.filter(goal => goal.id !== id));
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Minhas Metas de Bem-Estar</Text>
      
      {/* Lista de Metas */}
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GoalItem 
            goal={item} 
            onToggle={toggleGoal} 
            onDelete={deleteGoal} 
          />
        )}
        style={styles.list}
        ListEmptyComponent={() => (
            <Text style={styles.emptyText}>Você não tem metas. Crie uma!</Text>
        )}
      />

      {/* Botão para abrir o Modal de Adicionar Meta*/}
      <Pressable 
        onPress={() => setModalVisible(true)} 
        style={({ pressed }) => [
          styles.addButton,
          { opacity: pressed ? 0.7 : 1.0 }
        ]}
      >
          <Feather name="plus-circle" size={50} color="#4CAF50" />
      </Pressable>

      {/* Modal de Adicionar Meta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Adicionar Nova Meta</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ler 10 páginas por dia"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
            />
            <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#F44336" />
                <Button title="Adicionar" onPress={addGoal} color="#4CAF50" />
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  goalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  goalCompleted: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    marginLeft: 15,
    padding: 5, // Aumenta a área de toque
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 10,
    borderRadius: 30, // Arredonda o Pressable
    backgroundColor: 'transparent', 
  },
  // Estilos do Modal
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default GoalsScreen