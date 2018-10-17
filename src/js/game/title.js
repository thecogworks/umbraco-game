function TitleScreen(game){
    this.game = game;
    this.cursors;
    this.enterKey;
    this.selector;
    this.selectorPos = 0;
    this.num_menu_objects = 3;
    this.selPosX = 50;
    this.selPosY = [100, 110, 120];
    this.selectorHoldTime = 10;
    this.selectorHoldCounter = 0
}

TitleScreen.prototype.preload = function(){
     game.load.image('title_select', 'assets/img/ui/titleselector.png');
}

TitleScreen.prototype.create = function(){
     init();
    scoreText = game.add.text(16, 16, '', {fontSize: '32px', fill: '#FFF'});
    this.selector = game.add.sprite(0,0,'title_select');
    this.selector.canMove = true;
    this.cursors = game.input.keyboard.createCursorKeys();
    this.enterKey =  game.input.keyboard.addKey(13);
    
    game.add.text(16, 16, 'GUARDIAN', {font: '16px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY[0], 'Start Game', {font: '10px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY[1], 'High Scores (not implemented)', {font: '10px Arial', fill: '#FFF'});
    game.add.text(this.selPosX, this.selPosY[2], 'Test Menu (not implemented)', {font: '10px Arial', fill: '#FFF'});
    
    this.selector.y = this.selPosY[this.selectorPos] + this.selector.height - 6;
    this.selector.x = this.selPosX - (this.selector.width * 2);
     //cursors
    cursors = game.input.keyboard.createCursorKeys();
}

TitleScreen.prototype.update = function() {
    if(this.enterKey.isDown){
        switch(this.selectorPos){
            case 0:
                game.state.start('tmxlevel');
                break;
            case 1:
                break;
            case 2:
                break;
            default:
                //do nothing
        }
       
    }

    if(cursors.up.isDown && this.selector.canMove){
        this.selectorPos -= 1;
        this.selector.canMove = false;
        if(this.selectorPos < 0){
            this.selectorPos = this.num_menu_objects - 1;
        }
        this.setSelectorPos(this.selectorPos);
    }else if(cursors.down.isDown && this.selector.canMove){
        this.selector.canMove = false;
        this.selectorPos += 1;
        if(this.selectorPos >= this.num_menu_objects){
            this.selectorPos = 0;
        }
        this.setSelectorPos(this.selectorPos);
    }
    
    if(!this.selector.canMove){
        this.selectorHoldCounter += 1;
        if(this.selectorHoldCounter > this.selectorHoldTime){
            this.selectorHoldCounter = 0;
            this.selector.canMove = true;
        }
    }
    
}

TitleScreen.prototype.setSelectorPos = function(newPos){
    if(newPos < this.selPosY.length){
        this.selector.y = this.selPosY[newPos] + this.selector.height - 6;
    }
}

TitleScreen.prototype.render = function(){
     //debug - due to the scaling it has to be done before pixel.context.drawImage or else it will be drawn underneath!
    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};