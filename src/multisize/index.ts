import Tile from "../Tile";


const tile1 = new Tile(1);
const tile2 = new Tile(2);
const tile3 = new Tile(3);
const tile4 = new Tile(4);
const tile6 = new Tile(6);
const tile8 = new Tile(8);

const tiles = [tile1 , tile2, tile3, /* tile4, tile6, tile8 */];


const previews = document.createElement('div');
previews.append(...tiles.reverse().flatMap(t => [t.canvas, t.altcanvas]));
previews.classList.add('previews');
document.body.append(previews);



const outputcanvas = document.createElement('canvas');
const vmax = Math.max(window.innerHeight, window.innerWidth) * window.devicePixelRatio;

// we learned to have odd row counts from the css version
const gridcount = Math.floor(Math.ceil(vmax / Tile.SIZE)/2) * 2 + 1;


outputcanvas.height = gridcount * Tile.SIZE;
outputcanvas.width = gridcount * Tile.SIZE;

outputcanvas.style.height = `${gridcount * Tile.SIZE / window.devicePixelRatio}px`;
outputcanvas.style.width = `${gridcount * Tile.SIZE / window.devicePixelRatio}px`;

outputcanvas.classList.add('main')

const outctx = outputcanvas.getContext('2d');



const grid: Tile[] = [];

const maxspaceneeded = tiles.reduce((m, t) => Math.max(t.count, m), 0);

for (let y = 0; y < gridcount; y++) {
    for (let x = 0; x < gridcount; x++) {
        const idx = x + (y * gridcount);

        let space = 0;

        while (space < maxspaceneeded && x + space < gridcount && !grid[idx + space]) {
            space++;
        };

        if (!space) continue;

        const fitting = tiles.filter(t => t.count <= space);
        const randTile = Math.floor(Math.random() * fitting.length);
        const tile = fitting[randTile];

        for (let j = y; j < y + tile.count; j++) {
            for (let i = x; i < x + tile.count; i++) {
                const fillIdx = i + (j * gridcount);

                grid[fillIdx] = tile;
            }
        }

        tile.draw(outctx, [ x, y ], idx);
    }
}

document.body.append(outputcanvas);