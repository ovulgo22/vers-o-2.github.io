class UIController {
    constructor(game) {
        this.game = game;
        this.elements = {
            // ... (todos os elementos da v6.0)
            floatingTextContainer: document.getElementById('floating-text-container'),
            toggleMusicBtn: document.getElementById('toggle-music-btn'),
            toggleSfxBtn: document.getElementById('toggle-sfx-btn'),
        };
        this.addEventListeners();
        this.renderAll();
    }
    
    // ... (funções da v6.0)
    
    // NOVO: Feedback visual ("Juice")
    showFloatingText(text, color = 'green', element) {
        const floatingText = document.createElement('div');
        floatingText.className = `floating-text ${color}`;
        floatingText.textContent = text;
        this.elements.floatingTextContainer.appendChild(floatingText);
        setTimeout(() => floatingText.remove(), 1500);
    }
    
    // NOVO: Modal de Recompensa Diária
    showDailyRewardModal(day, reward) {
        const rewardText = Object.entries(reward).map(([res, val]) => `${val} ${res}`).join(', ');
        const content = `
            <h3>Recompensa do Dia ${day + 1}</h3>
            <p>Por sua lealdade, o Alto Comando Galáctico lhe concede:</p>
            <p class="reward-text">${rewardText}</p>
        `;
        this.showGenericModal("Bônus de Login Diário", content);
    }
    
    // ... (outras funções, como renderBountyBoard)
}
