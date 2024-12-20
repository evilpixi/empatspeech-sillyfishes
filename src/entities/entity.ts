import Phaser from 'phaser';
import IComponent from '../components/IComponent';

export default class Entity extends Phaser.GameObjects.Sprite
{
  private components: IComponent[];
  public moves: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
  {
    super(scene, x, y, texture);
    scene.add.existing(this);
  }

  addComponent()
  {

  }

  update()
  {
    // Add custom update logic here
  }
}