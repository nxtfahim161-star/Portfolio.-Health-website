// Three.js 3D DNA Model synced with Scroll Position
let scene, camera, renderer, dnaGroup, particles;
let scrollY = 0;

function init3D() {
  const container = document.getElementById('canvas-container');
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  dnaGroup = new THREE.Group();

  const strandLength = 30;
  const sphereGeo = new THREE.SphereGeometry(0.28, 16, 16);
  const redMat = new THREE.MeshPhongMaterial({ color: 0xD92534, shininess: 80 });
  const pinkMat = new THREE.MeshPhongMaterial({ color: 0xFDE8E9, shininess: 40 });
  const lineMat = new THREE.LineBasicMaterial({ color: 0xD92534, transparent: true, opacity: 0.3 });

  for (let i = 0; i < strandLength; i++) {
    const t = i * 0.35;
    const x1 = Math.sin(t) * 2.2;
    const y1 = (i - strandLength / 2) * 0.6;
    const z1 = Math.cos(t) * 2.2;

    const x2 = Math.sin(t + Math.PI) * 2.2;
    const y2 = y1;
    const z2 = Math.cos(t + Math.PI) * 2.2;

    const s1 = new THREE.Mesh(sphereGeo, redMat);
    s1.position.set(x1, y1, z1);
    
    const s2 = new THREE.Mesh(sphereGeo, pinkMat);
    s2.position.set(x2, y2, z2);

    dnaGroup.add(s1);
    dnaGroup.add(s2);

    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x1, y1, z1),
      new THREE.Vector3(x2, y2, z2)
    ]);
    const line = new THREE.Line(geometry, lineMat);
    dnaGroup.add(line);
  }

  // Initial Right Side Placement
  dnaGroup.position.set(7.5, 0, -2);
  dnaGroup.rotation.z = Math.PI / 6;
  scene.add(dnaGroup);

  // Track window scroll to move DNA down organically with page scroll
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  function animate() {
    requestAnimationFrame(animate);

    // Continuous rotation + Scroll linkage (moves down as user scrolls)
    dnaGroup.rotation.y += 0.005;
    
    const targetY = 0 - (scrollY * 0.0035);
    dnaGroup.position.y += (targetY - dnaGroup.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerWidth < 992) {
      dnaGroup.position.set(0, -3, -6);
    } else {
      dnaGroup.position.set(7.5, 0, -2);
    }
  });

  if (window.innerWidth < 992) {
    dnaGroup.position.set(0, -3, -6);
  }
}

document.addEventListener('DOMContentLoaded', init3D);
      
