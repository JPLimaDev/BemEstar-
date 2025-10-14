import {create} from 'zustand'

export interface UserProfile{
    name: string
    email: string
    
}

interface UserState{
    user: UserProfile | null
    isLoggedIn: boolean

    //Funções 
    login: (userData: UserProfile) => void
    logout: () => void

}

export const useUserStore = create<UserState>((set) => ({
    // DADOS INICIAIS
    user: null,
    isLoggedIn: false,

    // AÇÃO 1: LOGIN (chamada após o cadastro/login ser validado)
    login: (userData) => set({
        user: userData,
        isLoggedIn: true,
    }),

    // AÇÃO 2: LOGOUT (para o botão de sair)
    logout: () => set({
        user: null,
        isLoggedIn: false,
    }),
}));

