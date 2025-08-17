import { Decimal } from './libs/break_infinity.js';

export const BUILDINGS_DATA = [
    { id: 'cursor', name: 'Cursor', baseCost: new Decimal(15), baseCps: new Decimal(0.1), icon: '👆' },
    { id: 'grandma', name: 'Vovó', baseCost: new Decimal(100), baseCps: new Decimal(1), icon: '👵' },
    // ... adicione muitas outras construções aqui
];

export const UPGRADES_DATA = [
    { id: 'uc01', name: 'Cursor Reforçado', cost: new Decimal(100), target: 'cursor', multiplier: 2, required: { type: 'building', id: 'cursor', amount: 1 } },
    // ... adicione muitas outras melhorias aqui
];

export const ACHIEVEMENTS_DATA = [
    { id: 'ach01', name: 'Começando', description: 'Clique no cookie pela primeira vez.', condition: (state) => state.player.manualClicks >= 1 },
    // ... adicione muitas outras conquistas aqui
];

// ... outras constantes de dados (PRESTIGE_UPGRADES, NEWS_TICKER, etc.)
