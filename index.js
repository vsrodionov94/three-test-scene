function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  let mouseX = 0;
  let mouseY = 0;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  document.addEventListener( 'mousemove', onDocumentMouseMove );
  
  function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;
  }

  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();

  {
    const near = 1.2;
    const far = 2.5;
    const color = 'black';
    scene.fog = new THREE.Fog(color, near, far);
    scene.background = new THREE.Color(color);
  }
  let light;
  {
    const color = 0x816EB5;
    const intensity = 1;
    light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 0, 10);
    scene.add(light);
  }

  const sphereRadius = 15;
  const sphereWidthSegments = 32;
  const sphereHeightSegments = 16;
  const bigGeometry = new THREE.SphereGeometry(sphereRadius * 2.2, sphereWidthSegments * 2.2, sphereHeightSegments * 2.2);
  const geometry = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);

  function makeInstance(geometry, color, x, y = 0) {
    const material = new THREE.MeshPhongMaterial({color});

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    sphere.position.x = x;
    sphere.position.y = y;
    sphere.scale.x = 0.03;
    sphere.scale.y = 0.03;
    sphere.scale.z = 0.03;
    return sphere;
  }

  const spheres = [
    makeInstance(geometry, 0x816EB5,  0.5),
    makeInstance(bigGeometry, 0x816EB5, -1, -0.5),
    makeInstance(geometry, 0x816EB5,  0.1, 0.8),
  ];

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function folowCamera() {
    const maxCameraX = 0.7;
    const maxCameraY = 0.7;
    const dX = ( mouseX - camera.position.x ) * .005;
    const dY = ( - mouseY - camera.position.y ) * .005;
    if (camera.position.x + dX > -maxCameraX && camera.position.x + dX < maxCameraX) {
      camera.position.x += dX;
    }
    if (camera.position.x + dY > -maxCameraY && camera.position.x + dY < maxCameraY) {
      camera.position.y += dY;
    }

    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
  }

  function render(time) {
    time *= 0.001;

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    folowCamera();
    camera.lookAt( scene.position );

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
