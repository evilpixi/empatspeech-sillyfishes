import IComponent from "./IComponent";
import Component from "./ComponentConsts";

export default class RandomMovementComponent implements IComponent
{
  public readonly name: string = Component.RANDOM_MOVEMENT;
  public area: Phaser.Geom.Rectangle;
  public speed: number;
  public waitTime: number;

  constructor({ area, speed = 2000, waitTime = 500 }:
    { area: Phaser.Geom.Rectangle, speed?: number, waitTime?: number })
  {
    this.area = area;
    this.speed = speed;
    this.waitTime = waitTime;
  }
}