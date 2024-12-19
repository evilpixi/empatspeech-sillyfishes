import Phaser from 'phaser';

export default class Fish extends Phaser.GameObjects.Sprite
{
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
  {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  update()
  {
    // Add custom update logic here
  }
}