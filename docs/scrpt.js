// --- DOM ELEMENTS ---
const bgCanvas = document.getElementById('bgCanvas');
const mainCanvas = document.getElementById('mainCanvas');
const statsDiv = document.getElementById('stats');
const colonySizeSlider = document.getElementById('colonySize');
const resourceSlider = document.getElementById('resourceAvailability');
const colonyValueSpan = document.getElementById('colonyValue');
const resourceValueSpan = document.getElementById('resourceValue');
const resetButton = document.getElementById('resetButton');
const eventNotifier = document.getElementById('event-notifier');

const bgCtx = bgCanvas.getContext('2d');
const mainCtx = mainCanvas.getContext('2d');

// --- CONFIGURATION ---
const CONFIG = {
    HEX_SIZE: 18,
    SPRITE_SIZE: 3.5,
    SPRITE_SPEED: 2.0,
    QUEEN_SPEED: 0.5,
    BUILD_SPEED: 0.5,
    TEND_SPEED: 0.4,
    EGG_LAY_CHANCE: 0.005,
    HATCH_TIME: 1000,
    STAR_COUNT: 400,
    EVENT_CHANCE: 0.001,
    COLORS: {
        STAR: '#FFFFFF',
        EMPTY_OUTLINE: 'rgba(0, 255, 255, 0.1)',
        CONSTRUCTION_OUTLINE: '#00aaff',
        BUILT_OUTLINE: '#00ffff',
        NEBULA_START: 'rgba(255, 100, 255, 0.2)',
        NEBULA_END: 'rgba(0, 255, 255, 0.2)',
        BROOD_FILL: 'rgba(224, 110, 255, 0.8)',
        SPRITE_BODY: '#00ffff',
        SPRITE_WING: 'rgba(0, 255, 255, 0.7)',
        QUEEN_BODY: '#ff4dd2',
    }
};

// --- GLOBAL STATE ---
let initialColonySize = parseInt(colonySizeSlider.value);
let resourceAvailability = parseInt(resourceSlider.value);
let sprites = [];
let queen;
let grid = {};
let stars = [];
let mousePos = { x: 0, y: 0 };
let lastTime = 0;
let hiveEnergy = 100;

// --- Cosmic Events State ---
let activeEvent = { type: 'none', duration: 0 };
let nebula = null;
let meteors = [];

// --- UTILITY ---
const hexWidth = Math.sqrt(3) * CONFIG.HEX_SIZE;
const hexHeight = 2 * CONFIG.HEX_SIZE;
const hexDirections = [ { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 }, { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 } ];
function hexToPixel(q, r) {
    const x = CONFIG.HEX_SIZE * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
    const y = CONFIG.HEX_SIZE * (3 / 2 * r);
    return { x: x + mainCanvas.width / 2, y: y + mainCanvas.height / 2 };
}
function getNeighbors(q, r) {
    return hexDirections.map(dir => ({ q: q + dir.q, r: r + dir.r }));
}

// --- CLASSES ---
class HexCell {
    constructor(q, r) {
        this.q = q; this.r = r; this.key = `${q},${r}`;
        this.state = 'empty';
        this.progress = 0; this.pulse = 0;
        const { x, y } = hexToPixel(q, r);
        this.x = x; this.y = y;
    }
    draw(ctx) {
        let outlineColor = CONFIG.COLORS.EMPTY_OUTLINE; let lineWidth = 1;
        switch (this.state) {
            case 'constructing': outlineColor = CONFIG.COLORS.CONSTRUCTION_OUTLINE; lineWidth = 1 + this.progress * 2; break;
            case 'built': case 'filling': case 'full': case 'brood': outlineColor = CONFIG.COLORS.BUILT_OUTLINE; lineWidth = 2; break;
        }
        if (this.pulse > 0) {
            lineWidth += this.pulse * 3; outlineColor = 'white'; this.pulse -= 0.02;
        }
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i + Math.PI / 6;
            const px = this.x + (CONFIG.HEX_SIZE - lineWidth) * Math.cos(angle);
            const py = this.y + (CONFIG.HEX_SIZE - lineWidth) * Math.sin(angle);
            ctx[i === 0 ? 'moveTo' : 'lineTo'](px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = outlineColor; ctx.lineWidth = lineWidth;
        ctx.shadowColor = outlineColor; ctx.shadowBlur = 5; ctx.stroke(); ctx.shadowBlur = 0;

        if (this.state === 'filling' || this.state === 'full') {
            const radius = (CONFIG.HEX_SIZE * 0.8) * Math.sqrt(this.progress);
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);
            gradient.addColorStop(0, CONFIG.COLORS.NEBULA_START); gradient.addColorStop(1, CONFIG.COLORS.NEBULA_END);
            ctx.beginPath(); ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI); ctx.fillStyle = gradient; ctx.fill();
        } else if (this.state === 'brood') {
            const radius = (CONFIG.HEX_SIZE * 0.7) * (this.progress / CONFIG.HATCH_TIME);
            ctx.beginPath(); ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = CONFIG.COLORS.BROOD_FILL; ctx.shadowColor = CONFIG.COLORS.BROOD_FILL;
            ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0;
        }
    }
}

class Sprite {
    constructor(id, isQueen = false) {
        this.id = id; this.isQueen = isQueen;
        this.x = mainCanvas.width / 2; this.y = mainCanvas.height / 2;
        this.target = { x: this.x, y: this.y };
        this.state = 'wandering'; this.task = null; this.cargo = 0;
        this.speed = isQueen ? CONFIG.QUEEN_SPEED : CONFIG.SPRITE_SPEED;
        this.size = isQueen ? CONFIG.SPRITE_SIZE * 1.8 : CONFIG.SPRITE_SIZE;
        this.color = isQueen ? CONFIG.COLORS.QUEEN_BODY : CONFIG.COLORS.SPRITE_BODY;
    }

    update(dt) {
        const dx = this.target.x - this.x; const dy = this.target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let currentSpeed = this.speed;
        if (nebula && isPointInNebula(this.x, this.y)) {
            currentSpeed *= 1.5; // Speed boost in nebula
        }
        if (dist > 1) {
            this.x += (dx / dist) * currentSpeed * (dt * 60);
            this.y += (dy / dist) * currentSpeed * (dt * 60);
        }
        if (this.isQueen) this.updateQueen(dist); else this.updateWorker(dist, dt);
    }
    
    updateWorker(dist, dt) {
        switch (this.state) {
            case 'wandering': if (dist < 5) this.findTask(); break;
            case 'gathering':
                if (dist < 10) {
                    let gatherRate = resourceAvailability * 0.5;
                    if (activeEvent.type === 'METEOR_SHOWER') gatherRate *= 5; // Event boost
                    this.cargo += gatherRate * (dt * 60);
                    if (this.cargo >= 100) { this.cargo = 100; this.state = 'wandering'; }
                }
                break;
            case 'depositing':
                if (dist < 50) { // Near hive center
                    const amount = Math.min(this.cargo, 5 * (dt*60));
                    hiveEnergy += amount;
                    this.cargo -= amount;
                    if (this.cargo <= 0) this.state = 'wandering';
                }
                break;
            case 'building': case 'tending':
                if (dist < 5 && hiveEnergy > 0) {
                    const cell = this.task.cell;
                    let workRate = (this.state === 'building' ? CONFIG.BUILD_SPEED : CONFIG.TEND_SPEED);
                    if (nebula && isPointInNebula(this.x, this.y)) workRate *= 2; // Event boost
                    const energyConsumed = workRate * (dt*60);
                    cell.progress += energyConsumed;
                    hiveEnergy -= energyConsumed;

                    if (this.state === 'building' && cell.progress >= 100) {
                        cell.state = 'built'; cell.progress = 0; cell.pulse = 1; this.state = 'wandering';
                    } else if (this.state === 'tending' && cell.progress >= CONFIG.HATCH_TIME) {
                        cell.state = 'built'; cell.progress = 0; cell.pulse = 1; this.hatchSprite(); this.state = 'wandering';
                    }
                } else if (hiveEnergy <= 0) { this.state = 'wandering'; }
                break;
        }
    }
    
    updateQueen(dist) {
         if (dist < 5) {
            const builtCells = Object.values(grid).filter(c => c.state === 'built');
            if (builtCells.length > 0 && Math.random() < CONFIG.EGG_LAY_CHANCE && hiveEnergy > 50) {
                const cell = builtCells[Math.floor(Math.random() * builtCells.length)];
                cell.state = 'brood'; cell.progress = 0; hiveEnergy -= 50;
            }
            const angle = Math.random() * 2 * Math.PI; const radius = Math.random() * 150;
            this.target = { x: mainCanvas.width / 2 + Math.cos(angle) * radius, y: mainCanvas.height / 2 + Math.sin(angle) * radius };
        }
    }
    
    findTask() {
        if (this.cargo > 80) { this.state = 'depositing'; this.target = { x: mainCanvas.width / 2, y: mainCanvas.height / 2 }; return; }
        if (hiveEnergy < 50 || this.cargo <= 0) {
            this.state = 'gathering'; const angle = Math.random() * 2 * Math.PI;
            this.target = { x: mainCanvas.width/2 + Math.cos(angle) * mainCanvas.width, y: mainCanvas.height/2 + Math.sin(angle) * mainCanvas.height }; return;
        }
        const tasks = [
            () => Object.values(grid).find(c => c.state === 'brood' && c.progress < CONFIG.HATCH_TIME),
            () => Object.values(grid).find(c => c.state === 'constructing'),
            () => Object.values(grid).find(c => c.state === 'empty'),
        ];
        const taskStates = ['tending', 'building', 'building'];
        for(let i = 0; i < tasks.length; i++) {
            const cell = tasks[i]();
            if(cell) {
                this.state = taskStates[i];
                if (this.state === 'building' && cell.state === 'empty') cell.state = 'constructing';
                this.task = { cell: cell }; this.target = { x: cell.x, y: cell.y }; return;
            }
        }
        this.target = { x: Math.random() * mainCanvas.width, y: Math.random() * mainCanvas.height };
    }
    
    hatchSprite() { if (sprites.length < 300) sprites.push(new Sprite(sprites.length)); }

    draw(ctx) {
        ctx.save(); ctx.translate(this.x, this.y);
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        ctx.rotate(angle);
        const wingAngle = Date.now() * 0.05 + this.id; const wingLength = this.size * 1.8;
        ctx.strokeStyle = CONFIG.COLORS.SPRITE_WING; ctx.lineWidth = this.isQueen ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-wingLength, Math.sin(wingAngle) * wingLength * 0.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-wingLength, -Math.sin(wingAngle) * wingLength * 0.5); ctx.stroke();
        ctx.fillStyle = this.color; ctx.shadowColor = this.color; ctx.shadowBlur = 15;
        ctx.beginPath(); ctx.ellipse(0, 0, this.size * 1.2, this.size, 0, 0, 2 * Math.PI); ctx.fill();
        ctx.shadowBlur = 0; ctx.restore();
    }
}

// --- SIMULATION LOGIC ---
function expandHive() {
    const builtCells = Object.values(grid).filter(c => c.state !== 'empty' && c.state !== 'constructing');
    if (builtCells.length === 0) return;
    const cell = builtCells[Math.floor(Math.random() * builtCells.length)];
    const neighbors = getNeighbors(cell.q, cell.r);
    for (const n of neighbors) { if (!grid[`${n.q},${n.r}`]) grid[`${n.q},${n.r}`] = new HexCell(n.q, n.r); }
}
function updateStats() {
    const cellCount = Object.keys(grid).length;
    const broodCount = Object.values(grid).filter(c => c.state === 'brood').length;
    statsDiv.innerHTML = `<p>Sprites: <span>${sprites.length}</span></p><p>Cells: <span>${cellCount}</span></p><p>Hive Energy: <span>${Math.floor(hiveEnergy)}</span></p><p>Brood: <span>${broodCount}</span></p>`;
}

// --- Cosmic Events Logic ---
function updateCosmicEvents(dt) {
    if (activeEvent.duration > 0) {
        activeEvent.duration -= dt;
        if (activeEvent.type === 'NEBULA_CLOUD' && nebula) {
            nebula.x += nebula.vx * dt;
        }
    } else {
        if (activeEvent.type !== 'none') {
            eventNotifier.style.opacity = '0';
            activeEvent.type = 'none';
            nebula = null;
        }
        if (Math.random() < CONFIG.EVENT_CHANCE) {
            triggerRandomEvent();
        }
    }

    // Update meteors visual
    meteors.forEach(m => { m.x += m.vx * dt; m.y += m.vy * dt; });
    meteors = meteors.filter(m => m.x > 0 && m.x < mainCanvas.width);
}

function triggerRandomEvent() {
    const events = ['METEOR_SHOWER', 'NEBULA_CLOUD'];
    activeEvent.type = events[Math.floor(Math.random() * events.length)];
    
    eventNotifier.textContent = activeEvent.type.replace('_', ' ');
    eventNotifier.style.opacity = '1';

    if (activeEvent.type === 'METEOR_SHOWER') {
        activeEvent.duration = 10; // 10 seconds
        for(let i=0; i<50; i++) meteors.push({x: Math.random() * mainCanvas.width, y: 0, vx: 500, vy: 500});
    } else if (activeEvent.type === 'NEBULA_CLOUD') {
        activeEvent.duration = 25; // 25 seconds
        nebula = {
            x: -200, y: mainCanvas.height / 2,
            radius: 200, vx: 30,
            colors: [
                {p:0, c: `rgba(${Math.random()*100+100}, 50, 150, 0)`},
                {p:0.5, c: `rgba(${Math.random()*100+100}, 50, 200, 0.3)`},
                {p:1, c: `rgba(${Math.random()*100+100}, 50, 255, 0)`},
            ]
        };
    }
}

function isPointInNebula(x, y) {
    if (!nebula) return false;
    const dx = x - nebula.x;
    const dy = y - nebula.y;
    return (dx * dx + dy * dy < nebula.radius * nebula.radius);
}


// --- DRAWING ---
function drawBackground() {
    bgCtx.fillStyle = '#050a10'; bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
    const parallaxFactorX = (mousePos.x / bgCanvas.width - 0.5) * 50;
    const parallaxFactorY = (mousePos.y / bgCanvas.height - 0.5) * 50;
    bgCtx.fillStyle = CONFIG.COLORS.STAR;
    stars.forEach(star => {
        const x = (star.x + parallaxFactorX * star.z) % bgCanvas.width;
        const y = (star.y + parallaxFactorY * star.z) % bgCanvas.height;
        bgCtx.beginPath(); bgCtx.arc(x < 0 ? x + bgCanvas.width : x, y < 0 ? y + bgCanvas.height : y, star.z, 0, 2 * Math.PI); bgCtx.fill();
    });
}
function drawEvents(ctx) {
    if (activeEvent.type === 'METEOR_SHOWER') {
        meteors.forEach(m => {
            ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.shadowColor='white'; ctx.shadowBlur=10;
            ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x-20, m.y-20); ctx.stroke();
            ctx.shadowBlur=0;
        });
    }
    if (nebula) {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
        nebula.colors.forEach(stop => gradient.addColorStop(stop.p, stop.c));
        ctx.fillStyle = gradient;
        ctx.beginPath(); ctx.arc(nebula.x, nebula.y, nebula.radius, 0, 2*Math.PI); ctx.fill();
    }
}

// --- MAIN LOOP ---
function gameLoop(timestamp) {
    const dt = Math.min(0.1, (timestamp - lastTime) / 1000); // Prevent large dt on tab switch
    lastTime = timestamp;

    updateCosmicEvents(dt);
    [...sprites, queen].forEach(b => b.update(dt));
    if (Math.random() < 0.1) expandHive();
    updateStats();

    mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    drawBackground();
    drawEvents(mainCtx);
    
    Object.values(grid).forEach(cell => cell.draw(mainCtx));
    [...sprites, queen].forEach(b => b.draw(mainCtx));

    requestAnimationFrame(gameLoop);
}

// --- INITIALIZATION ---
function setup() {
    const size = Math.min(window.innerWidth * 0.95, 1000);
    const container = document.getElementById('simulationContainer');
    container.style.width = `${size}px`;
    container.style.height = `${size * 0.6}px`;
    bgCanvas.width = mainCanvas.width = size;
    bgCanvas.height = mainCanvas.height = size * 0.6;
}
function init() {
    hiveEnergy = 100;
    grid = {};
    const centerCell = new HexCell(0, 0);
    centerCell.state = 'built';
    grid[centerCell.key] = centerCell;
    sprites = Array.from({ length: initialColonySize }, (_, i) => new Sprite(i));
    queen = new Sprite(999, true);
    stars = Array.from({ length: CONFIG.STAR_COUNT }, () => ({
        x: Math.random() * bgCanvas.width, y: Math.random() * bgCanvas.height, z: Math.random() * 1.5 + 0.5
    }));
    activeEvent = { type: 'none', duration: 0 };
    eventNotifier.style.opacity = '0';
    expandHive();
}

// --- EVENT LISTENERS ---
colonySizeSlider.addEventListener('input', e => { initialColonySize = parseInt(e.target.value); colonyValueSpan.textContent = initialColonySize; });
resourceSlider.addEventListener('input', e => { resourceAvailability = parseInt(e.target.value); resourceValueSpan.textContent = resourceAvailability; });
resetButton.addEventListener('click', init);
window.addEventListener('resize', () => { setup(); init(); });
document.addEventListener('mousemove', e => { const rect = bgCanvas.getBoundingClientRect(); mousePos.x = e.clientX - rect.left; mousePos.y = e.clientY - rect.top; });

// --- START ---
setup();
init();
lastTime = performance.now();
requestAnimationFrame(gameLoop);
