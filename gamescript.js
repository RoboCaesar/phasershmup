var game = new Phaser.Game(500, 300, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var shotTime = 0;
var playerShot;
var onePlayerShot;
var playerData;

function preload() {

    //Player sprites
    game.load.spritesheet('hero', 'assets/sprites/hero.png', 42, 20);
    game.load.spritesheet('trail', 'assets/sprites/engine trail.png', 15, 7);
    //player shots
    game.load.image('shot0', 'assets/sprites/shot1.png');


    game.load.image('sky', 'assets/sprites/sky2.png');


    

    //from: https://www.belenalbeza.com/articles/retro-crisp-pixel-art-in-phaser/
    // scale the game 4x
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(2, 2);

    // enable crisp rendering
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas)

    playerData.powerLevel = 0;

}

function create() {
    game.add.sprite(0,0, 'sky');

    game.physics.startSystem(Phaser.Physics.ARCADE);


    trail = game.add.sprite(-15, 8, 'trail');
    trail.animations.add('fire', [0, 1, 2], 20, true);
    trail.animations.play('fire');

    player = game.add.sprite(40, 200, 'hero');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    player.addChild(trail);

    //From https://phaser.io/examples/v2/input/keyboard-justpressed
    playerShot = game.add.group();

    playerShot.enableBody = true;

    playerShot.physicsBodyType = Phaser.Physics.ARCADE;
    playerShot.createMultiple(10, 'shot0');
    playerShot.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', resetShot, this);
    playerShot.setAll('checkWorldBounds', true);



    cursors = game.input.keyboard.createCursorKeys();

    //From https://phaser.io/examples/v2/input/keyboard-justpressed
	this.zKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);


    //  Stop the following keys from propagating up to the browser
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);


}

function update() {

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -300;
    }
    else if (cursors.right.isDown) {
        player.body.velocity.x = 300;
    }

    if (cursors.up.isDown) {
        player.body.velocity.y = -300;
        player.frame = 2;
    }
    else if (cursors.down.isDown) {
        player.body.velocity.y = 300;
        player.frame = 1;
    }

    if (!cursors.up.isDown && !cursors.down.isDown) {
        //standing still
        player.frame = 0;
    }

    if (this.zKey.isDown) {
        addShot();
    }


}


function addShot(type=0) {
    if (game.time.now > shotTime) {
        onePlayerShot = playerShot.getFirstExists(false);

        if (onePlayerShot) {
            switch(playerData.powerLevel) {
                case 0:
                    onePlayerShot.reset(player.x + 30, player.y + 10);
                    onePlayerShot.body.velocity.x = 900;
                    shotTime = game.time.now + 100;
                    break;
            }
        }
    }
}

function resetShot(onePlayerShot) {
    onePlayerShot.kill();
}