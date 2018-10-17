function EmptyLevel(){
}

EmptyLevel.prototype.preload = function() {
   
}
    
EmptyLevel.prototype.create = function() {
    scoreText = game.add.text(16, 16, 'Level 1', {fontSize: '32px', fill: '#FFF'});
}

EmptyLevel.prototype.update = function() {
}