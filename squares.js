(function () {
    function createSquares(container, opts) {
        opts = opts || {};
        var speed = typeof opts.speed === 'number' ? opts.speed : 0.5;
        var squareSize = opts.squareSize || 40;
        var direction = (opts.direction || 'diagonal');
        var borderColor = opts.borderColor || '#fff';
        var hoverFillColor = opts.hoverFillColor || '#222';

        container.innerHTML = '';
        var canvas = document.createElement('canvas');
        canvas.className = 'squares-canvas';
        container.appendChild(canvas);
        var ctx = canvas.getContext('2d');

        var width = 0, height = 0;
        var mouse = { x: -9999, y: -9999 };

        function resize() {
            var rect = container.getBoundingClientRect();
            width = canvas.width = rect.width;
            height = canvas.height = rect.height;
        }

        function draw(t) {
            ctx.clearRect(0, 0, width, height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = borderColor;

            var diag = direction === 'diagonal';
            var offX = (t * speed * (direction === 'left' ? -1 : direction === 'right' ? 1 : diag ? 0.7 : 0)) % squareSize;
            var offY = (t * speed * (direction === 'up' ? -1 : direction === 'down' ? 1 : diag ? 0.7 : 0)) % squareSize;

            for (var y = -squareSize; y < height + squareSize; y += squareSize) {
                for (var x = -squareSize; x < width + squareSize; x += squareSize) {
                    var sx = Math.floor(x + offX);
                    var sy = Math.floor(y + offY);
                    var mx = mouse.x, my = mouse.y;
                    var inside = mx >= sx && mx <= sx + squareSize && my >= sy && my <= sy + squareSize;
                    if (inside) {
                        ctx.fillStyle = hoverFillColor;
                        ctx.fillRect(sx, sy, squareSize, squareSize);
                    }
                    ctx.strokeRect(sx + 0.5, sy + 0.5, squareSize - 1, squareSize - 1);
                }
            }
            requestAnimationFrame(draw);
        }

        function onMouseMove(e) {
            var r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left;
            mouse.y = e.clientY - r.top;
        }

        resize();
        requestAnimationFrame(draw);
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove);

        return {
            destroy: function () {
                window.removeEventListener('resize', resize);
                window.removeEventListener('mousemove', onMouseMove);
            }
        };
    }

    window.createSquares = createSquares;
})();


