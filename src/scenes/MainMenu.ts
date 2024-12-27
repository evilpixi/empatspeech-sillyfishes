import { Scene, GameObjects } from 'phaser';
import TextButton from '../ui/TextButton';
import { GAME_HEIGHT, GAME_WIDTH } from '../consts';
import { GameModes } from '../consts';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor()
    {
        super('MainMenu');
    }

    create()
    {
        this.add.text(GAME_WIDTH / 2, GAME_HEIGHT * 0.2, "Pacient or Doctor?", {
            fontFamily: "Alatsi",
            fontSize: 64
        }).setOrigin(0.5);

        new TextButton(this, GAME_WIDTH / 2, GAME_HEIGHT * 0.43, "Pacient", () =>
        {
            this.scene.start('Game', { gameMode: GameModes.PACIENT });
        })

        new TextButton(this, GAME_WIDTH / 2, GAME_HEIGHT * 0.57, "Therapist", () =>
        {
            this.scene.start('Game', { gameMode: GameModes.THERAPIST });
        })
    }
}
