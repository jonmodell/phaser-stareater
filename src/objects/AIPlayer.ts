import { GameObjects, Types, Scene } from "phaser";

const ACCELERATION_SPEED = 0.5;
const SLOWDOWN_COEFFICIENT = 0.7;
const MAX_VELOCITY = 20;
const SIZE = 30;
const FILL_COLOR = 0xb03f56;

// a player entity that will use the corsor keys for movement and will be represented by a green circle
export default class Player extends GameObjects.Graphics {
  // private variable types
  accelerationX: number;
  accelerationY: number;
  velocityX: number;
  velocityY: number;
  halfSize: number;
  radius: number;
  width: number;
  height: number;
  particles?: GameObjects.Particles.ParticleEmitter;
  cursors: Types.Input.Keyboard.CursorKeys;
  particleScale: number;
  target?: GameObjects.Graphics;
  bumped: boolean;
  bumpTimeout: number | null;

  constructor(scene: Scene, x: number, y: number, enableParticles = true, target?: GameObjects.Graphics) {
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
    this.target = target;
    this.bumped = false;
    this.bumpTimeout = null;

    scene.add.existing(this);

    // make the fill style an brick red
    this.fillStyle(FILL_COLOR, 1);

    this.fillCircle(0, 0, this.radius + 3);

    this.fillStyle(0x000000, 1);
    this.fillCircle(0, 0, 5);

    this.particles = null;

    // add particles
    // this could be done on the game level, but it's done here to keep the player self-contained
    if (enableParticles) {
      this.particles = this.scene.add.particles(0, 0, "red", {
        speed: 20,
        scale: { start: this.particleScale, end: 0 },
        blendMode: "ADD",
        alpha: { start: 0.5, end: 0 },
      });

      this.particles.startFollow(this);
    }
  }

  setTarget(target: GameObjects.Graphics) {
    this.target = target;
  }

  bump(velocityX: number, velocityY: number) {
    clearTimeout(this.bumpTimeout);
    this.bumped = true;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }

  update() {
    // if the player was bumped, react to the bump velocity for 1 second
    if(this.bumped) {
      this.velocityX *= 0.95;
      this.velocityY *= 0.95;

      this.bumpTimeout = setTimeout(() => {
        this.bumped = false;
      }, 1000);
    }

    // move the player towards the target
    else if (this.target) {
      const targetX = this.target.x;
      const targetY = this.target.y;
      const distanceX = targetX - this.x;
      const distanceY = targetY - this.y;
      const angle = Math.atan2(distanceY, distanceX);
      const speed = 5;

      this.velocityX = Math.cos(angle) * speed;
      this.velocityY = Math.sin(angle) * speed;
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

    this.fillStyle(FILL_COLOR, 1);
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
