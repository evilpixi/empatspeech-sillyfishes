import UIButton from "./UIButton";

const DEFAULT_WIDTH = 128;
const DEFAULT_HEIGHT = 128;
const DEFAULT_COLOR = 0x064d94;

export default class SpriteButton extends UIButton
{
  private buttonSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene,
    x: number, y: number,
    texture: string, callback: () => void,
    width: number = DEFAULT_WIDTH, height: number = DEFAULT_HEIGHT,
    color: number = DEFAULT_COLOR)
  {
    super(scene, x, y, width, height, callback, color);

    this.buttonSprite = scene.add.sprite(0, 0, texture);
    this.buttonSprite.postFX.addGlow(0x000000, 2, 0, false, 2, 3);
    this.add(this.buttonSprite);

    this.button.on('pointerdown', () =>
    {
      this.buttonSprite.setY(2);
      this.buttonSprite.setAlpha(0.8);
    });

    this.button.on('pointerover', () =>
    {
      scene.tweens.add({
        targets: [this.buttonSprite],
        y: "-=2",
        duration: 150,
        ease: 'Sine.easeInOut'
      })
    });

    this.button.on('pointerout', () =>
    {
      this.buttonSprite.setY(0);
      this.buttonSprite.setAlpha(1);
    });

    this.button.on('pointerup', () => 
    {
      this.buttonSprite.setY(-2);
      this.buttonSprite.setAlpha(1);
    });
  }

  animateSprite(animation: string | Phaser.Types.Animations.PlayAnimationConfig): void
  {
    this.buttonSprite.play(animation);
  }
}