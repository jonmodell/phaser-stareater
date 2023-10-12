import { GameObjects } from "phaser"; 

const BALL_SIZE = 10;

// a ball entity that will use bounce around the scree
export default class Ball extends GameObjects.Graphics {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.x = x;
    this.y = y;
    this.width = BALL_SIZE;
    this.height = BALL_SIZE;
    this.halfSize = BALL_SIZE / 2;
    this.radius = BALL_SIZE / 2;

    // create a single green particle
    const leader = scene.physics.add.image(x, y, "blue");
    leader.setVelocity(Math.floor(-200 + Math.random() * 400), 200);
    leader.setBounce(1, 1);
    leader.setCollideWorldBounds(true);

    this.leader = leader;

    // add sprites to a layer behind the leader
    this.particles = scene.add.particles(0, 0, "red", {
      speed: 50,
      scale: { start: 0.2, end: 0 },
      blendMode: "ADD",
    });

    this.particles.startFollow(leader);
  }

  update() {
    this.x = this.leader.x;
    this.y = this.leader.y;
  }

  stop() {
    this.leader.setVelocity(0, 0);
  }

  destroy() {
    this.leader.destroy();
    this.particles.destroy();
  }
}
