// Animations p5.js
let unit = 14;
let dots = [];

function setup() {
  createCanvas(400, 400);

  for (let x = unit; x < width; x += unit) {
    for (let y = unit; y < height; y += unit) {
      dots.push(new Dot(x, y));
    }
  }
}

function draw() {
  background(0);
  for (let i = 0; i < dots.length; i++) {
    dots[i].pulse(0.1);
    dots[i].display();
  }
}

class Dot {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 10);
    this.color = random(255);
    this.offset = random(1000);
  }

  display() {
    ellipse(this.x, this.y, this.size, this.size);
    fill(this.color);
    noStroke();
  }

  pulse(speed) {
    let minSize = unit/2;
    let maxSize = unit;
    this.size = map(sin((frameCount + this.offset) * speed), -1.0, 1.0, minSize, maxSize);
  }
}