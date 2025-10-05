
const SIZE = 48;

const LINE = 4;


const PCT_BIG = 0.333;
const PCT_MID = 0.5;


function strokeOver(ctx: CanvasRenderingContext2D, path: Path2D, color: string = 'oklch(100% 100% 25)') {
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = LINE;
    ctx.stroke(path);
}

function strokeUnder(ctx: CanvasRenderingContext2D, path: Path2D, color: string = 'white') {
    ctx.beginPath();
    ctx.lineCap = 'butt';
    ctx.strokeStyle = color;
    ctx.lineWidth = 3 * LINE;
    ctx.stroke(path);
}





function create(scale: number = 1) {
    const fullsize = SIZE * scale;

    const canvas = document.createElement('canvas');
    canvas.height = fullsize;
    canvas.width = fullsize;


    const ctx = canvas.getContext('2d');

    const firstHalves = [];
    const secondHalves = [];


    for (let i = 0; i < scale; i++) {
        // draw the arcs in halves so we get nice "woven" overlapping
        const n = (SIZE / 2) + (i * SIZE);

        const nCos = n * Math.cos(Math.PI / 4);
        const nSin = n * Math.sin(Math.PI / 4);

        const h1 = new Path2D(`
                    M${n} 0 A${n} ${n} 0 0 1 ${nCos} ${nSin}
                `);
        const h2 = new Path2D(`
                    M${nCos} ${nSin} A${n} ${n} 0 0 1 0 ${n}
                `);

        const h3 = new Path2D(`
                    M${fullsize - n} ${fullsize} A${n} ${n} 0 0 1 ${fullsize - nCos} ${fullsize - nSin}
                `);
        const h4 = new Path2D(`
                    M${fullsize - nCos} ${fullsize - nSin} A${n} ${n} 0 0 1 ${fullsize} ${fullsize - n}
                `);

        // alternate when we draw the start/end of each arc
        if (i % 2) {
            firstHalves.push(h1, h3);
            secondHalves.unshift(h4, h2);
        } else {
            firstHalves.push(h2, h4);
            secondHalves.unshift(h3, h1);
        }
    }

    firstHalves.forEach(path => {
        strokeUnder(ctx, path);
        strokeOver(ctx, path);
    });
    secondHalves.forEach(path => {
        strokeUnder(ctx, path);
        strokeOver(ctx, path);
    });

    const half = fullsize / 2;

    return (x: number, y: number) => {
        const cx = x + half;
        const cy = y + half;

        outctx.translate(cx, cy);
        outctx.rotate(Math.floor(Math.random() * 4) * Math.PI / 2);
        outctx.translate(-cx, -cy);

        outctx.drawImage(canvas, x, y, fullsize, fullsize);
        outctx.resetTransform();
    };
}


const drawBig = create(4);
const drawMid = create(2);
const drawSmall = create();




const outputcanvas = document.createElement('canvas');
const vmax = Math.max(window.innerHeight, window.innerWidth) * window.devicePixelRatio;
outputcanvas.height = vmax;
outputcanvas.width = vmax;

const outctx = outputcanvas.getContext('2d');


for (let x = 0; x <= vmax; x += 4 * SIZE) {
    for (let y = 0; y <= vmax; y += 4 * SIZE) {
        if (Math.random() > 1 - PCT_BIG) {
            drawBig(x, y);
        } else {
            for (let x1 = x; x1 < x + 4 * SIZE; x1 += 2 * SIZE) {
                for (let y1 = y; y1 < y + 4 * SIZE; y1 += 2 * SIZE) {
                    if (Math.random() > 1 - PCT_MID) {
                        drawMid(x1, y1);
                    } else {
                        drawSmall(x1, y1);
                        drawSmall(x1 + SIZE, y1);
                        drawSmall(x1, y1 + SIZE);
                        drawSmall(x1 + SIZE, y1 + SIZE);
                    }
                }
            }
        }
    }
}



document.body.style.backgroundImage = `url(${outputcanvas.toDataURL()})`;
document.body.style.backgroundSize = `${vmax / window.devicePixelRatio}px ${vmax / window.devicePixelRatio}px`;