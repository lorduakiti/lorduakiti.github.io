class Particle{
	constructor(args){
		let def = {
			p: createVector(0,0),
			v: p5.Vector.random2D().mult(1),
			a: createVector(0,0),
			r: random(2,8),
			live: int(random(5,20)),
			xsinMult: random(1,2),
			generation: 0,
			// color: random(colors1),
			colors: random([colors1,colors2])
		}
		Object.assign(def,args)
		Object.assign(this,def)
		this.color = random(this.colors)
	}
	update(){
		this.p.add(this.v)
		this.live--
		this.v.x+=sin(this.p.x/this.xsinMult)
		this.v.y+=sin(this.p.y/20)/10
		if (this.live==0 && this.generation<5){

          particles.push(new Particle({
              p: this.p.copy(),
              v: this.v.copy().rotate(random(-0.8,0.8)),
              generation: this.generation++,
              colors: (random()<0.8)?this.colors:random([colors1,colors2])
          }))

          if (random()<0.05){
              push()	
              translate(this.p.x,this.p.y)
              stroke(255)
              noFill()
              strokeWeight(2)
              ellipse(0,0,15,15)
              for(var i=0;i<2*PI;i+=PI/10){
                  push()
                  rotate(i)
                  line(15,0,15+random([0,5,10]),0)
                  pop()
              }
              if (random()<0.1){
                  ellipse(0,0,80,80)
              }
              pop()
          }
		}
		this.r*=0.98
		this.v.mult(0.999)
	}
	draw(){
		push()
			translate(this.p.x,this.p.y)
			noStroke()
			let c = color(this.color)
			c.setAlpha(255)
			fill(c)
			ellipse(0,0,this.r,this.r)
			blendMode(SCREEN)
			c.setAlpha(5)
			fill(c)
			ellipse(0,0,this.r*3,this.r*3)
		pop()
	}
}

var particles = []
var pulse

var colors1 = "c6d8ff-71a9f7-6b5ca5-72195a-4c1036".split("-").map(a=>"#"+a)
var colors2 = "00a878-d8f1a0-f3c178-fe5e41".split("-").map(a=>"#"+a)

function setup() {
	pixelDensity(2)
	createCanvas(500,500);
	background(100)
	fill("#020721");
	rect(0,0,width,height)
	for(var x=0;x<width;x+=20){
		for(var y=0;y<height;y+=20){
			fill(255,100)
			noStroke()
			// ellipse(x,y,2,2)
			if (x%160==0 && y%160==0 && random()<0.5){
				ellipse(x,y,4,4)
				
				particles.push(new Particle({
					p: createVector(x,y),
					v: p5.Vector.random2D().mult(random(2,3)),
					live: int(random(5,40)),
					colors: colors2
				}))
			}
		}
	}
}

function draw() {
  background(0, 0, 0, 5)
  particles.forEach(p=>{
      p.draw()
      p.update()
  })
  particles = particles.filter(p=>p.live>-200)
}

function mousePressed(){
		particles.push(new Particle({
			p: createVector(mouseX,mouseY),
			v: p5.Vector.random2D().mult(random(1,3)),
			live: int(random(5,20)),
			colors: colors2
		}))
}
