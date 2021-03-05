function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);
  
  camera.position.set(10, 10, 20);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  
  initDefaultLighting(scene);
  var loader = new THREE.GLTFLoader();
  // GLTFLoader 会加载整个场景
  loader.load('mouse.gltf', function (result) {
    console.log('result: ', result);
    // result.scene.children[2].position.set(2, 0, 0);
    // result.scene.children[2].scale.set(50,50,50);
    scene.add(result.scene.children[0]);
    console.log('scene: ', scene);

  });

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    // const torus = scene.getObjectByName( "Torus" );
    // if(torus) torus.rotation.y += 0.01;
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}