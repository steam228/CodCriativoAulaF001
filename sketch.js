function setup() {
  createCanvas(windowWidth, windowHeight);
  background(200, 14, 200);
}

function draw() {
  circle(mouseX, mouseY, 60);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
