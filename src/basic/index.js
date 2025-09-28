import presets from './presets.json';


const presetNames = Object.keys(presets);


const stage = document.getElementById('stage');
const presetwrapper = document.querySelector('#presets');
const form = document.querySelector('form');


function applyPreset(presetname, element = stage) {
    const preset = presets[presetname];

    for (const prop in preset) {
        element.style.setProperty(`--${prop}`, preset[prop]);
    }

    initialiseForm();
}


presetNames.forEach(name => {
    const button = document.createElement('button');
    const tile = document.createElement('div');

    button.append(tile);

    tile.classList.add('tile', 'a');

    applyPreset(name, button);

    button.addEventListener('click', () => applyPreset(name));

    presetwrapper.append(button);
});


const rn = Math.floor(Math.random() * presetNames.length) % presetNames.length;
applyPreset(presetNames[rn]);


function fillContainer() {
    const toAdd = document.createDocumentFragment();

    // lazy, may break on larger screens
    for (let i = 0; i < 2000; i++) {
        toAdd.appendChild(createTile());
    }

    stage.appendChild(toAdd);
}


function createTile() {
    const tile = document.createElement('div');

    tile.classList.add('tile');
    
    turnTile(tile, Math.floor(Math.random() * 4) * 90);

    if (Math.random() > 0.75) {
        tile.classList.add('fork');
    }

    return tile;
}

function turnTile(tile, init = 0) {
    const currentAngle = init + Number(window.getComputedStyle(tile).getPropertyValue('--angle'));

    const angle = (currentAngle + 90)/*  % 360 */;
    const typeA = angle % 180;

    tile.classList.add(typeA ? 'a' : 'b');
    tile.classList.remove(typeA ? 'b' : 'a');

    tile.style.setProperty('--angle', angle);
}


fillContainer();

stage.addEventListener('click', evt => {
    if (evt.target.classList.contains('tile')) {
        turnTile(evt.target);
    }
});


// controls
form.addEventListener('submit', evt => evt.preventDefault());

form.addEventListener('change', evt => {
    const target = evt.target;
    const property = target.getAttribute('name');

    if (!property) return false;

    let value = target.value;
    
    if (property.indexOf('width') > -1) value = `${target.value}em`;
    if (property.indexOf('size') > -1) value = `${target.value}px`;

    stage.style.setProperty(`--${property}`, value);
});

function initialiseForm() {
    const initialStyles = window.getComputedStyle(stage);
    
    Array.from(form.elements).forEach(
        fld => {
            const name = fld.getAttribute('name');
            let value = initialStyles.getPropertyValue(`--${name}`);

            if (name.indexOf('width') > -1 || name.indexOf('size') > -1) {
                value = Number(value.replace(/[a-zA-Z]/g, ''));
            }
            console.log(name, value)
            fld.value = value;
        }
    );
}