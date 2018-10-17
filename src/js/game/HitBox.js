function HitBox(game, X, Y, key, friendly, lifespan){
    Phaser.Sprite.call(this, game, X, Y, key);
    //this.x = X;
    //this.y = Y;
    //this.width = W;
    //this.height = H;
    this.friendly = friendly;
    this.lifespan = lifespan;
}

//  Here is a custom game object
HitBox.prototype = Object.create(Phaser.Sprite.prototype);
HitBox.prototype.constructor = HitBox;


HitBox.prototype.update = function(){
    //use this for any hitbox unique functionality
};

function ExtendHitBox(game, X, Y){
    HitBox.call(this, game, X, Y, 'blanksprite', true, 1000);
}

//ExtendHitBox.prototype = Object.create(HitBox.prototype);
//ExtendHitBox.prototype.constructor = ExtendHitBox;
//console.log("test");    
//test = new HitBox(50, 50, 50, 50, true, 600);
//console.log(test);
