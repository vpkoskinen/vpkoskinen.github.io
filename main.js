import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputcolorSpace = THREE.SRGBColorSpace;

renderer.setSize(window.innerWidth*0.9, window.innerHeight*0.9);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(-10, 5, 0);
camera.lookAt(0, 0, 0);

// Add Ground
const groundGeo = new THREE.PlaneGeometry(5, 5, 1, 1);
groundGeo.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeo, groundMaterial);
scene.add(groundMesh);

// Add Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const lightvalues = [[new THREE.Vector3(10.269,10.269,10.269), 0xE3E6FF, 300.0, true],
					[new THREE.Vector3(-14.3872,6.14344,10.104), 0xFFF9DD, 150.0, false],
					[new THREE.Vector3(-0.573415,10.4088,-15.4321), 0xE3E6FF, 50.0, false]
				];
//const lightvalues = [[new THREE.Vector3(10.269,10.269,10.269), 0xE3E6FF]];

for (const [lposition, lcolor, lintensity, lcastshadowbool] of lightvalues) {
	const spotlight = new THREE.SpotLight(lcolor, lintensity, 0.0, Math.PI / 10.0);
	spotlight.position.copy(lposition);
	if (lcastshadowbool == true) {
		spotlight.castShadow = true;
	}
	spotlight.shadow.camera.near = 0.1;
	spotlight.shadow.camera.far = 25.0;
	scene.add(spotlight);
	// helpers
	//scene.add( new THREE.CameraHelper( spotlight.shadow.camera ) );
}


// Add Banana
const loader = new GLTFLoader();
loader.setPath("/banaani/");
loader.load("banaani.gltf", (gltf) => {
	const banana = gltf.scene;
	gltf.scene.traverse(function (node) {

                    if (node.isMesh || node.isLight) node.castShadow = true;

                    if (node.isMesh || node.isLight) node.receiveShadow = true;

                });
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
