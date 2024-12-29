import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class RandomMovementComponent implements IComponent
{
  public readonly name: string = Component.RANDOM_MOVEMENT;
  public area: Phaser.Geom.Rectangle;
  public speed: number;
  public waitTime: number;
  private movementTween?: Phaser.Tweens.Tween;
  private tweenData?: object;
  private isStopped: boolean = false;

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

  getMovementTween(): Phaser.Tweens.Tween | undefined
  {
    return this.movementTween;
  }

  setMovementData(data: object)
  {
    this.tweenData = data;
  }

  getMovementData(): object | undefined
  {
    return this.tweenData;
  }

  setStopped(value: boolean)
  {
    this.isStopped = value;
  }

  getIsStopped(): boolean
  {
    return this.isStopped;
  }
}