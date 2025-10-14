import { create } from 'zustand';

// 1. O MOLDE (O que uma Meta precisa ser)
// Define a estrutura exata que cada objeto Meta deve ter.
export interface Meta {
    id: string;
    titulo: string;
    concluida: boolean;
    icone: string;
}

// 2. O ESTADO (Quais dados a loja vai guardar)
// Define tudo que o nosso Store (Planilha) vai guardar.
interface MetasState {
    metas: Meta[]; // Array de Metas (nossos dados)
    
    // Funções para Modificar os Dados (nossas "ações" ou "botões")
    adicionarMeta: (titulo: string) => void;
    removerMeta: (id: string) => void;
    toggleConclusao: (id: string) => void;
}

// 3. A CRIAÇÃO DA LOJA (Onde a mágica acontece)
export const useMetasStore = create<MetasState>((set) => ({
    // DADOS INICIAIS
    metas: [
        { id: '1', titulo: 'Beber 2L de Água', concluida: false, icone: 'water' },
        { id: '2', titulo: 'Fazer 30min de Exercício', concluida: true, icone: 'walk' },
    ],

    // AÇÃO 1: Adicionar Meta
    // O 'set' é a função do Zustand que usamos para mudar o estado.
    adicionarMeta: (titulo) => set((state) => {
        const novaMeta: Meta = {
            id: Date.now().toString(), // ID ÚNICO baseado no momento
            titulo: titulo,
            concluida: false,
            icone: 'leaf', // Ícone padrão
        };
        // O Estado Antigo (state.metas) + A Nova Meta (novaMeta)
        return { metas: [...state.metas, novaMeta] };
    }),

    // AÇÃO 2: Remover Meta
    removerMeta: (id) => set((state) => ({
        // Filtra o array, mantendo SOMENTE as metas cujo ID é diferente do ID a ser removido.
        metas: state.metas.filter(meta => meta.id !== id),
    })),

    // AÇÃO 3: Marcar/Desmarcar (Toggle)
    toggleConclusao: (id) => set((state) => ({
        // Mapeia (passa por) cada meta no array
        metas: state.metas.map(meta => 
            meta.id === id 
                ? { ...meta, concluida: !meta.concluida } // Se for a meta certa, inverte o valor de 'concluida'
                : meta // Se não for, retorna a meta sem mudar nada
        ),
    })),
}));