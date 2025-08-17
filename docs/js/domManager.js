import { state } from './gameState.js';
import { formatNumber } from './utils.js';

// Cache dos elementos do DOM para melhor performance
const elements = {
    cookieCounter: document.getElementById('cookie-counter'),
    cookieButton: document.getElementById('cookie-button'),
    cpsStat: document.getElementById('cps-stat'),
    buildingsContainer: document.getElementById('buildings-container'),
    upgradesContainer: document.getElementById('upgrades-container'),
    saveFeedback: document.getElementById('save-feedback'),
    pageTitle: document.querySelector('title')
};

/**
 * @description Atualiza a contagem de cookies na tela.
 */
export function updateCookieCount() {
    elements.cookieCounter.textContent = formatNumber(state.cookies);
}

/**
 * @description Atualiza as estatísticas (CPS).
 */
export function updateStats() {
    elements.cpsStat.textContent = formatNumber(state.cookiesPerSecond);
}

/**
 * @description Renderiza a lista de prédios.
 */
export function renderBuildings() {
    let html = '';
    for (const building of state.buildings) {
        const canAfford = state.cookies >= building.cost;
        html += `
            <div class="item-card ${canAfford ? '' : 'disabled'}" data-id="${building.id}" data-type="building">
                <h3>${building.name} (x${building.count})</h3>
                <p>${building.description}</p>
                <div class="item-info">
                    <span>+${formatNumber(building.cps)} CPS</span>
                    <span class="item-cost">Custo: ${formatNumber(building.cost)}</span>
                </div>
            </div>
        `;
    }
    elements.buildingsContainer.innerHTML = html;
}

/**
 * @description Renderiza a lista de upgrades disponíveis.
 */
export function renderUpgrades() {
    let html = '';
    const availableUpgrades = state.upgrades.filter(u => !u.purchased);
    for (const upgrade of availableUpgrades) {
        const canAfford = state.cookies >= upgrade.cost;
        html += `
            <div class="item-card ${canAfford ? '' : 'disabled'}" data-id="${upgrade.id}" data-type="upgrade">
                <h3>${upgrade.name}</h3>
                <p>${upgrade.description}</p>
                <div class="item-info">
                    <span class="item-cost">Custo: ${formatNumber(upgrade.cost)}</span>
                </div>
            </div>
        `;
    }
    elements.upgradesContainer.innerHTML = html;
}

/**
 * @description Função mestre que chama todas as funções de renderização.
 */
export function renderAll() {
    updateCookieCount();
    updateStats();
    renderBuildings();
    renderUpgrades();
}

/**
 * @description Mostra um feedback visual de que o jogo foi salvo.
 */
export function showSaveFeedback() {
    elements.saveFeedback.textContent = 'Jogo salvo com sucesso!';
    setTimeout(() => {
        elements.saveFeedback.textContent = '';
    }, 2000);
}

/**
 * @description Atualiza o título da página com a contagem de cookies.
 */
export function updateTitleWithCookieCount() {
    elements.pageTitle.textContent = `${formatNumber(state.cookies)} cookies - Cookie Simulator`;
}
