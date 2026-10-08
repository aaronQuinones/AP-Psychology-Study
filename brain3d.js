
import * as THREE from "https://esm.sh/three@0.170.0";
import { OrbitControls } from "https://esm.sh/three@0.170.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://esm.sh/three@0.170.0/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://esm.sh/three@0.170.0/examples/jsm/loaders/DRACOLoader.js";

const container = document.getElementById("brain-3d-viewer");

if (!container) {
  throw new Error("The brain-3d-viewer element was not found.");
}

container.style.width = "100%";
container.style.height = "520px";
container.style.minHeight = "350px";
container.style.position = "relative";
container.style.overflow = "hidden";
container.style.borderRadius = "14px";
container.style.background = "#101522";

const status = document.createElement("div");
status.textContent = "Loading 3D brain... This may take a while.";
status.style.cssText =
  "position:absolute;top:12px;left:12px;z-index:2;" +
  "color:white;background:#202a3acc;padding:10px 14px;" +
  "border-radius:8px;font:14px sans-serif;";
container.appendChild(status);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#101522");

const camera = new THREE.PerspectiveCamera(
  45,
  container.clientWidth / container.clientHeight,
  0.01,
  100000
);

camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffff, 0x384052, 2));

const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(4, 6, 8);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.target.set(0, 0, 0);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(
  "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
);

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

loader.load(
  "./models/brain.glb",
  (gltf) => {
    
const brain = gltf.scene;

// Colors for identifiable brain regions
const regionColors = [
  { terms: ["frontal"], color: 0xF06C6C },
  { terms: ["parietal"], color: 0xF2C14E },
  { terms: ["temporal"], color: 0x55B878 },
  { terms: ["occipital"], color: 0x6699F5 },
  { terms: ["cerebell"], color: 0xB18AE8 },
  { terms: ["brainstem", "brain stem"], color: 0xE99A65 },
  { terms: ["thalamus"], color: 0x49C5C9 },
  { terms: ["hypothalamus"], color: 0xE982BD }
];

brain.traverse((object) => {
  if (!object.isMesh) return;

  const name = object.name.toLowerCase().replace(/_/g, " ");

  // Avoid recoloring blood vessels and grooves.
  if (/artery|arteries|vein|sinus|sulcus/.test(name)) return;

  const region = regionColors.find((item) =>
    item.terms.some((term) => name.includes(term))
  );

  if (!region || !object.material) return;

  const materials = Array.isArray(object.material)
    ? object.material
    : [object.material];

  const coloredMaterials = materials.map((material) => {
    const copy = material.clone();
    if (copy.color) copy.color.setHex(region.color);
    return copy;
  });

  object.material = Array.isArray(object.material)
    ? coloredMaterials
    : coloredMaterials[0];
});
let coloredCount = 0;

brain.traverse((object) => {
  if (object.isMesh) {
    const name = object.name.toLowerCase().replace(/_/g, " ");

    if (
      ["frontal", "parietal", "temporal", "occipital",
       "cerebell", "brainstem", "brain stem",
       "thalamus", "hypothalamus"].some(term => name.includes(term)) &&
      !/artery|arteries|vein|sinus|sulcus/.test(name)
    ) {
      coloredCount++;
    }
  }
});

console.log("Matching brain meshes:", coloredCount);
scene.add(brain);

    // Center the model and fit the camera to its size.
    const bounds = new THREE.Box3().setFromObject(brain);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());

    brain.position.sub(center);

    const maxDimension = Math.max(size.x, size.y, size.z);

    if (maxDimension > 0) {
      const distance =
        (maxDimension / (2 * Math.tan(THREE.MathUtils.degToRad(22.5)))) *
        1.5;

      camera.position.set(
        distance * 0.7,
        distance * 0.45,
        distance
      );

      camera.near = Math.max(maxDimension / 1000, 0.001);
      camera.far = maxDimension * 100;
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.minDistance = maxDimension * 0.5;
      controls.maxDistance = maxDimension * 10;
    }

    // Report the model's structure names for our next step.
    let meshCount = 0;
    const structureNames = [];

    brain.traverse((object) => {
      if (object.isMesh) {
        meshCount++;
        structureNames.push({
          name: object.name,
          ...object.userData
        });
      }
    });

    console.log("Brain model loaded.");
    console.log("Mesh count:", meshCount);
    console.log("Anatomical structures:", structureNames);
    const searchTerms = [
  "frontal lobe",
  "parietal lobe",
  "temporal lobe",
  "occipital lobe",
  "cerebellum",
  "brainstem",
  "brain stem",
  "thalamus",
  "hypothalamus"
];

const matches = structureNames.filter((item) => {
  const text = JSON.stringify(item).toLowerCase();
  return searchTerms.some((term) => text.includes(term));
});

console.log("Possible brain-region matches:", matches);

    status.textContent = "3D brain loaded! Drag to rotate; scroll to zoom.";
    setTimeout(() => status.remove(), 5000);
  },
  (progress) => {
    if (progress.total > 0) {
      const percent = Math.round(
        (progress.loaded / progress.total) * 100
      );
      status.textContent = `Loading 3D brain... ${percent}%`;
    }
  },
  (error) => {
    console.error("Could not load the brain model:", error);
    status.textContent =
      "Could not load the brain. Check the model path and browser console.";
  }
);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const width = container.clientWidth;
  const height = container.clientHeight;

  if (!width || !height) return;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
