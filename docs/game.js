// game.js - Lógica central do jogo
import { state } from './state.js';
import { bus } from './event_bus.js';
import { BUILDINGS_DATA } from './data.js';
import { Decimal } from './libs/break_infinity.js';

function recalculateCPS() {
    let totalCps = new Decimal(0);
    state.buildings.forEach(b => {
        const data = BUILDINGS_DATA.find(d => d.id === b.id);
        totalCps = totalCps.plus(new Decimal(data.baseCps).times(b.count));
    });
    // Adicionar multiplicadores de upgrades e prestígio aqui
    state.player.cookiesPerSecond = totalCps;
    bus.publish('stats:cpsUpdated', { cps: totalCps });
}

export function clickCookie() {
    const clickPower = new Decimal(1); // Modificar com upgrades
    state.player.cookies = state.player.cookies.plus(clickPower);
    state.player.manualClicks++;
    bus.publish('player:cookiesUpdated', { cookies: state.player.cookies });
    bus.publish('player:clickedCookie', { x: MouseEvent.clientX, y: MouseEvent.clientY });
}

export function buyBuilding(buildingId) {
    // Lógica completa de compra...
    // ...
    // Ao final:
    recalculateCPS();
}

export function update(deltaTime) {
    const produced = state.player.cookiesPerSecond.times(deltaTime);
    if (produced.gt(0)) {
        state.player.cookies = state.player.cookies.plus(produced);
        state.player.totalCookiesEver = state.player.totalCookiesEver.plus(produced);
        bus.publish('player:cookiesUpdated', { cookies: state.player.cookies });
    }
    state.player.playTime += deltaTime;
}

export function init() {
    recalculateCPS();
    bus.subscribe('ui:buyBuilding', ({ id }) => buyBuilding(id));
    bus.subscribe('ui:clickCookie', clickCookie);
}
