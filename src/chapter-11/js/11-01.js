function init() {

  // use the defaults
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera(new THREE.Vector3(0, 20, 40));
  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();

  // create a scene and add a light
  var scene = new THREE.Scene();
  var earthAndLight = addEarth(scene);
  var earth = earthAndLight.earth;
  var pivot = earthAndLight.pivot;

  // setup effects
  var renderPass = new THREE.RenderPass(scene, camera); // 渲染通道，需要添加，不然就无法渲染，这个通道会渲染场景，但是渲染结果不会输出到屏幕上
  var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false); // 电视屏幕效果
  effectFilm.renderToScreen = true; // 将结果输出到屏幕上

  // 效果组合器，可以添加后期处理通道
  // 所有后期效果都是在已经渲染完成一帧场景画面之后添加的
  var composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(effectFilm);

  // setup controls
  var gui = new dat.GUI();
  var controls = {};
  addFilmPassControls(gui, controls, effectFilm);
  
  // do the basic rendering
  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    earth.rotation.y += 0.001;
    pivot.rotation.y += -0.0003;

    // request next and render using composer
    requestAnimationFrame(render);
    composer.render(delta);
  }
}
