import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../consts';

export class Preloader extends Scene
{
    constructor()
    {
        super('Preloader');
    }

    init()
    {
        const progressBarWidth = 500;
        const progressBarHeight = 32;
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, progressBarWidth, progressBarHeight).setStrokeStyle(1, 0xffffff);
        const bar = this.add.rectangle(GAME_WIDTH / 2 - progressBarWidth / 2, GAME_HEIGHT / 2, 4, 28, 0xffffff);
        this.load.on('progress', (progress: number) =>
        {
            bar.width = 4 + (progressBarWidth * progress);
        });
    }

    preload()
    {
        this.load.font("Alatsi", "assets/fonts/Alatsi-Regular.ttf");

        this.load.spritesheet("spritesheet-fish1", "assets/tilemaps/spritesheet-fish1.png", {
            frameWidth: 128,
            frameHeight: 128
        })
        this.load.spritesheet("backobjects-fish1", "assets/tilemaps/backobjects-fish1.png", {
            frameWidth: 128,
            frameHeight: 128
        })
        this.load.spritesheet("frontobjects-fish1", "assets/tilemaps/frontobjects-fish1.png", {
            frameWidth: 128,
            frameHeight: 128
        })
        this.load.tilemapTiledJSON('map-fish1', 'assets/tilemaps/map-fish1.json');
    }

    create()
    {
        this.scene.start('MainMenu');
    }
}
