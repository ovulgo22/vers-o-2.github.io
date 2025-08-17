import { BUILDINGS_DATA, UPGRADES_DATA, PRESTIGE_UPGRADES_DATA } from './data.js';
import { Decimal } from './libs/break_infinity.js';

const createInitialState = () => ({
    meta: {
        version: "2.0",
        lastSaveTimestamp: Date.now(),
    },
    options: {
        theme: 'theme-dark',
        musicVolume: 0.2,
        sfxVolume: 0.5,
        showParticles: true,
        buyAmount: 1,
    },
    player: {
        cookies: new Decimal(0),
        cookiesPerSecond: new Decimal(0),
        totalCookiesEver: new Decimal(0),
        manualClicks: 0,
        playTime: 0,
    },
    buildings: BUILDINGS_DATA.map(b => ({ id: b.id, count: 0 })),
    upgrades: {
        purchased: [],
        unlocked: [], // Para mostrar apenas as relevantes
    },
    prestige: {
        chips: new Decimal(0),
        upgradesPurchased: [],
    },
    achievements: {
        unlocked: [],
    },
    goldenCookie: {
        timer: 0,
        timeToNextSpawn: 120,
        isActive: false,
        activeEffect: null,
        effectTimer: 0,
    },
});

export let state = createInitialState();

// Função para resetar o estado para uma nova ascensão
export function resetForPrestige() {
    const prestigeState = state.prestige;
    const achievementsState = state.achievements;
    const optionsState = state.options;

    const freshState = createInitialState();
    freshState.prestige = prestigeState;
    freshState.achievements = achievementsState;
    freshState.options = optionsState;
    
    state = freshState;
}

// Para carregar um save
export function loadState(loadedState) {
    state = loadedState;
}
