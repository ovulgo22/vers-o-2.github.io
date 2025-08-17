import { state, initState, resetState } from './gameState.js';
import { showSaveFeedback, renderAll } from './domManager.js';

const SAVE_KEY = 'cookieSimulatorSaveData';

/**
 * @description Salva o estado atual do jogo no localStorage.
 */
export function saveGame() {
    try {
        const stateToSave = JSON.stringify(state);
        localStorage.setItem(SAVE_KEY, stateToSave);
        showSaveFeedback();
    } catch (error) {
        console.error("Erro ao salvar o jogo:", error);
        alert("Não foi possível salvar seu progresso. O armazenamento pode estar cheio.");
    }
}

/**
 * @description Carrega o estado do jogo do localStorage.
 * @returns {object | null} O estado do jogo ou nulo se não houver save.
 */
export function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData === null) {
            return null; // Nenhum jogo salvo
        }
        return JSON.parse(savedData);
    } catch (error) {
        console.error("Erro ao carregar o jogo. O save pode estar corrompido.", error);
        localStorage.removeItem(SAVE_KEY); // Limpa o save corrompido
        return null;
    }
}

/**
 * @description Reseta o jogo, limpando o localStorage e recarregando a página.
 */
export function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    resetState(); // Reseta o estado na memória
    renderAll(); // Atualiza a UI para o estado zerado
}

// Exporta initState para que o main.js possa usá-lo.
export { initState };
