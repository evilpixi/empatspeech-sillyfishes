import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, Music, Sound } from '../consts';

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
        for (let music of Object.values(Music))
        {
            this.load.audio(music, `assets/audio/${music}.mp3`);
        }
        for (let sound of Object.values(Sound))
        {
            this.load.audio(sound, `assets/audio/${sound}.wav`);
        }
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

        this.load.spritesheet("particle-buble", "assets/particles/particle-buble.png", {
            frameWidth: 128,
            frameHeight: 128
        });

        for (let fish of this.cache.json.get('fishdata'))
        {
            this.load.image(fish.id, `assets/sprites/${fish.id}.png`);
        }
    }

    create()
    {
        this.anims.create({
            key: 'anim-particle-bubble',
            frames: this.anims.generateFrameNumbers('particle-buble', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.start('MainMenu');
    }
}
