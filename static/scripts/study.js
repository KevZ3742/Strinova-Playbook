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

    console.log(index);
}
