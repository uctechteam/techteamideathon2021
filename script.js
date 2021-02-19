class Plane {
 constructor() {
   this.uniforms = {};
   this.texture = null;
   this.mesh = null;
 }
 loadTexture(image, callback) {
   const loader = new THREE.TextureLoader();
   loader.load(image, texture => {
     texture.magFilter = THREE.NearestFilter;
     texture.minFilter = THREE.NearestFilter;
     texture.wrapS = THREE.RepeatWrapping;
     texture.wrapT = THREE.RepeatWrapping;
     this.texture = texture;
     this.mesh = this.createMesh();
     callback();
   });
 }
 createMesh() {
   this.uniforms = {
     resolution: {
       type: 'v2',
       value: new THREE.Vector2(document.body.clientWidth, document.body.clientHeight) },

     imageResolution: {
       type: 'v2',
       value: new THREE.Vector2(2048, 1356) },

     texture: {
       type: 't',
       value: this.texture },

     time: {
       type: 'f',
       value: 0 }
   };

   return new THREE.Mesh(
   new THREE.PlaneBufferGeometry(2, 2),
   new THREE.RawShaderMaterial({
     uniforms: this.uniforms,
     vertexShader: document.getElementById('vertexShader').textContent,
     fragmentShader: document.getElementById('fragmentShader').textContent }));
 }
 resize() {
   this.uniforms.resolution.value.set(document.body.clientWidth, document.body.clientHeight);
 }}

var container, stats;
var camera, scene, plane,renderer, clock;
var uniform;

init();
animate();
function init(){
 container = document.getElementById('container');
 renderer = new THREE.WebGLRenderer({
   antialias: true,
   canvas: container,
   alpha: true
 });

 scene = new THREE.Scene();
 clock = new THREE.Clock();
 camera = new THREE.PerspectiveCamera(45, document.body.clientWidth / document.body.clientHeight, 1, 100);

 renderer.setSize(document.body.clientWidth, document.body.clientHeight);
 renderer.setClearColor(0xffffff, 0.0);

 plane = new Plane();
 plane.loadTexture('https://dl.dropbox.com/s/he8eogjzn4oe0xj/04.jpg?dl=0', () => {
   scene.add(plane.mesh);
   window.addEventListener( 'resize', function(){
     onWindowResize(plane);
   }, false );
   onWindowResize(plane);
 });
}

function onWindowResize(plane) {
 container.width = document.body.clientWidth;
 container.height = document.body.clientHeight;
 camera.aspect = document.body.clientWidth / document.body.clientHeight;
 camera.updateProjectionMatrix();
 plane.mesh.material.uniforms.resolution.value.set(document.body.clientWidth, document.body.clientHeight);
 renderer.setSize(document.body.clientWidth, document.body.clientHeight);
}

function animate() {
 requestAnimationFrame( animate );
 render();
}
function render(){
 var delta = clock.getDelta();
 plane.uniforms.time.value += delta;
 renderer.render(scene, camera);
}
