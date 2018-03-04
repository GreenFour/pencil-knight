define([
    "entity",
    "animation"
],function(
    Entity,
    Animation
){

    /***********
    Camera class
    xView, yView - position of camera (top left)
    canvasWidth, canvasHeight - camera dimensions
    worldWidth, worldHeight - dimensions that represent the world's boundary

    ***********/
    class Camera extends Entity {
        constructor(game, xView, yView=0, img=null, ctx=null, canvasWidth, canvasHeight, worldWidth, worldHeight) {
            super(game, xView, yView, img, ctx);
            this.canvasWidth = canvasWidth; //this is the viewport, NOT the same as canvas in core.js
            this.canvasHeight = canvasHeight; //this is the viewport, NOT the same as canvas in core.js
            this.worldWidth = worldWidth;
            this.worldHeight = worldHeight;


            // possible axis the camera can move in. not implemented yet
            this.axis = {
                "none": false,
                "horizontal": false,
                "vertical": false,
                "both": true
            }

            // object to be followed (the Hero)
            this.followed = null;
        }

        follow (obj) {
            this.followed = obj;
        }

        draw(ctx) {
            //  ctx.setTransform(1, 0, 0, 1, 0, 0); //reset transform matrix
            //  ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight); // clear viewport after matrix is reset
              ctx.translate(this.xView, this.yView);
            
        }


        update() {
            // Note: this logic feels HORRIBLY wrong, but it works for now, so yay?
            if (this.followed != null) {
                //TODO: need to figure out world bounds for min and max clamping
                this.xView = -this.followed.x + this.canvasWidth/2;
                this.yView = -this.followed.y + this.canvasHeight/1.5;
            }
            
             //console.log("xView: " + this.xView);
             //console.log("yView: " + this.yView);
             //console.log("hero x: " + this.followed.x);
             //console.log("hero y: " + this.followed.y);

        }

        boundsCheck(val, min, max) {
            return Math.min(Math.max(val, min), max);
        }

    }
    return Camera;
});