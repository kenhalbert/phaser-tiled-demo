import Phaser from 'phaser';
import PlayerControls from '../input/PlayerControls';

class MainScene extends Phaser.Scene {
  constructor () {
    super({ key: 'MainScene' });

    this.worldBaseY = 200;
  }

  preload () {
    this.load.image('background', 'assets/images/background.png');
    this.load.image('spike', 'assets/images/spike.png');
    this.load.image('tiles', 'assets/tilesets/platformPack_tilesheet.png');

    this.load.atlas('player', 'assets/images/player.png','assets/images/player_atlas.json');

    this.load.tilemapTiledJSON('map', 'assets/tilemaps/tilemap.json');
  }

  create () {
    this.initProperties();

    this.createBackgroundImage();

    const map = this.make.tilemap({ key: 'map' });

    const tileset = map.addTilesetImage(
      'platform-pack',   // this needs to be the name of the tileset in the map data
      'tiles'
    );

    const platforms = map.createStaticLayer('Platforms', tileset, 0, this.worldBaseY);

    platforms.setCollisionByExclusion(-1, true);

    this.controls = new PlayerControls(this);

    this.createAnimations();

    this.createPlayer(platforms);

    this.createSpikes(map);
  }

  update() {
    if (this.controls.isMoveLeftActive()) {
      this.player.setVelocityX(-200);
      this.player.flipX = true;

      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }
    } else if (this.controls.isMoveRightActive()) {
      this.player.setVelocityX(200);
      this.player.flipX = false;

      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }
    } else {
      this.player.setVelocityX(0);

      // Only show the idle animation if the player is on the ground
      if (this.player.body.onFloor()) {
        this.player.play('idle', true);
      }
    }

    if (this.controls.isJumpActive() && this.player.body.onFloor()) {
      this.player.setVelocityY(-350);
      this.player.play('jump', true);
    }
  }

  initProperties() {
    this.player = null;
    this.controls = null;
  }

  createPlayer(platforms) {
    this.player = this.physics.add.sprite(50, 300, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);
  }

  createSpikes(map) {
    const spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const spikeObjects = map.getObjectLayer('Spikes')['objects'];

    spikeObjects.forEach(spikeObject => {
      const spike = spikes
        .create(
          spikeObject.x, 
          spikeObject.y + this.worldBaseY - spikeObject.height, 
          'spike'
        )
        .setOrigin(0, 0);
      
      spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
    });

    this.physics.add.collider(this.player, spikes, this.playerHit, null, this);
  }

  createBackgroundImage() {
    const backgroundImage = this.add.image(0, 0,'background').setOrigin(0, 0);

    backgroundImage.setScale(2, 0.8);
  }

  createAnimations() {
    this.anims.generateFrameNames('player', {
      prefix: 'robo_player_'
    });

    this.anims.create({
      key: 'walk',
      frames: [
        { key: 'player', frame: 'robo_player_2' },
        { key: 'player', frame: 'robo_player_3' }
      ],
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'robo_player_0' }],
      frameRate: 10,
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'player', frame: 'robo_player_1' }],
      frameRate: 10,
    });
  }

  playerHit() {
    this.player.setVelocity(0, 0);
    this.player.setX(50);
    this.player.setY(300);
    this.player.play('idle', true);
    this.player.setAlpha(0);

    // a tween is a transition on some property of a game object
      // (kind of like a css transition - it works in a similar way)
    this.tweens.add({
      targets: this.player,
      alpha: 1,
      duration: 100,
      ease: 'Linear',
      repeat: 5,
    });
  }
}

export default MainScene;