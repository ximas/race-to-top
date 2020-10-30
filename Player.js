class Player extends Block {
    constructor(x, y, name) {
        super(x, y, 2);
        this.name = name;
        this.jump = this.jump.bind(this);
        this.strafeLeft = this.strafeLeft.bind(this);
        this.strafeRight = this.strafeRight.bind(this);
        this.endStrafe = this.endStrafe.bind(this);
        this.player = true;
        this.color = "#caa";
    }

    jump() {
        if (this.yVelocity === 0) {
            this.yVelocity = 0.5;
        }
    }

    strafeLeft() {this.strafe(-1)}

    strafeRight() {this.strafe(1)}

    strafe(direction) {
        this.xForce = direction * 0.5;
    }

    endStrafe() {
        this.xForce = 0;
    }
}