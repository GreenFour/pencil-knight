define([
    'asset-manager',
    'game-engine',
    'game-board',
    'entity',
], function(
    AssetManager,
    GameEngine,
    GameBoard,
    Entity,
) {

    let init = function() {
        console.log("init")
    };

    // the "main" code begins here

    toload = [
        "img/ZXe.png",
        "img/OtorenRockman.jpg",
        "animations/hero.json",

    ];

    let ASSET_MANAGER = new AssetManager(toload);

    ASSET_MANAGER.downloadAll(function () {
        console.log("starting up da sheild");
        let canvas = document.getElementById('gameWorld');
        let ctx = canvas.getContext('2d');

        let gameEngine = new GameEngine();

        // gameEngine.showOutlines = true;
        // let gameboard = new GameBoard();

        // gameEngine.addEntity(gameboard);
        // console.log(hero);
        //(game, x, y, img=null, ctx=null, scale=3, spriteWidth=50, spriteHeight=50)
        gameEngine.addEntity(new Entity.Hero(gameEngine, 200, 500, 
            ASSET_MANAGER.getAsset("img/ZXe.png"), 
            ctx));
     
        gameEngine.init(ctx);
        gameEngine.start();
    });

    return {
        init: init
    };

});

