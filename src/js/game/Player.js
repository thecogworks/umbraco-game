function Player(X, Y){
    Actor.call(this, X, Y, 'playerchar');
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.linearDamping = 1;
    this.body.collideWorldBounds = true;
    this.gamestate = game.state.getCurrentState();
    
    this.dir = 0; // 0 for left, 1 for right.
    
    this.attackBox = {w: 16, h: 16};
    this.attackTimer;
    
    game.input.keyboard.addKey(32).onDown.add(function(){this.attack()}, this);
    
    this.animations.add('idle_left', [3], 10, true);
    this.animations.add('idle_right', [0], 10, true);
    this.animations.add('run_left',[3, 4, 3, 5] , 10, true);
    this.animations.add('run_right', [0, 1, 0, 2], 10, true);
    this.animations.add('jump_left', [5], 10, true);
    this.animations.add('jump_right', [2], 10, true);
}

Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(){
    this.updateActor();
    this.processControls();
    this.animations.play(this.updateAnimation());
};

Player.prototype.updateAnimation = function(){
    var anim = 'idle_right';
    var onground = this.body.blocked.down || this.body.touching.down;
    if(onground)
    //if (this.body.onFloor())
    {
        if(this.body.velocity.x != 0){
            if(this.dir == 0){
                anim = 'run_left';
            }else{
                anim = 'run_right';
            }
        }else{
            if(this.dir == 0){
                anim = 'idle_left';
            }else{
                anim = 'idle_right';
            }
        }
    }else{
        if(this.dir == 0){
            anim = 'jump_left';
        }else{
            anim = 'jump_right';
        }
    }
    return anim;
};

Player.prototype.processControls = function(){
    this.body.velocity.x = 0;
    var onground = this.body.blocked.down || this.body.touching.down;
    if (this.gamestate.cursors.up.isDown)
    {
        if(onground)
        //if (this.body.onFloor())
        {
            this.body.velocity.y = -180;
        }
    }

    if (this.gamestate.cursors.left.isDown)
    {
        this.body.velocity.x = -75;
        this.dir = 0;
    }
    else if (this.gamestate.cursors.right.isDown)
    {
        this.body.velocity.x = 75;
        this.dir = 1;
    }
    //set facing
    if(this.body.velocity.x > 0){
        this.dir = 1;
    }else if(this.body.velocity.x < 0){
        this.dir = 0;
    }
}

Player.prototype.attack = function(evt){
     //create hitbox depending on facing.
     var hbx;
     var hby;
     var stabeffect;
     if(this.dir == 0){
         hbx = this.x - this.attackBox.w;
         stabeffect = new Stab(player.x - player.width, player.y + (player.height / 2), this.dir);
     }else{
         hbx = this.x + this.width;
         stabeffect = new Stab(player.x + player.width, player.y + (player.height / 2), this.dir);
     }
     if(stabeffect){
         game.add.existing(stabeffect);
     }
     hby = this.y + (this.height / 2) - this.attackBox.h / 2;
     this.gamestate.createHitBox(hbx, hby, this.attackBox.w, this.attackBox.h, true, 50);
}

Player.prototype.onDeath = function(){
    game.state.start('gameover');
}