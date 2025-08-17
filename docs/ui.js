class UIController {
    constructor(game) {
        this.game = game;
        this.elements = {
            // Resource Displays
            credits: document.getElementById('credits-resource'),
            nutrients: document.getElementById('nutrients-resource'),
            metal: document.getElementById('metal-resource'),
            polymers: document.getElementById('polymers-resource'),
            tritium: document.getElementById('tritium-resource'),
            energy: document.getElementById('energy-resource'),
            // Fleet Displays
            fighter: document.getElementById('fighter-resource'),
            frigate: document.getElementById('frigate-resource'),
            cruiser: document.getElementById('cruiser-resource'),
            corvette: document.getElementById('corvette-resource'),
            fleetCapacity: document.getElementById('fleet-capacity'),
            // Player Status
            commanderLevel: document.getElementById('commander-level'),
            xpBar: document.getElementById('xp-bar'),
            // Containers
            timersContainer: document.getElementById('timers-container'),
            buildingsGrid: document.getElementById('buildings-grid'),
            worldMapGrid: document.getElementById('world-map-grid'),
            eventLog: document.getElementById('event-log'),
            // Modals
            modalBackdrop: document.getElementById('modal-backdrop'),
            genericModal: document.getElementById('generic-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalContent: document.getElementById('modal-content'),
        };
        this.addEventListeners();
        this.renderAll();
    }

    addEventListeners() {
        this.elements.buildingsGrid.addEventListener('click', e => this.game.handleBuildingClick(e));
        this.elements.worldMapGrid.addEventListener('click', e => this.game.handleMapClick(e));
        document.querySelectorAll('.close-modal-btn').forEach(btn => btn.addEventListener('click', () => this.toggleModal(null, false)));
    }

    renderAll() {
        this.updateResources();
        this.renderBuildings();
        this.renderMap();
        this.updateTimers();
        this.updatePlayerStatus();
    }

    updateResources() {
        const { gameState } = this.game;
        // Update resource displays
        ['credits', 'nutrients', 'metal', 'polymers', 'tritium'].forEach(res => {
            const el = this.elements[res];
            const capacity = this.game.getCapacity(res);
            el.textContent = `[${res.charAt(0).toUpperCase()}] ${Math.floor(gameState.resources[res])}` + (capacity ? ` / ${capacity}` : '');
        });

        // Update fleet displays
        ['fighter', 'frigate', 'cruiser', 'corvette'].forEach(ship => {
            this.elements[ship].textContent = `[${ship.charAt(0).toUpperCase()}] ${gameState.ships[ship]}`;
        });
        this.elements.fleetCapacity.textContent = `[F] ${this.game.getTotalFleetSize()} / ${this.game.getFleetCapacity()}`;

        // Update energy
        const { produced, consumed } = this.game.getEnergyBalance();
        this.elements.energy.textContent = `[E] ${produced} / ${consumed}`;
        this.elements.energy.classList.toggle('energy-deficit', produced < consumed);
    }
    
    renderBuildings() {
        this.elements.buildingsGrid.innerHTML = '';
        for (const [key, data] of Object.entries(this.game.data.buildings)) {
            const level = this.game.gameState.buildings[key].level;
            const buildingEl = document.createElement('div');
            buildingEl.className = 'building';
            buildingEl.innerHTML = `
                <h4>[${data.name.charAt(0)}] ${data.name} (Nv. ${level})</h4>
                <button data-type="building" data-key="${key}" ${level >= data.maxLevel ? 'disabled' : ''}>
                    ${level >= data.maxLevel ? 'MAX' : (level > 0 ? 'Evoluir' : 'Construir')}
                </button>
            `;
            this.elements.buildingsGrid.appendChild(buildingEl);
        }
    }

    renderMap() {
        this.elements.worldMapGrid.innerHTML = '';
        this.game.data.mapTargets.forEach((target, index) => {
            const tile = document.createElement('div');
            tile.className = 'map-tile';
            tile.dataset.type = 'map';
            tile.dataset.index = index;
            tile.innerHTML = `<div class="tile-name">${target.name}</div><div class="tile-level">Nível ${target.level}</div>`;
            this.elements.worldMapGrid.appendChild(tile);
        });
    }

    updateTimers() {
        this.elements.timersContainer.innerHTML = '<h3>Filas Ativas</h3>';
        this.game.gameState.timers.forEach(timer => {
            const remaining = timer.endTime - Date.now();
            const timerEl = document.createElement('div');
            timerEl.className = 'timer-item';
            timerEl.textContent = `${timer.description} (${Math.ceil(remaining/1000)}s)`;
            this.elements.timersContainer.appendChild(timerEl);
        });
    }

    updatePlayerStatus() {
        const { level, xp, xpForNext } = this.game.gameState.commander;
        this.elements.commanderLevel.textContent = `Comandante Nv. ${level}`;
        this.elements.xpBar.style.width = `${(xp / xpForNext) * 100}%`;
    }
    
    addLog(message) {
        const li = document.createElement('li');
        li.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        this.elements.eventLog.prepend(li);
        if (this.elements.eventLog.children.length > 10) {
            this.elements.eventLog.lastChild.remove();
        }
    }

    toggleModal(modal, show) {
        this.elements.modalBackdrop.classList.toggle('hidden', !show);
        if (this.currentModal) this.currentModal.classList.add('hidden');
        if (show) {
            this.currentModal = modal;
            this.currentModal.classList.remove('hidden');
        }
    }
    
    showGenericModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalContent.innerHTML = content;
        this.toggleModal(this.elements.genericModal, true);
    }
}
