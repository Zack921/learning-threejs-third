function init() {

  // setup the scene for rendering
  var camera = initCamera(new THREE.Vector3(50, 50, 50));
  var loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 15, 0));

  var loader = new THREE.JSONLoader();
  // 直接加载json文件,注意-blender2.8版本开始，不再支持导出成json格式了，引入了gltf
  loader.load('../../assets/models/house/house.json', function (geometry, mat) {
    console.log('geometry: ', geometry);

    var mesh = new THREE.Mesh(geometry, mat[0]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // call the default render loop.
    loaderScene.render(mesh, camera);
  });
}