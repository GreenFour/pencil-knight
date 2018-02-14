define([
    'actor',
    'animation',
], function (
    Actor,
    Animation,
    ) {


        class Projectile extends Actor {

            //Added energized (BEFORE DIMENSIONS) to choose correct projectile
            constructor(game, x, y, img = null, ctx = null, scale = 3, facingRight, energized, spriteWidth = 60, spriteHeight = 60) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 7;
                if (facingRight) { this.x += 100; } else { this.x -= 100 };//offset to match gun
                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2);
                this.boundWidth = 0;
                this.boundHeight = 0;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y + (this.spriteHeight * this.scale - this.boundHeight);

                this.states = {
                    "green": !energized,
                    "blue": energized,
                    "active": true,
                    "stablized": false,                    
                    "facingRight": facingRight,
                };
                this.animations = {
                    "green_exiting": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 3, 15, 6, 8, false, this.scale, 4),
                    "green_stable": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 3, 15, 6, 4, true, this.scale, 11),
                    "blue_exiting": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 3, 23, 6, 8, false, this.scale, 15),
                    "blue_stable": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 3, 23, 6, 3, true, this.scale, 20),
                };
                if (this.states.green) { this.animation = this.animations.green_exiting; } else { this.animation = this.animations.blue_exiting; }
            }

            update() {
                //TODO
                if (this.states.facingRight) { this.x += this.movementSpeed; } else { this.x -= this.movementSpeed; }
                if (this.states.active) {
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.active = false;
                        this.states.stablized = true;
                    }
                }
                else if (this.states.stablized) {
                    if (this.animation.loops > 1) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.stablized = false;
                        this.removeFromWorld = true;
                    }
                }
            };

            draw(ctx) {
                if (this.states.green) {
                    if (this.states.active) {
                        this.animation = this.animations.green_exiting;
                    }
                    if (this.states.stablized) {
                        this.animation = this.animations.green_stable;
                    }
                    this.drawImg(ctx);
                }
                else if (this.states.blue) {
                    if (this.states.active) {
                        this.animation = this.animations.blue_exiting;
                    }
                    if (this.states.stablized) {
                        this.animation = this.animations.blue_stable;
                    }
                    this.drawImg(ctx);
                }
            }

            drawOutline(ctx) {
                ctx.beginPath();
                ctx.strokeStyle = "green";
                ctx.rect(this.boundX,
                    this.boundY,
                    this.boundWidth, this.boundHeight);
                ctx.stroke();
                ctx.closePath();
            }


            drawImg(ctx) {
                this.drawOutline(ctx);
                if (this.yVelocity < 0) {
                    this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);

                } else this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);

            }
    }

        return Projectile;
    });
