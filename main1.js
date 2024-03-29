// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
const ballCountPara = document.querySelector("p");
 // Use this for the score counter

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Shape {
  constructor(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}

class Ball extends Shape {
    color;
    size; 
    exists;
  constructor(x, y, velX, velY, color, size, exists = true) {
    super(x, y, velX, velY);
    this.color = color;
    this.size = size;
    this.exists = exists;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }
  update() {
    if (this.x + this.size >= width) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (!(this === ball) && ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}
  

const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size
  );

  balls.push(ball);
}

function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }
}

class EvilCircle extends Shape {
  color;
  size;
  constructor(x, y) {
    super(x, y, 20, 20);
    this.color = "white";
    this.size = 10;
  }

    setControls() {
      window.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "a":
          case "ArrowLeft":
            this.x -= this.velX;
            break;
          case "d":
          case "ArrowRight":
            this.x += this.velX;
            break;
          case "w":
          case "ArrowUp":
            this.y -= this.velY;
            break;
          case "s":
          case "ArrowDown":
            this.y += this.velY;
            break;
        }
      });
    }

    draw() {
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = this.color;
      ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      ctx.stroke();
    }
    checkBounds() {
      if (this.x + this.size >= width) {
        this.x = -this.x;
      }

      if (this.x - this.size <= 0) {
        this.x = -this.x;
      }

      if (this.y + this.size >= height) {
        this.y = -this.y;
      }

      if (this.y - this.size <= 0) {
        this.y = -this.y;
      }
    }
    collisionDetect() {
      for (const ball of balls) {
        if (ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + ball.size) {
            ball.exists = false;
            updateBallCount();
          }
        }
      }
    }
  }
// Function to update the ball count display
function updateBallCount() {
  const ballsOnScreen = balls.filter(ball => ball.exists).length;
  ballCountPara.textContent = `Balls count: ${ballsOnScreen}`;
}

  // Initialize the evil circle at a random position, with event listeners for control
  const evilCircle = new EvilCircle(
    random(20, width - 20),
    random(20, height - 20)
  );
  evilCircle.setControls();

  // The main animation loop
  function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)"; // semi-transparent black to create a trail effect
    ctx.fillRect(0, 0, width, height); // covers the entire canvas

    // Iterate through the balls array to draw, update, and check collisions for each ball
    for (const ball of balls) {
      if (ball.exists) {
        // Only draw and update balls that exist
        ball.draw();
        ball.update();
        ball.collisionDetect();
      }
    }

    // Draw and check bounds for the evil circle, also check for collisions with balls
    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    // Update the display of the ball count
    updateBallCount();

    requestAnimationFrame(loop); // Continuously run loop()
  }

  // Start the game loop
  loop();