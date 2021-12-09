import * as THREE from '../build/three.module.js';
import Stats from '../build/jsm/libs/stats.module.js';
import { GUI } from '../build/jsm/libs/dat.gui.module.js';
import { TrackballControls } from '../build/jsm/controls/TrackballControls.js';
import KeyboardState from '../libs/util/KeyboardState.js';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
    initRenderer,
    InfoBox,
    createGroundPlane,
    onWindowResize,
    degreesToRadians,
    createLightSphere
} from "../libs/util/util.js";

var scene = new THREE.Scene();
var stats = new Stats();
var keyboard = new KeyboardState();

// Renderer
var renderer = initRenderer();
renderer.setClearColor("rgb(30, 30, 42)");

// Camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(2.18, 1.62, 3.31);
camera.up.set(0, 1, 0);

// Camera helpers
var trackballControls = new TrackballControls(camera, renderer.domElement);
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

// Ground plane
var groundPlane = createGroundPlane(4.0, 4.0, 50, 50);
groundPlane.rotateX(degreesToRadians(-90));
scene.add(groundPlane);

// Axes helper
var axesHelper = new THREE.AxesHelper(1.5);
axesHelper.visible = false;
scene.add(axesHelper);

// Teapot
var geometry = new TeapotGeometry(0.5);
var material = new THREE.MeshPhongMaterial({ color: "rgb(255,255,255)", shininess: "200" });
material.side = THREE.DoubleSide;
var obj = new THREE.Mesh(geometry, material);
obj.castShadow = true;
obj.position.set(0.0, 0.5, 0.0);
scene.add(obj);

// Torus
var torusGeometry = new THREE.TorusGeometry(1.3, 0.04, 100, 100, Math.PI * 2);
torusGeometry.rotateX(degreesToRadians(90));
var torusMaterial = new THREE.MeshPhongMaterial({ color: "rgb(208,60,60)" });
var torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.y = 1.5;
scene.add(torus);

// Red light sphere
var lightColor = "rgb(255,0,0)";
var redSphere = buildLightSphere(new THREE.Vector3(1.3, -0.5, 0), lightColor);
var redSpherePivot = buildSpherePivot(redSphere, 0);
var redSpotLight = new THREE.SpotLight(lightColor);
setSpotLight(redSpotLight, redSphere);

// Green light sphere
var lightColor = "rgb(0,255,0)";
var greenSphere = buildLightSphere(new THREE.Vector3(-1.3, -0.5, 0), lightColor);
var greenSpherePivot = buildSpherePivot(greenSphere, 0);
var greenSpotLight = new THREE.SpotLight(lightColor);
setSpotLight(greenSpotLight, greenSphere);

// Blue light sphere
var lightColor = "rgb(0,0,255)";
var blueSphere = buildLightSphere(new THREE.Vector3(1.3, -0.5, 0), lightColor);
var blueSpherePivot = buildSpherePivot(blueSphere, -1);
var blueSpotLight = new THREE.SpotLight(lightColor);
setSpotLight(blueSpotLight, blueSphere);

// Ambient light
// More info here: https://threejs.org/docs/#api/en/lights/AmbientLight
var ambientColor = "rgb(50,50,50)";
var ambientLight = new THREE.AmbientLight(ambientColor);
scene.add(ambientLight);

buildInterface();
showInformation();

render();

function buildLightSphere(position, color) {
    var lightSphere = createLightSphere(scene, 0.1, 10, 10, position);
    lightSphere.material.color.set(color);
    return lightSphere;
}

function buildSpherePivot(lightSphere, rotateYAngle) {
    var spherePivot = new THREE.Object3D();
    spherePivot.position.set(0, 2, 0);
    spherePivot.add(lightSphere);
    scene.add(spherePivot);
    spherePivot.rotateY(rotateYAngle);
    return spherePivot;
}

// More info here: https://threejs.org/docs/#api/en/lights/SpotLight
function setSpotLight(spotLight, lightSphere, name) {
    lightSphere.getWorldPosition(spotLight.position);

    spotLight.shadow.mapSize.width = 512;
    spotLight.shadow.mapSize.height = 512;
    spotLight.angle = degreesToRadians(40);
    spotLight.castShadow = true;
    spotLight.decay = 2;
    spotLight.penumbra = 0.5;
    spotLight.name = name;

    scene.add(spotLight);
}

function buildInterface() {
    var controls = new function () {
        this.redLight = true;
        this.greenLight = true;
        this.blueLight = true;
        this.ambientLight = true;
        this.viewAxes = false;

        this.onEnableRedLight = function () {
            redSphere.visible = this.redLight;
            redSpotLight.visible = this.redLight;
        };
        this.onEnableGreenLight = function () {
            greenSphere.visible = this.greenLight;
            greenSpotLight.visible = this.greenLight;
        };
        this.onEnableBlueLight = function () {
            blueSphere.visible = this.blueLight;
            blueSpotLight.visible = this.blueLight;
        };
        this.onEnableAmbientLight = function () {
            ambientLight.visible = this.ambientLight;
        };
        this.onViewAxes = function () {
            axesHelper.visible = this.viewAxes;
        };
    };

    var gui = new GUI();
    gui.add(controls, 'redLight', true)
        .name("Red Light")
        .onChange(function (e) { controls.onEnableRedLight() });
    gui.add(controls, 'greenLight', true)
        .name("Green Light")
        .onChange(function (e) { controls.onEnableGreenLight() });
    gui.add(controls, 'blueLight', true)
        .name("Blue Light")
        .onChange(function (e) { controls.onEnableBlueLight() });
    gui.add(controls, 'ambientLight', true)
        .name("Ambient Light")
        .onChange(function (e) { controls.onEnableAmbientLight() });
    gui.add(controls, 'viewAxes', false)
        .name("View Axes")
        .onChange(function (e) { controls.onViewAxes() });
}

function showInformation() {
    var controls = new InfoBox();
    controls.add("Lighting - RGB Spotlights");
    controls.addParagraph();
    controls.add("Use the A and D keys to move the red sphere");
    controls.add("Use the < and > keys to move the green sphere");
    controls.add("Use the left and right keys to move the blue sphere");
    controls.show();
}

function render() {
    stats.update();
    //trackballControls.update();
    keyboardUpdate();
    requestAnimationFrame(render);
    renderer.render(scene, camera)
}

function keyboardUpdate() {
    keyboard.update();
    if (keyboard.pressed("A")) {
        redSpherePivot.rotateY(-0.05)
        updateLightPosition(redSphere, redSpotLight);
    }
    if (keyboard.pressed("D")) {
        redSpherePivot.rotateY(0.05)
        updateLightPosition(redSphere, redSpotLight);
    }
    if (keyboard.pressed(",")) {
        greenSpherePivot.rotateY(-0.05)
        updateLightPosition(greenSphere, greenSpotLight);
    }
    if (keyboard.pressed(".")) {
        greenSpherePivot.rotateY(0.05)
        updateLightPosition(greenSphere, greenSpotLight);
    }
    if (keyboard.pressed("left")) {
        blueSpherePivot.rotateY(-0.05)
        updateLightPosition(blueSphere, blueSpotLight);
    }
    if (keyboard.pressed("right")) {
        blueSpherePivot.rotateY(0.05)
        updateLightPosition(blueSphere, blueSpotLight);
    }
}

function updateLightPosition(lightSphere, spotLight) {
    lightSphere.getWorldPosition(spotLight.position);
}
