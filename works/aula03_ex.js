import * as THREE from  '../build/three.module.js';
import {initRenderer,
    onWindowResize, 
    InfoBox,
    createGroundPlaneWired} from "../libs/util/util.js";
import KeyboardState from '../libs/util/KeyboardState.js';

var renderer = initRenderer();
renderer.setClearColor("cornflowerblue");

var scene = new THREE.Scene();
scene.add(new THREE.HemisphereLight());

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0.0, 2.0, 0.0);
camera.up.set(0, 1, 0);

var cameraHolder = new THREE.Object3D();
cameraHolder.add(camera);
scene.add(cameraHolder);

var groundPlane = createGroundPlaneWired(800, 800, 160, 160);
scene.add(groundPlane);

var keyboard = new KeyboardState();

window.addEventListener('resize', function(){ onWindowResize(camera, renderer) }, false);

showInformation();
render();

function showInformation()
{  
  var controls = new InfoBox();
  controls.add("Flying camera");
  controls.addParagraph();
  controls.add("Press space to move");            
  controls.add("Up / Down arrows to rotate x");
  controls.add("Left / Right arrows to rotate y");
  controls.add("< / > keys to rotate z");
  controls.show();
}

function keyboardUpdate()
{
    var movementAcceleration = 1;
    var rotationAcceleration = 0.02;

    keyboard.update();

    if (keyboard.pressed("space"))
        cameraHolder.translateZ(-movementAcceleration);

    if (keyboard.pressed("up"))
        cameraHolder.rotateX(-rotationAcceleration);

    if (keyboard.pressed("down"))
        cameraHolder.rotateX(rotationAcceleration);

    if (keyboard.pressed("left"))
        cameraHolder.rotateY(rotationAcceleration);

    if (keyboard.pressed("right"))
        cameraHolder.rotateY(-rotationAcceleration);

    if (keyboard.pressed(","))
        cameraHolder.rotateZ(rotationAcceleration);

    if (keyboard.pressed("."))
        cameraHolder.rotateZ(-rotationAcceleration);
}

function render()
{
  requestAnimationFrame(render);
  keyboardUpdate();
  renderer.render(scene, camera)
}