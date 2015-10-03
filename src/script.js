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

    var canvas;
    var ctx;

    var ball;

    var paddleX;

    var bricks;

    var rightPressed = false;
    var leftPressed = false;

    var score;
    var lives;

    function startNewGame() {
        canvas = document.getElementById('myCanvas');
        ctx = canvas.getContext('2d');

        score = 0;
        lives = 3;

        ball = new Ball(
            new Point(canvas.width / 2, canvas.height - 30),
            BALL_RADIUS,
            STARTING_BALL_X_VELOCITY,
            STARTING_BALL_Y_VELOCITY
        );

        paddleX = (canvas.width - PADDLE_WIDTH) / 2;

        bricks = [];
        for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
            bricks[c] = [];
            for (var r = 0; r < BRICK_ROW_COUNT; r++) {
                bricks[c][r] = {x: 0, y: 0, status: 'alive'};
            }
        }
        registerControlHandlers();
        main();
    }

    function registerControlHandlers() {
        document.addEventListener('keyup', keyUpHandler, false);
        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('mousemove', mouseMoveHandler, false);

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
    }

    function main() {
        animationId = requestAnimationFrame(main);
        render();
        update();
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        drawBricks();
        drawScore();
        drawLives();

        function drawBall() {
            ctx.beginPath();
            ctx.arc(ball.centerPoint.x, ball.centerPoint.y, ball.radius, 0, Math.PI * 2);
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
    }

    function update() {
        collisionDetection();

        if (ball.centerPoint.y + ball.yVelocity < ball.radius) {
            ball.yVelocity = -ball.yVelocity;
        } else if (ball.centerPoint.y + ball.yVelocity > canvas.height - ball.radius) {
            if (ball.centerPoint.x > paddleX && ball.centerPoint.x < paddleX + PADDLE_WIDTH) {
                if (ball.centerPoint.y = ball.centerPoint.y - PADDLE_HEIGHT) {
                    ball.yVelocity = -ball.yVelocity;
                }
            } else {
                lives--;
                if (!lives) {
                    alert('Game over');
                    document.location.reload();
                } else {
                    ball.centerPoint.x = canvas.width / 2;
                    ball.centerPoint.y = canvas.height - 30;
                    ball.xVelocity = STARTING_BALL_X_VELOCITY;
                    ball.yVelocity = STARTING_BALL_Y_VELOCITY;
                    paddleX = (canvas.width - PADDLE_WIDTH) / 2;
                }
            }
        }
        if (ball.centerPoint.x + ball.xVelocity < ball.radius || ball.centerPoint.x + ball.xVelocity > canvas.width - ball.radius) {
            ball.xVelocity = -ball.xVelocity;
        }
        if (rightPressed && paddleX < canvas.width - PADDLE_WIDTH) {
            paddleX += 7;
        }
        if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        ball.centerPoint.x += ball.xVelocity;
        ball.centerPoint.y += ball.yVelocity;

        function collisionDetection() {
            for (var c = 0; c < BRICK_COLUMN_COUNT; c++) {
                for (var r = 0; r < BRICK_ROW_COUNT; r++) {
                    var brick = bricks [c][r];
                    if (brick.status === 'alive' &&
                        pointInRectangle(
                            new Point(ball.centerPoint.x, ball.centerPoint.y),
                            new Rectangle(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT))) {
                        ball.yVelocity = -ball.yVelocity;
                        brick.status = 'dead';
                        score++;
                        if (score == BRICK_ROW_COUNT * BRICK_COLUMN_COUNT) {
                            alert('You win!');
                            document.location.reload();
                        }
                    }

                }
            }

            function pointInRectangle(point, rectangle) {
                return point.x > rectangle.x &&
                    point.x < rectangle.x + rectangle.width &&
                    point.y > rectangle.y &&
                    point.y < rectangle.y + rectangle.height;
            }

            function Rectangle(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
        }
    }

    function Ball(centerPoint, radius, xVelocity, yVelocity) {
        this.centerPoint = centerPoint;
        this.radius = radius;
        this.xVelocity = xVelocity;
        this.yVelocity = yVelocity;
    }

    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

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
            main();
        }
    };
})(window);
