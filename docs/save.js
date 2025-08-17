class SaveManager {
    constructor(game) {
        this.game = game;
        this.saveKey = 'starlightClickerSave_v2'; // Chave atualizada para evitar conflitos
    }

    save() { /* ... */ }

    load() {
        const savedState = localStorage.getItem(this.saveKey);
        if (savedState) {
            // ... (lógica de merge robusta da v1) ...
            
            // NOVO: Lógica do Modal de Progresso Offline
            const offlineTime = (Date.now() - parsedState.lastSave) / 1000;
            if (offlineTime > 60) { // Só mostra se ficou offline por mais de 1 minuto
                const offlineGains = this.game.calculateSPS() * offlineTime;
                this.game.gameState.stardust += offlineGains;
                this.game.ui.showOfflineReport(offlineTime, offlineGains);
            }
            return true;
        }
        return false;
    }
}
