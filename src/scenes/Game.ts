import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../consts';
import Entity from '../entities/entity';

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
        // --------------- Create Background ----------------
        let bggraphics = this.add.graphics();
        bggraphics.fillGradientStyle(0x96cce3, 0x96cce3, 0xDEF5FD, 0xDEF5FD, 1);
        bggraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

        // --------------- Create Map ----------------
        const map = this.make.tilemap({ key: 'map-fish1' });
        const tileset = map.addTilesetImage('spritesheet-fish1', 'spritesheet-fish1');
        map.addTilesetImage('backobjects-fish1', 'backobjects-fish1');

        if (!tileset) return;
        map.createLayer("backsand", tileset, 0, GAME_HEIGHT / 2 - 100);
        map.createLayer("frontsand", tileset, 0, GAME_HEIGHT / 2 - 100);
        let backgroundObjects = map.createFromObjects("backobjs", { classType: Entity }) as Entity[];

        for (let obj of backgroundObjects)
        {
            obj.y += GAME_HEIGHT / 2 - 90;
            if (obj.moves)
            {
                obj.setOrigin(0.5, 1);
                obj.y += 64;
                this.tweens.add({
                    targets: obj,
                    rotation: {
                        getEnd: () => { return Phaser.Math.DegToRad(10); },
                        getStart: () => { return Phaser.Math.DegToRad(-10); }
                    },
                    scaleY: {
                        getStart: () => { return 0.9 + Math.random() * 0.1; },
                        getEnd: () => { return 1.1 + Math.random() * 0.1; }
                    },
                    ease: Phaser.Math.Easing.Sine.InOut,
                    duration: 2000 + Math.random() * 3000,
                    yoyo: true,
                    repeat: -1
                });
            }
        }



        this.input.once('pointerdown', () =>
        {

            this.scene.start('GameOver');

        });
    }
}
