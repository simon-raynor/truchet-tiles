import { Color, DirectionalLight, Fog, HemisphereLight, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { BLOOM, COLOR_BACKGROUND, FOG, LIGHT_COUNT, RAINBOW_LIGHTS } from "./constants";


// initialise scene
const scene = new Scene();
scene.background = new Color(COLOR_BACKGROUND);


// initialise renderer
const renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById('stage')?.appendChild(renderer.domElement);


// add fog for aesthetics
if (FOG) {
    const fog = new Fog(COLOR_BACKGROUND, 10, 20);
    scene.fog = fog;
}



if (RAINBOW_LIGHTS) {
    for (let i = 0; i < LIGHT_COUNT; i++) {
        const theta = i * Math.PI * 2 / LIGHT_COUNT;

        const dlight = new DirectionalLight( new Color().setHSL(theta / (Math.PI * 2), 1, 0.5), 1 );
        dlight.position.set(Math.sin(theta), 0, Math.cos(theta));
        scene.add( dlight );
    }
} else {
    const hlight = new HemisphereLight( 0xffffee, 0x444444, 1 );
    scene.add( hlight );

    const dlight = new DirectionalLight( 0xffffff, 1 );
    dlight.position.set(1, 1, 1);
    scene.add( dlight );
}


// create camera
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    750
);

camera.position.set(0, 15, -25);
camera.lookAt(new Vector3(0, 0, 0));


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
//controls.autoRotate = true;
//controls.autoRotateSpeed = 1;



const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.1;
bloomPass.strength = .5;
bloomPass.radius = 0;

const outputPass = new OutputPass();


const composer = new EffectComposer( renderer );
composer.addPass( renderScene );

if (BLOOM) {
    composer.addPass( bloomPass );
}

composer.addPass( outputPass );


export {
    scene,
    composer as renderer,
    camera,
    controls
};