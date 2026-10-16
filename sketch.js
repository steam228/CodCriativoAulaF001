let readout;
let pg; // offscreen WEBGL canvas where the real 3D cube is rendered
let cols, rows, charW, lineH, fontPx;
const RAMP = " .:-=+*#%@";

// size the character grid to the screen and (re)build the offscreen render target
function layoutAscii() {
  fontPx = max(8, min(width, height) / 45);
  textFont("monospace");
  textSize(fontPx);
  charW = textWidth("M");
  lineH = fontPx * 1.1;
  cols = floor(width / charW);
  rows = floor(height / lineH);
  if (pg) pg.remove();
  pg = createGraphics(width, height, WEBGL);
  pg.pixelDensity(1);
  pg.angleMode(DEGREES);
  pg.noStroke();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  layoutAscii();
  noStroke();

  // angle readout is a plain HTML overlay above the canvas
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

  // 1) render the real 3D cube, full screen, into the offscreen buffer
  pg.push();
  pg.noLights();
  pg.background("#121358");
  pg.ambientLight(80);
  pg.directionalLight(255, 255, 255, 0.3, 0.5, -1);
  pg.rotateZ(-yaw);
  pg.rotateX(pitch);
  pg.rotateY(roll);
  pg.fill(255);
  pg.box(min(width, height) * 0.5);
  pg.pop();

  // 2) read that image back and turn each character cell into a symbol by brightness
  pg.loadPixels();
  background("#121358");
  fill("#36ADA3");
  textFont("monospace");
  textSize(fontPx);
  textAlign(LEFT, TOP);
  for (let y = 0; y < rows; y++) {
    const py = min(height - 1, floor(y * lineH + lineH / 2));
    let line = "";
    for (let x = 0; x < cols; x++) {
      const px = min(width - 1, floor(x * charW + charW / 2));
      const i = 4 * (py * width + px);
      const lum = (pg.pixels[i] + pg.pixels[i + 1] + pg.pixels[i + 2]) / 3 / 255;
      line += RAMP[floor(lum * (RAMP.length - 0.001))];
    }
    text(line, 0, y * lineH);
  }

  readout.html(
    "Pitch (X): " + nf(pitch, 1, 1) + "°<br>" +
    "Roll (Y): " + nf(roll, 1, 1) + "°<br>" +
    "Yaw (Z): " + nf(yaw, 1, 1) + "°"
  );
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  layoutAscii();
}

//#121358
//#232F72
//#2F578A
//#36ADA3
