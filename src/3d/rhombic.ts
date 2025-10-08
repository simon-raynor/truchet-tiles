

import { DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, QuadraticBezierCurve3, TubeGeometry, Vector3 } from "three";
import { RATIO } from "./constants";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getMaterial } from "./material";



const GRID_DIRECTIONS = [
    [1, 1, 0],
    [1, 0, 1],
    [1, -1, 0],
    [1, 0, -1],

    [-1, -1, 0],
    [-1, 0, 1],
    [-1, 1, 0],
    [-1, 0, -1],

    [0, 1, 1],
    [0, 1, -1],
    [0, -1, 1],
    [0, -1, -1]
];





const pairs = [
    [ 0, 1, ],
    [ 2, 3 ],
    [ 4, 5 ],
    [ 6, 7 ],
    [ 8, 9 ],
    [ 10, 11 ]
];

const tubes = [];

for (let pair of pairs) {
    const curve = new QuadraticBezierCurve3(
        new Vector3().fromArray(GRID_DIRECTIONS[pair[0]]),
        new Vector3(0, 0, 0),
        new Vector3().fromArray(GRID_DIRECTIONS[pair[1]])
    );


    const geometry = new TubeGeometry( curve, 15, RATIO, 15, false );

    tubes.push(geometry);
}

const tileGeom = mergeGeometries(tubes);





export function getRhombicMesh(perSide = 5, color: number = 0xff1122) {
    const count = perSide;
    const total = count * count * count;




    const mesh = new InstancedMesh(
        tileGeom, 
        getMaterial(color),
        total
    );
    //mesh.instanceMatrix.setUsage( DynamicDrawUsage ); // will be updated every frame



    const idir = new Vector3(2, 0, 2);
    const jdir = new Vector3(2, 2, 0);
    const kdir = new Vector3(0, 2, 2);
    
    const offset = Math.floor(count / 2);


    const dummy = new Object3D();

    let idx = 0;

    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            for (let k = 0; k < count; k++) {
                dummy.position.set( 0, 0, 0, )
                    .add(idir.clone().multiplyScalar(i - offset))
                    .add(jdir.clone().multiplyScalar(j - offset))
                    .add(kdir.clone().multiplyScalar(k - offset));

                dummy.rotateX(Math.floor(Math.random() * 4) * Math.PI / 2);
                dummy.rotateY(Math.floor(Math.random() * 4) * Math.PI / 2);
                dummy.rotateZ(Math.floor(Math.random() * 4) * Math.PI / 2);

                dummy.updateMatrix();
                mesh.setMatrixAt( idx++, dummy.matrix );
            }
        }
    }

    return mesh;
}