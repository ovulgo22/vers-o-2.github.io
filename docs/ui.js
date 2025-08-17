const UI = {
    init(main) {
        this.main = main;
        this.elements = {
            gold: document.getElementById('gold-resource'),
            food: document.getElementById('food-resource'),
            wood: document.getElementById('wood-resource'),
            stone: document.getElementById('stone-resource'),
            infantry: document.getElementById('infantry-resource'),
            cavalry: document.getElementById('cavalry-resource'),
            archers: document.getElementById('archer-resource'),
            timersContainer: document.getElementById('timers-container'),
            buildingsGrid: document.getElementById('buildings-grid'),
            worldMapGrid: document.getElementById('world-map-grid'),
            modalBackdrop: document.getElementById('modal-backdrop'),
            genericModal: document.getElementById('generic-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalContent: document.getElementById('modal-content'),
            battleModal: document.getElementById('battle-modal'),
            battleModalTitle: document.getElementById('battle-modal-title'),
            battleModalContent: document.getElementById('battle-modal-content'),
        };
        this.addEventListeners();
        this.renderAll();
    },

    renderAll() {
        this.updateResources();
        this.renderBuildings();
        this.renderMap();
        this.updateTimers();
    },

    addEventListeners() {
        this.elements.buildingsGrid.addEventListener('click', e => this.main.handleBuildingClick(e));
        this.elements.worldMapGrid.addEventListener('click', e => this.main.handleMapClick(e));
        document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', () => this.toggleModal(null, false)));
    },

    updateResources() {
        const { gameState } = this.main;
        const capacity = this.main.getCapacity();
        const resources = ['gold', 'food', 'wood', 'stone', 'infantry', 'cavalry', 'archers'];
        
        resources.forEach(res => {
            const el = this.elements[res];
            if (!el) return;
            const oldValue = parseInt(el.dataset.value || '0');
            const newValue = Math.floor(gameState[res]);

            if (newValue > oldValue && oldValue > 0) {
                el.classList.add('resource-pop-animation');
                setTimeout(() => el.classList.remove('resource-pop-animation'), 500);
            }
            
            let text = `${GAME_DATA.troops[res]?.icon || '🪙'} ${newValue}`;
            if (['food', 'wood', 'stone'].includes(res)) text += ` / ${capacity}`;
            el.textContent = text;
            el.dataset.value = newValue;
        });
    },

    renderBuildings() {
        this.elements.buildingsGrid.innerHTML = '';
        for (const [key, data] of Object.entries(GAME_DATA.buildings)) {
            const level = this.main.gameState.buildings[key].level;
            const buildingEl = document.createElement('div');
            buildingEl.className = 'building';
            buildingEl.innerHTML = `
                <h3>${data.icon} ${data.name} (Nível ${level})</h3>
                <p id="${key}-desc">...</p>
                <button data-type="building" data-key="${key}" ${level >= data.maxLevel ? 'disabled' : ''}>${level >= data.maxLevel ? 'MAX' : (level > 0 ? 'Evoluir' : 'Construir')}</button>
            `;
            this.elements.buildingsGrid.appendChild(buildingEl);
        }
        this.updateBuildingDescriptions();
    },
    
    updateBuildingDescriptions(){
        for (const [key, data] of Object.entries(GAME_DATA.buildings)) {
            const el = document.getElementById(`${key}-desc`);
            if(!el) continue;
            let desc = '';
            if(data.production) desc = `Produz ${this.main.getProduction(data.production.type).toFixed(1)}/s.`;
            if(data.capacity) desc = `Capacidade: ${this.main.getCapacity()}`;
            if(data.defense) desc = `Defesa: ${(this.main.getWallDefense()*100).toFixed(0)}%`;
            if(key === 'barracks') desc = 'Treine suas tropas aqui.';
            if(key === 'academy') desc = 'Pesquise novas tecnologias.';
            if(key === 'heroesHall') desc = `Herói: ${this.main.gameState.hero.name || 'Nenhum'}`;
            el.textContent = desc;
        }
    },

    renderMap() {
        this.elements.worldMapGrid.innerHTML = '';
        GAME_DATA.mapTargets.forEach((target, index) => {
            const tile = document.createElement('div');
            tile.className = 'map-tile';
            tile.dataset.type = 'map';
            tile.dataset.index = index;
            tile.innerHTML = `<div class="tile-icon">${target.icon}</div><div class="tile-level">Nv. ${target.level}</div>`;
            this.elements.worldMapGrid.appendChild(tile);
        });
    },

    updateTimers() {
        this.elements.timersContainer.innerHTML = '';
        this.main.gameState.timers.forEach(timer => {
            const remaining = timer.startTime + timer.duration - Date.now();
            const progress = 100 - (remaining / (timer.duration) * 100);
            const timerEl = document.createElement('div');
            timerEl.className = 'timer-item';
            timerEl.innerHTML = `
                <span>${timer.description}... (${Math.ceil(remaining/1000)}s)</span>
                <div class="timer-progress-bar"><div class="timer-progress" style="width: ${progress}%"></div></div>
            `;
            this.elements.timersContainer.appendChild(timerEl);
        });
    },

    toggleModal(modal, show) {
        this.elements.modalBackdrop.classList.toggle('hidden', !show);
        if (this.currentModal) this.currentModal.classList.add('hidden');
        if (show) {
            this.currentModal = modal;
            this.currentModal.classList.remove('hidden');
        }
    },

    showGenericModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalContent.innerHTML = content;
        this.toggleModal(this.elements.genericModal, true);
    },
    
    showBattleModal(target) {
        this.elements.battleModalTitle.textContent = `Atacar ${target.name} (Nv. ${target.level})`;
        this.elements.battleModalContent.innerHTML = `
            <h4>Tropas Inimigas (Estimado):</h4>
            <p>${Object.entries(target.troops).map(([type, count]) => `${GAME_DATA.troops[type].icon} ${count}`).join(', ')}</p>
            <h4>Seu Exército:</h4>
            ${Object.keys(GAME_DATA.troops).map(type => `
                <div class="army-input">
                    <label>${GAME_DATA.troops[type].icon} ${GAME_DATA.troops[type].name} (Disponível: ${this.main.gameState[type]})</label>
                    <input type="number" id="send-${type}" value="0" min="0" max="${this.main.gameState[type]}">
                </div>
            `).join('')}
            <button id="confirm-attack-btn">Confirmar Ataque</button>
        `;
        this.toggleModal(this.elements.battleModal, true);
        document.getElementById('confirm-attack-btn').onclick = () => this.main.confirmAttack(target);
    }
};
