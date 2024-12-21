import ISystem from "./ISystem";
import Entity from "../entities/entity2";
import Component from "../components/ComponentConsts";
import IdleAnimationComponent from "../components/IdleAnimationComponent";

export default class IdleAnimationSystem implements ISystem
{
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene)
  {
    this.scene = scene;
  }

  processEntity(entity: Entity): void
  {
    const idleAnimationComponent = entity.getComponent(Component.IDLE_ANIMATION) as IdleAnimationComponent;
    if (!idleAnimationComponent) return;

    let animName = idleAnimationComponent.idleAnimation;

    const animation = Animations.get(animName);
    if (animation)
    {
      animation(this.scene, entity);
    }
  }
}

const Animations = new Map<string, (scene: Phaser.Scene, entity: Entity) => void>();
Animations.set("AlgaeAnimation", (scene: Phaser.Scene, entity: Entity) =>
{
  entity.setOrigin(0.5, 1);
  entity.y += 64;
  if (Math.random() > 0.5) entity.flipX = true;

  scene.tweens.add({
    targets: entity,
    rotation: {
      getStart: () => { return Phaser.Math.DegToRad(-7); },
      getEnd: () => { return Phaser.Math.DegToRad(7); }
    },
    ease: Phaser.Math.Easing.Sine.InOut,
    duration: 3000 + Math.random() * 2000,
    yoyo: true,
    repeat: -1,
    hold: 500 * Math.random()
  }).seek(Math.random() * 6000);

  let randomScale = 0.8 + Math.random() * 0.6;
  scene.tweens.add({
    targets: entity,
    scaleY: {
      getStart: () => { return randomScale - Math.random() * 0.2; },
      getEnd: () => { return randomScale + Math.random() * 0.2; }
    },
    ease: Phaser.Math.Easing.Sine.InOut,
    duration: 3000 + Math.random() * 2000,
    yoyo: true,
    repeat: -1,
    hold: 500 * Math.random()
  }).seek(Math.random() * 6000);
});
