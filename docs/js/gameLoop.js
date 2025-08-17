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

// ...
function tick() {
    let currentCPS = state.cookiesPerSecond;

    // Aplica buffs
    if (state.buffs.goldenCookie) {
        currentCPS *= state.buffs.goldenCookie.multiplier;
        state.buffs.goldenCookie.timeLeft -= 0.1; // 100ms
        if (state.buffs.goldenCookie.timeLeft <= 0) {
            delete state.buffs.goldenCookie;
            console.log("Buff do Golden Cookie expirou.");
        }
    }

    if (currentCPS > 0) {
        const cookiesPerTick = currentCPS / 10;
        addCookies(cookiesPerTick);
        updateCookieCount();
        updateTitleWithCookieCount();
    }
    updateStats(); // Atualiza o CPS na tela para refletir o buff
}
// ...
