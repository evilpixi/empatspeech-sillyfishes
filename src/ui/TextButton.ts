import UIButton from "./UIButton";

const DEFAULT_WIDTH = 350;
const DEFAULT_HEIGHT = 100;

export default class TextButton extends UIButton
{
  private buttonText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: () => void)
  {
    super(scene, x, y, DEFAULT_WIDTH, DEFAULT_HEIGHT, callback);

    this.buttonText = scene.add.text(0, 0, text, {
      fontSize: '60px',
      fontFamily: "Alatsi",
      color: '#fff',
      stroke: '#064d94',
      strokeThickness: 6
    });
    this.buttonText.setOrigin(0.5, 0.5);
    this.add(this.buttonText);


    this.buttonText.setFontFamily("Alatsi");
    this.buttonText.setFontSize('60px');
    this.buttonText.setStroke('#064d94', 6);

    this.button.on('pointerdown', () =>
    {
      this.buttonText.setY(2);
      this.buttonText.setAlpha(0.8);
    });

    this.button.on('pointerover', () =>
    {
      scene.tweens.add({
        targets: [this.buttonText],
        y: "-=2",
        duration: 150,
        ease: 'Sine.easeInOut'
      })
    });

    this.button.on('pointerout', () =>
    {
      this.buttonText.setY(0);
      this.buttonText.setAlpha(1);
    });

    this.button.on('pointerup', () => 
    {
      this.buttonText.setY(-2);
      this.buttonText.setAlpha(1);
    });
  }
}