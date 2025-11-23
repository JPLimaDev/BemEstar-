import React, { useState } from 'react'
import { View, Text, FlatList, Pressable, StyleSheet, Modal, TextInput, Button, Alert} from 'react-native'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics' 
import { db, auth } from '../../config/firebase'
import { collection, addDoc, deleteDoc, doc, updateDoc , serverTimestamp } from 'firebase/firestore'

interface Goal{
  id: string
  title: string
  completed: boolean
  type: 'diaria' | 'semanal' | 'mensal'
}



interface GoalItemProps{
  goal: Goal
  onToggle: (id:string) => void
  onDelete: (id:string) => void
}


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



const GoalsScreen: React.FC = () => {

 const [goals, setGoals] = useState<Goal[]>([])
 const [modalVisible, setModalVisible] = useState<boolean>(false)
 const [newGoalTitle, setNewGoalTitle] = useState<string>('')

  const triggerHapticFeedback = (type: 'light' | 'success' | 'warning') => {
    
    if (typeof Haptics.impactAsync === 'function') {
      try {
        if (type === 'light') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        } else if (type === 'success') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        } else if (type === 'warning') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
        }
      } catch (e) {
        console.log("Haptics indisponível ou erro:", e)
      }
    }
  }



 const addGoal = async () => {
  const usuario = auth.currentUser

  if (newGoalTitle.trim().length === 0) {
      triggerHapticFeedback('warning')
   Alert.alert('Erro', 'O título da meta não pode estar vazio.')
   return
  } 

  const newGoal: Goal = {
   id: Date.now().toString(),
   title: newGoalTitle,
   completed: false,
   type: 'diaria',
  }

  try{
    const goalDatatoSave = {
      title: newGoal.title,
      completed: newGoal.completed,
      type: newGoal.type,
      userId: usuario?.uid,
      createdAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, "metas"), goalDatatoSave)

    setGoals(prevGoals => [
             ...prevGoals, 
             {...newGoal, id: docRef.id} 
        ]);


    setNewGoalTitle('')
    setModalVisible(false)
    triggerHapticFeedback('success') 

     Alert.alert('Sucesso', 'Meta adicionada com sucesso do servidor.')

  }
  catch (error){
    console.error("Erro ao adicionar meta:", error)
    Alert.alert('Erro', 'Não foi possível salvar a meta no servidor.')
    triggerHapticFeedback('warning')
  }

  
 }
 
 const toggleGoal = async (id: string): Promise<void> => {
    
    const goalToUpdate = goals.find(g => g.id === id);
    if (!goalToUpdate) return;
    
   
    const isNowCompleted = !goalToUpdate.completed; 
    
    try {
        
        const metaDocRef = doc(db, "metas", id);
        
        
        await updateDoc(metaDocRef, {
            completed: isNowCompleted
        });
        
        
        setGoals(
            goals.map(goal => 
                goal.id === id ? { ...goal, completed: isNowCompleted } : goal
            )
        );

       
        if (isNowCompleted) {
            triggerHapticFeedback('success');
        } else {
            triggerHapticFeedback('light');
        }

    } catch (error) {
        console.error("Erro ao atualizar meta:", error);
        Alert.alert('Erro', 'Não foi possível atualizar o status da meta no servidor.');
        triggerHapticFeedback('warning');
    }
}

 const deleteGoal = async (id: string): Promise<void> => {
  try{
    const metaDocRef = doc(db, "metas", id)

    await deleteDoc(metaDocRef)

    setGoals(goals.filter(goal => goal.id !== id))
    triggerHapticFeedback('light')

    Alert.alert('Sucesso', 'Meta excluída com sucesso do servidor.')

  }
  catch (error){
      console.error("Erro ao excluir meta:", error)
      Alert.alert('Erro', 'Não foi possível excluir a meta no servidor.')
      triggerHapticFeedback('warning')
  }
  
  
  
 }


 return (
  <View style={styles.container}>
   <Text style={styles.header}>Minhas Metas de Bem-Estar</Text>
   

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


   <Pressable 
    onPress={() => setModalVisible(true)} 
    style={({ pressed }) => [
     styles.addButton,
     { opacity: pressed ? 0.7 : 1.0 }
    ]}
   >
     <Feather name="plus-circle" size={50} color="#4CAF50" />
   </Pressable>


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
 )
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
  padding: 5, 
 },
 addButton: {
  position: 'absolute',
  right: 20,
  bottom: 20,
  zIndex: 10,
  borderRadius: 30, 
  backgroundColor: 'transparent', 
 },

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
})

export default GoalsScreen
