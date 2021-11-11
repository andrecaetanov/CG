import * as THREE from "../build/three.module.js";
import { TrackballControls } from "../build/jsm/controls/TrackballControls.js";
import { GUI } from "../build/jsm/libs/dat.gui.module.js";
import { initRenderer, initCamera, onWindowResize } from "../libs/util/util.js";

var scene = new THREE.Scene();
var renderer = initRenderer();
var camera = initCamera(new THREE.Vector3(0, -30, 15));

var trackballControls = new TrackballControls(camera, renderer.domElement);

var planeGeometry = new THREE.PlaneGeometry(25, 25);
var planeMaterial = new THREE.MeshBasicMaterial({ color: "rgba(150, 150, 150)", side: THREE.DoubleSide });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var sphereMaterial = new THREE.MeshNormalMaterial();
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

var deltaSpeed = 0.5;
var spherePosition = new THREE.Vector3(0, 0, 1);
var targetPosition = new THREE.Vector3(0, 0, 1);
var isMoving = false;

window.addEventListener("resize", function () { onWindowResize(camera, renderer); }, false);

buildInterface();
render();

function buildInterface() {
  var controls = new (function () {
    this.x = targetPosition.x;
    this.y = targetPosition.y;
    this.z = targetPosition.z;

    this.changePosition = function () {
      targetPosition.x = this.x;
      targetPosition.y = this.y;
      targetPosition.z = this.z;
    };

    this.move = function () {
      isMoving = true;
    };
  })();

  var gui = new GUI();
  gui.add(controls, "x", -12, 12)
    .onChange(function () {
      controls.changePosition();
    })
    .name("X");
  gui.add(controls, "y", -12, 12)
    .onChange(function () {
      controls.changePosition();
    })
    .name("Y");
  gui.add(controls, "z", 1, 10)
    .onChange(function () {
      controls.changePosition();
    })
    .name("Z");
  gui.add(controls, "move", true).name("Move");
}

function moveSphere() {
  var mat4 = new THREE.Matrix4();
  sphere.matrixAutoUpdate = false;
  sphere.matrix.identity();

  if (isMoving) {
    var distances = new THREE.Vector3(
      targetPosition.x - spherePosition.x,
      targetPosition.y - spherePosition.y,
      targetPosition.z - spherePosition.z
    );

    var totalDistance = Math.abs(distances.x) + Math.abs(distances.y) + Math.abs(distances.z);

    spherePosition.x = calculatePosition(spherePosition.x, distances.x, totalDistance);
    spherePosition.y = calculatePosition(spherePosition.y, distances.y, totalDistance);
    spherePosition.z = calculatePosition(spherePosition.z, distances.z, totalDistance);

    if (distances.x == 0 && distances.y == 0 && distances.z == 0)
      isMoving = false;
  }

  sphere.matrix.multiply(mat4.makeTranslation(spherePosition.x, spherePosition.y, spherePosition.z));
}

function calculatePosition(spherePosition, distance, totalDistance) {
  if (distance != 0) {
    var moveSpeed = (distance / totalDistance) * deltaSpeed;
    var distanceToMove = Math.min(moveSpeed, Math.abs(distance));
    spherePosition += distanceToMove;
  }

  return spherePosition;
}

function render() {
  trackballControls.update();
  moveSphere();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
