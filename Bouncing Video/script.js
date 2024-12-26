let ctx;
let cwidth;
let cheight;
let ballrad = 50;
let maskrad;
let ballx = 50;
let bally = 60;
let canvas1;
let ballvx = 2;
let ballvy = 4;
let v;
let videow;
let videoh;

function init() {
  canvas1 = document.getElementById("canvas");
  ctx = canvas1.getContext("2d");

  canvas1.width = window.innerWidth;
  cwidth = canvas1.width;
  canvas1.height = window.innerHeight;
  cheight = canvas1.height;

  v = document.getElementById("vid");

  const aspect = v.videoWidth / v.videoHeight;
  v.width = Math.min(v.videoWidth, 0.5 * cwidth);
  v.height = v.width / aspect;

  v.height = Math.min(v.height, 0.5 * cheight);
  v.width = aspect * v.height;

  window.onscroll = function () {
    window.scrollTo(0, 0);
  };

  videow = v.width;
  videoh = v.height;

  ballrad = Math.min(0.5 * videow, 0.5 * videoh);
  maskrad = 0.4 * Math.min(videow, videoh);

  ctx.lineWidth = ballrad;
  ctx.strokeStyle = "rgb(200,0,50)";
  ctx.fillStyle = "white"; //para pruebas
  v.play();
  setInterval(drawscene, 50);
}

function drawscene() {
  ctx.clearRect(0, 0, cwidth, cheight); //limpia todo el canvas
  checkPosition();

  ctx.drawImage(v, ballx, bally, videow, videoh); // dibuja un marco rectangular en el video
  ctx.beginPath();
  ctx.moveTo(ballx, bally);
  ctx.lineTo(ballx + videow + 2, bally);
  ctx.lineTo(ballx + videow + 2, bally + 0.5 * videoh + 2);

  ctx.lineTo(ballx + 0.5 * videow + ballrad, bally + 0.5 * videoh + 2);
  ctx.arc(ballx + 0.5 * videow, bally + 0.5 * videoh, ballrad, 0, Math.PI, true);
  ctx.lineTo(ballx, bally + 0.5 * videoh);
  ctx.lineTo(ballx, bally);
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.moveTo(ballx, bally + 0.5 * v.height);
  ctx.lineTo(ballx, bally + v.height);
  ctx.lineTo(ballx + videow + 2, bally + videoh);

  ctx.lineTo(ballx + videow + 2, bally + 0.5 * videoh - 2);
  ctx.lineTo(ballx + 0.5 * videow + ballrad, bally + 0.5 * videoh - 2);
  ctx.arc(ballx + 0.5 * videow, bally + 0.5 * videoh, ballrad, 0, Math.PI, false); // ojo con la variable videoh / videoHeight
  ctx.lineTo(ballx, bally + 0.5 * videoh);
  ctx.fill();
  ctx.closePath();

  ctx.strokeRect(0, 0, cwidth, cheight); //caja
}

function checkPosition() {
  let nballx = ballx + ballvx + 0.5 * videow; //horizontal coordinate of center, after next move
  let nbally = bally + ballvy + 0.5 * videoh; //vertical coordinate of center, after next move

  if (nballx > cwidth) {
    ballvx = -ballvx;
    nballx = cwidth;
  }
  if (nballx < 0) {
    nballx = 0;
    ballvx = -ballvx;
  }
  if (nbally > cheight) {
    nbally = cheight;
    ballvy = -ballvy;
  }
  if (nbally < 0) {
    nbally = 0;
    ballvy = -ballvy;
  }
  ballx = nballx - 0.5 * videow; //Realizar el movimiento ajustado, Horizontalmente
  bally = nbally - 0.5 * videoh; //Realizar el movimiento ajustado, verticalmente
}

function reverse() {
  ballvx = -ballvx;
  ballvy = -ballvy;
}

//109