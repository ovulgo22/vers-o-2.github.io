class Game {
    constructor(data) {
        this.data = data;
        this.gameState = {
            resources: { credits: 1000, nutrients: 500, metal: 500, polymers: 500, tritium: 0 },
            ships: { fighter: 10, frigate: 0, cruiser: 0, corvette: 0 },
            buildings: {},
            research: {},
            timers: [],
            commander: { level: 1, xp: 0, xpForNext: 100 },
            activePolicy: null,
        };
        this.initGameState();
        this.ui = new UIController(this);
        document.getElementById('background-music').play().catch(e => console.log("A reprodução automática de áudio foi bloqueada."));
        this.startGameLoop();
    }

    initGameState() {
        for (const key in this.data.buildings) this.gameState.buildings[key] = { level: 0 };
        this.gameState.buildings.commandCenter.level = 1;
        this.gameState.buildings.hydroponics.level = 1;
        this.gameState.buildings.metalExtractor.level = 1;
        this.gameState.buildings.polymerSynth.level = 1;
        this.gameState.buildings.fusionReactor.level = 1;
        this.gameState.buildings.metalSilo.level = 1;
        this.gameState.buildings.nutrientSilo.level = 1;
        this.gameState.buildings.polymerSilo.level = 1;
    }

    startGameLoop() {
        setInterval(() => {
            this.updateProduction();
            this.checkTimers();
            this.ui.updateResources();
            this.ui.updateTimers();
        }, 1000);
    }
    
    updateProduction() {
        const energyBalance = this.getEnergyBalance();
        const efficiency = energyBalance.produced >= energyBalance.consumed ? 1 : 0.5;
        
        for(const key in this.data.buildings) {
            const buildingData = this.data.buildings[key];
            const buildingLevel = this.gameState.buildings[key].level;
            if(buildingData.provides?.production && buildingLevel > 0) {
                const prod = buildingData.provides.production;
                this.gameState.resources[prod.type] += prod.base * buildingLevel * efficiency;
            }
        }
        this.gameState.resources.credits += 5 * this.gameState.buildings.commandCenter.level;

        // Cap resources
        for (const res in this.gameState.resources) {
            const capacity = this.getCapacity(res);
            if (capacity) this.gameState.resources[res] = Math.min(capacity, this.gameState.resources[res]);
        }
    }

    checkTimers() {
        const now = Date.now();
        const completed = this.gameState.timers.filter(t => now >= t.endTime);
        
        completed.forEach(timer => {
            this.gameState.buildings[timer.key].level++;
            this.addXp(50 * this.gameState.buildings[timer.key].level);
            this.ui.addLog(`${this.data.buildings[timer.key].name} Nível ${this.gameState.buildings[timer.key].level} concluído.`);
            this.ui.renderAll();
        });

        this.gameState.timers = this.gameState.timers.filter(t => !completed.includes(t));
        // Update title notification
        document.title = this.gameState.timers.length > 0 ? `(${this.gameState.timers.length}) Cosmic Empires` : "Cosmic Empires";
    }

    addTimer(type, key, duration, description) {
        this.gameState.timers.push({ type, key, endTime: Date.now() + duration * 1000, description });
    }

    addXp(amount) {
        this.gameState.commander.xp += amount;
        if (this.gameState.commander.xp >= this.gameState.commander.xpForNext) {
            this.gameState.commander.level++;
            this.gameState.commander.xp -= this.gameState.commander.xpForNext;
            this.gameState.commander.xpForNext = Math.floor(this.gameState.commander.xpForNext * 1.5);
            this.ui.addLog(`Comandante promovido ao Nível ${this.gameState.commander.level}!`);
        }
        this.ui.updatePlayerStatus();
    }
    
    // GETTERS
    getCapacity(resource) {
        const siloKey = Object.keys(this.data.buildings).find(k => this.data.buildings[k].provides?.capacity?.type === resource);
        if (!siloKey) return null;
        return this.data.buildings[siloKey].provides.capacity.base * this.gameState.buildings[siloKey].level;
    }
    
    getEnergyBalance() {
        let produced = 0, consumed = 0;
        for(const key in this.data.buildings) {
            const buildingData = this.data.buildings[key];
            const buildingLevel = this.gameState.buildings[key].level;
            if (buildingLevel > 0) {
                if(buildingData.provides?.energy) produced += buildingData.provides.energy * buildingLevel;
                if(buildingData.consumes?.energy) consumed += buildingData.consumes.energy * buildingLevel;
            }
        }
        return { produced, consumed };
    }
    
    getTotalFleetSize() {
        return Object.values(this.gameState.ships).reduce((a, b) => a + b, 0);
    }
    
    getFleetCapacity() {
        return this.data.buildings.fleetHangar.provides.fleetCap * this.gameState.buildings.fleetHangar.level;
    }

    // HANDLERS
    handleBuildingClick(e) {
        const button = e.target.closest('button');
        if (!button) return;
        const key = button.dataset.key;
        this.upgradeBuilding(key);
    }
    
    upgradeBuilding(key) {
        if(this.gameState.timers.filter(t => t.type === 'building').length >= 1) return alert("Fila de construção cheia!");
        
        const building = this.data.buildings[key];
        const state = this.gameState.buildings[key];
        const cost = this.getModifiedCost(building.cost, state.level);
        
        if (this.hasEnoughResources(cost)) {
            this.deductResources(cost);
            this.addTimer('building', key, building.time, `Evoluindo ${building.name}`);
            this.ui.renderBuildings();
            this.addXp(20);
        } else {
            alert("Recursos insuficientes!");
        }
    }
    
    handleMapClick(e) { /* Lógica para mostrar modal de ataque */ }

    // UTILITIES
    hasEnoughResources = (cost) => Object.entries(cost).every(([res, val]) => this.gameState.resources[res] >= val);
    deductResources = (cost) => Object.entries(cost).forEach(([res, val]) => this.gameState.resources[res] -= val);
    getModifiedCost = (baseCost, level) => {
        const newCost = {};
        Object.keys(baseCost).forEach(res => newCost[res] = Math.floor(baseCost[res] * Math.pow(1.5, level)));
        return newCost;
    };
}

// Inicia o jogo
window.onload = () => { window.game = new Game(GAME_DATA); };
