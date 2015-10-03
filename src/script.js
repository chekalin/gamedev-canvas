(function (window) {
    'use strict';

    var animationId;

    var STARTING_BALL_X_VELOCITY = 2;
    var STARTING_BALL_Y_VELOCITY = -2;
    var ELEMENT_COLOR = '#0095DD';

    var BALL_RADIUS = 10;
    var PADDLE_HEIGHT = 10;
    var PADDLE_WIDTH = 75;

    var BRICK_ROW_COUNT = 3;
    var BRICK_COLUMN_COUNT = 5;
    var BRICK_WIDTH = 75;
    var BRICK_HEIGHT = 20;
    var BRICK_PADDING = 10;
    var BRICK_OFFSET_TOP = 30;
    var BRICK_OFFSET_LEFT = 30;

    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');

    var ballX;
    var ballY;
    var ballXVelocity;
    var ballYVelocity;

    var paddleX;

    var bricks;

    var rightPressed = false;
    var leftPressed = false;

    var score;
    var lives;

    function startNewGame() {
        score = 0;
        lives = 3;

        ballX = canvas.width / 2;
        ballY = canvas.height - 30;
        ballXVelocity = STARTING_BALL_X_VELOCITY;
        ballYVelocity = STARTING_BALL_Y_VELOCITY;

        paddleX = (canvas.width - PADDLE_WIDTH) / 2;

        bricks = [];
        for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
            bricks[c] = [];
            for (var r = 0; r < BRICK_ROW_COUNT; r++) {
                bricks[c][r] = {x: 0, y: 0, status: 'alive'};
            }
        }

        draw();
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = ELEMENT_COLOR;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
        ctx.fillStyle = ELEMENT_COLOR;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (var r = 0; r < BRICK_ROW_COUNT; r++) {
                if (bricks[c][r].status === 'alive') {
                    var brickX = (c * (BRICK_WIDTH + BRICK_PADDING)) + BRICK_OFFSET_LEFT;
                    var brickY = (r * (BRICK_HEIGHT + BRICK_PADDING)) + BRICK_OFFSET_TOP;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, BRICK_WIDTH, BRICK_HEIGHT);
                    ctx.fillStyle = ELEMENT_COLOR;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }

    function drawScore() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Score: ' + score, 8, 20);
    }

    function drawLives() {
        ctx.font = '16px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
    }

    function pointInRectangle(point, rectangle) {
        return point.x > rectangle.x &&
            point.x < rectangle.x + rectangle.width &&
            point.y > rectangle.y &&
            point.y < rectangle.y + rectangle.height;
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    function Rectangle(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    function collisionDetection() {
        for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
            for (var r = 0; r < BRICK_ROW_COUNT; r++) {
                var brick = bricks [c][r];
                if (brick.status === 'alive' &&
                    pointInRectangle(
                        new Point(ballX, ballY),
                        new Rectangle(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT))) {
                    ballYVelocity = -ballYVelocity;
                    brick.status = 'dead';
                    score++;
                    if (score == BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                        alert('You win!');
                        document.location.reload();
                    }
                }

            }
        }
    }

    function draw() {
        animationId = requestAnimationFrame(draw);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        drawScore();
        drawLives();
        collisionDetection();

        if (ballY + ballYVelocity < BALL_RADIUS) {
            ballYVelocity = -ballYVelocity;
        } else if (ballY + ballYVelocity > canvas.height - BALL_RADIUS) {
            if (ballX > paddleX && ballX < paddleX + PADDLE_WIDTH) {
                if (ballY = ballY - PADDLE_HEIGHT) {
                    ballYVelocity = -ballYVelocity;
                }
            } else {
                lives--;
                if (!lives) {
                    alert('Game over');
                    document.location.reload();
                } else {
                    ballX = canvas.width / 2;
                    ballY = canvas.height - 30;
                    ballXVelocity = STARTING_BALL_X_VELOCITY;
                    ballYVelocity = STARTING_BALL_Y_VELOCITY;
                    paddleX = (canvas.width - PADDLE_WIDTH) / 2;
                }
            }
        }
        if (ballX + ballXVelocity < BALL_RADIUS || ballX + ballXVelocity > canvas.width - BALL_RADIUS) {
            ballXVelocity = -ballXVelocity;
        }
        if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
            paddleX += 7;
        }
        if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        ballX += ballXVelocity;
        ballY += ballYVelocity;
    }

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        } else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        } else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - PADDLE_WIDTH / 2;
        }
    }

    document.addEventListener('keyup', keyUpHandler, false);
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('mousemove', mouseMoveHandler, false);

    window.MainGame = {};
    window.MainGame.newGame = function () {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        startNewGame();
    };
    window.MainGame.pause = function () {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        } else {
            draw();
        }
    };
})(window);
