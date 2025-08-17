import { state, addCookies, purchaseBuilding, purchaseUpgrade } from './gameState.js';
import { renderAll, updateCookieCount } from './domManager.js';
import { saveGame, resetGame } from './saveManager.js';

// Cache dos elementos do DOM para os listeners
const cookieButton = document.getElementById('cookie-button');
const buildingsContainer = document.getElementById('buildings-container');
const upgradesContainer = document.getElementById('upgrades-container');
const saveButton = document.getElementById('save-button');
const resetButton = document.getElementById('reset-button');

/**
 * @description Lida com o clique principal no cookie.
 */
function handleCookieClick() {
    addCookies(state.cookiesPerClick);
    updateCookieCount();
}

/**
 * @description Lida com a compra de itens (prédios ou upgrades).
 * @param {Event} event - O evento de clique.
 */
function handleItemPurchase(event) {
    const card = event.target.closest('.item-card');
    if (!card || card.classList.contains('disabled')) {
        return;
    }

    const { id, type } = card.dataset;
    let purchaseSuccessful = false;

    if (type === 'building') {
        purchaseSuccessful = purchaseBuilding(id);
    } else if (type === 'upgrade') {
        purchaseSuccessful = purchaseUpgrade(id);
    }
    
    // Se a compra deu certo, renderiza tudo para atualizar a UI
    if (purchaseSuccessful) {
        renderAll();
    }
}

/**
 * @description Lida com o reset do jogo, com confirmação.
 */
function handleReset() {
    if (confirm('Você tem certeza que deseja resetar todo o seu progresso? Essa ação não pode ser desfeita.')) {
        resetGame();
    }
}

/**
 * @description Inicializa todos os event listeners do jogo.
 */
export function initializeEventListeners() {
    // Suporte para clique e toque no cookie principal
    cookieButton.addEventListener('click', handleCookieClick);
    cookieButton.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Previne zoom ou outros comportamentos padrão
        handleCookieClick();
    }, { passive: false });

    // Delegação de eventos para performance
    buildingsContainer.addEventListener('click', handleItemPurchase);
    upgradesContainer.addEventListener('click', handleItemPurchase);
    
    saveButton.addEventListener('click', saveGame);
    resetButton.addEventListener('click', handleReset);
}
