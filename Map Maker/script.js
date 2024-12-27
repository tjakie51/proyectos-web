const locations = [
  [51.534467, -0.121631, "Springer Nature (Apress Publishers) London, UK"],
  [41.04796, -73.70539, "Purchase College/SUNY, NY, USA"],
  [35.085136, 135.776585, "Kyoto, Japan"],
];

let positionopts;
positionopts = {
  enableHighAccuracy: true,
};

let candiv;
let can;
let ctx;
let pl;

function init() {
  let mylat = 0;
  let mylong = 0;
  candiv = document.createElement("div");
  candiv.innerHTML = "<canvas id='canvas' width='600' height='400'>No canvas </canvas>";
  document.body.appendChild(candiv);
  can = document.getElementById("canvas");
  pl = document.getElementById("place");
  ctx = can.getContext("2d");
  can.onmousedown = function () {
    return false;
  }; //prevents change of cursor to default
  can.addEventListener("mousemove", showshadow);
  can.addEventListener("mousedown", pushcanvasunder);
  can.addEventListener("mouseout", clearshadow);
  mylat = locations[1][0];
  mylong = locations[1][1];
  document.getElementById("first").checked = "checked";
  makemap(mylat, mylong);
}
function pushcanvasunder(ev) {
  can.style.zIndex = 1;
  pl.style.zIndex = 100;
}

function clearshadow(ev) {
  ctx.clearRect(0, 0, 600, 400);
}

function showshadow(ev) {
  let mx;
  let my;
  if (ev.layerX || ev.layerX == 0) {
    // Necessary for older browsers
    mx = ev.layerX;
    my = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) {
    // works with current browsers
    mx = ev.offsetX;
    my = ev.offsetY;
  }
  can.style.cursor = "url('light.gif'), pointer"; // change to finger when dragging
  //rough correction to make center of light
  mx = mx + 10;
  my = my + 12;
  drawshadowmask(mx, my);
}
const canvasAx = 0;
const canvasAy = 0;
const canvasBx = 600;
const canvasBy = 0;
const canvasCx = 600;
const canvasCy = 400;
const canvasDx = 0;
const canvasDy = 400;
const holerad = 50;
const grayshadow = "rgba(250,250,250,.8)";
function drawshadowmask(mx, my) {
  ctx.clearRect(0, 0, 600, 400);
  ctx.fillStyle = grayshadow;
  ctx.beginPath();
  ctx.moveTo(canvasAx, canvasAy);
  ctx.lineTo(canvasBx, canvasBy);
  ctx.lineTo(canvasBx, my);
  ctx.lineTo(mx + holerad, my);
  ctx.arc(mx, my, holerad, 0, Math.PI, true);
  ctx.lineTo(canvasAx, my);
  ctx.lineTo(canvasAx, canvasAy);
  ctx.closePath();
  ctx.fill();
  //ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(canvasAx, my);
  ctx.lineTo(canvasDx, canvasDy);
  ctx.lineTo(canvasCx, canvasCy);
  ctx.lineTo(canvasBx, my);
  ctx.lineTo(mx + holerad, my);
  ctx.arc(mx, my, holerad, 0, Math.PI, false);
  ctx.lineTo(canvasAx, my);
  ctx.closePath();
  ctx.fill();
  // ctx.stroke();
}

let listener;
let map;
const markersArray = [];
let blatlng;
let myOptions;

const rxmarker = "Images/rx1.png";
const bxmarker = "Images/bx1.png";
function makemap(mylat, mylong) {
  let marker;
  blatlng = new google.maps.LatLng(mylat, mylong);
  // alert("latlng is "+latlng);
  myOptions = {
    zoom: 12,
    center: blatlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    //disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById("place"), myOptions);
  //mark center
  marker = new google.maps.Marker({
    position: blatlng,
    title: "center",
    icon: rxmarker,
    map: map,
  });

  //
  listener = google.maps.event.addListener(map, "mouseup", function (event) {
    checkit(event.latLng);
  });
}
function checkit(clatlng) {
  let distance = dist(clatlng, blatlng);
  //distance = Math.floor((distance+.005)*100)/100;
  distance = round(distance, 2);
  const distanceString = String(distance) + " km";
  marker = new google.maps.Marker({
    position: clatlng,
    title: distanceString,
    icon: bxmarker,
    map: map,
  });
  markersArray.push(marker);
  let clat = clatlng.lat();
  let clng = clatlng.lng();
  clat = round(clat, 4);
  clng = round(clng, 4);

  document.getElementById("answer").innerHTML =
    "The distance from base to most recent marker (" + clat + ", " + clng + ") is " + String(distance) + " miles.";
  //change miles to km depending on value used for R in the dist function.
  can.style.zIndex = 100;
  pl.style.zIndex = 1;
}
function round(num, places) {
  const factor = Math.pow(10, places);
  const increment = 5 / (factor * 10);
  return Math.floor((num + increment) * factor) / factor;
}

function dist(point1, point2) {
  //spherical law of cosines
  //var R = 6371; // km  Need to make sure message syncs.
  const R = 3959; // miles
  const lat1 = (point1.lat() * Math.PI) / 180;
  const lat2 = (point2.lat() * Math.PI) / 180;
  const lon1 = (point1.lng() * Math.PI) / 180;
  const lon2 = (point2.lng() * Math.PI) / 180;

  const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)) * R;
  return d;
}

function changebase() {
  let mylat;
  let mylong;
  for (let i = 0; i < locations.length; i++) {
    if (document.f.loc[i].checked) {
      mylat = locations[i][0];
      mylong = locations[i][1];
      makemap(mylat, mylong);
      document.getElementById("header").innerHTML = "Base location (small red x) is " + locations[i][2];
    }
  }

  return false;
}
