var Game = {
  player: null,
  ground: null,
  enemies: null,
  current_speed: 200,
  speed_inc_amount: 0.05,
  time_until_spawn: null,
  last_spawn_time: null,
  scoreCount: 0,
  scoreMessage: null,

  preload: function() {
    game.load.image("ground", "assets/ground.png");
    game.load.image("player", "assets/hero-01.png");
    game.load.image("enemy", "assets/enemy-01.png");
    game.load.image("background", "assets/background.png");
  },

  create: function() {
    game.add.image(0, 0, "background");
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.resetScoreCount();
    this.scoreMessage = game.add.text(20, 20, this.getScoreText(), { font: "20px Arial", fill: "#000000", align: "left"});

    // register ground
    this.ground = game.add.sprite(0, game.world.height - 84, "ground");
    game.physics.arcade.enable(this.ground);
    this.ground.body.immovable = true;

    // register player sprite
    this.player = game.add.sprite(72, game.world.height - 182, "player");
    game.physics.arcade.enable(this.player);
    this.player.body.gravity.y = 1000;

    // register key events
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    spaceKey.onDown.add(this.jump, this);
    upKey.onDown.add(this.jump, this);

    // register enemies
    this.enemies = game.add.group();
    this.enemies.enableBody = true;

    this.time_until_spawn = Math.random() * 1000 + 1000;
    this.last_spawn_time = game.time.time;

    this.current_speed = 200;
  },

  update: function() {
    this.increaseSpeed();
    game.physics.arcade.collide(this.player, this.ground);
    game.physics.arcade.overlap(this.player, this.enemies, this.endGame, null, this);

    var current_time = game.time.time;
    if (current_time - this.last_spawn_time > this.time_until_spawn) {
      this.time_until_spawn = Math.random() * 1000 + (1000 - this.current_speed);
      this.last_spawn_time = current_time;
      this.spawnEnemy();
    }
  },

  jump: function() {
    if (this.player.body.touching.down) {
      this.player.body.velocity.y = -600;
    }
  },

  spawnEnemy: function() {
    var enemy = this.enemies.create(game.world.width, game.world.height - 182, "enemy");

    this.updateScoreCount(1);

    enemy.body.velocity.x = -this.current_speed;

    enemy.checkWorldBounds = true;
    enemy.outOfBoundsKill = true;
  },
  
  updateScoreCount: function(numberToAddToScore) {
    this.scoreCount += numberToAddToScore;
    this.updateScoreMessage();
  },

  updateScoreMessage: function() {
    this.scoreMessage.setText(this.getScoreText());
  },

  getScoreText: function() {
    return "Score: " + this.scoreCount;
  },

  resetScoreCount: function() {
    this.scoreCount = 0;
  },

  increaseSpeed: function() {
    if (this.current_speed < 500) {
      this.current_speed += this.speed_inc_amount;
    }
  },

  endGame: function() {
    alert("Final " + this.getScoreText());
    game.state.start("Menu");
  }
};