const GAME_DATA = {
    buildings: {
        farm: { name: "Fazenda", maxLevel: 20, icon: '🌾', cost: { food: 50, wood: 100 }, time: 10, production: { type: 'food', base: 5 } },
        sawmill: { name: "Serraria", maxLevel: 20, icon: '🌲', cost: { food: 100, wood: 50 }, time: 10, production: { type: 'wood', base: 5 } },
        quarry: { name: "Pedreira", maxLevel: 20, icon: '⛏️', cost: { food: 150, wood: 100 }, time: 15, production: { type: 'stone', base: 3 } },
        warehouse: { name: "Armazém", maxLevel: 15, icon: '📦', cost: { wood: 200, stone: 100 }, time: 20, capacity: { base: 10000 } },
        barracks: { name: "Quartel", maxLevel: 10, icon: '⚔️', cost: { wood: 150, stone: 150 }, time: 30 },
        wall: { name: "Muralha", maxLevel: 10, icon: '🧱', cost: { stone: 500 }, time: 60, defense: { base: 0.02 } },
        academy: { name: "Academia", maxLevel: 5, icon: '📜', cost: { wood: 1000, stone: 1000 }, time: 120 },
        heroesHall: { name: "Salão dos Heróis", maxLevel: 5, icon: '👑', cost: { gold: 5000, wood: 2000 }, time: 300 }
    },
    troops: {
        infantry: { name: "Infantaria", icon: '🛡️', cost: { food: 25, wood: 10 }, time: 3, strongAgainst: 'cavalry' },
        cavalry: { name: "Cavalaria", icon: '🐎', cost: { food: 50, wood: 20 }, time: 5, strongAgainst: 'archers' },
        archers: { name: "Arqueiros", icon: '🏹', cost: { food: 30, wood: 25 }, time: 4, strongAgainst: 'infantry' }
    },
    research: {
        agriculture: { name: "Agricultura", icon: '🌾', maxLevel: 5, cost: { gold: 1000 }, time: 60, description: "Aumenta a produção de comida em 10% por nível." },
        logistics: { name: "Logística", icon: '📦', maxLevel: 5, cost: { gold: 1200 }, time: 90, description: "Aumenta a produção de madeira e pedra em 10% por nível." },
        swordsmanship: { name: "Esgrima", icon: '⚔️', maxLevel: 5, cost: { gold: 2000 }, time: 180, description: "Aumenta o ataque da Infantaria em 5% por nível." },
    },
    heroes: {
        reginald: { name: 'Sir Reginald', icon: '👑', description: 'Bônus de produção de comida.', bonus: { type: 'production', subType: 'food', value: 0.1 } },
        elara: { name: 'Elara a Arquiteta', icon: '🏛️', description: 'Reduz o tempo de construção.', bonus: { type: 'time', subType: 'construction', value: -0.1 } },
        grommash: { name: 'Grommash', icon: '斧', description: 'Aumenta o ataque de todas as tropas.', bonus: { type: 'attack', subType: 'all', value: 0.05 } }
    },
    mapTargets: [
        { name: 'Acampamento Bárbaro', level: 1, icon: '🏕️', troops: { infantry: 50 }, reward: { gold: 200, food: 300 } },
        { name: 'Covil de Goblins', level: 2, icon: '👺', troops: { infantry: 100, archers: 50 }, reward: { gold: 500, wood: 400 } },
        { name: 'Fortaleza Orc', level: 3, icon: '🏰', troops: { infantry: 200, cavalry: 100, archers: 150 }, reward: { gold: 1000, stone: 800 } },
    ]
};
