import ISystem from "./ISystem";
import Entity from "../entities/Entity";
import Component from "../components/ComponentConsts";
import RandomMovementComponent from "../components/RandomMovementComponent";

export default class RandomMovementSystem implements ISystem
{
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene)
  {
    this.scene = scene;
  }

  processEntity(entity: Entity): void
  {
    const movement = entity.getComponent(Component.RANDOM_MOVEMENT) as RandomMovementComponent;

    if (!movement) return;

    const targetX = Phaser.Math.Between(movement.area.x, movement.area.width);
    const targetY = Phaser.Math.Between(movement.area.y, movement.area.height);

    entity.flipX = entity.x > targetX;

    this.scene.tweens.add({
      targets: entity,
      x: targetX,
      y: targetY,
      duration: movement.speed,
      ease: 'Sine.easeInOut',
      onComplete: () =>
      {
        this.scene.time.delayedCall(movement.waitTime, () =>
        {
          this.processEntity(entity);
        });
      }
    });
  }
}