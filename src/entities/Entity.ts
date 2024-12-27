import Phaser from 'phaser';
import IComponent from '../components/IComponent';

export default class Entity extends Phaser.GameObjects.Sprite
{
  private components: Map<string, IComponent>;
  public readonly moves: boolean = false;
  private id: string = "";
  private fishType: string = "";

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
  {
    super(scene, x, y, texture);
    this.components = new Map<string, IComponent>();
    scene.add.existing(this);
    this.fishType = texture;
  }

  addComponent(component: IComponent): void
  {
    this.components.set(component.name, component);
  }

  getComponent(componentName: string): IComponent | undefined
  {
    return this.components.get(componentName);
  }

  setId(id: string): void
  {
    this.id = id;
  }

  getId(): string
  {
    return this.id;
  }

  getFishType(): string
  {
    return this.fishType;
  }
}