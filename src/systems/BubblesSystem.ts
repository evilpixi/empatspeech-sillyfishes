import Component from "../components/ComponentConsts";
import ISystem from "./ISystem";
import Entity from "../entities/Entity";
import BubblesComponent from "../components/BubblesComponent";

export default class BubblesSystem implements ISystem
{
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene)
  {
    this.scene = scene;
  }

  createNewBubble(entity: Entity): Phaser.GameObjects.Sprite | void
  {
    const bubblesComponent = entity.getComponent(Component.BUBBLES) as BubblesComponent;
    if (!bubblesComponent) return;

    let newBubble = this.scene.add.sprite(entity.x, entity.y, bubblesComponent.bubblesKey, 0)
      .play({ key: "anim-" + bubblesComponent.bubblesKey, repeat: -1, yoyo: true })
      .setDepth(entity.depth - 0.1)

    let lookingAt = entity.flipX ? -1 : 1;
    newBubble.x += lookingAt * 64;

    this.scene.add.tween({
      targets: newBubble,
      duration: 1600,
      alpha: 0,
      scale: { from: 0, to: 0.7 },
      y: entity.y - 100,
      ease: 'Sine.easeIn',
      onComplete: () => newBubble.destroy()
    })

    this.scene.add.tween({
      targets: newBubble,
      duration: 500,
      x: { from: entity.x - 10, to: entity.x + 10 },
      ease: 'Sine.easeIn',
      yoyo: true,
      repeat: -1
    })

    return newBubble;
  }

  processEntity(entity: Entity): void
  {
    const bubblesComponent = entity.getComponent(Component.BUBBLES) as BubblesComponent;
    if (!bubblesComponent) return;

    entity.setDepth(entity.depth + 1);

    const interval = this.scene.time.addEvent({
      delay: 500,
      callback: () =>
      {
        this.createNewBubble(entity);
      },
      loop: true
    });

    entity.once(Phaser.Scenes.Events.DESTROY, () =>
    {
      interval.remove(false);
    });
  }
  /*processEntity(entity: Entity): void
  {
    const bubblesComponent = entity.getComponent(Component.BUBBLES) as BubblesComponent;
    if (!bubblesComponent) return;

    const particles = bubblesComponent.bubbles;
    entity.setDepth(entity.depth + 1);
    particles.setDepth(entity.depth - 0.1);

    this.scene.events.on('update', () =>
    {
      if (particles) particles.setPosition(entity.x, entity.y);
    });

    entity.once(Phaser.Scenes.Events.DESTROY, () =>
    {
      particles.stop();
      particles.destroy();
    });
  }*/
}