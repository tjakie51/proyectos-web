let ctx;
let canvas1;
const stuff = [];
let thingInMotion;
let offsetx;
let offsety;
let tid;
let savedgco;
const images = [];
const videotext1 =
  '<video id="XXXX"  preload="auto" loop="loop" autoplay muted controls> <source src="XXXX.webm" type=\'video/webm; codecs="vp8, vorbis"\'> ';
const videotext2 =
  '<source src="XXXX.mp4" type=\'video/mp4; codecs="avc1.42E01E, mp4a.40.2"\'> <source src="XXXX.ogv" type=\'video/ogg; codecs="theora, vorbis"\'>';
const videotext3 = "Your browser does not accept the video tag.</video>";
function restart(ev) {
  const v = ev.target;
  v.currentTime = 0;
  v.play();
}
let videocount = 0;
let okaytogo = false;
function videoloaded(ev) {
  ctx.fillText(ev.target.id + " loaded.", 400, 100 * videocount);

  ev.target.play();
  videocount--;
  if (videocount == 0) {
    okaytogo = true;
  }
}
let textmsg = "Loading videos";
function init() {
  canvas1 = document.getElementById("canvas");
  canvas1.onmousedown = function () {
    return false;
  }; //prevents change of cursor to default

  canvas1.addEventListener("dblclick", makenewitem, false);
  canvas1.addEventListener("mousedown", startdragging, false);
  ctx = canvas1.getContext("2d");
  savedgco = ctx.globalCompositeOperation;
  createelements();
  drawstuff();
  ctx.fillText(textmsg, 100, 100);
  loadid = setInterval(loading, 2000);
  ctx.strokeStyle = "blue";
}
function loading() {
  if (okaytogo) {
    clearInterval(loadid);
    tid = setInterval(drawstuff, 40);
  } else {
    textmsg += ".";
    ctx.fillText(textmsg, 100, 100);
  }
}

function createelements() {
  let name;
  let i;
  let type;
  let divelement;
  let videomarkup;
  let velref;

  let vb;
  let imgdummy;
  let pic;

  for (i = 0; i < mediainfo.length; i++) {
    type = mediainfo[i].shift(); //removes 1st element from array
    info = mediainfo[i];

    switch (type) {
      case "video":
        videocount++;
        name = info[0];
        divelement = document.createElement("div");
        videomarkup = videotext1 + videotext2 + videotext3;
        videomarkup = videomarkup.replace(/XXXX/g, name);
        divelement.innerHTML = videomarkup;
        document.body.appendChild(divelement);
        velref = document.getElementById(name);
        velref.addEventListener("ended", restart, false);
        velref.addEventListener("loadeddata", videoloaded, false);
        vb = new Videoblock(info[2], info[3], info[4], info[5], info[6], info[7], info[8], velref, info[9], info[1]);
        stuff.push(vb);
        break;
      case "picture":
        imgdummy = new Image();
        imgdummy.src = info[4];
        images.push(imgdummy);
        stuff.push(new Picture(info[0], info[1], info[2], info[3], images[images.length - 1]));

        break;
      case "heart":
        stuff.push(new Heart(info[0], info[1], info[2], info[3], info[4]));
        break;
      case "oval":
        stuff.push(new Oval(info[0], info[1], info[2], info[3], info[4], info[5]));
        break;
      case "rect":
        stuff.push(new Rect(info[0], info[1], info[2], info[3], info[4]));
        break;
    }
  }
}

function distsq(x1, y1, x2, y2) {
  //done to avoid taking square roots
  const xd = x1 - x2;
  const yd = y1 - y2;
  return xd * xd + yd * yd;
}
function Videoblock(sx, sy, x, y, w, h, scale, videoel, volume, angle) {
  this.sx = sx;
  this.sy = sy;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.videoelement = videoel;
  this.volume = volume;
  this.draw = drawvideo;
  this.overcheck = overvideo; //need more complex checking because of angle and scale
  this.angle = angle;
  this.cosine = Math.cos(angle);
  this.sine = Math.sin(angle);
  this.scale = scale;
  videoel.volume = 0;
  this.videoelement.play();
}
function overvideo(mx, my) {
  //need to add code to check in rotation case and scaling
  omx = mx;
  omy = my;

  if (this.angle != 0) {
    omx = omx - this.x;
    omy = omy - this.y;
    mx = omx * this.cosine + omy * this.sine;
    my = -omx * this.sine + omy * this.cosine;
    mx = this.x + mx;
    my = this.y + my;
  }
  if (this.scale != 1) {
    //alert("prescaling mx is "+mx+" prescaling my is "+my);
    mx = mx / this.scale;
    my = my / this.scale;
    //alert("post scaling mx is "+mx+" post scaling my is "+my);
  }

  if (mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h) {
    return true;
  } else {
    return false;
  }
}

function drawvideo() {
  const savedalpha = ctx.globalAlpha;
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = this.alpha;
  if (this.angle != 0) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.translate(-this.x, -this.y);
    if (this.scale != 1) {
      ctx.scale(this.scale, this.scale);
    }
    ctx.drawImage(this.videoelement, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);

    ctx.restore();
  } else {
    if (this.scale != 1) {
      ctx.save();
      ctx.scale(this.scale, this.scale);

      ctx.drawImage(this.videoelement, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);

      ctx.restore();
    } else {
      ctx.drawImage(this.videoelement, this.sx, this.sy, this.w, this.h, this.x, this.y, this.w, this.h);
    }
  }
  ctx.globalAlpha = savedalpha;
  ctx.globalCompositeOperation = savedgco;
}

function Picture(x, y, w, h, imagename) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.imagename = imagename;
  this.draw = drawpic;
  this.overcheck = overrect;
}
function Heart(x, y, h, drx, color) {
  this.x = x;
  this.y = y;
  this.h = h;
  this.drx = drx;
  this.radsq = drx * drx;
  this.color = color;
  this.draw = drawheart;
  this.overcheck = overheart;
  this.ang = 0.25 * Math.PI;
}
function drawheart() {
  const leftctrx = this.x - this.drx;
  const rightctrx = this.x + this.drx;
  const cx = rightctrx + this.drx * Math.cos(this.ang);
  const cy = this.y + this.drx * Math.sin(this.ang);
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.arc(leftctrx, this.y, this.drx, 0, Math.PI - this.ang, true);
  ctx.lineTo(this.x, this.y + this.h);
  ctx.lineTo(cx, cy);
  ctx.arc(rightctrx, this.y, this.drx, this.ang, Math.PI, true);
  ctx.closePath();
  ctx.fill();
}
function overheart(mx, my) {
  const leftctrx = this.x - this.drx;
  const rightctrx = this.x + this.drx;
  const qx = this.x - 2 * this.drx;
  const qy = this.y - this.drx;
  const qwidth = 4 * this.drx;
  const qheight = this.drx + this.h;

  //quick test if it is in bounding rectangle
  if (outside(qx, qy, qwidth, qheight, mx, my)) {
    return false;
  }
  //compare to two centers

  if (distsq(mx, my, leftctrx, this.y) < this.radsq) return true;
  if (distsq(mx, my, rightctrx, this.y) < this.radsq) return true;
  // if outside of circles AND less than equal to y, return false
  if (my <= this.y) return false;

  // compare to each slope
  const x2 = this.x;
  const y2 = this.y + this.h;
  let m = this.h / (2 * this.drx);
  // left side
  if (mx <= this.x) {
    if (my < m * (mx - x2) + y2) {
      return true;
    } else {
      return false;
    }
  } else {
    m = -m;

    if (my < m * (mx - x2) + y2) {
      return true;
    } else return false;
  }
}
function outside(x, y, w, h, mx, my) {
  return mx < x || mx > x + w || my < y || my > y + h;
}

function drawpic() {
  ctx.globalAlpha = 1.0;
  ctx.drawImage(this.imagename, this.x, this.y, this.w, this.h);
}
function Oval(x, y, r, hor, ver, c) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.radsq = r * r;
  this.hor = hor;
  this.ver = ver;
  this.draw = drawoval;
  this.color = c;
  this.overcheck = overoval;
}
function drawoval() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.scale(this.hor, this.ver);
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(0, 0, this.r, 0, 2 * Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function Rect(x, y, w, h, c) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.draw = drawrect;
  this.color = c;
  this.overcheck = overrect;
}
function overoval(mx, my) {
  //computes positions in the translated and scaled coordinate system
  const x1 = 0; //this is this.x - this.x
  const y1 = 0;
  const x2 = (mx - this.x) / this.hor;
  const y2 = (my - this.y) / this.ver;
  if (distsq(x1, y1, x2, y2) <= this.radsq) {
    return true;
  } else {
    return false;
  }
}
function overrect(mx, my) {
  if (mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h) {
    return true;
  } else {
    return false;
  }
}
function makenewitem(ev) {
  let mx;
  let my;
  if (ev.layerX || ev.layerX == 0) {
    // Firefox, ???
    mx = ev.layerX;
    my = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera, ???
    mx = ev.offsetX;
    my = ev.offsetY;
  }
  const endpt = stuff.length - 1;
  let item;
  for (let i = endpt; i >= 0; i--) {
    //reverse order
    if (stuff[i].overcheck(mx, my)) {
      item = clone(stuff[i]);
      item.x += 20;
      item.y += 20;
      stuff.push(item);
      break;
    }
  }
}
function clone(obj) {
  const item = new Object();
  for (const info in obj) {
    item[info] = obj[info];
  }
  return item;
}
function startdragging(ev) {
  let mx;
  let my;
  if (ev.layerX || ev.layerX == 0) {
    // Firefox, ???
    mx = ev.layerX;
    my = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera, ???
    mx = ev.offsetX;
    my = ev.offsetY;
  }
  const endpt = stuff.length - 1;
  for (let i = endpt; i >= 0; i--) {
    //reverse order
    if (stuff[i].overcheck(mx, my)) {
      offsetx = mx - stuff[i].x;
      offsety = my - stuff[i].y;
      //move this item on top
      const item = stuff[i];
      thingInMotion = stuff.length - 1;
      stuff.splice(i, 1);
      stuff.push(item);
      canvas1.style.cursor = "pointer"; // change to finger when dragging
      canvas1.addEventListener("mousemove", moveit, false);
      canvas1.addEventListener("mouseup", dropit, false);
      break;
    }
  }
}
function dropit(ev) {
  canvas1.removeEventListener("mousemove", moveit, false);
  canvas1.removeEventListener("mouseup", dropit, false);
  canvas1.style.cursor = "crosshair"; //change back to crosshair
}
function moveit(ev) {
  let mx;
  let my;
  if (ev.layerX || ev.layerX == 0) {
    // Firefox, ???
    mx = ev.layerX;
    my = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // Opera, ???
    mx = ev.offsetX;
    my = ev.offsetY;
  }
  stuff[thingInMotion].x = mx - offsetx; //adjust for flypaper dragging
  stuff[thingInMotion].y = my - offsety;
}

function drawstuff() {
  ctx.clearRect(0, 0, 800, 600);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, 800, 600);
  for (let i = 0; i < stuff.length; i++) {
    stuff[i].draw();
  }
}

function drawrect() {
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

function saveasimage() {
  try {
    window.open(canvas1.toDataURL("image/png"));
  } catch (err) {
    alert("You need to change browsers AND/OR upload the file to a server.");
  }
}

function removeobj() {
  stuff.pop();
  drawstuff();
}
