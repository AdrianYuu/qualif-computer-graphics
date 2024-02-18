import * as THREE from "./three.js/build/three.module.js";
import {OrbitControls} from "./three.js/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from "./three.js/examples/jsm/loaders/GLTFLoader.js";
import {FontLoader} from "./three.js/examples/jsm/loaders/FontLoader.js";
import {TextGeometry} from "./three.js/examples/jsm/geometries/TextGeometry.js";

/*
Material:
1. MeshBasicMaterial -> Sun, Sun Ring
2. MeshStandardMaterial -> Dirt, Grass, Water, Bamboo, Rock, Hill
3. MeshPhongMaterial -> Lilypad

Geometry:
1. BoxGeometry -> Dirt, Grass, Water
2. SphereGeometry -> Sun
3. RingGeometry -> Sun Ring
4. CylinderGeometry -> Bamboo
5. CircleGeometry -> Lilypad
6. TetrahedronGeometry -> Rock
7. ConeGeometry -> Hill

Lightning:
1. Ambient Light (Jumlah: 1)
2. Point Light (Jumlah: 1)
3. Spot Light (Jumlah: 1)

3D Text:
1. Tulisan "Welcome to Panda Forest!"

3D Model:
1. Panda (Jumlah: 2)

Mouse Interaction
1. Klik kiri pada 3D Text maka 3D Text akan berubah warna

Keyboard Interaction
1. Klik "SPASI" untuk switch camera
*/

const model3DLoader = new GLTFLoader();
const fontLoader = new FontLoader();

// Scene
const scene = new THREE.Scene();

// Camera
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
const FOV = 45;
const aspectRatio = windowWidth / windowHeight;
const near = 0.1;
const far = 2000;

const frontCamera = new THREE.PerspectiveCamera(FOV, aspectRatio, near, far);
frontCamera.position.set(200, 140, 200);
const backCamera = new THREE.PerspectiveCamera(FOV, aspectRatio, near, far);
backCamera.position.set(-200, 140, -200);
const movingCamera = new THREE.PerspectiveCamera(FOV, aspectRatio, near, far);
movingCamera.position.set(250, 200, 250);

let currentCamera = frontCamera;
currentCamera.lookAt(0, 0, 0);
let isFrontCamera = true;
let isBackCamera = false;
let isMovingCamera = false;

window.addEventListener("keydown", (e) => {
    // Change Camera by pressing "SPACE"
    if(e.key == " ") {
        if(isFrontCamera){
            isFrontCamera = false;
            isBackCamera = true;
            currentCamera = backCamera;
            frontCamera.position.set(200, 140, 200);
        } else if(isBackCamera){
            isBackCamera = false;
            isMovingCamera = true;
            currentCamera = movingCamera;
            backCamera.position.set(-200, 140, -200);
        } else if(isMovingCamera){
            isMovingCamera = false;
            isFrontCamera = true;
            currentCamera = frontCamera;
        }
        controls.dispose();
        controls = new OrbitControls(currentCamera, renderer.domElement);

    // Move Panda by pressing [W/w | A/a | S/s | D/d]
    } else if(e.key == "w" || e.key == "W"){
        panda1.position.x += 1;
    } else if(e.key == "a" || e.key == "A"){
        panda1.position.z -= 1;
    } else if(e.key == "s" || e.key == "S"){
        panda1.position.x -= 1;
    } else if(e.key == "d" || e.key == "D"){
        panda1.position.z += 1;
    }
});

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(windowWidth, windowHeight);
renderer.shadowMap.enabled = true;
document.body.append(renderer.domElement);

window.addEventListener("resize", () => {
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    currentCamera.aspect = windowWidth / windowHeight;
    currentCamera.updateProjectionMatrix();
    renderer.setSize(windowWidth, windowHeight);
});

// Orbit Controls
let controls = new OrbitControls(currentCamera, renderer.domElement);

// Light
const ambientLight = new THREE.AmbientLight({color: 0xfffff7}, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight({color: 0xffffff}, 0.4);
pointLight.position.set(0, 100, 0);
scene.add(pointLight);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 5);
// scene.add(pointLightHelper);

const movingLight = new THREE.SpotLight({color: 0xffffff}, 1);
movingLight.position.set(0, 60, 0);
movingLight.shadow.mapSize.width = 512;
movingLight.shadow.mapSize.height = 512;
movingLight.shadow.camera.near = 0.5;
movingLight.shadow.camera.far = 500;
movingLight.shadow.camera.fov = 45;
movingLight.castShadow = true;
scene.add(movingLight);
// const movingLightHelper = new THREE.SpotLightHelper(movingLight, 5);
// scene.add(movingLightHelper);

// Geometry
const dirtGeo = new THREE.BoxGeometry(200, 6, 200);
const dirtMap = new THREE.TextureLoader().load("./assets/texture/dirt.jpg");
const dirtMaterial = new THREE.MeshStandardMaterial({map: dirtMap});
const dirt = new THREE.Mesh(dirtGeo, dirtMaterial);
dirt.receiveShadow = true;
scene.add(dirt);

const grassLeftGeo = new THREE.BoxGeometry(100, 8, 200);
const grassLeftMap = new THREE.TextureLoader().load("./assets/texture/grass.jpg");
const grassLeftMaterial = new THREE.MeshStandardMaterial({map: grassLeftMap});
const grassLeft = new THREE.Mesh(grassLeftGeo, grassLeftMaterial);
grassLeft.position.set(-50, 7, 0);
grassLeft.receiveShadow = true;
scene.add(grassLeft);

const grassRightGeo = new THREE.BoxGeometry(60, 8, 200);
const grassRightMap = new THREE.TextureLoader().load("./assets/texture/grass.jpg");
const grassRightMaterial = new THREE.MeshStandardMaterial({map: grassRightMap});
const grassRight = new THREE.Mesh(grassRightGeo, grassRightMaterial);
grassRight.position.set(70, 7, 0);
grassRight.receiveShadow = true;
scene.add(grassRight);

const grassMidGeo = new THREE.BoxGeometry(40, 8, 50);
const grassMidMap = new THREE.TextureLoader().load("./assets/texture/grass.jpg");
const grassMidMaterial = new THREE.MeshStandardMaterial({map: grassMidMap});
const grassMid = new THREE.Mesh(grassMidGeo, grassMidMaterial);
grassMid.position.set(20, 7, -75);
grassMid.receiveShadow = true;
scene.add(grassMid);

const waterGeo = new THREE.BoxGeometry(40, 4, 150);
const waterMap = new THREE.TextureLoader().load("./assets/texture/water.jpg");
const waterMaterial = new THREE.MeshStandardMaterial({map: waterMap});
const water = new THREE.Mesh(waterGeo, waterMaterial);
water.position.set(20, 5, 25);
water.receiveShadow = true;
scene.add(water);

const sunGeo = new THREE.SphereGeometry(10, 30, 25);
const sunMap = new THREE.TextureLoader().load("./assets/texture/sun.jpg");
const sunMaterial = new THREE.MeshBasicMaterial({map: sunMap});
const sun = new THREE.Mesh(sunGeo, sunMaterial);
sun.position.set(0, 125, 0);
sun.castShadow = true;
scene.add(sun);

const sunRingGeo = new THREE.RingGeometry(16, 12, 8);
const sunRingMap = new THREE.TextureLoader().load("./assets/texture/sun.jpg");
const sunRingMaterial = new THREE.MeshBasicMaterial({map: sunRingMap, side: THREE.DoubleSide});
const sunRing = new THREE.Mesh(sunRingGeo, sunRingMaterial);
sunRing.position.set(0, 125, 0);
sunRing.castShadow = true;
scene.add(sunRing);

const bambooLocationX = [
    -35, -30, -25, 
    -35, -30, -25, 
    -35, -30, -25, 
    -35, -30, -25, 
    -35, -30, -25,
    -35, -30, -25, 
    -35, -30, -25, 
    -35, -30, -25, 
    -35, -30, -25, 
    -65, -60, -55,
    -65, -60, -55, 
    -65, -60, -55,
    -65, -60, -55, 
    -65, -60, -55, 
    -65, -60, -55,
    -65, -60, -55, 
    -65, -60, -55, 
    -95, -90, -85, 
    -95, -90, -85, 
    -95, -90, -85,
    -95, -90, -85, 
    -95, -90, -85, 
    -95, -90, -85, 
    -95, -90, -85, 
    -95, -90, -85,
    -95, -90, -85, 
    60, 55, 50, 
    60, 55, 50, 
    60, 55, 50, 
    60, 55, 50, 
    60, 55, 50, 
    60, 55, 50, 
    90, 85, 80, 
    90, 85, 80, 
    90, 85, 80, 
    90, 85, 80, 
    90, 85, 80, 
    90, 85, 80, 
    90, 85, 80, 
    90, 85, 80,
];

const bambooLocationZ = [
    -80, -85, -83, 
    -60, -65, -63, 
    -40, -45, -43, 
    -20, -25, -23, 
    0, 5, 3, 
    20, 25, 23, 
    40, 45, 43, 
    60, 65, 63, 
    80, 85, 83, 
    -70, -75, -73, 
    -50, -55, -53, 
    -30, -35, -33, 
    -10, -15, -13, 
    10, 15, 13, 
    30, 35, 33, 
    50, 55, 53, 
    70, 75, 73, 
    -80, -85, -83, 
    -60, -65, -63, 
    -40, -45, -43, 
    -20, -25, -23, 
    0, 5, 3, 
    20, 25, 23,
    40, 45, 43, 
    60, 65, 63, 
    80, 85, 83, 
    -20, -25, -23, 
    0, 5, 3, 
    20, 25, 23, 
    40, 45, 43, 
    60, 65, 63, 
    80, 85, 83, 
    -70, -75, -73, 
    -50, -55, -53, 
    -30, -35, -33,
    -10, -15, -13, 
    10, 15, 13, 
    30, 35, 33, 
    50, 55, 53, 
    70, 75, 73,
];

const bambooHeight = [30, 42, 20];
const bambooLocationY = [26, 32, 21];
const bambooMap = new THREE.TextureLoader().load("./assets/texture/bamboo.jpg");
const bambooMaterial = new THREE.MeshStandardMaterial({map: bambooMap});
for (let i = 0; i < bambooLocationX.length; i++) {
    let random = Math.floor(Math.random() * 10) % 2;
    let currHeight = bambooHeight[random];
    let currY = bambooLocationY[random];
    let bambooGeo = new THREE.CylinderGeometry(1, 1, currHeight, 30);
    let bamboo = new THREE.Mesh(bambooGeo, bambooMaterial);
    bamboo.position.set(bambooLocationX[i], currY, bambooLocationZ[i]);
    bamboo.castShadow = true;
    scene.add(bamboo);
}

const lilyPadLocationX = [10, 15, 20, 25, 30, 32, 30, 8, 11, 14, 26, 31];
const lilyPadLocationZ = [0, 30, 60, 80, 40, 90, 10, 50, 85, -30, -20, -10];
const lilyPadGeo = new THREE.CircleGeometry(3, 30);
const lilyPadMap = new THREE.TextureLoader().load("./assets/texture/lilypad.jpg");
const lilyPadMaterial = new THREE.MeshPhongMaterial({
    map: lilyPadMap,
    side: THREE.DoubleSide,
    emissive: "yellow",
    emissiveIntensity: 0.3,
});
for (let i = 0; i < lilyPadLocationX.length; i++) {
    let lilyPad = new THREE.Mesh(lilyPadGeo, lilyPadMaterial);
    lilyPad.rotateX(Math.PI / 2);
    lilyPad.position.set(lilyPadLocationX[i], 7.5, lilyPadLocationZ[i]);
    lilyPad.castShadow = true;
    scene.add(lilyPad);
}

const rockCount = 74;
const rockLocationX = [2, 38];
const rockLocationY = [8, 8.4, 7.6];
const randomRotation = [20, 50, 80, 110];
const rockGeo = new THREE.TetrahedronGeometry(2, 3);
const rockMap = new THREE.TextureLoader().load("./assets/texture/rock.jpg");
const rockMaterial = new THREE.MeshStandardMaterial({map: rockMap});
for (let i = 0; i < rockLocationX.length; i++) {
    for (let j = 0; j < rockCount; j++) {
        let rock = new THREE.Mesh(rockGeo, rockMaterial);
        let randomLocationY = rockLocationY[Math.floor(Math.random() * 10) % 3];
        rock.rotateY(randomRotation[Math.floor(Math.random() * 10) % 4]);
        rock.position.set(rockLocationX[i], randomLocationY, -48 + j * 2);
        rock.castShadow = true;
        scene.add(rock);
    }
}

const hillCount = 2;
const hillLocationX = [10, 40];
const hillGeo = new THREE.ConeGeometry(25, 70, 15);
const hillMap = new THREE.TextureLoader().load("./assets/texture/hill.jpg");
const hillMaterial = new THREE.MeshStandardMaterial({map: hillMap});
for (let i = 0; i < hillCount; i++) {
    let hill = new THREE.Mesh(hillGeo, hillMaterial);
    hill.position.set(hillLocationX[i], 46, -75);
    hill.castShadow = true;
    scene.add(hill);
}

const skyBoxGeo = new THREE.BoxGeometry(800, 800, 800);
const skyBoxFrontMap = new THREE.TextureLoader().load("./assets/skybox/front.png");
const skyBoxBackMap = new THREE.TextureLoader().load("./assets/skybox/back.png");
const skyBoxUpMap = new THREE.TextureLoader().load("./assets/skybox/up.png");
const skyBoxDownMap = new THREE.TextureLoader().load("./assets/skybox/down.png");
const skyBoxLeftMap = new THREE.TextureLoader().load("./assets/skybox/left.png");
const skyBoxRightMap = new THREE.TextureLoader().load("./assets/skybox/right.png");
const skyBoxMaterial = [
    new THREE.MeshBasicMaterial({map: skyBoxFrontMap, side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: skyBoxBackMap, side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: skyBoxUpMap, side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: skyBoxDownMap, side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: skyBoxLeftMap, side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: skyBoxRightMap, side: THREE.DoubleSide}),
];
const skyBox = new THREE.Mesh(skyBoxGeo, skyBoxMaterial);
skyBox.position.set(0, -100, 0);
scene.add(skyBox);

// Font Loader
fontLoader.load("./three.js/examples/fonts/gentilis_bold.typeface.json", (font) => {
    const textGeo = new TextGeometry("Welcome to Panda Forest!", {
        font: font,
        size: 14,
        height: 2,
    });
    const textMaterial = new THREE.MeshStandardMaterial({color: 0x008000});
    const text = new THREE.Mesh(textGeo, textMaterial);
    text.name = "welcomeText";
    text.position.set(-100, 100, -80);
    text.receiveShadow = true;
    scene.add(text);
});
  
// GLTF Loader
let panda1, panda2;
model3DLoader.load("./assets/model/panda/scene.gltf", (model) => {
    panda1 = model.scene;
    panda1.scale.set(5, 5, 5);
    panda1.position.set(-8, 11, 20);
    panda1.traverse((child) => {
        child.castShadow = true;
    });
    panda1.rotateY(Math.PI / 2);
    scene.add(panda1);
});
  
model3DLoader.load("./assets/model/panda/scene.gltf", (model) => {
    panda2 = model.scene;
    panda2.scale.set(5, 5, 5);
    panda2.position.set(-8, 11, 0);
    panda2.traverse((child) => {
        child.castShadow = true;
    });
    panda2.rotateY(Math.PI / 4);
    scene.add(panda2);
});

// RayCaster
const rayCaster = new THREE.Raycaster();
const mousePointer = new THREE.Vector2();
let isClicked = false;

// Kalau klik kiri di tulisan "Welcome to Panda Forest!" maka warnanya akan berubah
window.addEventListener("pointerdown", (e) => {
    mousePointer.x = (e.clientX / windowWidth) * 2 - 1;
    mousePointer.y = - (e.clientY / windowHeight) * 2 + 1;

    rayCaster.setFromCamera(mousePointer, currentCamera);

    const intersects = rayCaster.intersectObjects(scene.children);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.name === "welcomeText"){
            if(!isClicked) {
                intersects[i].object.material.color.set(0xffff00);
                isClicked = true;
            } else{
                intersects[i].object.material.color.set(0x008000);
                isClicked = false;
            }
        }
    }
});

// Render Function
let t = 0;
function renderFunction() {
    t += 0.005;

    const xMove = 70 * Math.cos(t);
    const zMove = 70 * Math.sin(t);

    sun.rotateY(0.01);
    sun.position.x = xMove;
    sun.position.z = zMove;

    sunRing.rotateY(-0.01);
    sunRing.rotateZ(-0.01);
    sunRing.position.x = xMove;
    sunRing.position.z = zMove;

    movingLight.position.x = xMove;
    movingLight.position.z = zMove;

    const newXCam = 250 * Math.cos(t);
    const newZCam = 250 * Math.sin(t);

    if(currentCamera == movingCamera){
        currentCamera.lookAt(0, 0, 0);
        currentCamera.position.setX(newXCam);
        currentCamera.position.setZ(newZCam);
    }

    requestAnimationFrame(renderFunction);
    renderer.render(scene, currentCamera);
}

renderFunction();