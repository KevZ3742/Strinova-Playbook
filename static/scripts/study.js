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

let colorIndicator = document.getElementById("color-indicator");

function ChangeColor(button) {
    var element = button.querySelector(".past-color");
    var elementBgColor = window.getComputedStyle(element).getPropertyValue("background-color");

    colorIndicator.style.backgroundColor = elementBgColor;
}

const colorPicker = new iro.ColorPicker("#color-picker", {
    width: 175, color: "fff"
});
colorPicker.on('color:change', function (color) {
    colorIndicator.style.backgroundColor = color.hexString;
});

const colorPickerElement = document.getElementById('color-picker');