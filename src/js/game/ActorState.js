function ActorState(a){
    this.actor = a;
    this.fsm = this.actor.fsm;
    
    this.interruptable = false;
}

ActorState.prototype.onEnter = function(){

}

ActorState.prototype.onExit = function(){

}

ActorState.prototype.update = function(){

}