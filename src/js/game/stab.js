function Stab(X, Y, dir){
    Phaser.Sprite.call(this, game, X, Y, 'stab');
    this.lifespan = 60;
    
    this.animations.add('l', [1], 10, true);
    this.animations.add('r', [0], 10, true);
    
    if(dir == 0){
        this.animations.play('l');
    }else{
        this.animations.play('r');
    }
}

Stab.prototype = Object.create(Phaser.Sprite.prototype);
Stab.prototype.constructor = Stab;