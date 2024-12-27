import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class BubblesComponent implements IComponent
{
  public readonly name = Component.BUBBLES;
  public bubbles: Phaser.GameObjects.Particles.ParticleEmitter;
  public bubblesKey: string;
  public entityIsAlive: boolean = true;
  
  constructor(bubbles: string)
  {
    this.bubblesKey = bubbles;
  }
}

/*
let fishBubbles = this.add.particles(fish.x, fish.y, "particle-bublle", {
      speed: { min: 20, max: 80 },
      angle: { min: -120, max: -60 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      anim: "anim-particle-bubble",
      lifespan: 7000,
      frequency: Phaser.Math.Between(1200, 1500),
      delay: Phaser.Math.Between(500, 800)
    });
    */