function HUD(){
    this.hpBarIconX = 0;
    this.hpBarIconY = 0;
    this.hpBarContainerX = 18;
    this.hpBarContainerY = 2;
    this.hpBarX = this.hpBarContainerX + 2;
    this.hpBarY = this.hpBarContainerY + 2;
    this.scoreIconX = 130;
    this.scoreIconY = 0;
    this.scoreTextX = this.scoreIconX + 12;
    this.scoreTextY = this.scoreIconY - 1;
    this.timeIconX = 10;
    this.timeIconY = 138;
    this.timeTextX = this.timeIconX + 12;
    this.timeTextY = this.timeIconY - 1;
    this.timeElapsedInMs = 0;
    this.timeElapsedInCs = 0;
    this.timeElapsedInS = 0;
    this.timeElapsedInM = 0;
    
    this.lifeIcon = game.add.sprite(this.hpBarIconX, this.hpBarIconY, 'hpbar_icon');
    this.lifeBarContainer = game.add.sprite(this.hpBarContainerX, this.hpBarContainerY, 'hpbar_container');
    this.lifeBar = game.add.sprite(this.hpBarX, this.hpBarY, 'hpbar');
    this.scoreIcon = game.add.sprite(this.scoreIconX, this.scoreIconY, 'scoreicon');
    this.scoreText = game.add.text(this.scoreTextX, this.scoreTextY, '0', {font: '10px Verdana', fill: '#FFF'});
    this.timeIcon = game.add.sprite(this.timeIconX, this.timeIconY, 'timeicon');
    this.timeText = game.add.text(this.timeTextX, this.timeTextY, "0:00'00",  {font: '10px Verdana', fill: '#FFF'});
    
    this.lifeIcon.fixedToCamera = this.lifeBarContainer.fixedToCamera = this.lifeBar.fixedToCamera = 
    this.scoreIcon.fixedToCamera = this.scoreText.fixedToCamera = this.timeIcon.fixedToCamera = this.timeText.fixedToCamera = true;
    this.lifeBar.initialWidth = this.lifeBar.width;
}

HUD.prototype.update = function(){
    this.updateTimer();
};

HUD.prototype.updateScore = function(newpoints){
    game.points += newpoints;
    console.log(game);
    this.scoreText.text = game.points.toString();
};

HUD.prototype.updateTimer = function(){
    this.timeElapsedInMs += game.time.elapsedMS;
    this.timeElapsedInCs = Math.floor(this.timeElapsedInMs / 10) % 100;
    this.timeElapsedInS = Math.floor(this.timeElapsedInMs / 1000) % 60;
    this.timeElapsedInM = Math.floor(this.timeElapsedInMs / 1000 / 60);
    this.timeText.text = this.timeElapsedInM.toString() + ":" + this.timeElapsedInS + "'" + this.timeElapsedInCs;
};

HUD.prototype.updateLifeBar = function(){
    this.lifeBar.width = (player.curHP / player.maxHP) * this.lifeBar.initialWidth;
}