import { state, loadState, resetForPrestige } from './state.js';
import { Decimal } from './libs/break_infinity.js';

const SAVE_KEY = 'cookieSimulatorSave_v2';
const OPTIONS_KEY = 'cookieSimulatorOptions_v2';

// Converte Decimals para string ao salvar
function replacer(key, value) {
    if (value instanceof Decimal) {
        return { __type: 'Decimal', value: value.toString() };
    }
    return value;
}

// Converte strings de volta para Decimals ao carregar
function reviver(key, value) {
    if (value && value.__type === 'Decimal') {
        return new Decimal(value.value);
    }
    return value;
}

export function save() {
    try {
        state.meta.lastSaveTimestamp = Date.now();
        localStorage.setItem(SAVE_KEY, JSON.stringify(state, replacer));
        localStorage.setItem(OPTIONS_KEY, JSON.stringify(state.options));
    } catch (e) {
        console.error("Falha ao salvar o progresso:", e);
    }
}

export function load() {
    try {
        const savedGame = localStorage.getItem(SAVE_KEY);
        if (!savedGame) return null;
        
        const loaded = JSON.parse(savedGame, reviver);
        
        // Versionamento do Save
        if (loaded.meta.version !== "2.0") {
            // Lógica para migrar um save antigo, se necessário
            console.warn("Save de versão antiga detectado. Pode haver inconsistências.");
        }
        
        loadState(loaded);
        return loaded;
    } catch (e) {
        console.error("Falha ao carregar progresso, save pode estar corrompido:", e);
        return null;
    }
}
