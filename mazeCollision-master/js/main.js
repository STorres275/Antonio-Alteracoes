var canvas = document.getElementById('board'),
	ctx = canvas.getContext('2d');

var canvas2 = document.getElementById('preview'),
	ctx2 = canvas2.getContext('2d');

var canvas3 = document.getElementById('antonio'),
	ctx3 = canvas3.getContext('2d');

canvas.width = 400;
canvas.height = 400;
window.addEventListener('keydown', setInterval, false);
//callback function to move the game piece

canvas2.width = 400;
canvas2.height = 400;

canvas3.width = 400;
canvas3.height = 400;

var PIECE_RADIUS = 5; //all caps for constant
var BLOCK_SIZE = 10;
var SPEED = 2;
var POSX = 25;
var POSY = 20;
var img = new Image();
var img2 = new Image();
let key;

img2.onload = function () {
	ctx.drawImage(img2, 500, 500);
}
img2.src = "images/antonio.png";
document.onkeydown = function (e) {
	key = window.event ? e.keyCode : e.which;
}
setInterval(function () {

	if (key == 37) POSX -= 0.2;
	if (key == 38) POSY -=0.2;
	if (key == 39) POSX += 0.2;
	if (key == 40) POSY += 0.2;
	canvas.width = canvas.width;
	ctx.drawImage(img, POSX, POSY);
	ctx3.drawImage(img2, POSX+170, POSY+170);
}, 0);


function loadImages(callback) { //callback is a function
	img.src = "images/hack.png";
	img.onload = callback;
}




// function drawBoard(w,h,ctx){
// 	ctx.strokeStyle = "yellow";
// 	ctx.strokeRect(0,0, h * BLOCK_SIZE , w * BLOCK_SIZE );
// }

var piece = {
	x: POSX,
	y: POSY,
	radius: PIECE_RADIUS
}

function drawPiece(x, y, ctx) {

	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.arc(x, y, PIECE_RADIUS, 0, Math.PI * 2, 0);
	ctx.fill();
}

function drawMaze(ctx) {
	ctx.drawImage(img, 0, 0);
	ctx.drawImage(img2, 0, 0);
}

function winData(ctx) {
	var piecePadding = PIECE_RADIUS + 1;
	var winData = ctx.getImageData(piece.x - piecePadding, piece.y - piecePadding, piecePadding * 2, piecePadding * 2);
	return winData;
}

function imageData(ctx, ctx2) {
	ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
	preview = winData(ctx);
	// 	ctx2.putImageData(preview,0,0);	
}

function drawAll(ctx, ctx2) {
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawMaze(ctx);
	//drawBoard(40,40,ctx);
	drawPiece(piece.x, piece.y, ctx);
	imageData(ctx, ctx2);
}
function detectCollision(winData) {
	var topLeft = winData.data[0] == 0;
	var topRight = winData.data[44] == 0;
	var bottomLeft = winData.data[528] == 0;
	var bottomRight = winData.data[572] == 0;

	var colString = "";

	if (topLeft || topRight) {
		colString += "TOP";
		console.log('detected black TOP');
	}
	if (topRight || bottomRight) {
		colString += "RIGHT";
		console.log('detected black RIGHT')
	}
	if (topLeft || bottomLeft) {
		colString += "LEFT";
		console.log('detected black LEFT')
	}
	if (bottomRight || bottomLeft) {
		colString += "BOTTOM";
		console.log('detected black BOTTOM')
	}

	return colString;
}

function movePiece(e) {
	e.preventDefault();
	var collisions = detectCollision(winData(ctx));

	if (e.keyCode == 37 && collisions.indexOf("LEFT") < 0) {
		piece.x -= SPEED;
	}
	if (e.keyCode == 38 && collisions.indexOf("TOP") < 0) {
		piece.y -= SPEED;
	}
	if (e.keyCode == 39 && collisions.indexOf("RIGHT") < 0) {
		piece.x += SPEED;
	}
	if (e.keyCode == 40 && collisions.indexOf("BOTTOM") < 0) {
		piece.y += SPEED;
	}
	drawAll(ctx, ctx2);
}

loadImages(drawAll.bind(this, ctx, ctx2));
//passing a function into loadImages aka a callback function
//bind function so we can pass drawAll's parameter as well (ctx)
