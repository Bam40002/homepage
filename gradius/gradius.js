/*
    Tremendously awful gradius clone
*/

// the game
let board;
let boardWidth = 320;
let boardHeight = 240;
let context;

let background;

// ship
let shipWidth = 32;
let shipHeight = 16;

// where to spawn
let shipX = boardWidth/2 - shipWidth;
let shipY = boardHeight/2;

let music = new Audio("./gradius/D_RUNNIN.ogg")

let gameover = false
let score = 0

let tick = 0


//Runs a route within byond, client or server side. Consider this "ehjax" for byond.
function runByond(uri) {
	window.location = uri;
}

// PLAYER

let ship

class PlayerShip {
    constructor(image = Image(), posx, posy, height, width) {
        this.height = height;
        this.width = width;
        this.x = posx;
        this.y = posy;
        this.image = image;
    }
    // fire da bullet
    fireBullet() {
        if (this.lastShoot + this.shootDelay > tick ) {
            return
        }

        var bullet = new Bullet(new Image(), this.x + this.width, this.y + this.height/2 -1)
        bullet.image.src = "./gradius/GRADBULL.png"
        bullet.image.onload = function() {
            context.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height)
        }
        bullets.push(bullet)

        this.lastShoot = tick;

        var sound = new Audio("./gradius/GRADFIRE.ogg")
        sound.volume = 0.5
        sound.play()
    }
    die() {
        // Game over man, game over
        if (gameover) {
            return
        }
        gameover = true

        this.image.src = ""

        music.pause();

        var sound = new Audio("./gradius/GRADFUCK.ogg")
        sound.volume = 0.5
        sound.play()

    }
}

//

// ENEMY

let enemies = []

class Enemy {
    constructor(image = Image(), posx, posy, height, width) {
        this.height = height;
        this.width = width;
        this.x = posx;
        this.y = posy;
        this.image = image;
        this.alive = true;
        this.scoreAmount = 100
    }
    think() {
        if (!this.alive) {
            return
        }
        this.x -= 2

        if (this.x <= 0 - this.width) {
            this.alive = false
        }
    }
    fireBullet() {
        if (!this.alive) {
            return
        }

        // Calculate direction vector towards the target
        var dx = ship.x - this.x;
        var dy = ship.y - this.y;
        var distance = Math.hypot(dx, dy);  // Distance between bullet and target

        var bullet = new EnemyBullet(new Image(), this.x + this.width/2, this.y + this.height/2)
        bullet.speedx = (dx / distance) * 2;
        bullet.speedy = (dy / distance) * 2;
        bullet.image.src = "./gradius/GRADBUE1.png"
        bullet.image.onload = function() {
            context.drawImage(bullet.image, bullet.x, bullet.y, bullet.width, bullet.height)
        }
        bullets.push(bullet)
    }
    die() {
        if (!this.alive) {
            return
        }

        score += this.scoreAmount


        this.alive = false
        this.image.src = ""

        // idk just place it nowhere
        this.x = -200
        this.y = -200

        var sound = new Audio("./gradius/GRADDIE.ogg")
        sound.volume = 0.5
        sound.play()

        var index = enemies.indexOf(Enemy);
        if (enemies > -1) { // only splice array when item is found
            enemies.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
}

function spawnEnemies(params) {
    var enem = new Enemy(new Image())
    enem.x = boardWidth + Math.floor(Math.random() * boardWidth)
    enem.y = Math.floor(Math.random() * (boardHeight-32));
    enem.height = 16
    enem.width = 14
    enem.image.src = "./gradius/GRADEN1.png"
    enem.image.onload = function() {
        context.drawImage(enem.image, enem.x, enem.y, enem.width, enem.height)
    }
    enemies.push(enem)
}

function enemyFireBullet() {
    enemies.forEach((item) => {
        item.fireBullet()
    });
}

//

// BULLETS

let bullets = []

class Bullet {
    constructor(image = Image(), posx, posy, height = 2, width = 8) {
        this.height = height;
        this.width = width;
        this.x = posx;
        this.y = posy;
        this.image = image;
        this.speedx = 3;
        this.speedy = 0;
        this.broke = false;
    }
    moveAndCollide() {
        if (this.broke) {
            return
        }
        this.x += this.speedx;
        this.y += this.speedy;

        if (this.x >= boardWidth) {
            this.break()
        }

        enemies.forEach((item) => {
            if (isCollide(this, item)) {
                item.die()
                this.break()
            }
        });
    }
    break(){
        this.broke = true
        this.image.src = ""
        var index = bullets.indexOf(Bullet);
        if (bullets > -1) { // only splice array when item is found
            bullets.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
}

class EnemyBullet {
    constructor(image = Image(), posx, posy, height = 4, width = 4, speedx = 1, speedy = 2) {
        this.height = height;
        this.width = width;
        this.x = posx;
        this.y = posy;
        this.image = image;
        this.speedx = speedx;
        this.speedy = speedy;
        this.broke = false;
    }
    moveAndCollide() {
        if (this.broke) {
            return
        }
        this.x += this.speedx;
        this.y += this.speedy;

        if (this.x >= boardWidth) {
            this.break()
        }

        if (isCollide(this, ship)) {
            ship.die()
            this.break()
        }
    }
    break(){
        this.broke = true
        this.image.src = ""
        var index = bullets.indexOf(Bullet);
        if (bullets > -1) { // only splice array when item is found
            bullets.splice(index, 1); // 2nd parameter means remove one item only
        }
    }
}

function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

//

// PARTICLE

let particles = []

class Particle {
    constructor(posx, posy) {
        this.x = posx;
        this.y = posy;
        this.speed;
    }
}

//

// MAP

let map

class Map {
    constructor(image = Image(), posx, posy, height, width) {
        this.height = height;
        this.width = width;
        this.x = posx;
        this.y = posy;
        this.image = image;
    }
}

//

// INTERFACE

let gameui

class UiInterface {
    constructor(image = Image(), posx, posy, height, width) {
        this.height = height;
        this.width = width;
        this.x = posx;
        this.y = posy;
        this.image = image;
    }
}

//

window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth*2;
    board.height = boardHeight*2;
    context = board.getContext("2d");
    context.scale(2,2)
    context.imageSmoothingEnabled = false;

    context.fillStyle = "black";
    context.fillRect(0, 224, boardWidth, 16)
}

let gameRunnning = false

function Game() {
    if(gameRunnning)
        return

    gameRunnning = true


    ship = new PlayerShip(new Image(), shipX, shipY, shipHeight, shipWidth)
    ship.image.src = "./gradius/SHIP.png"
    ship.image.onload = function() {
        context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height)
    }

    // the game map
    map = new Map(new Image(), 0, 0, 224, 4096)
    map.image.src = "./gradius/THELEVEL.png"
    map.image.onload = function() {
        context.drawImage(map.image, map.x, map.y, map.width, map.height)
    }

    // the game map
    gameui = new UiInterface(new Image(), 32, 224, 8, 256)
    gameui.image.src = "./gradius/WEPPAGE0.png"
    gameui.image.onload = function() {
        context.drawImage(gameui.image, gameui.x, gameui.y, gameui.width, gameui.height)
    }

    // populate particles
    for (let index = 0; index < 100; index++) {
        var part = new Particle()
        part.x = Math.floor(Math.random() * boardWidth)
        part.y = Math.floor(Math.random() * (boardHeight-16));
        part.speed = (Math.floor(Math.random() * 10) / 10);
        particles.push(part)
    }

    // enemy spawning loop
    setInterval(spawnEnemies, 2000)

    setInterval(enemyFireBullet, 500)

    music.volume = 0.4
    music.loop = true
    music.play();
    requestAnimationFrame(update)
}

// Keycodes
let right_arrow = 68;
let left_arrow = 65;
let up_arrow = 87;
let down_arrow = 83;
let space_bar = 32; // for powerups
let control_button = 32; // to shoot

// Shitty garbage
let right = false
let left = false
let up = false
let down = false
let control = false


let shipVelocity = {
    x : 0,
    y : 0
}

// Very stupd. Make this better in the future
// Dont know if there is a better way to do this. whatever I guess with a switch? welp!


// The fuck you mean keyCode is depecrated? 
// What am I supposed to do now :sob:
window.onkeydown= function(gfg){
    if (gameover) {
        if(gfg.keyCode === control_button){
            location.reload()
        }
        return
    }

    if(gfg.keyCode === right_arrow && !right){
        shipVelocity.x += 1
        right = true
    }
    else if(gfg.keyCode === left_arrow && !left){
        shipVelocity.x -= 1
        left = true
    }
    else if(gfg.keyCode === up_arrow && !up){
        shipVelocity.y -= 1
        up = true
    }
    else if(gfg.keyCode === down_arrow && !down){
        shipVelocity.y += 1
        down = true
    }
    else if(gfg.keyCode === control_button && !control){
        ship.fireBullet()
        control = true
    }
};

window.onkeyup= function(gfg){

    if (gameover) {
        return
    }

    if(gfg.keyCode === right_arrow && right){
        shipVelocity.x -= 1
        right = false
    }
    else if(gfg.keyCode === left_arrow && left){
        shipVelocity.x += 1
        left = false
    }
    else if(gfg.keyCode === up_arrow && up){
        shipVelocity.y += 1
        up = false
    }
    else if(gfg.keyCode === down_arrow && down){
        shipVelocity.y -= 1
        down = false
    }
    else if(gfg.keyCode === control_button && control){
        control = false
    }
};

// ticker for da game
function update() {
    requestAnimationFrame(update)
    tick++;

    // clear the board to allow for drawing new frames
    context.clearRect(0,0, board.width, board.height)

    context.fillStyle = "black";
    context.fillRect(0, 224, boardWidth, 16)

    // draw particles
    particles.forEach((item) => {
        item.x -= item.speed
        context.fillStyle = "white";
        context.fillRect(item.x, item.y, 1, 1)
        if (item.x <= 0) {
            item.x = boardWidth + 10
            item.y = Math.floor(Math.random() * (boardHeight-16));
        }
    });

    // Check if you are outside the board lol
    if (ship.y >= boardHeight-16-ship.height) {
        ship.y -= 1
    }
    if (ship.x >= boardWidth-ship.width){
        ship.x -= 1
    }
    if (ship.x <= 0) {
        ship.x += 1
    }
    if (ship.y <= 0) {
        ship.y += 1
    }

    // apply the velocity
    ship.y += shipVelocity.y
    ship.x += shipVelocity.x

    context.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height)


    // The level
    if (!gameover) {
        map.x -= 0.5
    }

    context.drawImage(map.image, map.x, map.y, map.width, map.height)

    // UI n shieet
    context.drawImage(gameui.image, gameui.x, gameui.y, gameui.width, gameui.height)

    //board.style.backgroundPosition.xpos -= 10

    //context.drawImage(board.style.backgroundImage)

    // enemies
    enemies.forEach((enem) => {
        enem.think()
        context.drawImage(enem.image, enem.x, enem.y, enem.width, enem.height)
    });


    // draw bullets
    bullets.forEach((item) => {
        item.moveAndCollide()
        context.drawImage(item.image, item.x, item.y, item.width, item.height)
    });

    context.fillStyle = "black";
    context.fillRect(0, 224, boardWidth, 16)

    context.drawImage(gameui.image, gameui.x, gameui.y, gameui.width, gameui.height)
}


