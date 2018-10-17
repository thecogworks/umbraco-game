function Goal(X, Y){
    Phaser.Sprite.call(this, game, X, Y, 'goal');
    
    this.animations.add('a', [0, 0, 0, 0, 1], 10, true);
    this.animations.play('a');
}

Goal.prototype = Object.create(Phaser.Sprite.prototype);
Goal.prototype.constructor = Goal;