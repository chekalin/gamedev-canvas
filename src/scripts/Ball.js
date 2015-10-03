(function(window) {
    function Ball(centerPoint, radius, xVelocity, yVelocity) {
        var self = this;
        self.centerPoint = centerPoint;
        self.radius = radius;
        self.centerPointAfterMove = function() {
            return new Point(
                self.centerPoint.x + xVelocity,
                self.centerPoint.y + yVelocity
            );
        };
        self.move = function() {
            self.centerPoint = self.centerPointAfterMove();
        };
        self.collideHorizontally = function() {
            yVelocity = -yVelocity;
        };
        Ball.prototype.collideVertically = function() {
            xVelocity = -xVelocity;
        };
    }
    window.Ball = Ball;
})(window);