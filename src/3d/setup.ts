import { Color, DirectionalLight, Fog, HemisphereLight, PerspectiveCamera, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { COLOR_BACKGROUND } from "./constants";


// initialise scene
const scene = new Scene();
scene.background = new Color(COLOR_BACKGROUND);


// initialise renderer
const renderer = new WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.getElementById('stage')?.appendChild(renderer.domElement);


// add fog for aesthetics
const fog = new Fog(COLOR_BACKGROUND, 10, 20);
scene.fog = fog;


// light
//const hlight = new HemisphereLight( 0xff8888, 0x00ffff, 1 );
const hlight = new HemisphereLight( 0xff0000, 0x00ff00, 1 );
scene.add( hlight );

const dlight = new DirectionalLight( 0x00ff00, 1 );
dlight.position.set(10, 0, 0)
scene.add( dlight );



// create camera
const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.5,
    750
);

camera.position.set(0, 1, -10);
camera.lookAt(new Vector3(0, 0, 0));


const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.autoRotate = true;



const renderScene = new RenderPass( scene, camera );

const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio ), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0.1;
bloomPass.strength = 1;
bloomPass.radius = 0;

const outputPass = new OutputPass();

const composer = new EffectComposer( renderer );
composer.addPass( renderScene );
composer.addPass( bloomPass );
composer.addPass( outputPass );


export {
    scene,
    composer as renderer,
    camera,
    controls
};