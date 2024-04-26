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

            const map = document.querySelector('.map');
            var mapLocation = "/static/images/maps/" + option.innerText.replace(/ /g, "_") + ".png";
            map.src = mapLocation;
        });
    });
});

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
         ("0" + parseInt(rgbArray[1],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgbArray[2],10).toString(16)).slice(-2) +
         ("0" + parseInt(rgbArray[3],10).toString(16)).slice(-2);
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

function IncrementPastColors(){
    if (pastColors.length > 10) {
        pastColors.splice(10);
    }

    const pastColorButtons = document.querySelectorAll('.past-color');
    pastColorButtons.forEach((button, index) => {
        button.style.backgroundColor = pastColors[index];
    });
}

var x = 0;
var y = 0;
var isDrawing = false;
const cnv = document.getElementById('canvas');
const ctx = cnv.getContext('2d');

cnv.addEventListener('mousedown', e => {
    x = e.offsetX;
    y = e.offsetY;
    isDrawing = true;
});

cnv.addEventListener('mousemove', e => {
    if (isDrawing === true) {
        DrawLine(x,y,e.offsetX,e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

cnv.addEventListener('mouseup', e => {
    if (isDrawing === true) {
        DrawLine(x,y,e.offsetX,e.offsetY);
        x = 0;
        y = 0;
        isDrawing = false;
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
}