import { BoxGeometry, DoubleSide, DynamicDrawUsage, InstancedMesh, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, TorusGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

import { controls, renderer, scene } from "./setup";
import { RATIO, SIZE } from "./constants";







/* const debugCube = new Mesh(
    new BoxGeometry(2 * SIZE, 2 * SIZE, 2 * SIZE),
    new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.25 })
);

scene.add(debugCube); */




const tubeGeom = new TorusGeometry(SIZE, SIZE * RATIO, 15, 15, Math.PI / 2);

const clone1 = tubeGeom.clone();
clone1.rotateY(Math.PI / 2);
clone1.rotateZ(Math.PI / 2);

const clone2 = tubeGeom.clone();
clone2.rotateZ(-Math.PI / 2);
clone2.rotateY(-Math.PI / 2);


tubeGeom.translate(-SIZE, -SIZE, 0);
clone1.translate(SIZE, 0, SIZE);
clone2.translate(0, SIZE, -SIZE);


const truchetGeom = mergeGeometries([tubeGeom, clone1, clone2]);


const testMesh = new Mesh(
    truchetGeom,
    new MeshPhongMaterial({ color: 0xeeeeff, side: DoubleSide })
);

//scene.add(testMesh);


const halfcount = 10;
const total = Math.pow(1 + (halfcount * 2), 3);


const mesh = new InstancedMesh(
    truchetGeom, 
    new MeshPhongMaterial({ color: 0xeeeeff, side: DoubleSide }),
    total
);
//mesh.instanceMatrix.setUsage( DynamicDrawUsage ); // will be updated every frame
scene.add( mesh );



const dummy = new Object3D();

let idx = 0;

for (let i = -halfcount; i <= halfcount; i++) {
    for (let j = -halfcount; j <= halfcount; j++) {
        for (let k = -halfcount; k <= halfcount; k++) {

            dummy.position.set( i * SIZE * 2, j * SIZE * 2, k * SIZE * 2 );
            dummy.rotateY(Math.floor(Math.random() * 4) * Math.PI / 2);

            dummy.updateMatrix();

            mesh.setMatrixAt( idx++, dummy.matrix );
        }
    }
}





function animate() {

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render();

}

animate();