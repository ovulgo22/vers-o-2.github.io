// Usar `Object.freeze` torna os dados imutáveis, prevenindo modificações acidentais.

export const BUILDINGS_DATA = Object.freeze([
    { id: 'b01', name: 'Cursor', description: 'Clica no cookie para você.', cost: 15, cps: 0.1, count: 0 },
    { id: 'b02', name: 'Vovó', description: 'Faz cookies com amor.', cost: 100, cps: 1, count: 0 },
    { id: 'b03', name: 'Fazenda', description: 'Planta e colhe cookies.', cost: 1100, cps: 8, count: 0 },
    { id: 'b04', name: 'Mina', description: 'Minera chocolate e cookies.', cost: 12000, cps: 47, count: 0 },
    { id: 'b05', name: 'Fábrica', description: 'Produz cookies em massa.', cost: 130000, cps: 260, count: 0 },
]);

export const UPGRADES_DATA = Object.freeze([
    { 
        id: 'u01', 
        name: 'Dedo de Aço', 
        description: 'Seus cliques valem o dobro.', 
        cost: 100,
        purchased: false,
        effect: { type: 'add_cpc', amount: 1 } 
    },
    { 
        id: 'u02', 
        name: 'Luvas de Crochê', 
        description: 'Vovós produzem em dobro.', 
        cost: 500,
        purchased: false,
        effect: { type: 'multiply_cps', target: 'b02', multiplier: 2 } 
    },
]);
