var GAME2 = [
    {text: 'smile', isCorrect: true},
    {text: '?', isCorrect: false},
    {text: 'pictures', isCorrect: true},
    {text: 'Washington', isCorrect: true},
    {text: 'ugly', isCorrect: true},
    {text: 'false teeth', isCorrect: true},
    {text: 'metal', isCorrect: true},
    {text: 'ivory', isCorrect: true},
    {text: 'answer', isCorrect: true},
    {text: 'Ben', isCorrect: true},
    {text: 'Franklin', isCorrect: true},
    {text: 'solves', isCorrect: true},
    {text: 'lightening', isCorrect: true},
    {text: 'problem', isCorrect: false},
    {text: 'lead to', isCorrect: true},
    {text: 'danger', isCorrect: true},
    {text: 'solution', isCorrect: true},
    {text: 'protected', isCorrect: false},
    {text: 'home', isCorrect: true},
    {text: 'Philadelphia', isCorrect: true},
    {text: 'harming', isCorrect: true},
    {text: 'destruction', isCorrect: true},
    {text: 'two', isCorrect: true},
    {text: 'although', isCorrect: false},
    {text: 'great', isCorrect: true},
    {text: 'invention', isCorrect: true},
    {text: 'for people', isCorrect: true},
    {text: 'wasting', isCorrect: true},
    {text: 'popcorn', isCorrect: false},
    {text: 'good', isCorrect: true},
    {text: 'answer', isCorrect: true},
    {text: 'to', isCorrect: false},
    {text: 'question', isCorrect: true},
    {text: 'put', isCorrect: true},
    {text: 'in', isCorrect: true},
    {text: 'freezer', isCorrect: true},
]

function createRect(itemWidth, itemHeight, x, y, textObject) {

    var rect = new fabric.Rect({
        width: itemWidth,
        height: itemHeight,
        stroke: '#BDBDBD',
        strokeWidth: 2,
        fill: '#424242',
        selectable: false,
        hasBorders: false,
        evented: true,
        originX: 'center',
        originY: 'center',
    });

    var text = new fabric.Text(textObject.text, {
        fontSize: 30,
        originX: 'center',
        scaleY: 0.5,
        scaleX: 0.5,
        originY: 'center',
        fill: '#FAFAFA',
        strokeWidth: 10,
        fontWeight: 'bold'
    });

    var group = new fabric.Group([rect, text], {
        left: x,
        top: y,
        selectable: false,
        isCorrect: textObject.isCorrect
    });

    return group;
}

function createCircle(x, y, radius) {
    radius = radius || 10;
    var circle = new fabric.Circle({
        top: parseInt(y),
        left: parseInt(x),
        radius: parseInt(radius),
        lockRotation: true,
        lockUniScaling: true,
        hasRotatingPoint: false,
        selectable: false,
        fill: '#FF5722',
        hasBorders: false,
        evented: false,
        originX: 'center',
        originY: 'center'
    });
    return circle;
}

var circle;
var REACT_HEIGHT = 60;
var REACT_WIDTH = 85;


function createGrid(canvas) {

    var itemWidth = REACT_WIDTH;
    var itemHeight = REACT_HEIGHT;

    // 36 total (from game 2)
    var index = 0
    for (var x = 0; x < 6; x++) {
        for (var y = 0; y < 6; y++) {
            var textObject = GAME2[index];
            canvas.add(createRect(itemWidth, itemHeight, x * itemWidth, y * itemHeight, textObject));
            index += 1;
        }
    }
}


function RectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

function cellCenter(rectWidth, index) {
    var offset = 22;
    return rectWidth * index - offset;
}

function animate(canvas, circle, direction, max, onComplete) {
    // var speed = parseInt(document.getElementById('speed').value);
    var speed = 3000;
    circle.animate(direction, max, {
        duration: (direction == 'top' ? speed / 2 : speed),
        onChange: canvas.renderAll.bind(canvas),
        onComplete: onComplete,
        easing: fabric.util.ease['easeInOutQuad']
    });
}

var canvas = this.__canvas = new fabric.Canvas('c');
canvas.selection = false;
canvas.hoverCursor = 'normal';

createGrid(canvas);

function click(options) {
    var target = options.target;
    
    if (circle) {

        var c = {
            x: circle.left,
            y: circle.top,
            r: circle.radius
        }
        var r = {
            x: target.left,
            y: target.top,
            w: target.width,
            h: target.height
        }

        if (RectCircleColliding(c, r)) {
            var rect = target._objects[0];
            if (target.isCorrect) {
                rect.setFill('#4CAF50'); // Green
            } else {
                rect.setFill('#F44336'); // Red
            }
        }
    }
}

canvas.on({
    'mouse:down': click,
    'mouse:over': function(event) {
        var target = event.target;

        if (circle) {

            var c = {
                x: circle.left,
                y: circle.top,
                r: circle.radius
            }
            var r = {
                x: target.left,
                y: target.top,
                w: target.width,
                h: target.height
            }

            if (RectCircleColliding(c, r)) {
                event.target.hoverCursor = 'crosshair';
            } else {
                event.target.hoverCursor = 'default';
            }
        }

    }
});

function reset() {
    canvas.remove(circle)
    circle = createCircle(cellCenter(REACT_WIDTH, 6), cellCenter(REACT_HEIGHT, 6));
    canvas.add(circle)
}


var animateBtn = document.getElementById('animate');
animateBtn.onclick = function() {
    reset();

    animateBtn.disabled = true;
    var FAR_LEFT = 1;
    var FAR_RIGHT = 6;
    animate(canvas, circle, 'left', cellCenter(REACT_WIDTH, FAR_LEFT), function() { // Left
        animate(canvas, circle, 'top', cellCenter(REACT_HEIGHT, 5), function() { // Up
            animate(canvas, circle, 'left', cellCenter(REACT_WIDTH, FAR_RIGHT), function() { // Right
                animate(canvas, circle, 'top', cellCenter(REACT_HEIGHT, 4), function() { // Up
                    animate(canvas, circle, 'left', cellCenter(REACT_WIDTH, FAR_LEFT), function() { // Left
                        animate(canvas, circle, 'top', cellCenter(REACT_HEIGHT, 3), function() { // Up
                            animate(canvas, circle, 'left', cellCenter(REACT_WIDTH, FAR_RIGHT), function() { // Right
                                animate(canvas, circle, 'top', cellCenter(REACT_HEIGHT, 2), function() { // Up
                                    animate(canvas, circle, 'left', cellCenter(REACT_WIDTH, FAR_LEFT), function() { // Left
                                        animate(canvas, circle, 'top', cellCenter(REACT_HEIGHT, 1), function() { // Up
                                            animate(canvas, circle, 'left', cellCenter(REACT_WIDTH, FAR_RIGHT), function() { // right
                                                animateBtn.disabled = false;
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};