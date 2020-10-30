class Physics {
    constructor(g) {
        this.g = g;
    }

    slow(block) {
        block.xVelocity /= 1.2;
    }

    applyMovement({ blocks, time }) {
        // copy player blocks properties into initial state
        blocks.forEach(block => {
            // horizontal movement

            if (Math.abs(block.xForce) === 0) {
                this.slow(block);
            }

            const a = block.xForce / block.mass;
            block.xVelocity = block.xVelocity + a * time;

            if (Math.abs(block.xVelocity) > block.maxVelocity) {
                block.xVelocity = Math.sign(block.xVelocity) * block.maxVelocity;
            }

            // falling velocity
            block.yVelocity = block.yVelocity + this.g * time;
        });

        this.collision({ blocks });
    }

    collision({ blocks }) {
        blocks.forEach((target, idx) => {
            let xCollision = false;
            let yCollision = false;
            let setYTo = false;

            const targetLeft = target.x;
            const targetRight = target.x + target.w;
            const targetTop = target.y + target.h;
            const targetBottom = target.y;

            const afterTargetLeft = target.x + target.xVelocity;
            const afterTargetRight = target.x + target.w + target.xVelocity;
            const afterTargetTop = target.y + target.h + target.yVelocity;
            const afterTargetBottom = target.y + target.yVelocity;

            if (target.ground && afterTargetBottom < 0) {
                target.y = 0;
                target.yVelocity = 0;
            }

            blocks.forEach((obstacle, idx) => {
                if (target.id !== obstacle.id) {

                    const obstacleLeft = obstacle.x;
                    const obstacleRight = obstacle.x + obstacle.w;
                    const obstacleTop = obstacle.y + obstacle.h;
                    const obstacleBottom = obstacle.y;

                    const afterObstacleLeft = obstacle.x + obstacle.xVelocity;
                    const afterObstacleRight = obstacle.x + obstacle.w + obstacle.xVelocity;
                    const afterObstacleTop = obstacle.y + obstacle.h + obstacle.yVelocity;
                    const afterObstacleBottom = obstacle.y + obstacle.yVelocity;

                    // top of obstacle will be contacting target
                    const topBoundary = targetBottom < obstacleTop && targetTop > obstacleTop;
                    // bottom of obstacle will be contacting target
                    const bottomBoundary = targetBottom < obstacleBottom && targetTop > obstacleBottom;
                    // obstacle will be between target top and target bottom
                    const vInsideBoundary = targetBottom <= obstacleBottom && targetTop >= obstacleTop;
                    // target will be between obstacle top and obstacle bottom
                    const vOutsideBoundary = targetBottom > obstacleBottom && targetTop < obstacleTop;

                    // target was right of obstacle, and now is left
                    const leftCollision = targetLeft >= obstacleRight && afterTargetLeft <= obstacleRight;
                    // target was left of obstacle, and now is right
                    const rightCollision = targetRight <= obstacleLeft && afterTargetRight >= obstacleLeft;

                    if (target.xVelocity !== 0 && leftCollision && (topBoundary || bottomBoundary || vInsideBoundary || vOutsideBoundary)) {
                        target.x = afterObstacleRight;
                        target.xVelocity = 0;
                        xCollision = true;
                    }
                    
                    if (target.xVelocity !== 0 && rightCollision && (topBoundary || bottomBoundary || vInsideBoundary || vOutsideBoundary)) {
                        target.x = afterObstacleLeft - target.w;
                        target.xVelocity = 0;
                        xCollision = true;
                    }

                    // target was above obstacle, and now is below
                    const bottomCollision = targetBottom >= obstacleTop && afterTargetBottom <= obstacleTop;
                    // target was below obstacle, and now is above
                    const topCollision = targetTop <= obstacleBottom && afterTargetTop >= obstacleBottom;

                    // leftside of obstacle is contacting target 
                    const leftBoundary = targetLeft < obstacleLeft && targetRight > obstacleLeft;
                    // rightside of obstacle is contacting target 
                    const rightBoundary = targetLeft < obstacleRight && targetRight > obstacleRight;
                    // obstacle between target left and target right
                    const hInsideBoundary = targetLeft <= obstacleLeft && targetRight >= obstacleRight;
                    // target is between obstacle left and obstacle right
                    const hOutsideBoundary = targetLeft > obstacleLeft && targetRight < obstacleRight;

                    if (bottomCollision && (leftBoundary || rightBoundary || hInsideBoundary || hOutsideBoundary)) {
                        if (obstacleTop > setYTo || setYTo === false) {
                            setYTo = obstacleTop;
                        }
                        yCollision = true;
                    }

                    if (topCollision && (leftBoundary || rightBoundary || hInsideBoundary || hOutsideBoundary)) {
                        if (obstacleTop < setYTo || setYTo === false) {
                            setYTo = obstacleBottom;
                        }
                        yCollision = true;

                    }

                    if (targetLeft === obstacleLeft && targetBottom === obstacleBottom) {
                        setYTo = obstacleTop;
                        yCollision = true;
                    }
                }
            });

            if (!xCollision) {
                target.x += target.xVelocity;
            }
            if (yCollision) {
                target.y = setYTo;
                target.yVelocity = 0;
            } else {
                target.y += target.yVelocity;
            }
        });
    }

    execute({ blocks, time }) {
        this.applyMovement(arguments[0]);
    }
}