// Three.js 3D Interactive DNA & Particle Scene Engine
let scene, camera, renderer, dnaGroup, particles;

function init3D() {
  const container = document.getElementById('canvas-container');
  
  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Renderer
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Group
  dnaGroup = new THREE.Group();

  // Build DNA Strand
  const strandLength = 40;
  const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const redMat = new THREE.MeshPhongMaterial({ color: 0xD92534, shininess: 80 });
  const pinkMat = new THREE.MeshPhongMaterial({ color: 0xFDE8E9, shininess: 40 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0xD92534, transparent: true, opacity: 0.4 });

  for (let i = 0; i < strandLength; i++) {
    const t = i * 0.3;
    const x1 = Math.sin(t) * 3;
    const y1 = (i - strandLength / 2) * 0.7;
    const z1 = Math.cos(t) * 3;

    const x2 = Math.sin(t + Math.PI) * 3;
    const y2 = y1;
    const z2 = Math.cos(t + Math.PI) * 3;

    // Spheres Strand A & B
    const s1 = new THREE.Mesh(sphereGeo, redMat);
    s1.position.set(x1, y1, z1);
    
    const s2 = new THREE.Mesh(sphereGeo, pinkMat);
    s2.position.set(x2, y2, z2);

    dnaGroup.add(s1);
    dnaGroup.add(s2);

    // Connector Line
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2)
    ]);
    const line = new THREE.Line(geometry, lineMat);
    dnaGroup.add(line);
  }

  // Positioning DNA to right side (Match Locus Hero visual reference)
  dnaGroup.position.set(10, 0, -5);
  dnaGroup.rotation.z = Math.PI / 6;
  scene.add(dnaGroup);

  // Floating Micro-Cell Particles
  const particleCount = 150;
  const pGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 60;
    positions[i + 1] = (Math.random() - 0.5) * 60;
    positions[i + 2] = (Math.random() - 0.5) * 40;
  }

  pGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMaterial = new THREE.PointsMaterial({
    color: 0xD92534,
    size: 0.25,
    transparent: true,
    opacity: 0.6
  });

  particles = new THREE.Points(pGeometry, pMaterial);
  scene.add(particles);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // Mouse Parallax
  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    dnaGroup.rotation.y += 0.008;
    particles.rotation.y += 0.001;

    // Smooth Mouse Reaction
    dnaGroup.rotation.x += (mouseY * 0.1 - dnaGroup.rotation.x) * 0.05;
    dnaGroup.rotation.z += (mouseX * 0.1 - dnaGroup.rotation.z) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // Resize Handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Responsive position check
    if (window.innerWidth < 992) {
      dnaGroup.position.set(0, -5, -10);
    } else {
      dnaGroup.position.set(10, 0, -5);
    }
  });

  if (window.innerWidth < 992) {
    dnaGroup.position.set(0, -5, -10);
  }
}

document.addEventListener('DOMContentLoaded', init3D);
