let id = 0;
class Block {
    constructor(x, y, h = 1, w = 1) {
        this.mass = 1;
        this.yForce = 0;
        this.yVelocity = 0;
        this.xForce = 0;
        this.xVelocity = 0;
        this.x = x;
        this.y = y;
        this.h = h;
        this.w = w;
        this.id = id;
        this.maxVelocity = 0.2
        id++;

        this.props = ["mass", "yForce", "yVelocity", "xForce", "xVelocity", "x", "y"];
    }
}