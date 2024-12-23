import Phaser from 'phaser';

const DEFAULT_COLOR = 0x064d94;

function getDarkerColor(color: number, amount: number): number
{
  const r = Math.max((color >> 16) - amount, 0);
  const g = Math.max(((color >> 8) & 0x00FF) - amount, 0);
  const b = Math.max((color & 0x0000FF) - amount, 0);
  return (r << 16) + (g << 8) + b;
}

export default abstract class UIButton extends Phaser.GameObjects.Container
{
  protected button: Phaser.GameObjects.Rectangle;
  protected innerElements: Phaser.GameObjects.GameObject[] = [];
  private color: number;

  constructor(scene: Phaser.Scene, x: number, y: number,
    width: number, height: number, callback: () => void,
    color: number = DEFAULT_COLOR)
  {
    super(scene, x, y);

    this.color = color;

    let border = scene.add.rectangle(0, 3, width, height, getDarkerColor(color, 50), 1);
    this.button = scene.add.rectangle(0, 0, width, height, color).setInteractive();

    let shine = scene.add.rectangle(0, -height * 0.25, width - 8, height / 2 - 8, 0xffffff);
    shine.setAlpha(0.1);
    shine.blendMode = Phaser.BlendModes.ADD;

    this.add(border);
    this.add(this.button);
    this.add(shine);

    this.button.on('pointerdown', () =>
    {
      this.button.setY(2);
      shine.setAlpha(0);
      callback()
    });
    this.button.on('pointerover', () =>
    {
      scene.tweens.add({
        targets: shine,
        alpha: 0.14,
        duration: 80,
        ease: 'Sine.easeInOut'
      });
      scene.tweens.add({
        targets: [this.button, shine],
        y: "-=2",
        duration: 150,
        ease: 'Sine.easeInOut'
      });
    });
    this.button.on('pointerout', () =>
    {
      shine.setAlpha(0.1);
      this.button.setY(0);
      shine.setY(-height * 0.25);
    });
    this.button.on('pointerup', () => 
    {
      shine.setAlpha(0.14);
      this.button.setY(-2);
      shine.setY(-height * 0.25 - 2);
    });

    scene.add.existing(this);
  }

  getColor(): number
  {
    return this.color;
  }
}