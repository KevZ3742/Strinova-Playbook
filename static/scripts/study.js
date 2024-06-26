function DrawMapLogic() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');
        const options = dropdown.querySelectorAll('.menu li');
        const selected = dropdown.querySelector('.selected');

        select.addEventListener('click', () => {
            select.classList.toggle('select-clicked');
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selected.innerText = option.innerText;
                select.classList.remove('select-clicked');
                caret.classList.remove('caret-rotate');
                menu.classList.remove('menu-open');
                options.forEach(option => {
                    option.classList.remove('active-dropdown');
                });

                option.classList.add('active-dropdown');

                DrawMap(option.innerText);
                drawingLog = [];
            });
        });
    });
}

DrawMapLogic();

function DrawMap(location) {
    const mapCanvas = document.getElementById('canvas');
    const mapCtx = mapCanvas.getContext('2d');
    const mapLocation = "/static/images/maps/" + location.replace(/ /g, "_") + ".png";

    const mapImage = new Image();
    mapImage.onload = function () {
        mapCtx.clearRect(0, 0, mapCanvas.width, mapCanvas.height);

        const desiredWidth = 680;
        const desiredHeight = (mapImage.height / mapImage.width) * desiredWidth;

        const centerX = (mapCanvas.width - desiredWidth) / 2;
        const centerY = (mapCanvas.height - desiredHeight) / 2;
        mapCtx.drawImage(mapImage, centerX, centerY, desiredWidth, desiredHeight);
    };
    mapImage.src = mapLocation;
}

window.onload = function () {
    var map = "404 Base";
    DrawMap(map);
};

function AddScene() {
    const sequenceBox = document.querySelector('.sequence-box-container');
    const buttons = sequenceBox.querySelectorAll('button');

    const lastIndex = buttons.length > 0 ? parseInt(buttons[buttons.length - 2].querySelector('.scene').textContent) : 0;

    const newButton = document.createElement('button');
    const newIndex = lastIndex + 1;
    newButton.innerHTML = `<div class="scene">${newIndex}</div>`;
    newButton.onclick = () => ChangeScene(newIndex);

    sequenceBox.insertBefore(newButton, buttons[buttons.length - 1]);
}

function ChangeScene(index) {
    const buttons = document.querySelectorAll('.sequence-box-container button');

    buttons.forEach(button => {
        button.querySelector('.scene').classList.remove('current');
    });

    buttons.forEach(button => {
        if (parseInt(button.querySelector('.scene').textContent) === index) {
            button.querySelector('.scene').classList.add('current');
        }
    });
}

function ChangeTool(button) {
    const tools = document.querySelectorAll('.tool-box button');

    tools.forEach(tool => {
        tool.querySelector('.tool').classList.remove('selected-tool');
    });

    tools.forEach(tool => {
        if (tool === button) {
            tool.querySelector('.tool').classList.add('selected-tool');
        }
    });
}

function rgbToHex(rgb) {
    const rgbArray = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    const hex = "#" +
        ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbArray[3], 10).toString(16)).slice(-2);
    return hex;
}

let pastColors = [];

function ChangeColor(button) {
    const colorPicker = document.querySelector('.color-picker');
    const buttonColor = window.getComputedStyle(button).backgroundColor;
    const hexColor = rgbToHex(buttonColor);
    colorPicker.value = hexColor;
    pastColors.unshift(hexColor);
    IncrementPastColors();
}

function ColorChanged(color) {
    pastColors.unshift(color);
    IncrementPastColors();
}

function IncrementPastColors() {
    if (pastColors.length > 10) {
        pastColors.splice(10);
    }

    const pastColorButtons = document.querySelectorAll('.past-color');
    pastColorButtons.forEach((button, index) => {
        button.style.backgroundColor = pastColors[index];
    });
}

let drawingLog = [];
let drawingItem = [];

var x = 0;
var y = 0;

const cnv = document.getElementById('canvas');
const ctx = cnv.getContext('2d');

var isDrawing = false;
const pencil = document.getElementById('pencil');
var isEarasing = false;
const eraser = document.getElementById('eraser');

function LogDrawing(x1, y1, x2, y2, color) {
    let item = [x1, y1, x2, y2, color];
    drawingItem.push(item);
}

cnv.addEventListener('mousedown', e => {
    if (pencil.classList.contains('selected-tool')) {
        x = e.offsetX;
        y = e.offsetY;
        isDrawing = true;
    } else if (eraser.classList.contains('selected-tool')) {
        isEarasing = true;
    } else if (text.classList.contains('selected-tool')) {
        var i, left = e.clientX, top = e.clientY;
        i = document.createElement('textarea');
        i.classList.add('deletable');
        i.style.left = left + "px";
        i.style.top = top + "px";
        i.style.position = "absolute";
        i.style.color = "white";
        i.style.backgroundColor = "rgb(25, 25, 25, .8)";
        i.style.border = "1px solid white";
        i.style.borderRadius = ".3em";
        i.style.zIndex = 3;
        i.value = "Enter Text";
        i.addEventListener('mousedown', function (e) {
            if (i.value === "Enter Text") {
                i.value = "";
            }

            const initialMouseX = e.clientX;
            const initialMouseY = e.clientY;
            const initialTextareaLeft = parseInt(this.style.left, 10);
            const initialTextareaTop = parseInt(this.style.top, 10);

            const offsetX = initialMouseX - initialTextareaLeft;
            const offsetY = initialMouseY - initialTextareaTop;

            const textarea = this;

            function handleMouseMove(moveEvent) {
                const newX = moveEvent.clientX - offsetX;
                const newY = moveEvent.clientY - offsetY;

                textarea.style.left = newX + 'px';
                textarea.style.top = newY + 'px';
            }

            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);

                // trash element if over trashcan
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        document.body.appendChild(i);
    }
});


cnv.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        DrawLine(x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    } else if (isEarasing === true) {
        x = e.offsetX;
        y = e.offsetY;
        if (isMouseOverLine(x, y)) {
            for (let i = 0; i < drawingLog.length; i++) {
                const item = drawingLog[i];
                for (let j = 0; j < item.length; j++) {
                    const [x1, y1, x2, y2] = item[j];
                    if (isPointOnLine(x, y, x1, y1, x2, y2)) {
                        drawingLog.splice(i, 1);
                        ctx.clearRect(0, 0, cnv.width, cnv.height);
                        map = document.querySelector('.active-dropdown').innerText;
                        DrawMap(map);
                        setTimeout(function () {
                            for (let k = 0; k < drawingLog.length; k++) {
                                const item = drawingLog[k];
                                for (let l = 0; l < item.length; l++) {
                                    const [x1, y1, x2, y2, color] = item[l];
                                    DrawLineGivenColor(x1, y1, x2, y2, color);
                                }
                            }
                        }, 10);
                    }
                }
            }
        }
    }
});

cnv.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        DrawLine(x, y, e.offsetX, e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
        drawingLog.push(drawingItem);
        drawingItem = [];
        console.log(drawingLog);
    } else if (isEarasing === true) {
        isEarasing = false;
    }
});

function DrawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = document.querySelector('.color-picker').value;
    ctx.lineWidth = 3;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();

    LogDrawing(x1, y1, x2, y2, ctx.strokeStyle);
}

function DrawLineGivenColor(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function ClearCurrentCanvas() {
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    map = document.querySelector('.active-dropdown').innerText;
    DrawMap(map);
    drawingLog = [];
}

function isMouseOverLine(x, y) {
    for (let i = 0; i < drawingLog.length; i++) {
        const item = drawingLog[i];
        for (let j = 0; j < item.length; j++) {
            const [x1, y1, x2, y2] = item[j];
            if (isPointOnLine(x, y, x1, y1, x2, y2)) {
                return true;
            }
        }
    }
    return false;
}

function isPointOnLine(px, py, x1, y1, x2, y2) {
    const d1 = distance(px, py, x1, y1);
    const d2 = distance(px, py, x2, y2);
    const lineLength = distance(x1, y1, x2, y2);
    return d1 + d2 >= lineLength - 0.1 && d1 + d2 <= lineLength + 0.1;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}