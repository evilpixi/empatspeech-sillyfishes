import { Scene } from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GameModes, FishEvents, Music, Sound } from '../consts';
import ClickableComponent from '../components/ClickableComponent';
import ClickableSystem from '../systems/ClickableSystem';
import IdleAnimationComponent from '../components/IdleAnimationComponent';
import IdleAnimationSystem from '../systems/IdleAnimationSystem';
import BubblesSystem from '../systems/BubblesSystem';
import FadeInComponent from '../components/FadeInComponent';
import FadeInSystem from '../systems/FadeInSystem';
import RandomMovementComponent from '../components/RandomMovementComponent';
import RandomMovementSystem from '../systems/RandomMovementSystem';
import BubblesComponent from '../components/BubblesComponent';
import TextButton from '../ui/TextButton';
import Fish from '../entities/Fish';
import Entity from '../entities/Entity';
import SpriteButton from '../ui/SpriteButton';
import { io, Socket } from 'socket.io-client';
import Utils from '../utils';

const FISH_HEIGHT = GAME_HEIGHT * 0.7;
const MARGIN = 20;

export class Game extends Scene
{
  private randomMovementSystem: RandomMovementSystem;
  private fadeInSystem: FadeInSystem;
  private clickableSystem: ClickableSystem;
  private idleAnimationSystem: IdleAnimationSystem;
  private bubbleSystem: BubblesSystem;
  private idleAnimationEntities: Entity[] = [];
  private fishData: Fish[];
  private scoreText: Phaser.GameObjects.Text;
  private score: number = 0;
  private gameMode: string;
  private socket: Socket;
  private fishes: Map<string, Entity> = new Map();
  private volume: number = 1;
  private currentSongKey: string;
  private currentSong: Phaser.Sound.HTML5AudioSound |
    Phaser.Sound.WebAudioSound | Phaser.Sound.NoAudioSound;

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
    // --------------------------------------------------
    // ----------------- Start Systems ------------------
    // --------------------------------------------------
    this.randomMovementSystem = new RandomMovementSystem(this);
    this.fadeInSystem = new FadeInSystem(this);
    this.clickableSystem = new ClickableSystem(this);
    this.idleAnimationSystem = new IdleAnimationSystem(this);
    this.idleAnimationEntities = [];
    this.fishData = this.cache.json.get('fishdata').map((data: any) => new Fish(data));
    this.bubbleSystem = new BubblesSystem(this);

    this.volume = parseInt(Utils.getFromLocalStorage("volume", "1"));
    this.playRandomMusic();


    // --------------------------------------------------
    // ------------------ Web sockets -------------------
    // --------------------------------------------------
    this.socket = io(SOCKET_IO_URL);
    console.log("Will try to connect to the server at: ", SOCKET_IO_URL);

    // --- initial connection to the websocket server
    this.socket.on("connect", () =>
    {
      console.log("Connected to server!");
      this.socket.emit(FishEvents.USER_CONNECTED, { userType: this.gameMode });
    });

    this.socket.on(FishEvents.GAME_RESETED, () =>
    {
      this.fishes.forEach((fish) =>
      {
        this.KillLocalFish(fish);
      });
    });

    // --- the server will send the initial fish data
    this.socket.on(FishEvents.FISH_INITIALIZE, (data: any[]) =>
    {
      console.log("Fish Initialized: ", data);
      this.fishes.clear();
      for (let fish of data)
      {
        this.SpawnLocalFish(fish.fishKey, fish.x, fish.y, fish.id, fish.isGroup);
      }
    });

    // --- receive the fish that was just spawned by the server
    this.socket.on(FishEvents.FISH_SPAWNED, (data: any) =>
    {
      console.log("New Fish Spawned: ", data);
      this.SpawnLocalFish(data.fishKey, data.x, data.y, data.id, data.isGroup);
    });

    // --- receive the fish that was just removed by the server
    this.socket.on(FishEvents.FISH_DELETED, (id: string) =>
    {
      this.sound.add(Sound.BUBBLE).play({ volume: this.volume });
      const fish = this.fishes.get(id);

      if (fish)
      {
        this.KillLocalFish(fish);
      }

      console.log("Fish Deleted: ", id, fish);
    });

    // --- receive score update
    this.socket.on(FishEvents.SCORE_UPDATED, (score: number) =>
    {
      this.score = score;
      if (this.scoreText) this.scoreText.setText(`Score: ${this.score}`);
    });


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

    // back background objects
    map.createLayer("backsand", tileset, 0, GAME_HEIGHT / 2 - 100);

    let backgroundObjects = map.createFromObjects("backobjs", { classType: Entity }) as Entity[];
    for (let obj of backgroundObjects)
    {
      obj.y += GAME_HEIGHT / 2 - 90;
      if (obj.moves) this.idleAnimationEntities.push(obj);
    }

    // bubble particles
    const n = 5;
    for (let i = 1; i <= n; i++)
    {
      this.add.particles((GAME_WIDTH / (n + 1)) * i, FISH_HEIGHT + 100, "particle-buble", {
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

    // front background objects
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
    new TextButton(this, 200, GAME_HEIGHT - 100, 'Switch Vol', () =>
    {
      this.setVolume(this.volume === 1 ? 0 : 1);
    }).setDepth(1000);

    if (this.gameMode === GameModes.THERAPIST)
    {
      new TextButton(this, GAME_WIDTH - 200, GAME_HEIGHT - 230, 'Random Fish', () =>
      {
        this.SpawnServerFish();
      }).setDepth(1000);

      new TextButton(this, GAME_WIDTH - 200, GAME_HEIGHT - 100, 'Reset', () =>
      {
        this.socket.emit(FishEvents.FULL_RESET);
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 230, 80, 'redfish', () =>
      {
        this.SpawnServerFish("redfish");
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 80, 80, 'bluefish', () =>
      {
        this.SpawnServerFish("bluefish");
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 80, 230, 'blobfish', () =>
      {
        this.SpawnServerFish("blobfish");
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 230, 230, 'lilacfish', () =>
      {
        this.SpawnServerFish("lilacfish");
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 230, 380, 'goldenfish', () =>
      {
        this.SpawnServerFish("goldenfish");
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 80, 380, 'greenfish', () =>
      {
        this.SpawnServerFish("greenfish");
      }).setDepth(1000);

      new SpriteButton(this, GAME_WIDTH - 80, 530, 'eel', () =>
      {
        this.SpawnServerFish("eel");
      }).setDepth(1000);
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
      fishData = Utils.getRandomFromArray(this.fishData);
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

  KillLocalFish(fish: Entity): void
  {
    const fishKey = fish.getFishType();
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
      speed: { min: 50, max: 100 },
      angle: { min: -150, max: -30 },
      scale: { start: 0, end: 0.6 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      anim: "anim-particle-bubble",
      lifespan: 1400,
      quantity: 5
    });

    this.time.delayedCall(200, () =>
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
        }
      })
    });
  }

  SpawnLocalFish(fishKey: string, x: number, y: number, id: string, isGroup: boolean = false): void
  {
    console.log("Spawn Local Fish: ", fishKey, x, y, isGroup);
    if (isGroup)
    {
      console.log("not implemented yet")
    }

    const fish = new Entity(this, x, y, fishKey);
    fish.setId(id);
    this.fishes.set(id, fish);

    // add a clickable component to the fish
    const handleClick = () =>
    {
      this.socket.emit(FishEvents.FISH_MARKED_FOR_DELETE, id);
    }

    fish.addComponent(new ClickableComponent(handleClick));
    this.clickableSystem.processEntity(fish);


    fish.addComponent(new BubblesComponent("particle-bubble"));
    this.bubbleSystem.processEntity(fish);

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

  playRandomMusic()
  {
    this.currentSongKey = Utils.getRandomFromArray(Object.values(Music));
    this.currentSong = this.sound.add(this.currentSongKey, { volume: this.volume });
    this.currentSong.play();

    this.currentSong.on('complete', () =>
    {
      this.playRandomMusic();
    });
  }

  setVolume(volume: number)
  {
    this.volume = volume;
    this.currentSong.setVolume(volume);
    Utils.setToLocalStorage("volume", this.volume);
  }
}
