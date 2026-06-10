

const boardHeight = 1080
const boardWidth = 1920

let board
let context

let particles = []

window.onload = function() {
	board = document.getElementById("board");

	board.width = boardWidth*2;
	board.height = boardHeight*2;

	context = board.getContext("2d");
	context.imageSmoothingEnabled = false;

	PopulateParticles()

	setInterval(ProcessParticles, 1)
}

let particleHeight = 250
let possibleColors = [
	"#4e0000ff",
	"#004447ff",
	"#233030ff",
	"#014d01ff",
	"#5c5f02ff"
]

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
		//item[1] -= 5
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