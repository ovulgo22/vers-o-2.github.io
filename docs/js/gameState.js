import { BUILDINGS_DATA, UPGRADES_DATA } from './data.js';

// O estado centralizado do jogo
export let state = {};

/**
 * @description Define o estado inicial do jogo, seja um novo jogo ou um jogo carregado.
 * @param {object | null} loadedState - O estado carregado do saveManager.
 */
export function initState(loadedState = null) {
    const defaultState = {
        cookies: 0,
        cookiesPerClick: 1,
        buildings: BUILDINGS_DATA.map(b => ({ ...b, count: 0 })),
        upgrades: UPGRADES_DATA.map(u => ({ ...u, purchased: false })),
    };

    // Mescla o estado salvo com o padrão para garantir que novos dados de updates sejam incluídos
    state = {
        ...defaultState,
        ...loadedState,
        // Garante que as arrays de prédios e upgrades sejam mescladas corretamente
        buildings: defaultState.buildings.map(defaultBuilding => {
            const savedBuilding = loadedState?.buildings?.find(b => b.id === defaultBuilding.id);
            return savedBuilding ? { ...defaultBuilding, ...savedBuilding } : defaultBuilding;
        }),
        upgrades: defaultState.upgrades.map(defaultUpgrade => {
            const savedUpgrade = loadedState?.upgrades?.find(u => u.id === defaultUpgrade.id);
            return savedUpgrade ? { ...defaultUpgrade, ...savedUpgrade } : defaultUpgrade;
        }),
    };
    
    // Recalcula o CPS inicial
    recalculateCPS();
}

/**
 * @description Recalcula o total de cookies por segundo (CPS) com base nos prédios.
 */
export function recalculateCPS() {
    state.cookiesPerSecond = state.buildings.reduce((total, building) => {
        return total + (building.cps * building.count);
    }, 0);
}

/**
 * @description Adiciona cookies ao total.
 * @param {number} amount - A quantidade de cookies a ser adicionada.
 */
export function addCookies(amount) {
    state.cookies += amount;
}

/**
 * @description Tenta comprar um prédio. Retorna true se a compra foi bem-sucedida.
 * @param {string} buildingId - O ID do prédio a ser comprado.
 * @returns {boolean} - Sucesso ou falha da compra.
 */
export function purchaseBuilding(buildingId) {
    const building = state.buildings.find(b => b.id === buildingId);
    if (!building || state.cookies < building.cost) {
        return false;
    }

    state.cookies -= building.cost;
    building.count++;
    // Aumenta o custo para a próxima compra (fator de 15%)
    building.cost = Math.ceil(building.cost * 1.15);
    
    recalculateCPS();
    return true;
}

/**
 * @description Tenta comprar um upgrade. Retorna true se a compra foi bem-sucedida.
 * @param {string} upgradeId - O ID do upgrade a ser comprado.
 * @returns {boolean} - Sucesso ou falha da compra.
 */
export function purchaseUpgrade(upgradeId) {
    const upgrade = state.upgrades.find(u => u.id === upgradeId);
    if (!upgrade || upgrade.purchased || state.cookies < upgrade.cost) {
        return false;
    }

    state.cookies -= upgrade.cost;
    upgrade.purchased = true;

    // Aplica o efeito do upgrade
    if (upgrade.effect.type === 'multiply_cps') {
        const targetBuilding = state.buildings.find(b => b.id === upgrade.effect.target);
        if (targetBuilding) {
            targetBuilding.cps *= upgrade.effect.multiplier;
        }
    } else if (upgrade.effect.type === 'add_cpc') {
        state.cookiesPerClick += upgrade.effect.amount;
    }

    recalculateCPS();
    return true;
}

/**
 * @description Reseta o estado do jogo para o padrão.
 */
export function resetState() {
    initState(null);
}

// No objeto defaultState dentro de initState:
const defaultState = {
    cookies: 0,
    cookiesPerClick: 1,
    buildings: BUILDINGS_DATA.map(b => ({ ...b, count: 0 })),
    upgrades: UPGRADES_DATA.map(u => ({ ...u, purchased: false })),
    buffs: {} // <--- NOVO CAMPO PARA BUFFS
};
