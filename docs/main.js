class Game {
    constructor(data) {
        this.data = data;
        this.ui = null;
        this.gameState = null;
        
        // CORREÇÃO: Carregamento seguro
        this.loadGame();
        
        this.ui = new UIController(this);
        this.initAudio();
        this.startGameLoop();
        this.checkDailyLogin();
    }
    
    // CORREÇÃO: Sistema de Save/Load robusto
    getNewGameState() {
        return {
            resources: { credits: 1000, nutrients: 500, metal: 500, polymers: 500, tritium: 0 },
            ships: { fighter: 10, frigate: 0, cruiser: 0, corvette: 0 },
            buildings: {},
            research: {},
            timers: [],
            commander: { level: 1, xp: 0, xpForNext: 100 },
            stats: { lastLogin: null, consecutiveDays: 0, singularityPoints: 0 },
            bounties: { active: [], completed: [] },
            settings: { music: true, sfx: true }
        };
    }
    
    loadGame() {
        const savedData = localStorage.getItem('cosmicEmpiresSave');
        const newState = this.getNewGameState();
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Merge profundo para garantir compatibilidade
            Object.keys(newState).forEach(key => {
                if (parsedData[key] !== undefined) {
                    if (typeof newState[key] === 'object' && newState[key] !== null) {
                        newState[key] = { ...newState[key], ...parsedData[key] };
                    } else {
                        newState[key] = parsedData[key];
                    }
                }
            });
        }
        this.gameState = newState;
        // Inicializa níveis dos edifícios se for um jogo novo
        if (!savedData) {
            for (const key in this.data.buildings) this.gameState.buildings[key] = { level: 0 };
            this.gameState.buildings.commandCenter.level = 1; // etc...
        }
    }
    
    saveGame() {
        localStorage.setItem('cosmicEmpiresSave', JSON.stringify(this.gameState));
        this.ui.addLog("Progresso salvo.");
        this.playSound('click');
    }

    // NOVO: Lógica de Login Diário
    checkDailyLogin() {
        const now = new Date();
        const lastLogin = this.gameState.stats.lastLogin ? new Date(this.gameState.stats.lastLogin) : null;
        
        if (!lastLogin || now.getDate() !== lastLogin.getDate()) {
            let consecutive = 1;
            if (lastLogin && (now.getTime() - lastLogin.getTime()) < 2 * 24 * 3600 * 1000) {
                 consecutive = this.gameState.stats.consecutiveDays + 1;
            }
            this.gameState.stats.consecutiveDays = consecutive;
            const rewardIndex = Math.min(consecutive - 1, this.data.dailyRewards.length - 1);
            const reward = this.data.dailyRewards[rewardIndex];
            
            Object.entries(reward).forEach(([res, val]) => this.gameState.resources[res] += val);
            
            this.ui.showDailyRewardModal(rewardIndex, reward);
            this.gameState.stats.lastLogin = now.toISOString();
        }
    }
    
    // CORREÇÃO: Filas separadas
    addTimer(type, key, duration, description) {
        const queue = this.gameState.timers.filter(t => t.type === type);
        const maxQueueSize = 1; // Pode ser aumentado com pesquisa
        if (queue.length >= maxQueueSize) {
            this.ui.addLog(`Fila de ${type} cheia!`);
            return false;
        }
        // ... (resto da lógica de adicionar timer)
        return true;
    }
    
    // NOVO: Sistema de Prestígio
    activateSingularity() {
        if (this.gameState.buildings.singularityMonolith.level < 1) return;
        if (confirm("Ativar a Singularidade? Todo o seu progresso será reiniciado em troca de poder permanente. Esta ação é irreversível.")) {
            this.gameState.stats.singularityPoints++;
            const points = this.gameState.stats.singularityPoints;
            localStorage.removeItem('cosmicEmpiresSave'); // Deleta o save antigo
            this.loadGame(); // Carrega um jogo novo
            this.gameState.stats.singularityPoints = points; // Reatribui os pontos
            this.saveGame();
            window.location.reload();
        }
    }
    
    // ... (restante do código com a lógica dos novos sistemas, áudio, etc.)
}

// Inicia o jogo
window.onload = () => { window.game = new Game(GAME_DATA); };
