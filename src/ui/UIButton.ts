import Phaser from 'phaser';

export default class UIButton extends Phaser.GameObjects.Container
{
  private button: Phaser.GameObjects.Rectangle;
  private buttonText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: () => void)
  {
    super(scene, x, y);

    let border = scene.add.rectangle(0, 3, 350, 104, 0x05204d, 1);
    this.button = scene.add.rectangle(0, 0, 350, 100, 0x064d94).setInteractive();
    this.buttonText = scene.add.text(0, 0, text, {
      fontSize: '60px',
      fontFamily: "Alatsi",
      color: '#fff',
      stroke: '#064d94',
      strokeThickness: 6
    });
    this.buttonText.setOrigin(0.5, 0.5);
    let shine = scene.add.rectangle(0, -25, 342, 42, 0xffffff);
    shine.setAlpha(0.2);
    shine.blendMode = Phaser.BlendModes.ADD;

    this.add(border);
    this.add(this.button);
    this.add(shine);
    this.add(this.buttonText);

    this.button.on('pointerdown', () =>
    {
      this.button.setY(2);
      this.buttonText.setY(2);
      this.buttonText.setAlpha(0.8);
      shine.alpha = 0;
      callback()
    });
    this.button.on('pointerover', () =>
    {
      scene.tweens.add({
        targets: shine,
        alpha: 0.24,
        duration: 80,
        ease: 'Sine.easeInOut'
      });
      scene.tweens.add({
        targets: [this.button, this.buttonText, shine],
        y: "-=2",
        duration: 150,
        ease: 'Sine.easeInOut'
      });
    });
    this.button.on('pointerout', () =>
    {
      shine.setAlpha(0.1);
      this.button.setY(0);
      this.buttonText.setY(0);
      shine.setY(-25);
      this.buttonText.setAlpha(1);
    });
    this.button.on('pointerup', () => 
    {
      shine.setAlpha(0.24);
      this.button.setY(-2);
      this.buttonText.setY(-2);
      shine.setY(-27);
      this.buttonText.setAlpha(1);
    });

    scene.add.existing(this);
  }
}