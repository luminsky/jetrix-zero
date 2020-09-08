let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    scoreBoard = document.getElementById('score'),
    width = canvas.width = window.innerWidth,
    height = canvas.height = window.innerHeight,
    verticalPoints = Array(Math.round(height / 10)).fill(width);

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
      playerName = /*prompt('Your name?', '') ||*/ alphabet.toLowerCase();

function getRandomChar(array = alphabet)
{
    return array[Math.floor(Math.random() * array.length)];
}

function randomColor(red = 255, green = 255, blue = 255) {
    let r = Math.floor(Math.random() * red),
        g = Math.floor(Math.random() * green),
        b = Math.floor(Math.random() * blue);
    return `rgba(${r},${g},${b},1)`;
}

function playSoundWav(soundName = '', volume = 0.5) {
    let sound = new Audio();
    sound.src = 'src/audio/' + soundName + '.wav.';
    sound.volume = volume;
    sound.play().then(() => sound = null);
}

function screenFill() {
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, width, height);
}

function drawStars() {
    ctx.fillStyle = '#c10090';
    for (let x in verticalPoints) {
        // ctx.fillRect(verticalPoints[x], x * 10,10,5);
        ctx.fillText(getRandomChar(playerName), verticalPoints[x], x * 10);
        if (x >= width || x > 10000 * Math.random() -50) {
            verticalPoints[x] = width;
        } else {
            verticalPoints[x] -= 10;
        }
    }
}

setInterval(() => screenFill(), 17);
setInterval(() => drawStars(), 34);

let score = {
    value: 0,
    up: function(x = 10) {
        this.value += x;
        scoreBoard.textContent = this.value;
    },
    clear: function() {
        this.value = 0;
        scoreBoard.textContent = this.value;
    },
    spend: function() {
        if (this.value >= 100) {
            playSoundWav('select')
            this.value -= 100;
            scoreBoard.textContent = this.value;
            jet.turboBoost = true;
            setTimeout(() => jet.turboBoost = false, 10000)
        } else if (this.value >= 50) {
            playSoundWav('select')
            this.value -= 50;
            scoreBoard.textContent = this.value;
            jet.boost();
        } else {
            ctx.fillStyle = 'red';
            ctx.fillText('Not enough points', scoreBoard.offsetLeft-30, scoreBoard.offsetTop-5);
        }
    },
}

let jet = {
    x: 300,
    y: height / 2,
    w: 100,
    h: 50,
    color: '#0086a7',
    fireline: 'cyan',
    hitEnemy: function() {
        score.up();
        enemy.explode();
        enemyRespawn();
    },
    isCrossing: isCrossing,
    fire: function(x = this.x + 10, y = this.y) {
        function drawFlame() {
            ctx.fillStyle = '#fe0';
            ctx.fillText(getRandomChar('@<CcG'), x, y);
            ctx.fillText(getRandomChar('<c:*'), x+10, y-10);
            ctx.fillText(getRandomChar('<c:x'), x+10, y+10);
        }

        drawFlame();
        playSoundWav('lasershoot');

        if (this.turboBoost) {
            ctx.fillStyle = '#00cf00'
            for (x; x < width; x += 10) {
                ctx.fillText(getRandomChar('=-+:>'), x, y +10);
                ctx.fillText(getRandomChar('=-+:>'), x, y -10);
                if (enemy.isCrossing(x, y)) jet.hitEnemy()
            }
        } else {
            ctx.fillStyle = this.fireline;
            for (x; x < width; x += 10) {
                ctx.fillText(getRandomChar('=-+:>'), x, y);
                if (enemy.isCrossing(x, y)) jet.hitEnemy()
            }
        }
    },
    boost: function() {
        jet.color = randomColor()
    },
    turboBoost: false,
}
function isCrossing(x, y) {
    return (x >= this.x - this.w/2 && x <= this.x + this.w/2) &&
        (y >= this.y - this.h/2 && y <= this.y + this.h/2)
}

function Enemy() {
    this.y = Math.round(Math.random() * (height - 40)) + 20;
    this.x = width;
    this.w = 30;
    this.h = 30;
    this.speed = 5 + Math.trunc((score.value / 10) / 2);
    this.color = '#ff1a1a';
    this.isCrossing = isCrossing;
    this.doStep = function() {
        this.x -= this.speed;
        // this.y +=
        // (!Math.round(Math.random()*10)) && (this.y < height) ? Math.random()*100 || -Math.random()*100
        // : (this.y > 0) ? -Math.random()*100 : Math.random()*100

        if (enemy.x < 0) {
            score.clear();
            enemyRespawn();
        }
    }
    this.explode = function(x = this.x, y = this.y) {
        playSoundWav('explosion')
        ctx.fillStyle = 'gold'
        for (let i = 0; i < 20; i++) {
            ctx.fillText(getRandomChar(playerName), x -50 + Math.random() * 100, y -50 + Math.random() * 100)
        }
        ctx.fillStyle = 'red'
    }
}

let enemy = new Enemy();

function drawEnemy(chars) {

    drawPix(chars, enemy.color, enemy.x, enemy.y-10)
    drawPix(chars, enemy.color, enemy.x +10, enemy.y)
    drawPix(chars, enemy.color, enemy.x, enemy.y+10)
}

function drawJet(chars) {
    let x = jet.x
    let y = jet.y

    for (let i = 0, j = 0; i < 10; i++, j += 10) {
        if (i >= 8) drawPix(chars, '#00b7ff', x -j, y -30);
        if (i >= 5) drawPix(chars, '#009edd', x -j, y -20);
        drawPix(chars, '#005099', x -j, y -10);
        if (i >= 4) drawPix(chars, '#0076dd', x -j, y);
        drawPix(chars, '#005099', x -j, y +10);
        if (i >= 5) drawPix(chars, '#0064bc', x -j, y +20);
        if (i >= 8) drawPix(chars, '#003b72', x -j, y +30);
    }

    drawPix('>3', randomColor(),
        [jet.x -100, jet.x -100, jet.x -100, jet.x -100],
        [jet.y -20, jet.y -10, jet.y +10, jet.y +20]);
}

function drawPix(chars, color, x, y) {
    ctx.fillStyle = color;
    if (Number.isInteger(x) && Number.isInteger(y)) ctx.fillText(getRandomChar(chars), x, y);
    else for (let key in x) ctx.fillText(getRandomChar(chars), x[key], y[key]);
}

canvas.addEventListener('mousemove', (e) => {
    jet.x = (e.clientX/10).toFixed(0)*10;
    jet.y = (e.clientY/10).toFixed(0)*10;
})

function enemyRespawn() {enemy = new Enemy();}

setInterval(() => {
    enemy.doStep()
    drawEnemy('oDO0')
    drawJet('oDO0')

    if (jet.isCrossing(enemy.x, enemy.y)) {
        score.clear();
        enemy.explode();
        enemyRespawn();
    }
}, 17);

canvas.addEventListener('mousedown', () => jet.fire());
scoreBoard.onclick = () => score.spend();
