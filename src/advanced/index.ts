
const DEFAULT_SIZE = 64;
const DEFAULT_LINESPER = 2 + Math.floor(Math.random() * 2);

const DEFAULT_SPACE = 1 - (1 / DEFAULT_LINESPER);

const LINE_WIDTH = 6 + Math.floor(Math.random() * 6);

const NUMBER_OF_TYPES = 2 + Math.floor(Math.random() * 3);


type Point = [number, number];


class Tile {
    size: number = DEFAULT_SIZE

    numEdges: number = 4
    corners: Point[] = [[-1, -1], [1, -1], [1, 1], [-1, 1]]
    linesPerEdge: number
    lines: Line[]

    constructor(
        linesPerEdge = DEFAULT_LINESPER
    ) {
        this.linesPerEdge = linesPerEdge;
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

            const thisEdgeNo = this.edgeNo(idx);

            const available = spotsAvailable.filter(other => {
                const edgeNo = this.edgeNo(other);

                return edgeNo !== thisEdgeNo
                    && edgeNo !== thisEdgeNo + (this.numEdges / 2);
            });

            const other = available[
                    Math.floor(Math.random() * available.length) % available.length
                ];

            spotsAvailable.splice(
                spotsAvailable.indexOf(other),
                1
            );

            spotsTaken.push(idx, other);
            
            const [x0, y0] = this.edgePointCoord(idx);
            const [x1, y1] = this.edgePointCoord(other);

            const xdiff = Math.abs(x0 - x1);
            const ydiff = Math.abs(y0 - y1);

            const [[sx0, sy0], [ex0, ey0]] = this.edgeEnds(idx);
            const [[sx1, sy1], [ex1, ey1]] = this.edgeEnds(other);

            let sharedCorner: Point | null = null;

            if (sx0 === ex1 && sy0 === ey1) sharedCorner = [sx0, sy0];
            if (sx1 === ex0 && sy1 === ey0) sharedCorner = [sx1, sy1];

            if (sharedCorner) {
                if (xdiff < 2 * ydiff && ydiff < 2 * xdiff) {
                    this.lines.push(
                        new ArcLine(
                            this.edgePointCoord(idx),
                            this.edgePointCoord(other),
                            this.scaleCoords(sharedCorner)
                        )
                    );
                } else {
                    const [cx, cy] = this.scaleCoords(sharedCorner);

                    const dx = cx - x0;
                    const dy = cy - y0;

                    const point: Point = [x1 - dx, y1 - dy];

                    this.lines.push(
                        new DotLine(
                            this.edgePointCoord(idx),
                            this.edgePointCoord(other),
                            point
                        )
                    );
                }
            }/*  else {
                this.lines.push(
                    new Line(
                        this.edgePointCoord(idx),
                        this.edgePointCoord(other)
                    )
                );
            } */


        }
    }


    scaleCoords([x, y]: Point): Point {
        return [this.size + (x * this.size), this.size + (y * this.size)];
    }


    edgeNo(idx: number): number {
        return Math.floor(idx / this.linesPerEdge);
    }

    edgeEnds(idx: number): [Point, Point] {
        const edgeNo = this.edgeNo(idx);
        const nextEdge = (edgeNo + 1) % this.numEdges;

        const a = this.corners[edgeNo];
        const b = this.corners[nextEdge];

        return [a, b];
    }

    edgePointCoord(idx: number): Point {
        const pointNo =  idx % this.linesPerEdge;
        const ratio = pointNo / (this.linesPerEdge - 1);

        const space = DEFAULT_SPACE;
        const pad = 1 - space;
        const paddedRatio = (pad/2) + (space * ratio);

        const [[x0, y0], [x1, y1]] = this.edgeEnds(idx);

        const x = x0 + (paddedRatio * (x1 - x0));
        const y = y0 + (paddedRatio * (y1 - y0));

        return this.scaleCoords([x, y]);
    }

    edgePointNormal(idx: number): Point {
        const [[x0, y0], [x1, y1]] = this.edgeEnds(idx);

        return [-(y1 - y0), (x1 - x0)];
    }
}


class Line {
    from: Point
    to: Point

    constructor(
        from: Point,
        to: Point,
    ) {
        this.from = from;
        this.to = to;
    }

    toString() {
        const [x0, y0] = this.from;
        const [x2, y2] = this.to;

        return `M${x0} ${y0} L${x2} ${y2}`;
    }

    embellish(ctx: CanvasRenderingContext2D) {

    }
}

class ArcLine extends Line {
    via: Point
    
    constructor(
        from: Point,
        to: Point,
        via: Point
    ) {
        super(from, to);
        this.via = via;
    }

    toString() {
        const [x0, y0] = this.from;
        const [x1, y1] = this.via;
        const [x2, y2] = this.to;

        const xrad = x0 - x2;
        const yrad = y0 - y2;

        const sweep = y0 || (xrad < 0)? 0 : 1;

        // M${x0} ${y0} h10h-20h10v10v-20v10 
        return `M${x0} ${y0} A${Math.abs(xrad)} ${Math.abs(yrad)} 0 0 ${sweep} ${x2} ${y2}`;
    }
}

class DotLine extends Line {
    via: Point
    
    constructor(
        from: Point,
        to: Point,
        via: Point
    ) {
        super(from, to);
        this.via = via;
    }

    toString() {
        const [x0, y0] = this.from;
        const [x1, y1] = this.via;
        const [x2, y2] = this.to;

        // M${x0} ${y0} h10h-20h10v10v-20v10 
        return `M${x0} ${y0} L${x1} ${y1} L${x2} ${y2}
                M${x1 + LINE_WIDTH} ${y1}
                    A${LINE_WIDTH} ${LINE_WIDTH} 0 1 0 ${x1 - LINE_WIDTH} ${y1}
                    A${LINE_WIDTH} ${LINE_WIDTH} 0 1 0 ${x1 + LINE_WIDTH} ${y1}`;
    }

    embellish(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.via[0], this.via[1], LINE_WIDTH/2, 0, Math.PI * 2);
        ctx.fill();
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
                this.renderLine(tile, line);
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

        line.embellish(ctx);
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