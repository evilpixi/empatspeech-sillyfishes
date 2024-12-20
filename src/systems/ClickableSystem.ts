import Component from "../components/ComponentConsts";
import ISystem from "./ISystem";
import Entity from "../entities/Entity"
import ClickableComponent from "../components/ClickableComponent";

export default class ClickableSystem implements ISystem
{
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene)
  {
    this.scene = scene;
  }

  processEntity(entity: Entity): void
  {
    const clickableComponent = entity.getComponent(Component.CLICKABLE) as ClickableComponent;
    if (!clickableComponent) return;

    const gameObject = entity as Phaser.GameObjects.GameObject;
    gameObject.setInteractive();
    gameObject.on("pointerdown", clickableComponent.onClick);

    this.scene.events.once("shutdown", () =>
    {
      gameObject.off("pointerdown", clickableComponent.onClick);
    });
  }
}