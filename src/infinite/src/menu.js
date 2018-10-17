var Menu = {
  preload: function() {
    game.load.image("startBtn", "assets/start.png");
    game.load.image('background', 'assets/background.png');
  },

  create: function() {
    game.add.image(0, 0, 'background');

    startButton = game.add.button(game.width/2, game.height/2, "startBtn", this.startGame, this);
    startButton.anchor.setTo(0.5);
  },

  startGame: function() {
    game.state.start("Game");
  }
};
