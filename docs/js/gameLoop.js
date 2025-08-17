import { state, addCookies } from './gameState.js';
import { updateCookieCount, updateTitleWithCookieCount } from './domManager.js';

let gameLoopInterval = null;

/**
 * @description A função que executa a cada tick do jogo.
 */
function tick() {
    if (state.cookiesPerSecond > 0) {
        const cookiesPerTick = state.cookiesPerSecond / 10; // Roda 10x por segundo para suavidade
        addCookies(cookiesPerTick);
        updateCookieCount();
        updateTitleWithCookieCount(); // Atualiza o título da página
    }
}

/**
 * @description Inicia o loop principal do jogo.
 */
export function startGameLoop() {
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval);
    }
    // Roda o tick 10 vezes por segundo (a cada 100ms) para uma atualização mais fluida
    gameLoopInterval = setInterval(tick, 100); 
}
