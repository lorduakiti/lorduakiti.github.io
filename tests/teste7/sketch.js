/* jshint esversion: 8 */
let start_word;
let word_arr = [];
let word_list = [];
let word_dict = {};
let impulse_arr = [];
let next_list = [];
let prev_list = [];
let promise_arr = [];
let font;
const level_incr = 300;
const max_levels = 6;
//let camera_x = 0;
//let camera_y = 0;
//let camera_z = 0;
//const camera_speed = 8;
//let slider_x, slider_y, slider_z;
let button, input_box, message;
let started = false;
let frameOffset;

p5.disableFriendlyErrors = true;

//class for visual connection between immediate synonyms
class Impulse {
  constructor(start_x, start_y, target) {
    
    this.completed = false;
    this.x = start_x;
    this.y = start_y;
    this.target = target;
    this.circle_arr = []
  }
  
  draw() {
    
    
    const angle = atan2(this.target.y-this.y,this.target.x - this.x);
    this.x += 10 * cos(angle);
    this.y += 10 * sin(angle);
    this.circle_arr.push({x:this.x, y:this.y})
    for (let i = 0; i < this.circle_arr.length; i++) {
    //for (let circ of this.circle_arr) {
      let alpha = Math.floor(map(i, 10, 0, 255, 0))
      fill(171,32,253,alpha);
      stroke(32,5,137,alpha);
      circle(this.circle_arr[i].x,this.circle_arr[i].y,10);
    }
    if (this.circle_arr.length > 10) {
      this.circle_arr.shift()
    }
    //end if near target
    if (dist(this.x, this.y, this.target.x, this.target.y) < 5) {
      this.completed = true;
      this.target.tagged()
    }  
  }  
}

//class for displaying and moving words as well as establishing connections between synonyms 
class Word {
  constructor(word, r, angle, direction) {
    //initial setup of position and rotation of word
    this.r = r + random(r*0.5);
    this.angle = angle;
    this.activated = false;
    this.timeout = 50;
    
    //alternating clockwise and counterclockwise directions
    if (Math.floor(direction)%2 == 0) {
      this.speed = random(0.01, 0.3);
    }
    else {
      this.speed = -random(0.01, 0.3);
    }
        
    this.word = word;
    this.connections = [];
  }

  connect(item_arr) {
    //add to connection list
    this.connections.push(item_arr);
  }
  
  tagged() {
    this.activated = true
    this.timeout += 50
  }  
  draw() {
    stroke(255);
    fill(255);
    if (this.activated) {
      fill(255)
      textSize(40)
      
      this.timeout --;

    }
    else {
      textSize(30)
      fill(200)
      strokeWeight(1)
    }
    
    if (this.timeout == 0) {
      this.timeout = 50
      this.activated = false;
    }
    //update position and draw text
    this.angle += this.speed;
    this.x = this.r * cos(radians(this.angle));
    this.y = this.r * sin(radians(this.angle));
    text(this.word, this.x, this.y);
  }
  
  impulse() {
    let target = random(this.connections);
    if (typeof target != 'undefined') {
      impulse_arr.push(new Impulse(this.x,this.y,target));
    }
  }
}

//asynchronous function to fetch synonyms of a given word
async function get_syn(word) {
  //check if word is already used
  if (word_list.indexOf(word) == -1) {
    word_list.push(word);
    let syn = [];
    //get data from dictionary and format it
    let response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);
    let data = await response.json();
    find_synonyms(data,syn);
    let completed = remove_duplicates(syn);
    let cleaned = [];
    //check for any potentially offensive terms
    for (let item of completed) {
      response = await fetch('https://www.purgomalum.com/service/containsprofanity?text='+item);
      data = await response.json();
      if (!(data)) {
        cleaned.push(item);
      }
    }
    if (cleaned.length > 5) {
      cleaned.splice(5,cleaned.length-5)
      
    }
    
    
    word_dict[word] = cleaned;
    return cleaned
  }
  else {
    return []
  }
}

//function to combine a set of arrays into a single array
function combine_arr(arr_of_arr) {
  let temp_arr = [];
  for(let arr of arr_of_arr) {
    for (let item of arr) {
      if (word_list.indexOf(item) == -1) {
        temp_arr.push(item);
      }
    }
  }
  return temp_arr
  
}

//function to remove any duplicate data from array
function remove_duplicates(arr) {
  let temp_list = [];
  for (let i = 0; i<arr.length;i++) {
    if (arr.indexOf(arr[i]) == i) {
      temp_list.push(arr[i]);
    }
  }
  return temp_list
}

//function to scrub through data and find the synonyms
function find_synonyms(data,syn_list) {
  
  let type = typeof data;
  if (type == 'object') {
    for (const [key, value] of Object.entries(data)) {
      find_synonyms(value, syn_list);
      if (key == 'synonyms') {
        for (let synonym of value){
          syn_list.push(synonym);
      }
    }
  }
}
}
function preload () {
  //Georgia is a serif font that was designed for the Web, making it the ideal choice for online documents that may be considered difficult to read. Georgia remains legible even when reduced to a small size.
  font = loadFont("GEORGIA.TTF");
}

function setup() {
  createCanvas(innerWidth, innerHeight, WEBGL);
    background(255)


  stroke(255);
  fill(255);
  textFont(font);
  textSize(30)
  textAlign(CENTER);
  
   camera_z = (height/2) / tan(PI/6);
  //create sliders to adjust camera position
  
  
  input_box = createInput();
  input_box.position(10, 50);

  button = createButton('submit');
  button.position(input_box.x + input_box.width, 50);
  button.mousePressed(startup);
  
  message = createElement('h2', 'Choose a starting word');
  message.position(20, 5);
}

function startup() {
  frameOffset = frameCount
  message.remove()
  button.remove()
  input_box.remove()
//slider_x = createSlider(-1500, 1500, 0);
  //slider_x.position(width/4, 0.1*height);
  //slider_y = createSlider(-1500, 1500, 0);
  //slider_y.position(width/2, 0.1*height);
  //slider_z = createSlider(0, 3000, 0);
  //slider_z.position(3*width/4, 0.1*height);
  //get starting word synonyms
  start_word = input_box.value();

  get_syn(start_word)
    .then(result => next_list = result)
  .catch(err => console.log(err));
    //.catch(err => console.log('too many requests, try again later'));
  word_arr.push(new Word(start_word,0,0,0));
  prev_list = [start_word];
    
 started = true
  
}

function draw() {
  
  if (started) {
      orbitControl()
  rotateY(0.5);

    let frame = frameCount - frameOffset
    //camera(slider_x.value()/1.1,slider_y.value()/1.1,camera_z+slider_z.value(), slider_x.value(), slider_y.value(), 0, 0, 1, 0);
    //display loaded words
    background(0);
    for (let word of word_arr) {
      word.draw();
    }
    //display impulses between direct synonyms
    for (let i = impulse_arr.length-1; i > 0; i--) {
      impulse_arr[i].draw();
      if (impulse_arr[i].completed) {
        impulse_arr.splice(i,1);
      }
    }

    //generate impulses between direct synonyms
    if (random(10) > 3) {
      random(word_arr).impulse();
    }

    //generate next level of synonyms
    //spaced out to avoid overloading url requests
    if ((frame - 200) % level_incr == 0 && frame < level_incr * (max_levels + 1)) {

      if(frame < level_incr * max_levels) {

        const angle_sep = 360 / next_list.length;
        let angle = 0;
        for (let word of next_list) {
          if (word_list.indexOf(word) == -1) {
            word_arr.push(new Word(word, 250*frame / level_incr, angle, frame / level_incr));
            angle += angle_sep;
            promise_arr.push(get_syn(word));
          }
          }
        //get all synonyms at once
        Promise.all(promise_arr)
          .then(results => next_list = combine_arr(results))
        .catch(err => console.log(err));
          //.catch(err => console.log('too many requests, try again later'));
      }
      //build connections from previously added words, delayed to allow load time
      for (let prev of prev_list) {
        let temp_index1 = word_list.indexOf(prev);
        if (typeof word_dict[prev] == 'undefined') {
          continue;
        }
        for (let connection of word_dict[prev]) {
          let temp_index2 = word_list.indexOf(connection);
          word_arr[temp_index1].connect(word_arr[temp_index2]);
        }
      }
      //add the currently added list to the next connection list       
      prev_list = next_list;
    }
  }
}

function windowResized() {
  resizeCanvas(innerWidth, innerHeight);
}