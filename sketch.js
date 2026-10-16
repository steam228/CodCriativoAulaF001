function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#121358");
  textSize(20);
  noStroke();

  // iOS 13+ only gives motion data after a tap (and only over HTTPS).
  // Android and desktop don't need this, so no button is shown there.
  if (
    typeof DeviceMotionEvent !== "undefined" &&
    typeof DeviceMotionEvent.requestPermission === "function"
  ) {
    const btn = createButton("Tap to enable motion");
    btn.position(width / 2 - 100, height / 2 - 25);
    btn.size(200, 50);
    btn.style("font-size", "18px");
    btn.elt.addEventListener("click", () => {
      DeviceMotionEvent.requestPermission()
        .then((state) => {
          if (state === "granted") btn.remove();
          else btn.html("Motion denied - reload to retry");
        })
        .catch(console.error);
    });
  }
}

function draw() {
  background("#121358");
  // sensor values on a phone; mouse fallback on desktop
  let ax = accelerationX,
    ay = accelerationY,
    az = accelerationZ;
  if (ax === 0 && ay === 0 && az === 0) {
    ax = map(mouseX, 0, width, 0, 300);
    ay = map(mouseY, 0, height, 0, 300);
    az = map(mouseX + mouseY, 0, width + height, 0, 300);
  }

  fill("#232F7280");
  ellipse(width / 2, height / 2, ax * 1.7, ay * 1.7);

  fill("#2F578A80");
  ellipse(width / 2, height / 2, ay * 1.7, az * 1.7);

  fill("#36ADA380");
  ellipse(width / 2, height / 2, az * 1.7, ax * 1.7);

  fill(255);
  text("Acceleration X: " + ax, 10, 30);
  text("Acceleration Y: " + ay, 10, 60);
  text("Acceleration Z: " + az, 10, 90);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//#121358
//#232F72
//#2F578A
//#36ADA3
