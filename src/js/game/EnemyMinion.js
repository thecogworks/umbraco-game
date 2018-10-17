function EnemyMinion(X, Y){
    Enemy.call(this, X, Y, 'enemytest');
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

    this.seekBoxSize = {w: 50, h: 20};
    this.seekBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.seekBoxSize.w, this.seekBoxSize.h, false, 0, true);
    this.attackBoxSize = {w: 32, h: 20}; // A seek box used to trigger the attack state
    this.attackBox = game.state.getCurrentState().createHitBox(this.x, this.y, this.attackBoxSize.w, this.attackBoxSize.h, false, 0, true);
    
    this.dir = 0; // 0 for left, 1 for right.
    this.prevdir = 1;

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
        
        if(this.actor.dir == 1){
            //console.log(this.actor.checkSeekBox('right', player));
            if(this.actor.checkSeekBox('right', player)){
                console.log("detected right");
                this.fsm.changeState(this.actor.state_Persue);
            }
        }else{
            if(this.actor.checkSeekBox('left', player)){
                console.log("detected left");
                this.fsm.changeState(this.actor.state_Persue);
            }
        }
    };
    
    //Wander state
    this.state_Wander = new ActorState(this);
    this.state_Wander.onEnter = function(){
       //this.dir = Math.round(Math.random() * 1);
       if(this.actor.prevdir == 1){
           this.actor.dir = 0;
       }else{
           this.actor.dir = 1;
       }
       this.wanderTimer = 50;
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
            this.actor.body.velocity.x = 55;
            if(this.actor.checkSeekBox('right', player)){
                console.log("detected right");
                this.fsm.changeState(this.actor.state_Persue);
            }
        }else{
            this.actor.body.velocity.x = -55;
            if(this.actor.checkSeekBox('left', player)){
                console.log("detected left");
                this.fsm.changeState(this.actor.state_Persue);
            }
        }
        
        if(this.wanderCount > this.wanderTimer){
            this.fsm.changeState(this.actor.state_Idle);
        }
    };
    
    //persue state
    this.state_Persue = new ActorState(this);
    this.state_Persue.onEnter = function(){
        this.persueTime = 120;
        this.persueCount = 0;
    };
    
    this.state_Persue.onExit = function(){
        this.persueCount = 0;
    };
    
    this.state_Persue.update = function(){
        this.persueCount++;
        
        if(this.actor.dir == 1){
            if(this.actor.checkSeekBox('right', player)){
                this.persueCount = 0;
            }
        }else{
            if(this.actor.checkSeekBox('left', player)){
                this.persueCount = 0;
            }
        }
        if(this.actor.checkAttackBox(player)){
            this.fsm.changeState(this.actor.state_Attack)
        };
        if(this.persueCount >= this.persueTime){
           this.fsm.changeState(this.actor.state_Idle);
        }
        
        if(player.x > this.actor.x){
            this.actor.body.velocity.x = 65;
             this.actor.dir = 1;
        }
        if(player.x < this.actor.x){
            this.actor.body.velocity.x = -65;
             this.actor.dir = 0;
        }
    };
   
   //attack state
   this.state_Attack = new ActorState(this);
   this.state_Attack.onEnter = function(){
       this.attackTimer = 15;
       this.attackCount = 0;
       this.postAttackTimer = 15;
       this.postAttackCount = 0;
       this.actor.body.velocity.x = 0;
       this.interrupt_duration = 5;
       this.interrupt_immunity = false;
       this.stabeffect;
   };
   this.state_Attack.onExit = function(){
       this.attackCount = 0;
   };
   this.state_Attack.update = function(){
       if((!this.actor.blinking && !this.actor.interrupted) || this.interrupt_immunity ){
           this.attackCount++;
           this.postAttackCount++;
       }
       //console.log(this.attackCount)
       if(this.actor.blinking && !this.actor.interrupted){
           this.actor.interrupted = true;
       }
       if(this.actor.interrupted){
            this.actor.interruptCounter++;
            if(this.actor.interruptCounter >= this.interrupt_duration){
                this.interrupt_immunity = true;
            }
            if(this.actor.interruptCounter >= this.actor.interruptTime){
                this.actor.interruptCounter = 0;
                this.actor.interrupted = false;
                this.interrupt_immunity = false;
            } 
       }
       this.actor.body.velocity.x = 0;
       if(this.attackCount == this.attackTimer){
            var hbx;
            var hby;
            if(this.actor.dir == 0){
                hbx = this.actor.x - 12;
                this.stabeffect = new Stab(this.actor.x - this.actor.width, this.actor.y + (this.actor.height / 2), this.actor.dir);
            }else{
                hbx = this.actor.x + 12;
                this.stabeffect = new Stab(this.actor.x + this.actor.width,this.actor.y + (this.actor.height / 2), this.actor.dir);
            }
            hby = this.actor.y + (this.actor.height / 2) - 4;
            
           game.state.getCurrentState().createHitBox(hbx, hby, 16, 8, false, 50);
           game.add.existing(this.stabeffect);
            console.log("attacked. " + hbx + " " + hby);
       }
       if(this.postAttackCount >= (this.attackTimer + this.postAttackTimer)){
           this.fsm.changeState(this.actor.state_Persue);
           console.log("attack finished");
       }
   };
    //set initial state
    this.fsm.changeState(this.state_Idle);
}

EnemyMinion.prototype = Object.create(Enemy.prototype);
EnemyMinion.prototype.constructor = EnemyMinion;

EnemyMinion.prototype.update = function(){
    this.updateActor();
    this.fsm.update();
};

EnemyMinion.prototype.checkSeekBox = function(posKey, target){
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

EnemyMinion.prototype.checkAttackBox = function (target){
    var detected = false;
    this.attackBox.x = this.x + (this.width / 2) - (this.attackBoxSize.w / 2);
    this.attackBox.y = this.y + (this.height / 2) - (this.attackBoxSize.h / 2);
    if(this.attackBox.overlap(target)){
        detected = true;
    }
    return detected;
};



