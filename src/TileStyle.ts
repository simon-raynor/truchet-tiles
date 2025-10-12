export class TileStyle implements TileStyleProps {
    linecolor1: string
    linecolor2: string

    linewidth1 : number
    linewidth2: number

    bgcolor1: string
    bgcolor2: string

    constructor(props: Partial<TileStyleProps>) {
        this.set(props);
    }

    set(props: Partial<TileStyleProps>) {
        this.linecolor1 = props.linecolor1 ?? 'black';
        this.linecolor2 = props.linecolor2 ?? 'white';

        this.linewidth1 = props.linewidth1 ?? 1 / 12;
        this.linewidth2 = props.linewidth2 ?? 1 / 4;

        this.bgcolor1 = props.bgcolor1 ?? 'white';
        this.bgcolor2 = props.bgcolor2 ?? 'white';
    }
}

export interface TileStyleProps {
    linecolor1: string
    linecolor2: string

    linewidth1 : number
    linewidth2: number

    bgcolor1: string
    bgcolor2: string
}