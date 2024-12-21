import ISystem from "./ISystem";
import Entity from "../entities/entity2";
import Component from "../components/ComponentConsts";
import FadeInComponent from "../components/FadeInComponent";

export default class FadeInSystem implements ISystem
{
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene)
  {
    this.scene = scene;
  }

  processEntity(entity: Entity): void
  {
    const fadeIn = entity.getComponent(Component.FADE_IN) as FadeInComponent;

    if (!fadeIn) return;

    this.scene.tweens.add({
      targets: entity,
      alpha: { from: 0, to: 1 },
      duration: fadeIn.duration,
      onComplete: () =>
      {
        fadeIn.complete();
      }
    });
  }
}