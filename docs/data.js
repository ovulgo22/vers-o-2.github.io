const GAME_DATA = {
    // ... (todos os dados da v6.0)
    
    // NOVO: Sistema de Prestígio
    singularity: {
        building: { name: "Monólito da Singularidade", cost: { credits: 1e9, metal: 1e8, polymers: 1e8, tritium: 1e5 }, time: 24 * 3600 },
        pointBonus: 0.05 // 5% de bônus em toda a produção por ponto de singularidade
    },
    
    // NOVO: Recompensas de Login Diário
    dailyRewards: [
        { credits: 1000, metal: 1000 },
        { credits: 2000, polymers: 1500 },
        { tritium: 10 },
        { credits: 5000, metal: 3000, polymers: 3000 },
        { tritium: 25 },
        // ... mais recompensas
    ],
    
    // NOVO: Contratos de Caça
    bounties: [
        { id: 'b001', title: "Limpeza de Setor", description: "Destrua 3 Ninhos Piratas.", target: { type: 'destroy', targetId: 'pirate_nest', count: 3 }, reward: { credits: 10000 } },
        // ... mais contratos
    ],
    
    // NOVO: Sons
    sfx: {
        click: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_generic_button_click_2.mp3',
        upgrade: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_power_up_12.mp3',
        resource: 'https://www.zapsplat.com/wp-content/uploads/2015/sound-effects-the-sound-pack-tree/tspt_cash_register_coins_2.mp3'
        // ... outros sons
    }
};
