import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class RandomMovementComponent implements IComponent
{
  public readonly name: string = Component.RANDOM_MOVEMENT;
  public area: Phaser.Geom.Rectangle;
  public speed: number;
  public waitTime: number;
  public movementTween?: Phaser.Tweens.Tween;

  constructor(config: { area: Phaser.Geom.Rectangle, speed?: number, waitTime?: number })
  {
    this.area = config.area;
    this.speed = config?.speed || 5000;
    this.waitTime = config?.waitTime || 500;
  }

  setMovementTween(tween: Phaser.Tweens.Tween)
  {
    this.movementTween = tween;
  }
}