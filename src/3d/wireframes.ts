import { BufferAttribute, BufferGeometry, LineBasicMaterial, LineSegments } from "three";

export function cubeWireframe(size: number, color: number = 0xffffff) {
    const edges = [
        // a
        size, size, size,
        -size, size, size,

        -size, size, size,
        -size, -size, size,

        -size, -size, size,
        size, -size, size,

        size, -size, size,
        size, size, size,
        // b
        size, size, -size,
        -size, size, -size,

        -size, size, -size,
        -size, -size, -size,

        -size, -size, -size,
        size, -size, -size,

        size, -size, -size,
        size, size, -size,
        // connect
        size, size, size,
        size, size, -size,

        -size, size, size,
        -size, size, -size,

        -size, -size, size,
        -size, -size, -size,

        size, -size, size,
        size, -size, -size,
    ]

    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(new Float32Array(edges), 3));

    return new LineSegments(geom, new LineBasicMaterial({ color }))
}


export const RHOMBIC_VERTICES = [
    1,1,1, 1,1,-1, 1,-1,1, 1,-1,-1,
    -1,1,1, -1,1,-1, -1,-1,1, -1,-1,-1,
    2,0,0, 0,2,0, 0,0,2,
    -2,0,0, 0,-2,0, 0,0,-2
];
export function rhombicWireframe(size: number, color: number = 0xffffff) {
    const a = [1,1,1],
        b = [1,1,-1],
        c = [1,-1,1],
        d = [1,-1,-1],
        e = [-1,1,1],
        f = [-1,1,-1],
        g = [-1,-1,1],
        h = [-1,-1,-1],
        i = [2,0,0],
        j = [0,2,0],
        k = [0,0,2],
        l = [-2,0,0],
        m = [0,-2,0],
        n = [0,0,-2];
    
    const edges = [
        ...a, ...i,
        ...a, ...j,
        ...a, ...k,
        ...b, ...i,
        ...b, ...j,
        ...b, ...n,
        ...c, ...i,
        ...c, ...m,
        ...c, ...k,
        ...d, ...i,
        ...d, ...m,
        ...d, ...n,
        ...e, ...l,
        ...e, ...j,
        ...e, ...k,
        ...f, ...l,
        ...f, ...j,
        ...f, ...n,
        ...g, ...l,
        ...g, ...m,
        ...g, ...k,
        ...h, ...l,
        ...h, ...m,
        ...h, ...n,
    ].map(e => e * size);

    const geom = new BufferGeometry();
    geom.setAttribute('position', new BufferAttribute(new Float32Array(edges), 3));

    return new LineSegments(geom, new LineBasicMaterial({ color }))
}