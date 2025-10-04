import { controls, renderer, scene } from "./setup";
import { getCubicMesh } from "./cubic";
import { getRhombicMesh } from "./rhombic";







/* const debugCube = new Mesh(
    new BoxGeometry(2 * SIZE, 2 * SIZE, 2 * SIZE),
    new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.25 })
);

scene.add(debugCube); */



const cubic = getCubicMesh();

scene.add(cubic);

const rhombic = getRhombicMesh();

scene.add(rhombic);





function animate() {

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render();

}

animate();