const GAME_DATA = {
    CLICK_UPGRADES: {
        'lens1': { name: "Lente Gravitacional I", cost: 10, power: 1, costIncrease: 1.5 },
        'lens2': { name: "Foco de Partículas", cost: 100, power: 5, costIncrease: 1.6 },
        'lens3': { name: "Canalizador de Fótons", cost: 1200, power: 25, costIncrease: 1.7 },
    },
    GENERATORS: {
        'probe': { name: "Sonda Coletora", baseCost: 15, baseProd: 0.1, costIncrease: 1.15 },
        'drone': { name: "Enxame de Drones", baseCost: 100, baseProd: 1, costIncrease: 1.15 },
        'starship': { name: "Nave Coletora", baseCost: 1100, baseProd: 8, costIncrease: 1.15 },
        'dyson': { name: "Esfera de Dyson (Fragmento)", baseCost: 130000, baseProd: 120, costIncrease: 1.15 },
    },
    SKILL_TREE: {
        's1': { name: "Memória Cósmica", cost: 1, description: "Comece cada Supernova com 1000 Poeira Estelar." },
        's2': { name: "Eficiência de Coleta", cost: 2, description: "A produção de todos os coletores é permanentemente aumentada em 25%." },
        's3': { name: "Lentes de Supernova", cost: 3, description: "+1% de produção por nível de Supernova." }
    },
    ARTIFACTS: [
        { id: 'art001', name: 'O Coração do Pulsar', description: 'Adiciona 0.1% da sua Produção por Segundo total ao poder do seu clique.' },
        { id: 'art002', name: 'Fragmento de Big Bang', description: 'Todos os custos de coletores são reduzidos em 1%.'}
    ],
    ACHIEVEMENTS: {
        'click1000': { description: "Clique 1.000 vezes.", condition: (state) => state.stats.totalClicks >= 1000, reward: { permanentMultiplier: 0.01 } },
        'stardust1M': { description: "Acumule 1 Milhão de Poeira Estelar.", condition: (state) => state.stardust >= 1000000, reward: { permanentMultiplier: 0.05 } }
    }
};
