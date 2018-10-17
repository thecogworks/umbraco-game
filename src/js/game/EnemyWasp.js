function EnemyWasp(X, Y){
    Enemy.call(this, X, Y, 'enemywasp');
    //Phaser.Sprite.call(this, game, X, Y, 'enemytest');
    //this.x = X;
    //this.y = Y;
    //this.width = W;
    //this.height = H;
    this.blinkTimer = 6;
   

    this.fsm = new FiniteStateMachine();
    game.physics.arcade.enable(this);
    this.body.bounce.y = 0;
    this.body.linearDamping = 1;
    this.body.collideWorldBounds = true;
     this.body.immovable = true;
    this.body.allowGravity = false;
     
    this.seekBoxSize = {w: 50, h: 20};
    this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    this.attackBoxSize = {w: 32, h: 20}; // A seek box used to trigger the attack state
    this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);
    
    this.dir = 0; // 0 for left, 1 for right.
    this.prevdir = 1;
    
    //anims
    
    this.animations.add('left', [0, 1], 2, true);
    this.animations.add('right', [2, 3], 2, true);
    this.animations.add('idle_left', [0], 2, true);
    this.animations.add('idle_right', [3], 2, true);

    this.interruptTime = 10;
    //=====
    //States
    //=====
    //Idle state
    this.state_Idle = new ActorState(this);
    this.state_Idle.onEnter = function(){
       this.idleTimer = 50;
       this.idleCount = 0;
    };
    this.state_Idle.onExit = function(){
    };
    this.state_Idle.update = function(){
        this.idleCount++;
        if(this.idleCount > this.idleTimer){
            this.fsm.changeState(this.actor.state_Wander);
        }
    };
    
    //Wander state
    this.state_Wander = new ActorState(this);
    this.state_Wander.onEnter = function(){
       //this.dir = Math.round(Math.random() * 1);
       if(this.actor.prevdir == 1){
           this.actor.dir = 0;
           this.actor.animations.play('left');
       }else{
           this.actor.dir = 1;
           this.actor.animations.play('right');
       }
       this.wanderTimer = 350;
       this.wanderCount = 0;
    };
    this.state_Wander.onExit = function(){
        this.actor.body.velocity.x = 0;
        this.prevdir = this.actor.dir;
        this.actor.prevdir = this.actor.dir;
    };
    this.state_Wander.update = function(){
        this.wanderCount++;
        if(this.actor.dir == 1){
            this.actor.body.velocity.x = 15;
        }else{
            this.actor.body.velocity.x = -15;
        }
        
        if(this.wanderCount > this.wanderTimer){
            this.fsm.changeState(this.actor.state_Idle);
        }
    };
     //set initial state
    this.fsm.changeState(this.state_Idle);
}

EnemyWasp.prototype = Object.create(Enemy.prototype);
EnemyWasp.prototype.constructor = EnemyMinion;

EnemyWasp.prototype.update = function(){
    this.updateActor();
    this.fsm.update();
};

EnemyWasp.prototype.checkSeekBox = function(posKey, target){
    var detected = false;
    switch(posKey){
        case 'left':
            this.seekBox.x = this.x + (this.width/2) - this.seekBoxSize.w;
            this.seekBox.y = this.y + (this.height / 2) - (this.seekBoxSize.h / 2);
            break;
        case 'right':
            this.seekBox.x = this.x + (this.width/2);
            this.seekBox.y = this.y + (this.height / 2) - (this.seekBoxSize.h / 2);
            break;
        case 'centered':
            this.seekBox.x = this.x + (this.width / 2) + (this.seekBoxSize.w / 2);
            this.seekBox.y = this.y + (this.height / 2) - (this.seekBoxSize.h / 2);
            break;
    }
    if(this.seekBox.overlap(target)){
        detected = true;
    }
    return detected;
};

EnemyWasp.prototype.checkAttackBox = function (target){
    var detected = false;
    this.attackBox.x = this.x + (this.width / 2) - (this.attackBoxSize.w / 2);
    this.attackBox.y = this.y + (this.height / 2) - (this.attackBoxSize.h / 2);
    if(this.attackBox.overlap(target)){
        detected = true;
    }
    return detected;
};