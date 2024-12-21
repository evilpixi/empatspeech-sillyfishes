import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../consts';
import ClickableComponent from '../components/ClickableComponent';
import ClickableSystem from '../systems/ClickableSystem';
import IdleAnimationComponent from '../components/IdleAnimationComponent';
import IdleAnimationSystem from '../systems/IdleAnimationSystem';
import FadeInComponent from '../components/FadeInComponent';
import FadeInSystem from '../systems/FadeInSystem';
import RandomMovementComponent from '../components/RandomMovementComponent';
import RandomMovementSystem from '../systems/RandomMovementSystem';
import UIButton from '../ui/UIButton';
import Fish from '../entities/Fish';
import Entity from '../entities/Entity';

const FISH_HEIGHT = GAME_HEIGHT * 0.7;
const MARGIN = 20;

export class Game extends Scene
{
  private randomMovementSystem: RandomMovementSystem;
  private fadeInSystem: FadeInSystem;
  private clickableSystem: ClickableSystem;
  private idleAnimationSystem: IdleAnimationSystem;
  private idleAnimationEntities: Entity[] = [];
  private fishData: Fish[];

  constructor()
  {
    super('Game');
  }

  create()
  {
    this.randomMovementSystem = new RandomMovementSystem(this);
    this.fadeInSystem = new FadeInSystem(this);
    this.clickableSystem = new ClickableSystem(this);
    this.idleAnimationSystem = new IdleAnimationSystem(this);
    this.idleAnimationEntities = [];
    this.fishData = this.cache.json.get('fishdata').map((data: any) => new Fish(data));


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
      this.SpawnFish();
    });
  }

  SpawnFish()
  {
    // select a random fish from the fishData array
    const randomIndex: number = Math.floor(Math.random() * this.fishData.length);
    const fishData = this.fishData[randomIndex];
    if (!fishData) return;

    const randomX = Phaser.Math.Between(MARGIN, GAME_WIDTH - MARGIN);
    const randomY = Phaser.Math.Between(MARGIN, FISH_HEIGHT - MARGIN);
    const fish = new Entity(this, randomX, randomY, fishData.id);

    // add a clickable component to the fish
    const handleClick = () => { console.log("Fish Clicked!: " + fishData.name); };
    fish.addComponent(new ClickableComponent(handleClick));
    this.clickableSystem.processEntity(fish);

    // fade in the fish
    fish.addComponent(new FadeInComponent(1000));
    this.fadeInSystem.processEntity(fish);

    // random movement fish
    fish.addComponent(new RandomMovementComponent({
      area: new Phaser.Geom.Rectangle(MARGIN, MARGIN, GAME_WIDTH - MARGIN * 2, FISH_HEIGHT - MARGIN * 2),
      speed: 5000,
      waitTime: 300
    }));
    console.log(fish);
    this.randomMovementSystem.processEntity(fish);
  }
}
