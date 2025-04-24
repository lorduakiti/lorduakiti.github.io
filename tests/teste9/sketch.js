/*=======================================================================
  This is an interactive project,
  - Single click to start the BGM;
  - Press Any key to Dive in Time;
  - ↑ and ↓ to mive up and down;
  - A summery woule be generated and auto-downloaded at the end
    - It should be a "txt" file named Dive in Time,
    - the file is SAFE
 Enjoy your journey!
=======================================================================*/

let temp1 = 0;

/*==========P5 Part===============*/
let BGM;
let individuals = []; // array to hold individual objects
let Exist = false;
let ProgressRate = 0;
let CanvasHeight = 400;
let TotalPopulation=0;
let KnownPopulation = 0;
let LastConnectedPopulation = 0;
let FrameRate = 30;
let ConnectedCount =0;
let inputbuffer = 0;
let tempinput = 9999;

let journey = [];
let sentences = [];

let TravelerColorID = 0;

let cnv;


/*================P5 Part=================*/
function preload(){
  BGM = loadSound("BGM.mp3");
}

function setup() {
  cnv = createCanvas(windowWidth, CanvasHeight);
  cnv.center();
  noStroke();
  //BGM.loop();
  BGM.setVolume(0.5);
  sentences.push("\n「Let life be beautiful like summer flowers and death like autumn leaves.」")
  sentences.push("\n「This life is the crossing of a sea, where we meet in the same narrow ship.\nIn death we reach the shore and go to our different worlds.」")
  sentences.push("\n「Some of us get dipped in flat, some in satin, some in gloss. But every once in a while you find someone who's iridescent, and when you do, nothing will ever compare.」")
  sentences.push("\n「I believe that all can hear\nEven anticipate discrete, I met the other their own\nSome can not grasp the moment\nLeft to the East to go West, the dead must not return to nowhere\nSee, I wear Zan Flowers on my head, in full bloom along the way all the way Frequently missed some, but also deeply moved by wind, frost, snow or rain.」")
  sentences.push("\n「If i should see you,after long year,\nHow should i greet,with tears,with silence.」")
  sentences.push("\n「Live a good life meet slowly.」")
  
  

}

function draw() {
  background(30);
  
  let t = frameCount / FrameRate; // update time
  frameRate(FrameRate);  
  let BornRate = 0.75;

  // create a individuals each frame according to bornrate
  if(random(1)<BornRate){
     individuals.push(new individual()); // append 
     if(Exist == true){
       TotalPopulation++;  //record population
     }
  }
    
  for(let i = 0;i<individuals.length;i++) {
    individuals[i].joinIndividuals(individuals.slice(i));
  }

  // loop through individuals with a for..of loop
  for (let people of individuals) {
    people.update(t); // update individual position
    people.display(t); // draw individual
  }
  
  //自己消失则进度归零
  if(Exist == false){
     ProgressRate=0;
     }
  
  
}

function mouseReleased() {
  if(!BGM.isPlaying()){
    BGM.loop();
  }else{
    if(Exist == false){
     let Meball = new individual();
      Meball.isMe = true;
      Meball.size = 20;
      individuals.push(Meball); // append
      Exist = true;
      TravelerColorID =  floor(Meball.initialB + Meball.initialG* 1000+ Meball.initialR*1000000);
  }
  }
}

function keyReleased(){
  if(keyCode != UP_ARROW && keyCode != DOWN_ARROW){
    if(Exist == false){
     let Meball = new individual();
      Meball.isMe = true;
      Meball.size = 20;
      individuals.push(Meball); // append
      Exist = true;
      TravelerColorID =  floor(Meball.initialB + Meball.initialG* 1000+ Meball.initialR*1000000);
  }
  }
  
}

// individual class
class individual{
  
  constructor(){
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 15);    
    this.initialR = random(0, 255);
    this.initialG = random(0, 255);
    this.initialB = random(0, 255);
    this.initialA = 255;
    this.FamiliarRGBA = [158, 110, 240,255];
    this.Familiar = false;
    this.AgeFactor = random(1,2);
    this.isMe = false;
    this.HorizontalSpeed = 2.5; //横向移动速度
    this.VerticalSpeed = 4;   //纵向移动速度
    this.CurrentHeight = CanvasHeight/2;
    this.isConnected = false;
    

    // radius of individual spiral
    // chosen so the individuals are uniformly spread out in area
    this.radius = sqrt(random(pow(CanvasHeight / 2, 2)));
    
  }  


  update(time){
    // x position follows a circle
    let w = 0.5; // angular speed
    let angle = w * time + this.initialangle;

  
    //console.log('tempresult:' + tempresult); 

    // different size individuals fall at slightly different y speeds
    if(this.isMe == false){
      this.posX += pow(this.size, 0.5);
      this.posY = CanvasHeight / 2 + this.radius * sin(angle);

    }else{
      //Controll your ball movement
      this.posX += this.HorizontalSpeed;

      
      if (keyIsDown(UP_ARROW) && this.CurrentHeight >=0){
            this.CurrentHeight-=this.VerticalSpeed;
        } else if (keyIsDown(DOWN_ARROW)&&this.CurrentHeight <= CanvasHeight) {
            this.CurrentHeight+=this.VerticalSpeed;
        }
      this.posY = this.CurrentHeight;
      ProgressRate = floor (this.posX / width * 100);
      
    }

    // delete individual if past end of screen
    if (this.posX > width) {
      if(this.isMe == true){
        Exist = false;
        //生成文件并保存
        journey.push("\nDear Travler No." + TravelerColorID +",\n\n  Good Morning, Good Afternoon and Good Evening.\n  Welcome to the end of the Time.");
        journey.push('\n  ·  During your journey, ' + TotalPopulation + ' travlers traveled with you. You are not alone. \n' );
        journey.push('  ·  You met ' + KnownPopulation + ' of them. No one else is like you.\n');
        journey.push('  ·  ' + this.CountLastKnown(individuals) + ' of them walked with you till the end. Life may always have regret, but the future is still good.');
        journey.push('\n  Whatever with the past has gone, the best is always yet to come.\n  Oh, and, Good Night :）\n====================================================================');
        temp1 = int(random(0,5));
        journey.push(sentences[temp1]);
        save(journey, "DiveInTime.txt");
        //console.log('Ever Connected:' + ConnectedCount);  //建立过的连接
        TotalPopulation= 0;
        KnownPopulation= 0;
        LastConnectedPopulation = 0;
        journey = [];
      }
      let index = individuals.indexOf(this);
      individuals.splice(index, 1);    
  }
  }
    

  display(time){
    let tempA = this.initialA-75*(sin(time*this.AgeFactor)+1);
    if(this.isMe == true){
      tempA = this.initialA;
      push();
          drawingContext.shadowColor = color(this.FamiliarRGBA);
          drawingContext.shadowBlur = 20;
          strokeWeight(3);
          stroke("yellow");
      ellipse(this.posX, this.posY, this.size); //stroke me
    pop();
    }
    if(this.Familiar == true&& this.isMe ==false){
      push();
       //fill(this.FamiliarRGBA);  //碰到的熟人变成蓝色
       drawingContext.shadowColor = color(this.FamiliarRGBA);
          drawingContext.shadowBlur = 20;
          strokeWeight(3);
          stroke("yellow");
      fill("white");
      ellipse(this.posX, this.posY, this.size);
    pop();
    }else{
      push();
      this.initialR += random([-5,5]);
      this.initialG += random([-5,5]);
      this.initialB += random([-5,5]);
      fill(this.initialR,this.initialG,this.initialB,tempA);  //陌生人逐渐变色
      ellipse(this.posX, this.posY, this.size);
    pop();
    }
  }

  joinIndividuals(individuals) {
    individuals.forEach(element =>{
      let dis = dist(this.posX,this.posY,element.posX,element.posY);
      if(dis<55) {
        if(this.isMe ==true){                //如果碰到我则连上不同颜色的线
          push();
          drawingContext.shadowColor = color(this.FamiliarRGBA);
          drawingContext.shadowBlur = 20;
          strokeWeight(3);
          stroke("yellow");
          if(element.Familiar == false){
             KnownPopulation ++;
             }
          element.Familiar = true;           //设置成熟人
        }else if(element.isMe ==true){
          push();
          drawingContext.shadowColor = color(this.FamiliarRGBA);
          drawingContext.shadowBlur = 20;
          strokeWeight(3);
          stroke("yellow");
           if(this.Familiar == false){
             KnownPopulation ++;
             }
          this.Familiar = true; 
        }else{                                //否则就是白线
          push();
          drawingContext.shadowColor = color("white");
          drawingContext.shadowBlur = 10;
          stroke('rgba(255,255,255,0.2)');
        }
        line(this.posX,this.posY,element.posX,element.posY);
        pop();
      }
    });
  }
  
  //计算最后的连接数量
  CountLastKnown(individuals) {
    individuals.forEach(element =>{
      let dis = dist(this.posX,this.posY,element.posX,element.posY);
      if(dis<55) {
        if(this.isMe ==true){                //
            LastConnectedPopulation++;     //
        }else if(element.isMe ==true){
            LastConnectedPopulation++;  
        }
      }
    });
      LastConnectedPopulation-=1;
      return LastConnectedPopulation;
  }
  
  
  //测试连线
  //self(individuals) {
   // individuals.forEach(element =>{
   //   let dis = dist(mouseX,mouseY,element.posX,element.posY);
   //   if(dis<55) {
   //     stroke('rgba(255,255,0,1)');
   //     line(mouseX,mouseY,element.posX,element.posY);
   //     element.Familiar = true;
   //   }
   // });
  //}
}