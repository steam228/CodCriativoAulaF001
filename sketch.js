let readout;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background("#121358");
  noStroke();

  // WEBGL text needs a loaded font, so the angle readout is a plain HTML overlay
  readout = createDiv("");
  readout.position(10, 10);
  readout.style("color", "#fff");
  readout.style("font", "16px monospace");
  readout.style("pointer-events", "none");
  angleMode(DEGREES); // rotationX/Y/Z and cos() then work in degrees

  // lock to portrait where the browser allows it (Android Chrome, fullscreen/PWA);
  // iOS ignores this, so the CSS rotate overlay covers it
  try {
    screen.orientation.lock("portrait").catch(() => {});
  } catch (e) {}

  // iOS 13+ only gives orientation data after a tap (and only over HTTPS).
  // Android and desktop don't need this, so no button is shown there.
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    const btn = createButton("Tap to enable motion");
    btn.position(width / 2 - 100, height / 2 - 25);
    btn.size(200, 50);
    btn.style("font-size", "18px");
    btn.elt.addEventListener("click", () => {
      DeviceOrientationEvent.requestPermission()
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
  // p5 gives rotations in degrees: pitch (X) -180..180, roll (Y) -90..90, yaw (Z) 0..360
  let pitch = rotationX,
    roll = rotationY,
    yaw = rotationZ;
  if (pitch === 0 && roll === 0 && yaw === 0) {
    // desktop fallback: mouse drives the three angles
    pitch = map(mouseY, 0, height, -90, 90);
    roll = map(mouseX, 0, width, -90, 90);
    yaw = map(mouseX + mouseY, 0, width + height, 0, 360);
  }

  ambientLight(120);
  directionalLight(255, 255, 255, 0.3, 0.5, -1);

  // same order the browser defines device orientation: Z (alpha), X (beta), Y (gamma)
  rotateZ(-yaw);
  rotateX(pitch);
  rotateY(roll);

  fill("#36ADA3");
  box(min(width, height) * 0.5);

  readout.html(
    "Pitch (X): " + nf(pitch, 1, 1) + "°<br>" +
    "Roll (Y): " + nf(roll, 1, 1) + "°<br>" +
    "Yaw (Z): " + nf(yaw, 1, 1) + "°"
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//#121358
//#232F72
//#2F578A
//#36ADA3
