import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputcolorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Add Ground
const groundGeo = new THREE.PlaneGeometry(5, 5, 1, 1);
groundGeo.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
scene.add(groundMesh);

// Add Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

// Add Banana
const loader = new GLTFLoader();
loader.setPath("/banaani/");
loader.load("banaani.gltf", (gltf) => {
	const banana = gltf.scene;
	//banana.scale.set(0.5, 0.5, 0.5);
	banana.position.set(0, 0, 0);
	scene.add(banana);
	scene.remove(groundMesh);
});

// Add Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.update();

// Handle window resize
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
}, false);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}

animate();
