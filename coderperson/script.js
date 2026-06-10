
// general stuff
const boardHeight = 1080
const boardWidth = 1920

let board
let context

// particle definitions
let particles = []
let particleHeight = 250
let possibleColors = [
	"#4e0000ff",
	"#004447ff",
	"#233030ff",
	"#014d01ff",
	"#5c5f02ff"
]

// music
let music = new Audio("assets/VGPromo1.ogg")

function ToggleMusic() {
	if(music.paused)
		music.play()
	else
		music.pause()
}

function PlaySound(soundpath, volume) {
	let sound = new Audio(soundpath)
	sound.volume = volume
	sound.play()
}

window.onload = function() {
	music.volume = 0.3
	music.loop = true
	music.play()

	board = document.getElementById("board");

	board.width = boardWidth*2;
	board.height = boardHeight*2;

	context = board.getContext("2d");
	context.imageSmoothingEnabled = false;

	PopulateParticles()

	setInterval(ProcessParticles, 1)

	// we are finished. Kill the fucking LOADING SCREEN!!
	let loadingScreen = document.getElementById("loadingscreen")
	loadingScreen.style.animation = "fadein 1s"
	setTimeout(function() { loadingScreen.remove() }, 500);

	PlaySound("assets/WIN95_S.ogg", 0.3)
}

function PopulateParticles() {
	for (let index = 0; index < 100; index++) {
		var part = [0,0,0,""]
		part[0] = Math.floor(Math.random() * boardWidth)
		part[1] = Math.floor(Math.random() * (boardHeight+particleHeight +16));
		part[2] = Math.floor(Math.random() * (10)) + 1;
		part[3] = possibleColors[Math.floor(Math.random() * possibleColors.length)]
		particles.push(part)
	}
}

function ProcessParticles() {
	context.clearRect(0,0, board.width, board.height)

	particles.forEach((item) => {
		item[1] -= item[2]
		context.fillStyle = item[3];
		context.fillRect(item[0], item[1], 1, particleHeight)
		
		// if we are out of view randomize again
		if(item[1] < 0 - particleHeight)
		{
			item[0] = Math.floor(Math.random() * boardWidth)
			item[1] = boardHeight + particleHeight
			item[2] = Math.floor(Math.random() * (10)) + 1;
			item[3] = possibleColors[Math.floor(Math.random() * possibleColors.length)]
		}
	});
}