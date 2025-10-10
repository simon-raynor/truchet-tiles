const SIZE = 64;


export default class Tile {
    static SIZE = SIZE;
    
    canvas: HTMLCanvasElement
    private context: CanvasRenderingContext2D
    altcanvas: HTMLCanvasElement
    private altcontext: CanvasRenderingContext2D

    count: number
    fullsize: number

    constructor(count = 1) {
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.altcanvas = document.createElement('canvas');
        this.altcontext = this.altcanvas.getContext('2d');

        this.count = count;
        this.fullsize = Tile.SIZE * count;

        this.canvas.width = this.fullsize;
        this.canvas.height = this.fullsize;

        this.altcanvas.width = this.fullsize;
        this.altcanvas.height = this.fullsize;

        this.canvas.classList.add('tile');
        this.altcanvas.classList.add('tile');

        this.create();
    }

    linecolor1: string = 'oklch(0 0 70)';
    linecolor2: string = 'oklch(1 0 100)';
    bgcolor1: string = 'oklch(.5 .7 70)';
    bgcolor2: string = 'oklch(.5 1 230)';

    linewidth1 = SIZE / 9;
    linewidth2 = SIZE / 5;

    create() {
        const count = this.count;
        const fullsize = this.fullsize;

        const firstHalves = [];
        const secondHalves = [];

        const fills = [];

        for (let i = 0; i < count; i++) {
            const n = (Tile.SIZE / 2) + (i * Tile.SIZE);

            // draw the arcs in halves so we get nice "woven" overlapping
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

            fills.push(
                new Path2D(`
                    M0 0 L${n} 0 A${n} ${n} 0 0 1 0 ${n}Z
                `),
                new Path2D(`
                    M${fullsize} ${fullsize} L${fullsize - n} ${fullsize} A${n} ${n} 0 0 1 ${fullsize} ${fullsize - n}Z
                `)
            );
        }

        fills.reverse();

        this.fill(fills);
        this.fill(fills, true);

        firstHalves.forEach(path => {
            this.strokeUnder(path);
            this.strokeOver(path);
            this.strokeUnder(path, this.altcontext);
            this.strokeOver(path, this.altcontext);
        });
        secondHalves.forEach(path => {
            this.strokeUnder(path);
            this.strokeOver(path);
            this.strokeUnder(path, this.altcontext);
            this.strokeOver(path, this.altcontext);
        });
    }

    fill(fills: Path2D[], alt = false) {
        const ctx = alt ? this.altcontext : this.context;

        ctx.fillStyle = alt ? this.bgcolor2 : this.bgcolor1;
        ctx.fillRect(0, 0, this.fullsize, this.fullsize);

        fills.forEach((path, idx) => {
            ctx.beginPath();
            ctx.fillStyle = Math.floor(idx / 2) % 2 ? (alt ? this.bgcolor2 : this.bgcolor1) : (alt ? this.bgcolor1 : this.bgcolor2);
            ctx.fill(path);
        });

        // debug border
        /* ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0,0,this.fullsize,this.fullsize); */
    }

    strokeOver(path: Path2D, ctx = this.context) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.linecolor1;
        ctx.lineWidth = this.linewidth1;
        ctx.stroke(path);
    }

    strokeUnder(path: Path2D, ctx = this.context) {
        ctx.beginPath();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = this.linecolor2;
        ctx.lineWidth = this.linewidth2;
        ctx.stroke(path);
    }


    draw(ctx: CanvasRenderingContext2D, [x, y]: [number, number], idx: number) {
        const angle = Math.floor(Math.random() * 4);

        const tx = (x * Tile.SIZE) + this.fullsize/2;
        const ty = (y * Tile.SIZE) + this.fullsize/2;

        const alt = this.count % 2
                ? (idx % 2) != (angle % 2)
                : !(idx % 2);

        ctx.translate(tx, ty);
        ctx.rotate(angle * Math.PI / 2);
        ctx.translate(-tx, -ty);
        ctx.drawImage(alt ? this.canvas : this.altcanvas, x * Tile.SIZE, y * Tile.SIZE, this.fullsize, this.fullsize);
        ctx.resetTransform();

        /* ctx.font = '14px monospace';
        ctx.fillStyle = 'yellow';
        ctx.fillText(`${this.count}-${idx}-${angle}`, x * Tile.SIZE + 5, y * Tile.SIZE + 5 + 14); */
    }
}