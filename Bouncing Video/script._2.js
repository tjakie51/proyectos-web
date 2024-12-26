let ctx;
let cwidth;
let cheight;
let ballrad = 50;
let ballx = 80;
let bally = 80;
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
  window.onscroll = function () {
    window.scrollTo(0, 0);
  };
  v = document.getElementById("vid");

  const aspect = v.videoWidth / v.videoHeight;
  v.width = Math.min(v.videoWidth, 0.5 * cwidth);
  v.height = v.width / aspect;
  v.height = Math.min(v.height, 0.5 * cheight);
  v.width = aspect * v.height;
  videow = v.width;
  videoh = v.height;

  amt = 0.5 * Math.min(videow, videoh);
  amtS = String(amt) + "px";
  v.style.clipPath = "circle(" + amtS + " at center)";
  ballrad = Math.min(0.2 * videow, 0.2 * videoh);

  ctx.lineWidth = ballrad;

  ctx.strokeStyle = "rgba(0, 100, 200, 0.95)";
  ctx.fillStyle = "white";

  v.style.left = String(ballx) + " px";
  v.style.top = String(bally) + "px";
  v.play();
  v.style.visibility = "visible";
  v.style.display = "block";
  ctx.strokeRect(0, 0, cwidth, cheight); //la caja roja
  setInterval(moveVideo, 50);
}

function moveVideo() {
  checkPosition();
  v.style.left = String(ballx) + "px";
  v.style.top = String(bally) + "px";
}

function checkPosition() {
  //var nballx = ballx + ballvx;
  //var nbally = bally + ballvy;

  let nballx = ballx + ballvx;
  let nbally = bally + ballvy;

  if (nballx + videow > cwidth) {
    ballvx = -ballvx;
    nballx = cwidth - videow;
  }
  if (nballx < 0) {
    nballx = 0;
    ballvx = -ballvx;
  }
  if (nbally + videoh > cheight) {
    nbally = cheight - videoh;
    ballvy = -ballvy;
  }
  if (nbally < 0) {
    nbally = 0;
    ballvy = -ballvy;
  }
  ballx = nballx;
  bally = nbally;
}

function reverse() {
  ballvx = -ballvx;
  ballvy = -ballvy;
}
