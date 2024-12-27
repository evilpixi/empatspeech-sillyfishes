import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GameModes, FishEvents, SOCKET_IO_URL } from '../consts';
import ClickableComponent from '../components/ClickableComponent';
import ClickableSystem from '../systems/ClickableSystem';
import IdleAnimationComponent from '../components/IdleAnimationComponent';
import IdleAnimationSystem from '../systems/IdleAnimationSystem';
import FadeInComponent from '../components/FadeInComponent';
import FadeInSystem from '../systems/FadeInSystem';
import RandomMovementComponent from '../components/RandomMovementComponent';
import RandomMovementSystem from '../systems/RandomMovementSystem';
import TextButton from '../ui/TextButton';
import Fish from '../entities/Fish';
import Entity from '../entities/Entity';
import SpriteButton from '../ui/SpriteButton';
import { io, Socket } from 'socket.io-client';

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
  private scoreText: Phaser.GameObjects.Text;
  private score: number = 0;
  private gameMode: string;
  private socket: Socket;

  constructor()
  {
    super('Game');
  }

  init(data: { gameMode: string })
  {
    this.gameMode = data?.gameMode;
    if (!this.gameMode) this.gameMode = GameModes.PACIENT;
  }

  create()
  {
    this.socket = io(SOCKET_IO_URL);

    this.socket.on("connect", () =>
    {
      console.log("Connected to server!");
      this.socket.emit(FishEvents.USER_CONNECTED, { userType: this.gameMode });
    });

    this.socket.on(FishEvents.FISH_INITIALIZE, (data: any[]) =>
    {
      console.log("Fish Initialized: ", data);
      for (let fish of data)
      {
        this.SpawnLocalFish(fish.fishKey, fish.x, fish.y, fish.id, fish.isGroup);
      }
    });

    this.socket.on(FishEvents.FISH_SPAWNED, (data: any) =>
    {
      console.log("New Fish Spawned: ", data);
      this.SpawnLocalFish(data.fishKey, data.x, data.y, data.id, data.isGroup);
    });


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

    const n = 5;
    for (let i = 1; i <= n; i++)
    {
      const emitter = this.add.particles((GAME_WIDTH / (n + 1)) * i, FISH_HEIGHT + 100, "particle-buble", {
        speed: { min: 20, max: 80 },
        angle: { min: -120, max: -60 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        anim: "anim-particle-bubble",
        lifespan: 7000,
        frequency: Phaser.Math.Between(1200, 1500),
        delay: Phaser.Math.Between(500, 1500)
      });
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
    if (this.gameMode === GameModes.THERAPIST)
    {
      new TextButton(this, GAME_WIDTH - 200, GAME_HEIGHT - 100, 'Spawn Fish', () =>
      {
        this.SpawnServerFish();
      });

      new SpriteButton(this, GAME_WIDTH - 100, 100, 'redfish', () =>
      {
        console.log("Red Fish Clicked!");
        this.SpawnServerFish("redfish");
      }, 128, 128, 0xeb7130);
    }

    this.scoreText = this.add.text(10, 10, 'Score: 0', {
      fontSize: '64px',
      fontFamily: "Alatsi",
      color: '#fff',
      stroke: 'orange',
      strokeThickness: 6
    });
    this.scoreText.depth = 1000;
  }

  SpawnServerFish(fishKey = "", x?: number, y?: number, isGroup = false): void
  {
    // select a random fish from the fishData array
    let fishData: Fish | undefined;
    if (fishKey === "")
    {
      const randomIndex: number = Math.floor(Math.random() * this.fishData.length);
      fishData = this.fishData[randomIndex];
    }
    else
    {
      fishData = this.fishData.find((fish) => fish.key === fishKey);
    }

    if (!fishData) return;

    if (x === undefined) x = Phaser.Math.Between(MARGIN, GAME_WIDTH - MARGIN);
    if (y === undefined) y = Phaser.Math.Between(MARGIN, FISH_HEIGHT - MARGIN);

    console.log("we asked to create the following fish:", fishData.key, x, y, isGroup);

    this.socket.emit(FishEvents.SPAWN_FISH, { fishKey: fishData.key, isGroup, x, y });
  }

  SpawnLocalFish(fishKey: string, x: number, y: number, id: string, isGroup: boolean = false): void
  {
    console.log("Spawn Local Fish: ", fishKey, x, y, isGroup);
    if (isGroup)
    {
      console.log("not implemented yet")
    }
    const fish = new Entity(this, x, y, fishKey);

    // add a clickable component to the fish
    const handleClick = () =>
    {
      let scaleX = fish.scaleX;
      let scaleY = fish.scaleY;
      fish.setOrigin(0.5, 0.5);
      fish.setDepth(100);
      fish.postFX.addGlow(0xffffff, 1.5, 1.5);

      console.log("Fish Clicked!: " + fishKey);
      this.idleAnimationSystem.stopAnimation(fish);
      this.randomMovementSystem.stopMovement(fish);

      fish.setScale(scaleX, scaleY);
      this.tweens.add({
        targets: fish,
        scaleX: scaleX * 1.2,
        scaleY: scaleY * 1.2,
        yoyo: true,
        duration: 300,
        ease: 'Power1'
      });

      const bubbleEmitter = this.add.particles(fish.x, fish.y, "particle-buble", {
        speed: { min: 150, max: 250 },
        scale: { start: 1, end: 0.5 },
        alpha: { start: 1, end: 0 },
        blendMode: 'ADD',
        anim: "anim-particle-bubble",
        lifespan: 400,
        frequency: 120,
        quantity: 10
      });

      this.time.delayedCall(1000, () =>
      {
        bubbleEmitter.stop();
        this.tweens.add({
          targets: fish,
          alpha: 0,
          duration: 300,
          ease: 'Power1',
          onComplete: () =>
          {
            fish.postFX.clear();
            this.idleAnimationSystem.processEntity(fish);
            this.randomMovementSystem.processEntity(fish);
            this.events.emit("ON_FISH_CLICKED", fishKey);
          }
        })
      });
    };
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
    this.randomMovementSystem.processEntity(fish);

    fish.addComponent(new IdleAnimationComponent("FishAnimation"));
    this.idleAnimationSystem.processEntity(fish);
  }

  update()
  {
    this.scoreText.setText(`Score: ${this.score}`);
  }
}
