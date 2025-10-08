import { controls, renderer, scene } from "./setup";
import { getCubicMesh } from "./cubic";
import { getRhombicMesh } from "./rhombic";
import { Vector3 } from "three";
import { cubeWireframe, rhombicWireframe } from "./wireframes";




/* const debugCube = new Mesh(
    new BoxGeometry(2 * SIZE, 2 * SIZE, 2 * SIZE),
    new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.25 })
);

scene.add(debugCube); */

const size = 5;


const x = size * 1.75;
const y = size * 1.75;


const cubic = getCubicMesh(1);
const cubicTiled = getCubicMesh(size);
const cubewire = cubeWireframe(size);


cubic.scale.set(size, size, size);

cubewire.position.set(-x, y, 0);
cubic.position.set(-x, y, 0);
cubicTiled.position.set(x, y, 0);

scene.add(cubewire);
scene.add(cubic);
scene.add(cubicTiled);


const rhombic = getRhombicMesh(1);
const rhombicTiled = getRhombicMesh(size);
const rhombwire = rhombicWireframe(size);

rhombic.scale.set(size, size, size);

rhombwire.position.set(-x, -y, 0);
rhombic.position.set(-x, -y, 0);
rhombicTiled.position.set(x, -y, 0)

scene.add(rhombwire);
scene.add(rhombic);
scene.add(rhombicTiled);


const toSpin = [cubic, cubicTiled, cubewire, rhombic, rhombicTiled, rhombwire];

let t = 0;
function animate(_t: number) {
    const dt = _t - t;
    t = _t;

    toSpin.forEach(obj => obj.rotateY(dt / 1000))

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render();

}

animate(0);