function TmxLevel(){
   this.map;
   this.tileset;
   this.layer;
   this.wall_layer;
   this.bkg_layer;
  
   this.cursors;
   this.spaceBar;
   
    //actors and groups
    this.p;
    this.enemies;
    this.bullets;
    this.hitboxes_friendly;
    this.hitboxes_unfriendly;
    this.hitboxes_seek;
    this.items;
    this.hazards;
    
    //hud
    this.hud;
}

TmxLevel.prototype.preload = function() {
   game.load.tilemap('circuitboard', 'assets/tilemap/testmap.json', null, Phaser.Tilemap.TILED_JSON);
   game.load.image('circuitboard_tiles', 'assets/img/tileset/webgametiles.png');
   //sprite images
   game.load.spritesheet('playerchar', 'assets/img/sprites/player.png', 14, 18);
   game.load.spritesheet('enemytest', 'assets/img/sprites/enemytest.png', 12, 16);
   game.load.spritesheet('blanksprite', 'assets/img/sprites/blanksprite.png', 1, 1);
   game.load.spritesheet('enemysnail', 'assets/img/sprites/EnemySnail.png', 16, 16);
   
   //hud images
   game.load.image('hpbar_icon', 'assets/img/hud/hpBarIcon.png');
   game.load.image('hpbar_container', 'assets/img/hud/hbBarContainer.png');
   game.load.image('hpbar', 'assets/img/hud/hpBar.png');
   game.load.image('scoreicon', 'assets/img/hud/scoreIcon.png');
   game.load.image('timeicon', 'assets/img/hud/timeIcon.png')
   
   //other things
   game.load.spritesheet('goal', 'assets/img/sprites/goal.png', 32, 24);
   game.load.image('spikes', 'assets/img/sprites/spikes.png', 32, 32);
   game.load.spritesheet('stab','assets/img/sprites/stab.png', 16, 8);
};

TmxLevel.prototype.create = function() {
    
   scoreText = game.add.text(16, 16, 'Level 1', {fontSize: '32px', fill: '#FFF'});
  
   
   //Physics
   game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 250;
    
    
   game.stage.backgroundColor = "#000000";
   this.map = game.add.tilemap('circuitboard');
   this.map.addTilesetImage( 'webgametiles', 'circuitboard_tiles');
   this.bkg_layer = this.map.createLayer('bkg');
   this.wall_layer = this.map.createLayer('wall');
   this.map.setCollisionByExclusion([0], true, this.wall_layer);
   this.wall_layer.resizeWorld();
  
   //init();
    //init sprite groups
    this.enemies = game.add.group();
    this.hitboxes_unfriendly = game.add.group();
    this.hitboxes_friendly = game.add.group();
    this.hitboxes_seek = game.add.group();
    
   //make player
   playerchar = new Player(0,0);
   player = game.add.existing(playerchar)
   this.p = player;
   game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
   
   //make goal
   this.goal = new Goal(0, 0);
   
   //load objects from the map
   this.createObjectsFromMap();
   
    game.add.existing(this.goal);
   
   
   
    //controls
    this.cursors = game.input.keyboard.createCursorKeys();
    this.spaceBar =  game.input.keyboard.addKey(32);
    
    this.hud = new HUD();
};

TmxLevel.prototype.update = function() {
    game.physics.arcade.collide(this.p, this.wall_layer);
    game.physics.arcade.collide(this.p, this.enemies);
    game.physics.arcade.collide(this.enemies, this.wall_layer);
    
    game.physics.arcade.overlap(this.hitboxes_friendly, this.enemies, this.onFriendlyOverlapWithEnemy);
    game.physics.arcade.overlap(this.hitboxes_unfriendly, this.p, this.onUnfriendlyOverlapWithPlayer);
    this.hud.update();
    if(this.goal.overlap(this.p)){
        this.onPlayerReachGoal();
    }
    if(this.p.y > 440){
        this.p.y = 0;
        game.state.start("gameover");
    }
};

TmxLevel.prototype.render = function(){
     //debug - due to the scaling it has to be done before pixel.context.drawImage or else it will be drawn underneath!
    //this.hitboxes_friendly.forEachExists(this.renderGroup, this, 0);
    //this.hitboxes_unfriendly.forEachExists(this.renderGroup, this, 1);
    //this.hitboxes_seek.forEachExists(this.renderGroup, this, 2);
    
    pixel.context.drawImage(game.canvas, 0, 0, game.width, game.height, 0, 0, pixel.width, pixel.height);
};

TmxLevel.prototype.debug = function(){
    
};

TmxLevel.prototype.renderGroup = function(member, n){
    switch(n){
        case 0:
            game.debug.body(member, 'rgba(0,255,0,0.4)');
            break;
        case 1:
            game.debug.body(member, 'rgba(255,0,0,0.4)');
            break;
        case 2:
            game.debug.body(member, 'rgba(0,200,200,0.4)');
            break;
    }
   
};

TmxLevel.prototype.createObjectsFromMap = function(){
    var objs = this.map.objects.objects;
    for(var i in objs){
        //console.log(objs[i].x);
        switch(objs[i].name){
            case 'player':
                console.log('pl' + objs[i].name);
                //player already exists so just set its position
                player.x = objs[i].x;
                player.y = objs[i].y - player.height;
                break;
            case 'enemy':
                console.log('en' + objs[i].gid);
                this.createEnemiesFromMap(objs[i]);
                break;
            case 'spikes':
                console.log('place spikes');
                this.createHazardsFromMap(objs[i]);
                break;
            case 'item':
                console.log('place item');
                this.createItemsFromMap(objs[i]);
                break;
            case 'goal':
                console.log(this.goal);
                this.goal.x = objs[i].x;
                this.goal.y = objs[i].y - 24;
                break;
        }
    }
}

TmxLevel.prototype.createEnemiesFromMap = function(en){
    var newenemy;
    
    switch(en.gid){
        case 197:
            newenemy = new EnemyMinion(en.x, en.y - 16);
            break;
        case 194:
            newenemy = new EnemySnail(en.x, en.y - 16);
            break;
    }
    
    if(newenemy){
        this.enemies.add(newenemy);
    }else{
        console.log("Invalid enemy: " + en.gid)
    }
}

TmxLevel.prototype.createItemsFromMap = function(itm){
    var newitem;
    
    switch(itm.gid){
        case 205:
            console.log("points item goes here");
            break;
    }
    
    if(newitem){
        this.items.add(newitem);
    }else{
        console.log("invalid item: " + itm.gid)
    }
}

TmxLevel.prototype.createHazardsFromMap = function(hzd){
    var newhazard;
    
    switch(hzd.gid){
        case 204:
            console.log("spikes go here");
            break;
    }
    
    if(newhazard){
        this.hazards.add(newhazard);
    }else{
        console.log("invalid spikes: " + hzd.gid)
    }
}

TmxLevel.prototype.createHitBox = function(X, Y, W, H, friendly, lifespan, seek){
    var spr = game.add.sprite(X, Y, 'blanksprite');
    game.physics.enable(spr, Phaser.Physics.ARCADE);
    spr.body.immovable = true;
    spr.body.allowGravity = false;
    spr.width = W;
    spr.height = H;
    spr.lifespan = lifespan;
    //spr.body.setSize(W, H, 0, 0);
    spr.renderable = false;
    //spr.visible = false;
    if(seek){
        this.hitboxes_seek.add(spr);
        return spr;
    }
    if(friendly){
        this.hitboxes_friendly.add(spr);
        console.log("added?")
    }else{
        this.hitboxes_unfriendly.add(spr);
    }
    return spr;
};

TmxLevel.prototype.onHitboxOverlapSprite = function(hb, spr){
    if(hb.friendly){
       console.log("enemy was hit!"); 
    }else if(!hb.friendly){
       console.log("player was hit!");
    }
    hb.destroy();
}

TmxLevel.prototype.onFriendlyOverlapWithEnemy = function(hb, ene){
    console.log("enemy was hit! " + ene);
    hb.destroy();
    ene.takeDamage();
    ene.blinking = true;
}

TmxLevel.prototype.onUnfriendlyOverlapWithPlayer = function(plyr, hb){
    
    hb.destroy();
    if(!player.blinking){
        player.takeDamage();
        player.blinking = true;
        game.state.getCurrentState().hud.updateLifeBar();
    }
    
}

TmxLevel.prototype.onPlayerReachGoal = function(){
    game.state.start("gameclear");
}

TmxLevel.prototype.incrementScore = function(pts){
    if(pts){
        this.hud.updateScore(pts);
    }
}

