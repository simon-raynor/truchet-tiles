

import { DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, QuadraticBezierCurve3, TubeGeometry, Vector3 } from "three";
import { camera, controls, renderer, scene } from "./setup";
import { RATIO } from "./constants";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";



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





export function getRhombicMesh(perSide = 5) {
    const count = perSide * 2;
    const total = count * count * count;




    const mesh = new InstancedMesh(
        tileGeom, 
        new MeshStandardMaterial({ color: 0xff1122, side: DoubleSide }),
        total
    );
    //mesh.instanceMatrix.setUsage( DynamicDrawUsage ); // will be updated every frame



    const idir = new Vector3(2, 0, 2);
    const jdir = new Vector3(2, 2, 0);
    const kdir = new Vector3(0, 2, 2);

    let centre;

    const halfsize = Math.round((count - 1) / 2);


    const dummy = new Object3D();

    let idx = 0;

    for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
            for (let k = 0; k < count; k++) {
                dummy.position.set( 0, 0, 0, )
                    .add(idir.clone().multiplyScalar(i))
                    .add(jdir.clone().multiplyScalar(j))
                    .add(kdir.clone().multiplyScalar(k));

                dummy.rotateX(Math.floor(Math.random() * 4) * Math.PI / 2);
                dummy.rotateY(Math.floor(Math.random() * 4) * Math.PI / 2);
                dummy.rotateZ(Math.floor(Math.random() * 4) * Math.PI / 2);

                if (i === halfsize && j === halfsize && k === halfsize) {
                    centre = dummy.position.clone();
                }

                dummy.updateMatrix();
                mesh.setMatrixAt( idx++, dummy.matrix );
            }
        }
    }

    mesh.position.sub(centre!);

    return mesh;
}








function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render();

}

animate();