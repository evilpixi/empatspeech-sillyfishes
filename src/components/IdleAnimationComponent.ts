import IComponent from './IComponent';
import Component from './ComponentConsts';

export default class IdleAnimationComponent implements IComponent
{
  public readonly name = Component.IDLE_ANIMATION;
  public readonly idleAnimation: string;
  public tweens: Phaser.Tweens.Tween[] = [];

  constructor(animation: string)
  {
    this.idleAnimation = animation;
  }

  setTweens(tweens: Phaser.Tweens.Tween[])
  {
    this.tweens = tweens;
  }
}

