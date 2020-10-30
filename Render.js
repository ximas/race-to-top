class Render {
    constructor(blockSize) {
        this.blockSize = blockSize;
    }

    drawAll(ctx, blocks) {
        blocks.forEach(block => {
            this.draw(ctx, block);
        });
    }

    draw(ctx, block) {
        ctx.fillStyle = block.color || "#777";
        ctx.fillRect(block.x * this.blockSize, block.y * this.blockSize, block.w * this.blockSize, block.h * this.blockSize);
    }
}