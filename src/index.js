
const stage = document.getElementById('stage');



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

    if (Math.random() > 0.9) {
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

const form = document.querySelector('form');

form.addEventListener('submit', evt => evt.preventDefault());

form.addEventListener('change', evt => {
    const target = evt.target;
    const property = target.getAttribute('name');

    if (!property) return false;

    const value = property.indexOf('width') > -1
                ? `${target.value}rem`
                : target.value;

    stage.style.setProperty(`--${property}`, value);
});

function initialiseForm() {
    const initialStyles = window.getComputedStyle(stage);
    
    Array.from(form.elements).forEach(
        fld => {
            const name = fld.getAttribute('name');
            let value = initialStyles.getPropertyValue(`--${name}`)

            if (name.indexOf('width') > -1) {
                value = Number(value.replace(/[a-zA-Z]/g, ''));
            }
            console.log(name, value)
            fld.value = value;
        }
    );
}

initialiseForm();