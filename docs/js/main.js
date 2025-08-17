import { loadGame, initializeState } from './saveManager.js';
import { renderAll } from './domManager.js';
import { initializeEventListeners } from './eventHandlers.js';
import { startGameLoop } from './gameLoop.js';

/**
 * @description Função principal que inicializa o jogo.
 * Garante que o DOM esteja totalmente carregado antes de executar o código.
 */
function initializeGame() {
    console.log("Cookie Simulator: Inicializando...");
    try {
        const initialState = loadGame(); // Tenta carregar o jogo salvo
        initializeState(initialState); // Configura o estado inicial (novo ou carregado)
        
        renderAll(); // Renderiza todos os componentes da UI
        initializeEventListeners(); // Configura os handlers de clique/toque
        startGameLoop(); // Inicia o loop principal do jogo
        
        console.log("Jogo inicializado com sucesso!");
    } catch (error) {
        console.error("Erro crítico durante a inicialização do jogo:", error);
        // Opcional: Mostrar uma mensagem de erro para o usuário na tela
        document.body.innerHTML = '<h1>Ocorreu um erro grave. Por favor, limpe o cache e tente novamente.</h1>';
    }
}

// Garante que o script só rode após o carregamento completo do HTML
document.addEventListener('DOMContentLoaded', initializeGame);
