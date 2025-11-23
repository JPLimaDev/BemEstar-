import { Tabs } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";


export default function Layout() {
  return (
    
    <Tabs
      screenOptions={{
        tabBarActiveBackgroundColor: "#A8DADC",
        tabBarInactiveBackgroundColor: "#8ED1FC",
        tabBarActiveTintColor: "#CCFFCC",
        
      }} 
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Início",
          tabBarLabel: "Home",
          tabBarIcon: (btn) => <MaterialIcons name="home" size={20} color={(btn.focused ? 'white' : 'black')}/>
        }}
      />
      <Tabs.Screen
        name="MeditacaoScreen"
        options={{
          title: "Meditação",
          tabBarLabel: "Meditação",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="leaf" 
              size={20}
              color={focused ? 'white' : 'black'}
            />
          ),  
        }}
      />
      <Tabs.Screen
        name="DiarioScreen"
        options={{
          title: "Diario",
          tabBarLabel: "Diario",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book" 
              size={20}
              color={focused ? 'white' : 'black'}
            />
          ),  
        }}
      />
      <Tabs.Screen
        name="MetasScreen"
        options={{
          title: "Metas",
          tabBarLabel: "Metas",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="trophy" 
              size={20}
              color={focused ? 'white' : 'black'}
            />
          ),  
        }}
      />
      <Tabs.Screen
        name="PerfilScreen"
        options={{
          title: "Perfil",
          tabBarLabel: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person" 
              size={20}
              color={focused ? 'white' : 'black'}
            />
          ),  
        }}
      />
    </Tabs>
    
  );
}