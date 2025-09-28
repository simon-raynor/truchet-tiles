
const DEFAULT_SIZE = 96;
const DEFAULT_LINESPER = 3;

const LINE_WIDTH = 7;

const NUMBER_OF_TYPES = 3;


type Point = [number, number];


class Tile {
    size: number = DEFAULT_SIZE

    numEdges: number = 4
    corners: Point[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    linesPerEdge: number
    edges: number[]
    lines: Line[]

    constructor(
        linesPerEdge = DEFAULT_LINESPER
    ) {
        this.linesPerEdge = linesPerEdge;
        this.edges = [];
        this.lines = [];

        const lineCount = this.linesPerEdge * this.numEdges;

        const spotsAvailable: number[] = Array.from(new Array(lineCount)).map((_,i) => i);
        const spotsTaken: number[] = [];

        for (let idx = 0; idx < lineCount; idx++) {
            if (spotsTaken.includes(idx)) continue;

            spotsAvailable.splice(
                spotsAvailable.indexOf(idx),
                1
            );

            const other = spotsAvailable[
                    (1 + Math.floor(Math.random() * (spotsAvailable.length - 2))) % spotsAvailable.length
                ];
            
            /* const edge1No = Math.floor(idx / this.linesPerEdge);
            const edge2No = Math.floor(other / this.linesPerEdge); */

            spotsAvailable.splice(
                spotsAvailable.indexOf(other),
                1
            );

            spotsTaken.push(idx, other);

            this.edges[idx] = other;
            this.edges[other] = idx;


            this.lines.push(
                new Line(
                    this.edgePointCoord(idx),
                    this.edgePointCoord(other),
                    [this.size, this.size]
                )
            )
        }
    }

    edgeEnds(idx: number): [Point, Point] {
        const edgeNo = Math.floor(idx / this.linesPerEdge);
        const nextEdge = (edgeNo + 1) % this.numEdges;

        const a = this.corners[edgeNo];
        const b = this.corners[nextEdge];

        return [a, b];
    }

    edgePointCoord(idx: number): Point {
        const pointNo =  idx % this.linesPerEdge;
        const ratio = (1 + pointNo) / (1 + this.linesPerEdge);

        const [[x0, y0], [x1, y1]] = this.edgeEnds(idx);

        const x = x0 + (ratio * (x1 - x0));
        const y = y0 + (ratio * (y1 - y0));

        return [this.size + (x * this.size), this.size + (y * this.size)];
    }
}


class Line {
    from: Point
    to: Point
    via: Point

    constructor(
        from: Point,
        to: Point,
        via: Point
    ) {
        this.from = from;
        this.to = to;
        this.via = via;
    }

    toString() {
        const [x0, y0] = this.from;
        const [x1, y1] = this.via;
        const [x2, y2] = this.to;
        return `M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}`;
    }
}


class TileRenderer {
    size: number

    // @ts-ignore
    #canvas: HTMLCanvasElement
    // @ts-ignore
    #ctx: CanvasRenderingContext2D

    #initCanvas() {
        this.#canvas = document.createElement('canvas');
        this.#ctx = this.#canvas.getContext('2d')!;

        if (!this.#ctx) throw('Unable to get 2d context');

        /* this.#canvas.style.position = 'absolute';
        this.#canvas.style.top = '-200vmax';
        this.#canvas.style.left = '-200vmax'; */
        this.#canvas.classList.add('previewer');

        this.#canvas.width = this.size * 2;
        this.#canvas.height = this.size * 2;

        document.getElementById('previews')!.appendChild(this.#canvas);
    }

    constructor(
        size = DEFAULT_SIZE
    ) {
        this.size = size;

        this.#initCanvas();
    }

    render(tile: Tile) {
        const done: number[] = [];

        /* tile.edges.forEach(
            (edge, idx) => {
                if (done.includes(edge) || done.includes(idx)) return;

                this.renderEdge(tile, edge, idx);

                done.push(edge, idx);
            }
        ); */
        tile.lines.forEach(
            (line, idx) => {
                this.renderLine(tile, line)
            }
        );
    }

    renderLine(
        tile: Tile,
        line: Line
    ) {
        const path = new Path2D(line.toString());
        const ctx = this.#ctx;

        ctx.lineWidth = LINE_WIDTH * 2;
        ctx.strokeStyle = 'black';
        ctx.stroke(path);

        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = 'white';
        ctx.stroke(path);
    }

    renderEdge(
        tile: Tile,
        fromIdx: number,
        toIdx: number
    ) {
        const ctx = this.#ctx;

        const [x0, y0] = tile.edgePointCoord(fromIdx);

        const [x1, y1] = tile.edgePointCoord(toIdx);

        const path = new Path2D(`
            M${x0} ${y0}
            L${x1} ${y1}
        `);
        ctx.lineWidth = LINE_WIDTH * 2;
        ctx.strokeStyle = 'black';
        ctx.stroke(path);

        ctx.lineWidth = LINE_WIDTH;
        ctx.strokeStyle = 'white';
        ctx.stroke(path);
    }

    get image() {
        return this.#canvas;
    }
}


const tiles = [];

for (let i = 0; i < NUMBER_OF_TYPES; i++) {
    const t = new Tile();
    const tr = new TileRenderer();

    tr.render(t);
    tiles.push(tr.image);
}



const maincanvas = document.createElement('canvas');
const mainctx = maincanvas.getContext('2d')!;

maincanvas.height = window.innerHeight;
maincanvas.width = window.innerWidth;


for (let i = 0; i < maincanvas.width; i += DEFAULT_SIZE) {
    for (let j = 0; j < maincanvas.height; j += DEFAULT_SIZE) {
        mainctx.save();

        const angleNo = Math.floor(Math.random() * 4);
        const angle = angleNo * Math.PI / 2;

        mainctx.translate(i + DEFAULT_SIZE / 2, j + DEFAULT_SIZE / 2);
        mainctx.rotate(angle);
        mainctx.translate(- i - DEFAULT_SIZE / 2, - j - DEFAULT_SIZE / 2);

        const tileNo = Math.floor(Math.random() * tiles.length) % tiles.length;
        const tile = tiles[tileNo];

        mainctx.drawImage(
            tile,
            i,
            j,
            DEFAULT_SIZE,
            DEFAULT_SIZE
        );

        mainctx.resetTransform();
    }
}

document.body.append(maincanvas);