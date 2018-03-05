define([
    'entity',
    "animation",
    "hurtbox",
], function (
    Entity,
    Animation,
    Hurtbox,
    ) {

        /***********
        game - a reference to the game in which this entity exists
        x, y - entity's coordinates
        removeFromWorld - a flag that denotes when to remove this entity from the game
        ************/
        class Lava extends Entity {
            constructor(game, x, y, img = null, ctx = null, scale = null, spriteWidth = 64) {
                super(game, x, y, img, ctx);
                this.y += (96 * 3 - 6 * 3);
                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = 128;
                this.centerX = x + ((this.spriteWidth * this.scale) / 2) - this.spriteWidth;
                this.boundWidth = this.spriteWidth * this.scale;
                this.boundHeight = this.scale * (this.spriteHeight - 32);
                this.boundX = this.x - this.spriteWidth;
                this.boundY = this.y - this.spriteHeight * this.scale + 37 * this.scale;

                this.fireCooldownTimer = 0;
                this.fireCooldown = 1000;

                this.states = {
                    "active": true,
                    "facingRight": true,
                };
                this.animations = {
                    "active": new Animation(this.img, [this.spriteWidth, 128], 7, 1, 7, 8, true, this.scale),
                };
                this.animation = this.animations.active;
            }

            /*Updates the entity each game loop. i.e. what does this entity do? */
            update() {
                ////Have Lava spawn fireballs **I don't like this, but I'm leaving the code for posterity's sake.**
                //if (Math.abs(this.x - this.game.hero.x) <= 500 && this.fireCooldownTimer <= 0) {
                //    this.game.addEntity(new Fireball(this.game, this.x - 32, this.y - this.spriteHeight*2, this.img, this.ctx, 4, 15));
                //    this.fireCooldownTimer = this.fireCooldown;
                //}
                //if (this.fireCooldownTimer > 0) {
                //    this.fireCooldownTimer--;
                //}
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

            draw(ctx) {
                if (this.states.active)
                    this.drawImg(ctx);
            }

            drawImg(ctx) {
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
                this.drawOutline(ctx);
            }
        }

        class Fireball extends Entity {
            constructor(game, x, y, img = null, ctx = null, scale = null, cooldown = 150, ySpeed = 12) {
                super(game, x, y, img, ctx);

                this.scale = scale;
                this.spriteWidth = 60;
                this.spriteHeight = 60;
                this.centerX = x + ((this.spriteWidth * this.scale) / 2) - this.spriteWidth;
                this.boundWidth = 6 * this.scale;
                this.boundHeight = 20 * this.scale;
                this.boundX = this.centerX - this.boundWidth/2;
                this.boundY = this.y - this.spriteHeight*this.scale/2;

                this.origX = this.x;
                this.origY = this.y;
                this.origBoundX = this.boundX;
                this.origBoundY = this.boundY;

                this.ySpeed = ySpeed;
                this.damage = 2;
                this.cooldownTimer = 0;
                this.cooldown = cooldown;

                this.states = {
                    "active": true,
                    "start": true,
                    "middle_up": false,
                    "peak_up": false,
                    "peak_down": false,
                    "middle_down": false,
                    "finish": false,
                    "facingRight": true,
                };
                this.animations = {
                    "active": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 6, true, this.scale, 6),
                    "start": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 1, true, this.scale, 6),
                    "middle_up": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 1, true, this.scale, 7),
                    "peak_up": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 1, true, this.scale, 8),
                    "peak_down": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 1, true, this.scale, 9),
                    "middle_down": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 1, true, this.scale, 10),
                    "finish": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 13, 3, 1, true, this.scale, 11),
                };
                this.animation = this.animations.start;
                console.log(this.gravity);
            }

            /*Updates the entity each game loop. i.e. what does this entity do? */
            update() {
                if (this.states.active) {
                    if (this.states.start) {
                        this.changePos(0, -1 * this.ySpeed);
                        if (this.animation.loops > 5) {
                            this.animation.elapsedTime = 0;
                            this.animation.loops = 0;
                            this.states.start = false;
                            this.states.middle_up = true;
                        }
                    }
                    if (this.states.middle_up) {
                        this.changePos(0, -.5 * this.ySpeed);
                        if (this.animation.loops > 3) {
                            this.animation.elapsedTime = 0;
                            this.animation.loops = 0;
                            this.states.middle_up = false;
                            this.states.peak_up = true;
                        }
                    }
                    if (this.states.peak_up) {
                        this.changePos(0, -.1 * this.ySpeed);
                        if (this.animation.loops > 2) {
                            this.animation.elapsedTime = 0;
                            this.animation.loops = 0;
                            this.states.peak_up = false;
                            this.states.peak_down = true;
                        }
                    }
                    if (this.states.peak_down) {
                        this.changePos(0, .1 * this.ySpeed);
                        if (this.animation.loops > 2) {
                            this.animation.elapsedTime = 0;
                            this.animation.loops = 0;
                            this.states.peak_down = false;
                            this.states.middle_down = true;
                        }
                    }
                    if (this.states.middle_down) {
                        this.changePos(0, .5 * this.ySpeed);
                        if (this.animation.loops > 3) {
                            this.animation.elapsedTime = 0;
                            this.animation.loops = 0;
                            this.states.middle_down = false;
                            this.states.finish = true;
                        }
                    }
                    if (this.states.finish) {
                        this.changePos(0, this.ySpeed);
                        if (this.animation.loops > 5) {
                            this.animation.elapsedTime = 0;
                            this.animation.loops = 0;
                            this.states.finish = false;
                            this.states.start = true;
                            this.states.active = true;
                            this.cooldownTimer = this.cooldown;
                            this.x = this.origX;
                            this.y = this.origY;
                            this.boundX = this.origBoundX;
                            this.boundY = this.origBoundY;
                        }
                    }
                }
                if (this.cooldownTimer > 0) {
                    this.cooldownTimer--;
                    this.states.active = false;
                }
                else {
                    this.states.active = true;
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

            draw(ctx) {
                if (this.states.start) {
                    this.animation = this.animations.start;
                }
                if (this.states.middle_up) {
                    this.animation = this.animations.middle_up;
                }
                if (this.states.peak_up) {
                    this.animation = this.animations.peak_up;
                }
                if (this.states.peak_down) {
                    this.animation = this.animations.peak_down;
                }
                if (this.states.middle_down) {
                    this.animation = this.animations.middle_down;
                }
                if (this.states.finish) {
                    this.animation = this.animations.finish;
                }
                if (this.states.active) {
                    this.drawImg(ctx);
                }                
            }

            drawImg(ctx) {
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
                this.drawOutline(ctx);
            }
        }

        class Spikes extends Entity {
            constructor(game, x, y, img = null, ctx = null, scale = null, active = true, timer, timeOffset = 0, length = 0) {
                super(game, x, y, img, ctx);
                //this.y += 44; Give a +44 offset when instantiating 
                this.scale = scale;
                this.spriteWidth = 60;
                this.spriteHeight = 60;
                this.centerX = x + ((this.spriteWidth * this.scale) / 2) - this.spriteWidth;
                this.boundWidth = this.scale*(this.spriteWidth - 28);
                this.boundHeight = this.scale * (this.spriteHeight/2 + 3);
                this.boundX = this.x - this.spriteWidth + this.scale*14;
                this.boundY = this.y - this.spriteHeight * this.scale + 37 * this.scale;

                this.spikeCooldownTimer = timeOffset;
                this.spikeCooldown = timer;
                this.damage = 1; //this.game.hero.maxHealth

                this.states = {
                    "active": false,
                    "inactive_up": !active,
                    //"inactive_up_spawned": false, //Doesn't work, unused for now
                    "inactive_down": active,
                    "facingRight": true,
                };
                this.animations = {
                    "active": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 6, 5, 5, false, this.scale, 1),
                    "inactive_up": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 6, 10, 1, true, this.scale, 3),
                    "inactive_down": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 9, 6, 3, 1, true, this.scale)
                };
                this.animation = this.animations.inactive_down;
                if (length > 0) {
                    var nextOffset = timeOffset + 20;
                    length--;
                    this.game.addEntity(new Spikes(this.game, this.x + this.spriteWidth,
                        this.y, this.img, ctx, 2, true, this.spikeCooldown, nextOffset, length));
                }
            }

            /*Updates the entity each game loop. i.e. what does this entity do? */
            update() {
                if (this.states.active) {
                    this.game.addEntity(new Hurtbox(this.game, this.ctx, this.boundX + 3, this.boundY, -this.spriteWidth - .5 * this.boundWidth, 0,
                        this.spriteWidth / 2, this.spriteHeight / 2, this.boundWidth - 3, this.boundHeight - 36, this.scale, this.damage, this.states.facingRight,
                        "health", 2, true));
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.active = false;
                        this.states.inactive_down = true;
                        this.spikeCooldownTimer = this.spikeCooldown;
                    }
                }
                if (this.states.inactive_down) {
                    if (this.spikeCooldownTimer > 0) {//TODO: Entity "check timer" helper function
                        this.spikeCooldownTimer--;
                    }
                    else {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.active = true;
                        this.states.inactive_down = false;
                    }
                }
                else if (this.states.inactive_up) {
                    if (Math.abs(this.x - this.game.hero.x) < 300 && Math.abs(this.y - this.game.hero.y) < 300) {
                        this.game.addEntity(new Hurtbox(this.game, this.ctx, this.boundX + 3, this.boundY, -this.spriteWidth - .5*this.boundWidth, 0,
                            this.spriteWidth / 2, this.spriteHeight / 2, this.boundWidth - 3, this.boundHeight - 36, this.scale, this.damage, this.states.facingRight,
                            "health", 2, true));
                    }
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

            draw(ctx) {
                if (this.states.active) {
                    this.animation = this.animations.active;
                }
                if (this.states.inactive_down) {
                    this.animation = this.animations.inactive_down;
                }
                if (this.states.inactive_up) {
                    this.animation = this.animations.inactive_up;
                }
                this.drawImg(ctx);
            }

            drawImg(ctx) {
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
                this.drawOutline(ctx);
            }
        }

        return {
            "lava": Lava,
            "fireball": Fireball,
            "spikes": Spikes,
        };
    });