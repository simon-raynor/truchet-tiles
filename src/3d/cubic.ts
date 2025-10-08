import { DoubleSide, TorusGeometry } from "three";
import { RATIO } from "./constants";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { InstancedMesh } from "three";
import { MeshPhongMaterial } from "three";
import { Object3D } from "three";
import { getMaterial } from "./material";

const tubeGeom = new TorusGeometry(1, RATIO, 15, 15, Math.PI / 2);

const clone1 = tubeGeom.clone();
clone1.rotateY(Math.PI / 2);
clone1.rotateZ(Math.PI / 2);

const clone2 = tubeGeom.clone();
clone2.rotateZ(-Math.PI / 2);
clone2.rotateY(-Math.PI / 2);


tubeGeom.translate(-1, -1, 0);
clone1.translate(1, 0, 1);
clone2.translate(0, 1, -1);


const truchetGeom = mergeGeometries([tubeGeom, clone1, clone2]);


export function getCubicMesh(perSide = 5, color = 0x3322ff) {
    const halfcount = perSide;
    const total = perSide <= 1 ? 1 : Math.pow(1 + (halfcount * 2), 3);


    const mesh = new InstancedMesh(
        truchetGeom, 
        getMaterial(color),
        total
    );
    //mesh.instanceMatrix.setUsage( DynamicDrawUsage ); // will be updated every frame



    const dummy = new Object3D();

    let idx = 0;

    const cubeoffset = 2 * Math.floor(perSide / 2);

    for (let i = 0; i < perSide; i++) {
        for (let j = 0; j < perSide; j++) {
            for (let k = 0; k < perSide; k++) {

                dummy.position.set( i * 2 - cubeoffset, j * 2 - cubeoffset, k * 2 - cubeoffset );
                dummy.rotateY(Math.floor(Math.random() * 4) * Math.PI / 2);

                dummy.updateMatrix();

                mesh.setMatrixAt( idx++, dummy.matrix );
            }
        }
    }

    return mesh;
}