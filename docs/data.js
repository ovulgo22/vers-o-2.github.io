const GAME_DATA = {
    // ... (CLICK_UPGRADES, GENERATORS, SKILL_TREE, ARTIFACTS, ACHIEVEMENTS da v1, mas rebalanceados)
    
    // NOVO: Desafios
    CHALLENGES: {
        'c1': { name: "Mãos Vazias", description: "O poder de clique é sempre 1. Conclua para ganhar +50% de poder de clique permanente.", goal: 1e12 },
        'c2': { name: "Crise de Energia", description: "A produção de coletores é reduzida em 90%. Conclua para que os coletores produzam 25% a mais permanentemente.", goal: 1e15 },
    },
    
    // NOVO: Missões
    MISSIONS: {
        daily: [
            { id: 'd01', description: "Clique 50 Estrelas Cadentes", target: 50, reward: { quasars: 5 } }
        ],
        weekly: [
            { id: 'w01', description: "Realize uma Supernova", target: 1, reward: { quasars: 50 } }
        ]
    },
    
    // NOVO: Temas de Cores
    THEMES: [
        { id: 'theme-nebula', name: "Nebulosa Púrpura", cost: 0 },
        { id: 'theme-pulsar', name: "Pulsar Dourado", cost: 100 },
        { id: 'theme-deepspace', name: "Espaço Profundo", cost: 100 }
    ],

    //... (e outros dados novos)
};
