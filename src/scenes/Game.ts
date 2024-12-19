import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../consts';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;

    constructor()
    {
        super('Game');
    }

    create()
    {
        let bggraphics = this.add.graphics();
        bggraphics.fillGradientStyle(0x96cce3, 0x96cce3, 0xDEF5FD, 0xDEF5FD, 1);
        bggraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        this.input.once('pointerdown', () =>
        {

            this.scene.start('GameOver');

        });
        this.add.text(10, 10, 'Game Scene', { font: '30px Courier' });
    }
}
