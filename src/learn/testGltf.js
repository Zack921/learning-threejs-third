function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  let mixer = null;
  scene.add(new THREE.AmbientLight(0x333333));

  var axes = new THREE.AxesHelper(20);
  scene.add(axes);
  
  camera.position.set(10, 10, 20);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  
  initDefaultLighting(scene);
  var loader = new THREE.GLTFLoader();
  // GLTFLoader 会加载整个场景
  loader.load('human.gltf', function (result) {
    console.log('result: ', result);

    scene.add(result.scene);
    console.log('scene: ', scene);

    mixer = new THREE.AnimationMixer( result.scene );
    animationClip = result.animations[0];
    clipAction = mixer.clipAction( animationClip ).play();    
    animationClip = clipAction.getClip();

  });

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction) {
      mixer.update( delta );
    }
  }   
}