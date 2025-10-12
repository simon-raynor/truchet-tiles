import { TileStyle, TileStyleProps } from "./TileStyle";

const SIZE = 32;


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

        this.canvas.style.setProperty('--count', this.count.toString());
        this.altcanvas.style.setProperty('--count', this.count.toString());

        this.create();
    }

    style: TileStyle = new TileStyle({});

    applyStyle(style: Partial<TileStyleProps>) {
        this.style.set(style);

        this.create();
    }

    get needsAlt() {
        return this.style.bgcolor1 !== this.style.bgcolor2;
    }

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

        this.#fill(fills);
        this.#fill(fills, true);

        firstHalves.forEach(path => {
            this.#strokeUnder(path);
            this.#strokeOver(path);
            this.#strokeUnder(path, this.altcontext);
            this.#strokeOver(path, this.altcontext);
        });
        secondHalves.forEach(path => {
            this.#strokeUnder(path);
            this.#strokeOver(path);
            this.#strokeUnder(path, this.altcontext);
            this.#strokeOver(path, this.altcontext);
        });
    }

    #fill(fills: Path2D[], alt = false) {
        const ctx = alt ? this.altcontext : this.context;

        const { bgcolor1, bgcolor2 } = this.style;

        ctx.fillStyle = alt ? bgcolor2 : bgcolor1;
        ctx.fillRect(0, 0, this.fullsize, this.fullsize);

        fills.forEach((path, idx) => {
            ctx.beginPath();
            ctx.fillStyle = Math.floor(idx / 2) % 2 ? (alt ? bgcolor2 : bgcolor1) : (alt ? bgcolor1 : bgcolor2);
            ctx.fill(path);
        });

        // debug border
        /* ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0,0,this.fullsize,this.fullsize); */
    }

    #strokeOver(path: Path2D, ctx = this.context) {
        const { linecolor1, linewidth1 } = this.style;

        if (!linewidth1 || !linecolor1) return;
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.strokeStyle = linecolor1;
        ctx.lineWidth = linewidth1 * Tile.SIZE;
        ctx.stroke(path);
    }

    #strokeUnder(path: Path2D, ctx = this.context) {
        const { linecolor2, linewidth2 } = this.style;

        if (!linewidth2 || !linecolor2) return;
        ctx.beginPath();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = linecolor2;
        ctx.lineWidth = linewidth2 * Tile.SIZE;
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