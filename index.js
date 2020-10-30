let p = true;
init();

function init() {
    const canvas = window.gameCanvas;
    const ctx = canvas.getContext("2d");
    canvas.height = window.innerHeight - 20;
    canvas.width = window.innerWidth / 2;
    ctx.transform(1, 0, 0, -1, 0, canvas.height)
    const player = new Player(1, 20, "Sami")

    const config = {
        bindings: {
            " ": {
                down: player.jump
            },
            j: {
                down: player.strafeLeft,
                up: player.endStrafe
            },
            l: {
                down: player.strafeRight,
                up: player.endStrafe
            },
        },
        blocks: [],
        keyBuffer: {},
        ctx,
        canvas,
        time: Date.now(),
        physics: new Physics(-1.2),
        render: new Render(20)
    }

    for (let i = 0; i < 25; i++) {
        const y = Math.round((Math.random() * 25));
        config.blocks.push(new Ground(i, y));
    }

    for (let i = 0; i < 100; i++) {
        const x = Math.round((Math.random() * 25));
        const y = Math.round((Math.random() * 50));
        config.blocks.push(new Ground(x, y));
    }

    config.blocks.push(player);

    addEventListeners(config.keyBuffer, config.bindings);
    gameLoop(config);
}

function addEventListeners(keyBuffer, bindings) {
    document.addEventListener("keydown", event => {
        Object.keys(bindings).forEach(key => {
            if (event.key === key) {
                keyBuffer[key] = true;
            }
        })
    });

    document.addEventListener("keyup", event => {
        Object.keys(bindings).forEach(key => {
            if (event.key === key) {
                keyBuffer[key] = false;
            }
        })
    });
}

function gameLoop({ bindings, blocks, keyBuffer, ctx, canvas, time, physics, render }) {
    // setTimeout(() => {
    const timeNow = Date.now();
    const timeDifference = (timeNow - time) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    Object.keys(keyBuffer).forEach(key => {
        const keyConfig = bindings[key];
        if (keyBuffer[key] === true && keyConfig.down) {
            keyConfig.down();
        } else if (keyBuffer[key] === false && keyConfig.up) {
            delete keyBuffer[key];
            keyConfig.up();
        }
    });

    physics.execute({ blocks, time: timeDifference })
    render.drawAll(ctx, blocks);

    requestAnimationFrame(() => gameLoop({ ...arguments[0], time: timeNow }));
    // gameLoop({ ...arguments[0], time: timeNow });
    // }, 500)
}