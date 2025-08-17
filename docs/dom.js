function get(id) { return document.getElementById(id); }

export const DOM = {
    // Overlays
    loadingOverlay: get('loading-overlay'),
    fatalErrorOverlay: get('fatal-error-overlay'),
    fatalErrorMessage: get('fatal-error-message'),
    
    // Contadores
    cookieCounter: get('cookie-counter'),
    cpsCounter: get('cps-counter'),

    // Botões Principais
    cookieButton: get('cookie-button'),
    optionsOpenButton: get('options-open-button'),
    prestigeOpenButton: get('prestige-open-button'),
    
    // Contêineres
    buildingsContainer: get('buildings-container'),
    upgradesContainer: get('upgrades-container'),
    particleContainer: get('particle-container'),
    toastContainer: get('toast-container'),
    goldenCookieContainer: get('golden-cookie-container'),
    
    // Modais
    optionsModal: get('options-modal'),
    optionsForm: get('options-form'),
    optionsSaveButton: get('options-save-button'),
    
    // Seletores
    buyAmountSelector: get('buy-amount-selector'),
};
