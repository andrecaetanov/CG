import * as THREE from  '../libs/other/three.module.r82.js';
import {RaytracingRenderer} from  '../libs/other/raytracingRenderer.js';

var scene, renderer;

var container = document.createElement( 'div' );
document.body.appendChild( container );

var scene = new THREE.Scene();

// The canvas is in the XY plane.
// Hint: put the camera in the positive side of the Z axis and the objects in the negative side
var camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.z = 6;
camera.position.y = 2.5;

renderer = new RaytracingRenderer(window.innerWidth, window.innerHeight, 32, camera);
container.appendChild( renderer.domElement );

addLights();
addPlane();

// Sphere
var cylinderPosition = new THREE.Vector3(0, 1.5,-0.5);
addCylinder(cylinderPosition);

var sphereGeometry = new THREE.SphereGeometry(1, 24, 24);
var mirrorMaterial = new THREE.MeshPhongMaterial( {
	color: "rgb(0,0,0)",
	specular: "rgb(255,255,255)",
	shininess: 1000,
} );
mirrorMaterial.mirror = true;
mirrorMaterial.reflectivity = 1;

var sphere = new THREE.Mesh(sphereGeometry, mirrorMaterial);
sphere.scale.multiplyScalar(0.5);
sphere.position.set(cylinderPosition.x, cylinderPosition.y + 1, cylinderPosition.z);
scene.add(sphere);

// Torus knot
var cylinderPosition = new THREE.Vector3(-2, 1.5, 0.5);
addCylinder(cylinderPosition);

var torusKnotGeometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8);
var mirrorMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(255,170,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

var torusKnot = new THREE.Mesh( torusKnotGeometry, mirrorMaterialSmooth );
torusKnot.scale.multiplyScalar(0.2);
torusKnot.position.set(cylinderPosition.x, cylinderPosition.y + 0.9, cylinderPosition.z);
scene.add(torusKnot);

// Red cylinder
var cylinderPosition = new THREE.Vector3(2, 1.5, 0.5);
addCylinder(cylinderPosition);

var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.25, 1.0, 80);
var mirrorMaterialSmooth = new THREE.MeshPhongMaterial( {
	color: "rgb(255,0,0)",
	specular: "rgb(34,34,34)",
	shininess: 10000,
} );
mirrorMaterialSmooth.mirror = true;
mirrorMaterialSmooth.reflectivity = 0.1;

var cylinder = new THREE.Mesh(cylinderGeometry, mirrorMaterialSmooth);
cylinder.position.set(cylinderPosition.x, cylinderPosition.y + 1, cylinderPosition.z);
scene.add(cylinder);

render();

function render()
{
	renderer.render(scene, camera);
}

function addLights() {
    var intensity = 0.5;
    var light = new THREE.PointLight(0xffffff, intensity);
    light.position.set(0, 3.50, 0);
    scene.add(light);

    var light = new THREE.PointLight(0x55aaff, intensity);
    light.position.set(-1.00, 2.50, 2.00);
    scene.add(light);

    var light = new THREE.PointLight(0xffffff, intensity);
    light.position.set(1.00, 2.50, 2.00);
    scene.add(light);
}

function addPlane() {
    var planeGeometry = new THREE.BoxGeometry(6.00, 0.05, 3.00);
    var planeSidesGeometry = new THREE.BoxGeometry(3.00, 0.05, 3.00);

    var phongMaterialBoxBack = new THREE.MeshLambertMaterial({
        color: "rgb(255,255,255)",
    });

    var phongMaterialBoxTopBottom = new THREE.MeshLambertMaterial({
        color: "rgb(211,211,211)",
    });

    var phongMaterialBoxLeftRight = new THREE.MeshLambertMaterial({
        color: "rgb(65,105,225)",
    });

    // bottom
    var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxTopBottom);
    plane.position.set(0, 1, 0);
    scene.add(plane);

    // top
    var plane = new THREE.Mesh(planeGeometry, phongMaterialBoxTopBottom);
    plane.position.set(0, 4, 0);
    scene.add(plane);

    // back
    var plane = new THREE.Mesh( planeGeometry, phongMaterialBoxBack );
    plane.rotation.x = 1.57;
    plane.position.set(0, 2.50, -1.5);
    scene.add(plane);

    // left
    var plane = new THREE.Mesh(planeSidesGeometry, phongMaterialBoxLeftRight);
    plane.rotation.z = 1.57;
    plane.position.set(-3.00, 2.50, 0)
    scene.add(plane);

    // right
    var plane = new THREE.Mesh(planeSidesGeometry, phongMaterialBoxLeftRight);
    plane.rotation.z = 1.57;
    plane.position.set(3.00, 2.50, 0)
    scene.add(plane);
}

function addCylinder(position) {
    var cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.0, 80);
    var phongMaterial = new THREE.MeshLambertMaterial({
        color: "rgb(70,130,180)",
    });

    var cylinder = new THREE.Mesh(cylinderGeometry, phongMaterial);
    cylinder.position.copy(position);
    scene.add(cylinder);
}