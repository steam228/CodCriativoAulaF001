function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#121358");
  textSize(max(14, min(width, height) * 0.04));
  noStroke();

  // lock to portrait where the browser allows it (Android Chrome, fullscreen/PWA);
  // iOS ignores this, so the CSS rotate overlay covers it
  try {
    screen.orientation.lock("portrait").catch(() => {});
  } catch (e) {}

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
  // normalise to 0..1: phone sensors give roughly 0-10 m/s², mouse uses the screen
  let ax = accelerationX,
    ay = accelerationY,
    az = accelerationZ;
  let nx, ny, nz;
  if (ax === 0 && ay === 0 && az === 0) {
    nx = mouseX / width;
    ny = mouseY / height;
    nz = (mouseX + mouseY) / (width + height);
    ax = nx * 10;
    ay = ny * 10;
    az = nz * 10;
  } else {
    nx = constrain(abs(ax) / 10, 0, 1);
    ny = constrain(abs(ay) / 10, 0, 1);
    nz = constrain(abs(az) / 10, 0, 1);
  }
  // diameter scales with the screen: 20%..100% of the short side * 1.4
  const size = (n) => (0.2 + 0.8 * n) * min(width, height) * 1.4;
  ax = nf(ax, 1, 2);
  ay = nf(ay, 1, 2);
  az = nf(az, 1, 2);

  fill("#232F7280");
  ellipse(width / 2, height / 2, size(nx), size(ny));

  fill("#2F578A80");
  ellipse(width / 2, height / 2, size(ny), size(nz));

  fill("#36ADA380");
  ellipse(width / 2, height / 2, size(nz), size(nx));

  fill(255);
  const lh = textSize() * 1.5;
  text("Acceleration X: " + ax, 10, lh);
  text("Acceleration Y: " + ay, 10, lh * 2);
  text("Acceleration Z: " + az, 10, lh * 3);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//#121358
//#232F72
//#2F578A
//#36ADA3
