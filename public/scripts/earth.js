import * as THREE from '/scripts/three.module.js';
import { OrbitControls } from '/scripts/OrbitControls.js';

const container = document.getElementById('earth-container');
if (container) {
  async function loadShader(url) {
    const response = await fetch(url);
    return await response.text();
  }
  
  // Cargar shaders con extensiones .vs y .fs
  const vertexShader = await loadShader('/shaders/vertex.vs');
  const fragmentShader = await loadShader('/shaders/fragment.fs');
  // Configuración básica
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Fondo transparente
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild(renderer.domElement);

  // Cargar la textura
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('/earth.jpg');  // Ruta de la textura en el directorio public

  // Crear una esfera para el mundo con la textura
  const geometry = new THREE.SphereGeometry(3.6, 32, 32);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new THREE.Color(0x6d28d9) },//1FACAC
      bias: { value: 0.1 },
      power: { value: 2.0 },
      time: { value: 0.0 },
      scale: { value: 1.0 },
      map: { value: texture },
    },
  });
/*
  const wireframeGeometry = new THREE.SphereGeometry(3.62, 32, 32); // Un poco más grande que la principal
  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x1FACAC,
    wireframe: true, // Habilitar modo wireframe
    transparent: true, // Hacerla transparente
    opacity: 0.3, // Ajustar opacidad (50%)
  });
  const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
  scene.add(wireframeSphere);
**/
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  // Luz ambiental y direccional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5).normalize();
  scene.add(directionalLight);

  camera.position.z = 6;

  // Controles de rotación con el mouse
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.8;
  controls.enableZoom = false;

  // Animación de rotación automática
  const animate = () => {
    requestAnimationFrame(animate);

    // Rotación automática si no se está interactuando
    if (!controls.isDragging) {
      sphere.rotation.y -= 0.002;
    //  wireframeSphere.rotation.y += 0.002;
    }

    controls.update();
    renderer.render(scene, camera);
  };

  animate();

  // Ajustar el canvas al redimensionar
  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
  });
}
