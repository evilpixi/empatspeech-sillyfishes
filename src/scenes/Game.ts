import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../consts';
import Entity from '../entities/Entity';
import ClickableSystem from '../systems/ClickableSystem';
import IdleAnimationSystem from '../systems/IdleAnimationSystem';
import IdleAnimationComponent from '../components/IdleAnimationComponent';
import UIButton from '../ui/UIButton';

const FISH_HEIGHT = GAME_HEIGHT * 0.7;

export class Game extends Scene
{
  private clickableSystem: ClickableSystem;
  private idleAnimationSystem: IdleAnimationSystem;
  private idleAnimationEntities: Entity[] = [];

  constructor()
  {
    super('Game');
  }

  create()
  {
    this.clickableSystem = new ClickableSystem(this);
    this.idleAnimationSystem = new IdleAnimationSystem(this);
    this.idleAnimationEntities = [];


    // --------------------------------------------------
    // --------------- Create Background ----------------
    // --------------------------------------------------
    let bggraphics = this.add.graphics();
    bggraphics.fillGradientStyle(0x96cce3, 0x96cce3, 0xDEF5FD, 0xDEF5FD, 1);
    bggraphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);


    // --------------------------------------------------
    // ------------------- Create Map -------------------
    // --------------------------------------------------
    const map = this.make.tilemap({ key: 'map-fish1' });
    const tileset = map.addTilesetImage('spritesheet-fish1', 'spritesheet-fish1');
    map.addTilesetImage('backobjects-fish1', 'backobjects-fish1');
    map.addTilesetImage('frontobjects-fish1', 'frontobjects-fish1');

    if (!tileset) return;

    map.createLayer("backsand", tileset, 0, GAME_HEIGHT / 2 - 100);

    let backgroundObjects = map.createFromObjects("backobjs", { classType: Entity }) as Entity[];
    for (let obj of backgroundObjects)
    {
      obj.y += GAME_HEIGHT / 2 - 90;
      if (obj.moves) this.idleAnimationEntities.push(obj);
    }

    let foregroundObjects = map.createFromObjects("frontobjs", { classType: Entity }) as Entity[];
    for (let obj of foregroundObjects)
    {
      obj.y += GAME_HEIGHT / 2 - 90;
      if (obj.moves) this.idleAnimationEntities.push(obj);
    }

    map.createLayer("frontsand", tileset, 0, GAME_HEIGHT / 2 - 90);


    // ----------------------------------------------------------------
    // --------------- Process Idle Animation Entities ----------------
    // ----------------------------------------------------------------
    for (let entity of this.idleAnimationEntities)
    {
      entity.addComponent(new IdleAnimationComponent("AlgaeAnimation"));
      this.idleAnimationSystem.processEntity(entity);
    }


    // --------------------------------------------------
    // -------------- Create UI Elements-----------------
    // --------------------------------------------------
    new UIButton(this, GAME_WIDTH - 200, GAME_HEIGHT - 100, 'Spawn Fish', () =>
    {
      //this.scene.start('MainMenu');
    });
  }
}
