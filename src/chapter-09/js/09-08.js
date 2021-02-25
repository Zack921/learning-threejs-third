// 变形动画：通过关键帧的方式实现
// 缺点：关键帧上的顶点位置重复存储，导致模型文件很大
function init() {
  var stats = initStats();
  var renderer = initRenderer();
  var camera = initCamera();
  var scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x333333));
  
  camera.position.set(0, 15, 70);

  var trackballControls = initTrackballControls(camera, renderer);
  var clock = new THREE.Clock();
  // AnimationMixer控制一个或多个动画模型
  var mixer = new THREE.AnimationMixer();
  var clipAction
  var frameMesh
  var mesh
  
  initDefaultLighting(scene);
  var loader = new THREE.JSONLoader();
  loader.load('../../assets/models/horse/horse.js', function (geometry, mat) {
      console.log('geometry: ', geometry);
      geometry.computeVertexNormals();
      geometry.computeMorphNormals();

      var mat = new THREE.MeshLambertMaterial({morphTargets: true, vertexColors: THREE.FaceColors});
      mesh = new THREE.Mesh(geometry, mat);
      mesh.scale.set(0.15,0.15,0.15);
      mesh.translateY(-10);
      mesh.translateX(10);

      mixer = new THREE.AnimationMixer( mesh );
      // or create a custom clip from the set of morphtargets
      // var clip = THREE.AnimationClip.CreateFromMorphTargetSequence( 'gallop', geometry.morphTargets, 30 );
      // 将animationClip添加到mixer中管理，animationClip指定具体的动画动作
      animationClip = geometry.animations[0] 
      clipAction = mixer.clipAction( animationClip ).play();    
      console.log('clipAction: ', clipAction);
      
      clipAction.setLoop(THREE.LoopRepeat);
      scene.add(mesh)

      // enable the controls
      enableControls()
  })

  var controls = {
    keyframe: 0,
    time: 0,
    timeScale: 1,
    repetitions: Infinity,
    stopAllAction: function() {mixer.stopAllAction()},

    // warp
    warpStartTimeScale: 1,
    warpEndTimeScale: 1,
    warpDurationInSeconds: 2,
    warp: function() {clipAction.warp(controls.warpStartTimeScale, controls.warpEndTimeScale, controls.warpDurationInSeconds)},
    fadeDurationInSeconds: 2,
    fadeIn: function() {clipAction.fadeIn(controls.fadeDurationInSeconds)},
    fadeOut: function() {clipAction.fadeOut(controls.fadeDurationInSeconds)},
    effectiveWeight: 0,
    effectiveTimeScale: 0
  }
  // control which keyframe to show
  function enableControls() {
    var gui = new dat.GUI();
    var mixerFolder = gui.addFolder("AnimationMixer")
    mixerFolder.add(controls, "time").listen()
    mixerFolder.add(controls, "timeScale", 0, 5).onChange(function (timeScale) {mixer.timeScale = timeScale});
    mixerFolder.add(controls, "stopAllAction").listen()
    var actionFolder = gui.addFolder("AnimationAction")
    actionFolder.add(clipAction, "clampWhenFinished").listen();
    actionFolder.add(clipAction, "enabled").listen();
    actionFolder.add(clipAction, "paused").listen();
    actionFolder.add(clipAction, "loop", { LoopRepeat: THREE.LoopRepeat, LoopOnce: THREE.LoopOnce, LoopPingPong: THREE.LoopPingPong }).onChange(function(e) {
      if (e == THREE.LoopOnce || e == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(e), undefined);
        console.log(clipAction)
      } else {
        clipAction.setLoop(parseInt(e), controls.repetitions);
      }
    });
    actionFolder.add(controls, "repetitions", 0, 100).listen().onChange(function(e) {
      if (clipAction.loop == THREE.LoopOnce || clipAction.loop == THREE.LoopPingPong) {
        clipAction.reset();
        clipAction.repetitions = undefined
        clipAction.setLoop(parseInt(clipAction.loop), undefined);
      } else {
        clipAction.setLoop(parseInt(e), controls.repetitions);
      }
    });
    actionFolder.add(clipAction, "time", 0, animationClip.duration, 0.001).listen()
    actionFolder.add(clipAction, "timeScale", 0, 5, 0.1).listen()
    actionFolder.add(clipAction, "weight", 0, 1, 0.01).listen()
    actionFolder.add(controls, "effectiveWeight", 0, 1, 0.01).listen()
    actionFolder.add(controls, "effectiveTimeScale", 0, 5, 0.01).listen()
    actionFolder.add(clipAction, "zeroSlopeAtEnd").listen()
    actionFolder.add(clipAction, "zeroSlopeAtStart").listen()
    actionFolder.add(clipAction, "stop")
    actionFolder.add(clipAction, "play")
    actionFolder.add(clipAction, "reset")
    actionFolder.add(controls, "warpStartTimeScale", 0, 10, 0.01)
    actionFolder.add(controls, "warpEndTimeScale", 0, 10, 0.01)
    actionFolder.add(controls, "warpDurationInSeconds", 0, 10, 0.01)
    actionFolder.add(controls, "warp")
    actionFolder.add(controls, "fadeDurationInSeconds", 0, 10, 0.01)
    actionFolder.add(controls, "fadeIn")
    actionFolder.add(controls, "fadeOut")
    
    gui.add(controls, "keyframe", 0, 15).step(1).onChange(function (frame) { showFrame(frame);});
  }

  function showFrame(frame) {
    if (mesh) {
      scene.remove(frameMesh);
      var newVertices = mesh.geometry.morphTargets[frame].vertices
      frameMesh = mesh.clone();
      frameMesh.geometry.vertices = newVertices;
      frameMesh.translateX(-30);
      frameMesh.translateZ(-10);
      scene.add(frameMesh)
    }
  }

  render();
  function render() {
    stats.update();
    var delta = clock.getDelta();
    trackballControls.update(delta);
    requestAnimationFrame(render);
    renderer.render(scene, camera)

    if (mixer && clipAction) {
      // 混合器根据 时间差 控制向下一个关键帧移动多远
      mixer.update( delta );
      controls.time = mixer.time;
      controls.effectiveTimeScale = clipAction.getEffectiveTimeScale();
      controls.effectiveWeight = clipAction.getEffectiveWeight();
    }
  }   
}