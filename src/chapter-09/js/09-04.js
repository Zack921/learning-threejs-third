function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  var clock = new THREE.Clock();

  initDefaultLighting(scene);  
  // 引入摄像机控件 TrackballControls
  var trackballControls = new THREE.TrackballControls(camera);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.0;
  trackballControls.panSpeed = 1.0;

  var loader = new THREE.OBJLoader();
  loader.load("../../assets/models/city/city.obj", function (object) {

    var scale = chroma.scale(['red', 'green', 'blue']);
    setRandomColors(object, scale);
    mesh = object;
    scene.add(mesh);
  });

  render();
  function render() {
    stats.update();
    // clock.getDelta() 可以计算出此次调用距离上次调用的时间间隔
    trackballControls.update(clock.getDelta());
    requestAnimationFrame(render);
    renderer.render(scene, camera)
  }   
}
