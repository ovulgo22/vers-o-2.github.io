class Game {
    constructor(data, ui) {
        this.data = data;
        this.ui = ui;
        this.gameState = {
            gold: 1000, food: 500, wood: 500, stone: 500,
            infantry: 10, cavalry: 0, archers: 0,
            buildings: {},
            research: {},
            hero: { id: null, name: null },
            timers: [],
            recruitedHeroes: []
        };
        this.initGameState();
        this.ui.init(this);
        this.startGameLoop();
    }

    initGameState() {
        for (const key in this.data.buildings) this.gameState.buildings[key] = { level: 0 };
        this.gameState.buildings.farm.level = 1;
        this.gameState.buildings.sawmill.level = 1;
        this.gameState.buildings.quarry.level = 1;
        this.gameState.buildings.warehouse.level = 1;

        for (const key in this.data.research) this.gameState.research[key] = { level: 0 };
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
        const capacity = this.getCapacity();
        ['food', 'wood', 'stone'].forEach(type => {
            this.gameState[type] = Math.min(capacity, this.gameState[type] + this.getProduction(type));
        });
        this.gameState.gold += 5; // Ouro base
    }

    checkTimers() {
        const now = Date.now();
        const completedTimers = this.gameState.timers.filter(t => now >= t.startTime + t.duration);
        
        completedTimers.forEach(timer => {
            if (timer.type === 'building') {
                this.gameState.buildings[timer.key].level++;
            } else if (timer.type === 'research') {
                this.gameState.research[timer.key].level++;
            } else if (timer.type === 'troop') {
                this.gameState[timer.key] += timer.amount;
            }
            this.ui.renderAll();
        });

        this.gameState.timers = this.gameState.timers.filter(t => !completedTimers.includes(t));
    }
    
    addTimer(type, key, duration, description, amount = 0) {
        this.gameState.timers.push({ type, key, duration: duration * 1000, startTime: Date.now(), description, amount });
    }

    // GETTERS (cálculos de bônus)
    getCapacity = () => this.data.buildings.warehouse.capacity.base * this.gameState.buildings.warehouse.level;
    getProduction = (type) => {
        const buildingKey = Object.keys(this.data.buildings).find(k => this.data.buildings[k].production?.type === type);
        const building = this.data.buildings[buildingKey];
        const buildingState = this.gameState.buildings[buildingKey];
        let bonus = 1;
        // Adicionar bônus de pesquisa e heróis aqui
        return building.production.base * buildingState.level * bonus;
    };
    getWallDefense = () => this.gameState.buildings.wall.level * this.data.buildings.wall.defense.base;
    
    // HANDLERS (ações do jogador)
    handleBuildingClick(e) {
        const button = e.target.closest('button');
        if (!button) return;
        const key = button.dataset.key;
        
        switch(key) {
            case 'barracks': this.showTrainModal(); break;
            case 'academy': this.showResearchModal(); break;
            case 'heroesHall': this.showHeroesModal(); break;
            default: this.upgradeBuilding(key);
        }
    }
    
    handleMapClick(e) {
        const tile = e.target.closest('.map-tile');
        if (!tile) return;
        const target = this.data.mapTargets[tile.dataset.index];
        this.ui.showBattleModal(target);
    }
    
    upgradeBuilding(key) {
        const building = this.data.buildings[key];
        const state = this.gameState.buildings[key];
        const cost = this.getModifiedCost(building.cost, state.level);
        
        if (this.hasEnoughResources(cost)) {
            this.deductResources(cost);
            const time = this.getModifiedTime(building.time);
            this.addTimer('building', key, time, `Evoluindo ${building.name}`);
            this.ui.renderBuildings();
        } else {
            alert("Recursos insuficientes!");
        }
    }

    showTrainModal() {
        let content = '';
        for (const [key, troop] of Object.entries(this.data.troops)) {
            content += `<div class="list-item">
                <p><strong>${troop.icon} ${troop.name}</strong></p>
                <p class="cost">${this.formatCost(troop.cost)}</p>
                <div>
                    <input type="number" id="train-${key}-amount" value="10" min="1" style="width: 50px;">
                    <button onclick="game.trainTroops('${key}')">Treinar</button>
                </div>
            </div>`;
        }
        this.ui.showGenericModal("Treinar Tropas", content);
    }

    trainTroops(key) {
        const amount = parseInt(document.getElementById(`train-${key}-amount`).value);
        const troop = this.data.troops[key];
        const totalCost = {};
        Object.keys(troop.cost).forEach(res => totalCost[res] = troop.cost[res] * amount);

        if (this.hasEnoughResources(totalCost)) {
            this.deductResources(totalCost);
            const totalTime = this.getModifiedTime(troop.time * amount);
            this.addTimer('troop', key, totalTime, `Treinando ${amount} ${troop.name}`, amount);
            this.ui.toggleModal(null, false);
        } else {
            alert("Recursos insuficientes!");
        }
    }
    
    showHeroesModal() {
        if (this.gameState.buildings.heroesHall.level === 0) return alert("Construa o Salão dos Heróis primeiro!");
        let content = '<h4>Recrutar Heróis:</h4>';
        for (const [id, hero] of Object.entries(this.data.heroes)) {
            if (!this.gameState.recruitedHeroes.includes(id)) {
                 content += `<div class="list-item">
                    <p><strong>${hero.icon} ${hero.name}</strong><br><small>${hero.description}</small></p>
                    <p class="cost">Custo: 5000 Ouro</p>
                    <button onclick="game.recruitHero('${id}')">Recrutar</button>
                 </div>`;
            }
        }
        content += '<h4>Heróis Ativos:</h4>';
         for (const id of this.gameState.recruitedHeroes) {
            const hero = this.data.heroes[id];
            content += `<div class="list-item">
                <p><strong>${hero.icon} ${hero.name}</strong></p>
                <p>${hero.description}</p>
                <button ${this.gameState.hero.id === id ? 'disabled' : ''} onclick="game.setActiveHero('${id}')">Ativar</button>
            </div>`;
         }
        this.ui.showGenericModal("Salão dos Heróis", content);
    }

    recruitHero(id) {
        if (this.gameState.gold >= 5000) {
            this.gameState.gold -= 5000;
            this.gameState.recruitedHeroes.push(id);
            this.showHeroesModal(); // Re-render modal
        }
    }
    
    setActiveHero(id){
        this.gameState.hero.id = id;
        this.gameState.hero.name = this.data.heroes[id].name;
        this.ui.toggleModal(null, false);
        this.ui.updateBuildingDescriptions();
    }
    
    showResearchModal() { /* ... Lógica similar a de treino ... */ }
    
    confirmAttack(target) { /* ... Lógica complexa de batalha ... */ alert(`Ataque a ${target.name} iniciado!`); this.ui.toggleModal(null, false); }


    // FUNÇÕES UTILITÁRIAS
    hasEnoughResources = (cost) => Object.entries(cost).every(([res, val]) => this.gameState[res] >= val);
    deductResources = (cost) => Object.entries(cost).forEach(([res, val]) => this.gameState[res] -= val);
    getModifiedCost = (baseCost, level) => {
        const newCost = {};
        Object.keys(baseCost).forEach(res => newCost[res] = Math.floor(baseCost[res] * Math.pow(1.5, level)));
        return newCost;
    };
    getModifiedTime = (baseTime) => {
        let modifier = 1;
        if(this.gameState.hero.id === 'elara') modifier += this.data.heroes.elara.bonus.value;
        return baseTime * modifier;
    }
    formatCost = (cost) => Object.entries(cost).map(([res, val]) => `${val} ${res}`).join(', ');
}

// Inicia o jogo quando a página carregar
window.onload = () => {
    const game = new Game(GAME_DATA, UI);
    window.game = game; // Expor para ser acessível pelos botões onclick
};
