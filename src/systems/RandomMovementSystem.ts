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

    console.log("---> mov <<< ", movement);
    if (!movement || movement.getIsStopped()) return;

    const movData: { targetX?: number, targetY?: number } = movement.getMovementData() || {};
    const targetX = movData?.targetX || Phaser.Math.Between(movement.area.x, movement.area.width);
    const targetY = movData?.targetY || Phaser.Math.Between(movement.area.y, movement.area.height);
    entity.flipX = entity.x > targetX;

    const tween = this.scene.tweens.add({
      targets: entity,
      x: targetX,
      y: targetY,
      duration: movement.speed,
      ease: 'Sine.easeInOut',

    });

    movement.setMovementTween(tween);
  }

  stopMovement(entity: Entity): void
  {
    const movement: RandomMovementComponent | undefined = entity.getComponent(Component.RANDOM_MOVEMENT) as RandomMovementComponent;
    if (!movement || movement.getIsStopped()) return;
    movement?.setStopped(true);
    movement?.getMovementTween()?.stop();
  }
}