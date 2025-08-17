const GAME_DATA = {
    buildings: {
        commandCenter: { name: "Centro de Comando", maxLevel: 10, cost: { metal: 1000 }, time: 60, provides: { energy: 10 } },
        hydroponics: { name: "Hidropônicos", maxLevel: 20, cost: { credits: 100, metal: 50 }, time: 10, provides: { production: { type: 'nutrients', base: 5 } }, consumes: { energy: 2 } },
        metalExtractor: { name: "Extrator de Metal", maxLevel: 20, cost: { credits: 100, metal: 50 }, time: 10, provides: { production: { type: 'metal', base: 5 } }, consumes: { energy: 2 } },
        polymerSynth: { name: "Sintetizador de Polímeros", maxLevel: 20, cost: { credits: 150, metal: 100 }, time: 15, provides: { production: { type: 'polymers', base: 3 } }, consumes: { energy: 3 } },
        tritiumRefinery: { name: "Refinaria de Trítio", maxLevel: 10, cost: { metal: 5000, polymers: 2500 }, time: 300, provides: { production: { type: 'tritium', base: 0.1 } }, consumes: { energy: 10 } },
        
        nutrientSilo: { name: "Silo de Nutrientes", maxLevel: 15, cost: { metal: 200, polymers: 100 }, time: 20, provides: { capacity: { type: 'nutrients', base: 10000 } } },
        metalSilo: { name: "Silo de Metal", maxLevel: 15, cost: { metal: 200, polymers: 100 }, time: 20, provides: { capacity: { type: 'metal', base: 10000 } } },
        polymerSilo: { name: "Silo de Polímeros", maxLevel: 15, cost: { metal: 200, polymers: 100 }, time: 20, provides: { capacity: { type: 'polymers', base: 10000 } } },

        fusionReactor: { name: "Reator de Fusão", maxLevel: 15, cost: { metal: 800, polymers: 400 }, time: 180, provides: { energy: 20 } },
        
        shipyard: { name: "Estaleiro", maxLevel: 10, cost: { metal: 150, polymers: 150 }, time: 30, consumes: { energy: 5 } },
        fleetHangar: { name: "Hangar da Frota", maxLevel: 10, cost: { metal: 300 }, time: 45, provides: { fleetCap: 20 }, consumes: { energy: 1 } },
        planetaryShield: { name: "Escudo Planetário", maxLevel: 10, cost: { polymers: 500 }, time: 60, provides: { defense: 100 }, consumes: { energy: 8 } },
        ionCannon: { name: "Canhão de Íons", maxLevel: 10, cost: { metal: 1000, tritium: 10 }, time: 240, provides: { planetAttack: 50 }, consumes: { energy: 15 } },
        
        academy: { name: "Academia", maxLevel: 5, cost: { metal: 1000, polymers: 1000 }, time: 120, consumes: { energy: 5 } },
        govtCenter: { name: "Centro Governamental", maxLevel: 1, cost: { credits: 10000, metal: 5000 }, time: 600 },
        galacticMarket: { name: "Mercado Galáctico", maxLevel: 1, cost: { credits: 2000, metal: 1000 }, time: 180 },
    },
    ships: {
        fighter: { name: "Caça", cost: { metal: 50, polymers: 25 }, time: 3, attack: 10, health: 5, strongAgainst: 'frigate' },
        frigate: { name: "Fragata", cost: { metal: 100, polymers: 50 }, time: 5, attack: 5, health: 20, strongAgainst: 'cruiser' },
        cruiser: { name: "Cruzador", cost: { metal: 200, polymers: 150 }, time: 8, attack: 25, health: 30, strongAgainst: 'fighter' },
        corvette: { name: "Corveta", cost: { metal: 150, polymers: 100, tritium: 1 }, time: 6, attack: 15, health: 15, strongAgainst: null },
    },
    policies: {
        militarism: { name: "Militarismo", description: "+10% de ataque para todas as naves." },
        industrialism: { name: "Industrialismo", description: "+15% de produção de Metal e Polímeros." },
        technocracy: { name: "Tecnocracia", description: "-10% no custo e tempo de pesquisa." }
    },
    mapTargets: [
        { name: 'Ninho Pirata', level: 1, fleet: { fighter: 50 }, reward: { credits: 200, metal: 300 } },
        { name: 'Anomalia Vóide', level: 3, fleet: { frigate: 30, fighter: 100 }, reward: { credits: 500, polymers: 400 } },
        { name: 'Cidadela Autômata', level: 5, fleet: { cruiser: 20, frigate: 50, fighter: 150 }, reward: { credits: 1000, tritium: 5 } },
    ],
    //... outras estruturas de dados como research, heroes(admirals)
};
