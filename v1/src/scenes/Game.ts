import { GameObjects, Scene } from 'phaser';
import Player from '../objects/Player';
import AIPlayer from '../objects/AIPlayer';
import Ball from '../objects/Ball';

// export default class Demo extends Phaser.Scene {
//   constructor() {
//     super('GameScene');
//   }

//   preload() {
//     this.load.image('logo', 'assets/phaser3-logo.png');
//   }

//   create() {
//     const logo = this.add.image(400, 70, 'logo');

//     this.tweens.add({
//       targets: logo,
//       y: 350,
//       duration: 1500,
//       ease: 'Sine.inOut',
//       yoyo: true,
//       repeat: -1
//     });
//   }
// }


// box collision detection
const collisionCheck = (item1, item2) => {
  // expect items to have x, y, radius, width and height
  // x and y represent the center of the item
  const xOverlap = Math.abs(item1.x - item2.x) * 2 < item1.width + item2.width;
  const yOverlap = Math.abs(item1.y - item2.y) * 2 < item1.height + item2.height;

  if (xOverlap && yOverlap) {
    return true;
  }

  return false;
};

// circle collision detection
const circularCollisionCheck = (item1, item2) => {
  // expect items to have centerX, centerY and radius
  // check if item1 and item2 overlap
  const overlap =
    Math.sqrt(Math.pow(item1.x - item2.x, 2) + Math.pow(item1.y - item2.y, 2)) <
    item1.radius + item2.radius;
  return overlap;
};

// game class
export default class StarEater extends Scene{
  score: number;
  scoreText: GameObjects.Text;

  aiScore: number;
  aiScoreText: GameObjects.Text;

  player: Player;
  aiPlayer: AIPlayer;
  ball: Ball;

  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.setBaseURL("https://labs.phaser.io");

    this.load.image("sky", "assets/skies/space3.png");
    this.load.image("red", "assets/particles/red.png");
    this.load.image("blue", "assets/particles/blue.png");
  }

  addBall() {
    // add a ball at a random location
    const randomX = Math.floor(Math.random() * (20 + (window.innerWidth - 40)));
    this.ball = new Ball(this, randomX, 0);
  }

  create() {
    this.score = 0;
    this.scoreText = this.add.text(16, 16, "You: 0", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    this.aiScore = 0;
    this.aiScoreText = this.add.text(400, 16, "AI: 0", {
      fontSize: "32px",
      fill: "#ffffff",
    });

    this.cameras.main.setBackgroundColor("#000000");

    // add a ball
    this.addBall();

    // add a player
    const player = new Player(this, window.innerWidth / 2, window.innerHeight / 2, true);
    this.player = player;

    // add an AI player
    const aiPlayer = new AIPlayer(this, window.innerWidth / 2, window.innerHeight / 2, true, this.ball);
    this.aiPlayer = aiPlayer;
  }

  update() {
    // update the ball
    this.ball && this.ball.update();


    // update the players
    this.player && this.player.update();
    this.aiPlayer && this.aiPlayer.update();
    

    // check for collisions if the player and ball are in the same space
    if (this.ball && this.player) {


      if (circularCollisionCheck(this.player, this.ball)) {
        this.ball.stop();
        this.ball.destroy();
        delete this.ball;

        this.score += 1;

        if(this.score > 80) {
          this.scoreText.setText(`You Win!`);
          this.scoreText.setColor("#00ff00");
          this.player.grow(30);
          return;
        }

        this.scoreText.setText(`Score: ${this.score}`);
        this.player.grow(5)
        this.addBall();
        this.aiPlayer.setTarget(this.ball);
      }

      if (circularCollisionCheck(this.aiPlayer, this.ball)) {
        this.ball.stop();
        this.ball.destroy();
        delete this.ball;

        this.aiScore += 1;

        if(this.aiScore > 80) {
          this.scoreText.setText(`You Lose!`);
          this.scoreText.setColor("#00ff00");
          this.aiPlayer.grow(30);
          return;
        }

        this.aiScoreText.setText(`AI: ${this.aiScore}`);
        this.aiPlayer.grow(5)
        this.addBall();
        this.aiPlayer.setTarget(this.ball);
      }
    }
  }
}
