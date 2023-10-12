import { GameObjects, Types, Scene } from "phaser";

const ACCELERATION_SPEED = 0.5;
const SLOWDOWN_COEFFICIENT = 0.7;
const MAX_VELOCITY = 20;
const SIZE = 30;

// a player entity that will use the corsor keys for movement and will be represented by a green circle
export default class Player extends GameObjects.Graphics {
  // private variable types
  accelerationX: number;
  accelerationY: number;
  velocityX: number;
  velocityY: number;
  x: number;
  y: number;
  halfSize: number;
  radius: number;
  width: number;
  height: number;
  particles?: GameObjects.Particles.ParticleEmitter;
  cursors: Types.Input.Keyboard.CursorKeys;
  particleScale: number;

  constructor(scene: Scene, x: number, y: number, enableParticles = true) {
    super(scene, x, y);
    this.accelerationX = 0;
    this.accelerationY = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.x = x;
    this.y = y;
    this.halfSize = this.radius = SIZE / 2;
    this.width = SIZE;
    this.height = SIZE;
    this.particleScale = 0.5;

    scene.add.existing(this);

    this.fillStyle(0x348891, 1);
    this.fillCircle(0, 0, this.radius + 3);

    this.fillStyle(0x000000, 1);
    this.fillCircle(0, 0, 5);

    this.particles = null;

    // add particles
    // this could be done on the game level, but it's done here to keep the player self-contained
    if (enableParticles) {
      this.particles = this.scene.add.particles(0, 0, "blue", {
        speed: 20,
        scale: { start: this.particleScale, end: 0 },
        blendMode: "ADD",
        alpha: { start: 0.5, end: 0 },
      });

      this.particles.startFollow(this);
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  update() {
    // move the player based on keyboard input
    if (this.cursors.left.isDown) {
      // if acceleration is positive, reset it and reset the velocity
      if (this.velocityX > 0) {
        this.velocityX = 0;
      }
      this.accelerationX = -ACCELERATION_SPEED;
    } else if (this.cursors.right.isDown) {
      if (this.velocityX < 0) {
        this.velocityX = 0;
      }
      this.accelerationX = ACCELERATION_SPEED;
    } else {
      this.accelerationX = 0;
    }

    if (this.cursors.up.isDown) {
      if (this.velocityY > 0) {
        this.velocityY = 0;
      }
      this.accelerationY = -ACCELERATION_SPEED;
    } else if (this.cursors.down.isDown) {
      if (this.velocityY < 0) {
        this.velocityY = 0;
      }

      this.accelerationY = ACCELERATION_SPEED;
    } else {
      this.accelerationY = 0;
    }

    // slow down the player if no key is pressed
    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
      this.velocityX *= SLOWDOWN_COEFFICIENT;
    }
    if (!this.cursors.up.isDown && !this.cursors.down.isDown) {
      this.velocityY *= SLOWDOWN_COEFFICIENT;
    }

    // change the velocity based on the acceleration
    this.velocityX += Math.abs(this.velocityX) < MAX_VELOCITY ? this.accelerationX : 0;
    this.velocityY += Math.abs(this.velocityY) < MAX_VELOCITY ? this.accelerationY : 0;

    // restrict the player to the screen
    if (this.x < 0) {
      this.x = 0;
      this.velocityX = 0;
    }
    if (this.x > window.innerWidth - 20) {
      this.x = window.innerWidth - 20;
      this.velocityX = 0;
    }
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }
    if (this.y > window.innerHeight - 20) {
      this.y = window.innerHeight - 20;
      this.velocityY = 0;
    }
    // move the player
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  grow(value = 5) {
    this.width += value;
    this.height += value;
    this.halfSize += value / 2;
    this.radius += value / 2;
    this.particleScale += 0.1;
    this.clear();

    this.fillStyle(0x348891, 1);
    this.fillCircle(0, 0, this.radius + 5);

    this.fillStyle(0x000000, 1);
    this.fillCircle(0, 0, 5);

    this.particles.setConfig({
      speed: 10,
      scale: { start: this.particleScale, end: 0 },
      blendMode: "ADD",
      alpha: { start: 0.4, end: 0 },
    });
  }
}
