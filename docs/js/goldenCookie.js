import { state, addCookies } from './gameState.js';
import { updateStats } from './domManager.js';

const goldenCookieElement = document.getElementById('golden-cookie');
let isActive = false;
let spawnTimeout = null;

function applyBuff() {
    if (state.buffs.goldenCookie) return; // Impede acumular buffs

    const duration = 77; // segundos
    state.buffs.goldenCookie = {
        multiplier: 7,
        timeLeft: duration,
        originalCPS: state.cookiesPerSecond
    };
    
    console.log(`Golden Cookie Ativado! CPS x7 por ${duration}s.`);
    // A lógica de aplicação do buff estará no gameLoop
}

function handleClick() {
    if (!isActive) return;
    
    const flatBonus = state.cookiesPerSecond * 60 * 15; // Bônus de 15 minutos de produção
    const minBonus = 13;
    const finalBonus = Math.max(flatBonus, minBonus);
    addCookies(finalBonus);
    console.log(`Golden Cookie clicado! Bônus de ${finalBonus} cookies.`);
    
    // applyBuff(); // Descomente para um buff de CPS em vez de bônus fixo

    hide();
    scheduleNextSpawn();
}

function show() {
    // Posição aleatória dentro da viewport
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    goldenCookieElement.style.left = `${x}px`;
    goldenCookieElement.style.top = `${y}px`;

    goldenCookieElement.classList.remove('hidden');
    isActive = true;

    // Desaparece depois de um tempo
    setTimeout(hide, 10000); // 10 segundos para clicar
}

function hide() {
    goldenCookieElement.classList.add('hidden');
    isActive = false;
}

function scheduleNextSpawn() {
    clearTimeout(spawnTimeout);
    // Aparece entre 1 e 5 minutos
    const nextSpawnTime = Math.random() * (300000 - 60000) + 60000;
    spawnTimeout = setTimeout(show, nextSpawnTime);
}

export function initializeGoldenCookie() {
    goldenCookieElement.addEventListener('click', handleClick);
    scheduleNextSpawn();
}
