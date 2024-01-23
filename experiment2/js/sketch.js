let br, sr; //variables for radius size
let isMilk = false, isCoffee = false, isFull = false, isSugar = false;
let coffeeSize = 0;
let myInstance;
let canvasContainer;

let sugarParticles = [],
  NUM_PARTICLES = 10;

function setup() {
    canvasContainer = $("#canvas-container");
    let canvas = createCanvas(500, 500);
    canvas.parent("canvas-container");
    // resize canvas is the page is resized
    $(window).resize(function() {
        console.log("Resizing...");
        resizeCanvas(canvasContainer.width(), canvasContainer.height());
    });

    background(0);
    noStroke();
    angleMode(DEGREES);
    br = 175; //big circle radius
    sr = 150; //small circle radius
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    sugarParticles[i] = new Particle(width * 0.5, height * 0.5);
  }
   
  let coffeeButton = createButton('add coffee');
  coffeeButton.position(550, 940);

  coffeeButton.mouseClicked(() => {
    isMilk = false;
    isSugar = false;
    isCoffee = true;
    if(isFull){
      repaint();
      fill(255);
      textSize(24);
      textAlign(CENTER, CENTER);
      text("your cup is full!", 0, -575);
    } else {
      fill(255);
      textSize(24);
      textAlign(CENTER, CENTER);
      text("click and hold in cup to add coffee", width/2, 30);
    }
  });
  
  let sugarButton = createButton('add sugar');
  sugarButton.position(550, 970);
  
  sugarButton.mouseClicked(() => {
    if(!isSugar && isFull){
      isCoffee = false;
      isMilk = false;
      isSugar = true;
      repaint();
      fill(255);
      textSize(24);
      textAlign(CENTER, CENTER);
      text("you can add sugar now!", 0, -575);
    }
  });
  
  let milkButton = createButton('add milk');
  milkButton.position(550, 1000);
  
  milkButton.mouseClicked(() => {
    if(!isMilk && isFull){
      isCoffee = false;
      isMilk = true;
      isSugar = false;
      repaint();
      fill(255);
      textSize(24);
      textAlign(CENTER, CENTER);
      text("you can add milk now!", 0, -575);
    }
  });
    
  //cup handle
  fill(255);
  translate(width/2, height/2);
  rotate(-135);
  rect(0, 0, 50, 230, 20);
  
  //outer circle of mug
  translate(-width/2, -height/2);
  circle(width/2, height/2, br * 2);
  
  //inner circle of mug
  fill(217, 217, 217);
  // fill(128, 89, 52); //coffee brown
  circle(width/2, height/2, sr * 2);
  
  //milk foam color
  foam = color(255);
}

function draw() {
  
  if(mouseIsPressed && dist(mouseX, mouseY, width/2, height/2) <= sr){
    if(isCoffee && !isFull){
      addCoffee();
    } else if(isMilk && isFull){
      drawMilk();
    } 
  }
  
  if(isSugar && isFull){
      addSugar();
  }
  
}

//function to draw milk foam
function drawMilk() {
  angleMode(RADIANS);
 
  //slight shades of white
  fill(foam.levels[0]+random(-25,25),foam.levels[1]+random(-25,25),foam.levels[2]+random(-25,25),6);
  
  //creating shapes to simulate milk foam
  for (i=0;i<3;i++){
    push();
    translate(mouseX,mouseY);
    rotate(random(PI*2));
    
    //drawing irregular shape with random vertices
    beginShape();
    for (angle = 0; angle < PI * 2; angle += 1) {
      r = random(10, 30);
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
  }
}

function addCoffee() {
  if(coffeeSize <= sr * 2) {
    coffeeSize += 1;
    fill(128, 89, 52); //coffee brown
    circle(width/2, height/2, coffeeSize);
  } else {
    repaint()
    isFull = true;
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("your cup is full!", 0, -575);
  }
}

function addSugar() {
  
  //inner circle of mug
  fill(128, 89, 52); //coffee brown
  circle(width/2, height/2, sr * 2);
  
  if(mouseIsPressed && dist(mouseX, mouseY, width/2, height/2) <= sr){
    sugarParticles.push(new Particle(mouseX, mouseY));
  }
  
  for (let i = 0; i < sugarParticles.length; i++) {
    sugarParticles[i].render();

    if (sugarParticles[i].hitGround()) {
      sugarParticles.splice(i, 1);
    }
  }

  if (sugarParticles.length > 100) {
    sugarParticles.pop();
  }
}

//to repaint over text
function repaint() {
  background(0);
  angleMode(DEGREES);
  
  //cup handle
  fill(255);
  translate(width/2, height/2);
  rotate(-135);
  rect(0, 0, 50, 230, 20);
  
  //outer circle of mug
  translate(-width/2, -height/2);
  circle(width/2, height/2, br * 2);
  
  //fill full with coffee
  fill(128, 89, 52); //coffee brown
  circle(width/2, height/2, coffeeSize);

  rotate(135);
}

//class particle for sugar disperse effect
class Particle {
  constructor(x, y) {
    this.size = random(3, 8);
    this.pos = createVector(x, y);
    this.vel = createVector(random(-2, 2), random(-2, 2));
    this.acc = createVector();
    this.color = color(255);
  }

  bounds() {
    if ((this.pos.x > width/2 + sr - this.size / 2) || (this.pos.x < width/2 - sr + this.size / 2)) {
      this.vel.y = this.vel.y;
      this.vel.x = -this.vel.x;
    }
    
    return this;
  }

  hitGround() {
    return (dist(this.pos.x, this.pos.y, width/2, height/2) > sr - this.size / 2);
  }

  move() {

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.y += random(-0.2, 0.2); // gravity

    return this;
  }


  display() {
    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size, this.size);

    return this;
  }

  render() {
    return this.display().bounds().move();
  }
}





