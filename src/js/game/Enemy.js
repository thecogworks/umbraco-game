function Enemy(X, Y, key){
    Actor.call(this, X, Y, key);
    this.fsm = new FiniteStateMachine();
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
    this.fsm.changeState(this.state_Idle);
}

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function(){
    this.updateActor();
    this.fsm.update();
};

Enemy.prototype.checkSeekBox = function(posKey, target){
    var detected = false;
    return detected;
};

Enemy.prototype.checkAttackBox = function (target){
    var detected = false;
    return detected;
};



