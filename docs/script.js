document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('content-area');

    // Função para carregar o conteúdo
    function loadContent(contentId) {
        // Encontra o template de conteúdo pelo ID
        const template = document.getElementById(contentId);
        if (template) {
            // Clona o conteúdo do template
            const clone = template.content.cloneNode(true);
            // Limpa a área de conteúdo e adiciona o novo conteúdo
            contentArea.innerHTML = '';
            contentArea.appendChild(clone);
        } else {
            console.error(`Conteúdo para o ID '${contentId}' não encontrado.`);
        }
    }

    // Adiciona o listener de clique para cada link da navegação
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Previne o comportamento padrão do link

            // Remove a classe 'active' de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            // Adiciona a classe 'active' ao link clicado
            link.classList.add('active');

            // Obtém o ID do conteúdo a ser carregado do atributo 'data-content'
            const contentId = link.dataset.content;
            loadContent(contentId);
            
            // Rola a página para o topo em telas menores
            window.scrollTo(0, 0);
        });
    });

    // Carrega o conteúdo inicial (Introdução) ao carregar a página
    loadContent('introducao');
});
