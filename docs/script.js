document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE NAVEGAÇÃO E CARREGAMENTO DE CONTEÚDO ---
    const navLinks = document.querySelectorAll('.nav-link');
    const contentArea = document.getElementById('content-area');

    function loadContent(contentId) {
        const template = document.getElementById(contentId);
        if (template) {
            const clone = template.content.cloneNode(true);
            contentArea.innerHTML = '';
            contentArea.appendChild(clone);
        } else {
            console.error(`Conteúdo para o ID '${contentId}' não encontrado.`);
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const contentId = link.dataset.content;
            loadContent(contentId);
            window.scrollTo(0, 0);
        });
    });

    loadContent('introducao');

    // --- FUNDO ANIMADO MATRIX ---
    const canvas = document.getElementById('matrix-background');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const alphabet = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }).fill(1);

    const drawMatrix = () => {
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00f469';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };
    const matrixInterval = setInterval(drawMatrix, 33);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // Recalcular colunas e gotas de chuva em resize pode ser adicionado para maior robustez
    });

    // --- LÓGICA DA CALCULADORA INTERATIVA ---
    // Observa quando o conteúdo é adicionado na 'content-area' para poder atachar o evento do botão
    const observer = new MutationObserver((mutations) => {
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            const runCalculation = () => {
                const fp = parseFloat(document.getElementById('fp').value);
                const fi = parseFloat(document.getElementById('fi').value);
                const n_bar_text = document.getElementById('n_bar').value;
                const n_bar = parseFloat(n_bar_text);

                if (isNaN(fp) || isNaN(fi) || isNaN(n_bar)) {
                    document.getElementById('sim-prob').textContent = "Valores inválidos.";
                    return;
                }
                const numerator = fp * fi * n_bar;
                const denominator = numerator + 1;
                const f_sim = denominator > 0 ? numerator / denominator : 0;
                document.getElementById('sim-prob').textContent = `${(f_sim * 100).toPrecision(8)}%`;
            };
            
            calculateBtn.addEventListener('click', runCalculation);
            // Executa o cálculo inicial com os valores padrão
            runCalculation();
            // Para de observar uma vez que o botão foi encontrado e o evento adicionado
            observer.disconnect(); 
        }
    });

    // Sempre que o conteúdo for trocado, o observer precisa ser reativado
    const mainObserver = new MutationObserver(() => {
        observer.observe(contentArea, { childList: true });
    });
    mainObserver.observe(contentArea, { childList: true, subtree: true });
});
