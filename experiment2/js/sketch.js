let br, sr; //variables for radius size
let isMilk = false, isCoffee = false, isFull = false, isSugar = false; //booleans to keep track of buttons
let coffeeSize = 0; //diameter of coffee size
let canvasContainer; //size of canvas

//variables for adding sugar element
let sugarParticles = [],
  NUM_PARTICLES = 10;

function setup() {
    //setting up canvas to fit in results section
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
  
    //initializing particles for sugar
    for (let i = 0; i < NUM_PARTICLES; i++) {
        sugarParticles[i] = new Particle(width * 0.5, height * 0.5);
    }
    
    //creating coffee button
    let coffeeButton = createButton('add coffee');
    coffeeButton.position(550, 940);

    //actions to be done when coffee button is clicked
    coffeeButton.mouseClicked(() => {
        isMilk = false;
        isSugar = false;
        isCoffee = true;
        if(isFull){ //if cup is full, display full text
            repaint();
            fill(255);
            textSize(24);
            textAlign(CENTER, CENTER);
            text("your cup is full!", 0, -575);
        } else { //otherwise, continue displaying instructions
            fill(255);
            textSize(24);
            textAlign(CENTER, CENTER);
            text("click and hold in cup to add coffee", width/2, 30);
        }
    });
    
    //creating sugar button
    let sugarButton = createButton('add sugar');
    sugarButton.position(550, 970);
    
    //actions to be done when sugar button is clicked
    sugarButton.mouseClicked(() => {
        if(!isSugar && isFull){ //checks if the current state is not on the sugar button and makes sure coffee is full
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
    
    //creating milk button
    let milkButton = createButton('add milk');
    milkButton.position(550, 1000);
    
    //actions to be done when milk button is clicked
    milkButton.mouseClicked(() => {
        if(!isMilk && isFull){ //checks that current state is not on milk and that coffee is full
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
    //checks that mouse is pressed and is within bounds of cup
    if(mouseIsPressed && dist(mouseX, mouseY, width/2, height/2) <= sr){
        if(isCoffee && !isFull){ //if coffee button is pressed and it is still not full, then add coffee
            addCoffee();
        } else if(isMilk && isFull){ //if milk button is pressed and coffee is full, then draw milk
            drawMilk();
        } 
    }
    
    if(isSugar && isFull){ //if sugar is pressed and coffee is full, add sugar
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

//adding coffee function
function addCoffee() {
    //make sure coffee does not go out of bounds of cup
    if(coffeeSize <= sr * 2) {
        coffeeSize += 1;
        fill(128, 89, 52); //coffee brown
        circle(width/2, height/2, coffeeSize);
    } else { //otherwise, stop increasing size and display cup is full
        repaint()
        isFull = true;
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);
        text("your cup is full!", 0, -575);
    }
}

//function to add sugar
function addSugar() {
    
    //inner circle of mug
    fill(128, 89, 52); //coffee brown
    circle(width/2, height/2, sr * 2);
    
    //checks if mouse is pressed and within circle bounds
    if(mouseIsPressed && dist(mouseX, mouseY, width/2, height/2) <= sr){
        sugarParticles.push(new Particle(mouseX, mouseY)); //adding particles
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
        //restrict particle to inside coffee cup
        if ((this.pos.x > width/2 + sr - this.size / 2) || (this.pos.x < width/2 - sr + this.size / 2)) {
            this.vel.y = this.vel.y;
            this.vel.x = -this.vel.x;
        }
        
        return this;
    }

    //checks if it hits sides of circle
    hitGround() {
        return (dist(this.pos.x, this.pos.y, width/2, height/2) > sr - this.size / 2);
    }

    move() {

        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.vel.y += random(-0.2, 0.2);

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





