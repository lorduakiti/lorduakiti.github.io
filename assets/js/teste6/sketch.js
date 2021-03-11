let total = 300;
let lineRange = 30;
let ballList = new Array(); 
let fr = 30; //starting FPS

function setup() {

  // Sets the screen to be 600ixels wide and 600 pixels high
  createCanvas(600, 600);
  smooth(8);
  frameRate(fr);
  
  for(let i=0; i<total; i++) {
    ball = new Ball((random(100, width-100)),(random(100, height-100)), (random(1.0, 5.0)));
    ballList.push( ball );
  }

}

function draw() {
  background('#272727');
  
  for (let i=0; i<ballList.length; i++) {
    var b = ballList[i];
    b.move();
    b.display();
    for (let o=1; o<ballList.length; o++)
    {
      b2 = ballList[o];
      if (Math.abs((b.xPos - b2.xPos)) < lineRange && Math.abs((b.yPos - b2.yPos)) < lineRange)
      {
        strokeWeight(1);
        let newColor = lerpColor(color('#99FF99'), color('#009933'), Math.random(1));
        stroke(newColor);
        line(b.xPos, b.yPos, b2.xPos, b2.yPos);
      }
    }
  }
}

class Ball {
  constructor(_xOffSet, _yOffSet, _speed){
    this.theta = 0.0;
    this.speed;
    this.r = 75.0;
    this.x, this.y;
    this.xOffSet, this.yOffSet;
    this.xPos, this.yPos;
    this.clockWise;

    this.xOffSet = parseFloat(_xOffSet);
    this.yOffSet = parseFloat(_yOffSet);
    this.speed = parseFloat(_speed/100);
    this.clockWise = parseInt(random(2));
  }

  display(){
    fill ('#00FF00');
    noStroke();
    ellipse(this.xPos, this.yPos, 3, 3);
  }

  move(){
    this.xPos = parseFloat(this.x) + parseFloat(this.xOffSet);
    this.yPos = parseFloat(this.y) + parseFloat(this.yOffSet);
    this.x = this.r * Math.cos(this.theta);
    this.y = this.r * Math.sin(this.theta);
    
    if (this.clockWise == 1){
      this.theta += this.speed;
    } else {
      this.theta -= this.speed;
    }
  }
}