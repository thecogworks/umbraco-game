function Actor(X, Y, key, HP){
    Phaser.Sprite.call(this, game, X, Y, key);
    this.maxHP = 3;
    if(HP){
        this.maxHP = HP;
    }
    this.curHP = this.maxHP;
    this.blinkTimer = 30;
    this.blinkCount = 0;
    this.blinking = false;
    this.interruptTime = 10;
    this.interruptCounter = 0;
    this.interrupted = false;
    
}

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.constructor = Actor;

Actor.prototype.updateActor = function(){
    if(this.blinking){
        this.blink();
    }
}

Actor.prototype.blink = function(){
    this.blinkCount++;
    if(this.blinkCount % 3 != 2){
        this.renderable = false;
    }else{
        this.renderable = true;
    }
    if(this.blinkCount >= this.blinkTimer){
        this.blinkCount = 0;
        this.renderable = true;
        this.blinking = false;
    }
}

Actor.prototype.takeDamage = function(){
    if(!this.blinking){
        this.curHP--;
        if(this.curHP <= 0){
            this.onDeath();
        }
    }
}

Actor.prototype.onDeath = function(){
    this.destroy();
}