var camera, scene, renderer;
var materials = new Array();
var meshs = new Array();
var imgs = ["img/sun.jpg", "img/banner1.jpg", "img/banner2.jpg", "img/banner3.jpg"];
var child = 0;
var uniforms;
var isUserInteracting = false,
	onMouseDownMouseX = 0,
	onMouseDownMouseY = 0,
	lon = 0,
	onMouseDownLon = 0,
	lat = 0,
	onMouseDownLat = 0,
	phi = 0,
	theta = 0;

init();
animate();
var list = document.getElementById('myList');
var listChild = document.getElementsByTagName('li');
for(var i = 0; i < listChild.length; i++) {
	listChild[i].addEventListener('click', function() {
		var url = this.children[0].currentSrc;
		if(child != i) {
			console.log("点击修改");
			var meshs1 = meshs[i];
			console.log(meshs1);
			var meshs2 = meshs[child];
			meshs2.position.set(5, 6, 7);
			child = i;
		} else {

		}

	}, false);
}

function init() {

	var container;

	container = document.getElementById('container');
	//新建一个相机
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	camera.target = new THREE.Vector3(0, 0, 0);
	//创建一个WebGL渲染器
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	container.appendChild(renderer.domElement);
	//新建一个场景
	scene = new THREE.Scene();

	for(var i = 0, len = imgs.length; i < len; i++) {

		setMeshChild(imgs[i]);
	}
	document.addEventListener('drop', function(event) {

		event.preventDefault();

		var reader = new FileReader();
		reader.addEventListener('load', function(event) {
			var material = materials[child];
			material.map.image.src = event.target.result;
			material.map.needsUpdate = true;

		}, false);
		reader.readAsDataURL(event.dataTransfer.files[0]);

		document.body.style.opacity = 1;

	}, false);
	document.addEventListener('mousedown', onPointerStart, false);
	document.addEventListener('mousemove', onPointerMove, false);
	document.addEventListener('mouseup', onPointerUp, false);

	document.addEventListener('wheel', onDocumentMouseWheel, false);

	document.addEventListener('touchstart', onPointerStart, false);
	document.addEventListener('touchmove', onPointerMove, false);
	document.addEventListener('touchend', onPointerUp, false);

	//

	document.addEventListener('dragover', function(event) {

		event.preventDefault();
		event.dataTransfer.dropEffect = 'copy';

	}, false);

	document.addEventListener('dragenter', function() {

		document.body.style.opacity = 0.5;

	}, false);

	document.addEventListener('dragleave', function() {

		document.body.style.opacity = 1;

	}, false);

	//

	window.addEventListener('resize', onWindowResize, false);

}

function setMeshChild(url) {
	var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
	// invert the geometry on the x-axis so that all of the faces point inward
	geometry.scale(-1, 1, 1);
//	var texture = new THREE.TextureLoader().load(url);
//	//材料
//	var material = new THREE.MeshBasicMaterial({
//		map: texture
//
//	});
	var textureLoader = new THREE.TextureLoader();
	uniforms = {
		time: {
			value: 1.0
		},
		texture3: {
			value: textureLoader.load(imgs[0])
		},
		texture4: {
			value: textureLoader.load(imgs[1])
		}
	};
	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent
	});
	//materials.push(material);
	//网格
	var mesh = new THREE.Mesh(geometry, material);
//	meshs.push(mesh);
	scene.add(mesh);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function onPointerStart(event) {

	isUserInteracting = true;

	var clientX = event.clientX || event.touches[0].clientX;
	var clientY = event.clientY || event.touches[0].clientY;

	onMouseDownMouseX = clientX;
	onMouseDownMouseY = clientY;

	onMouseDownLon = lon;
	onMouseDownLat = lat;

}

function onPointerMove(event) {

	if(isUserInteracting === true) {

		var clientX = event.clientX || event.touches[0].clientX;
		var clientY = event.clientY || event.touches[0].clientY;

		lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
		lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;

	}

}

function onPointerUp() {

	isUserInteracting = false;

}

function onDocumentMouseWheel(event) {

	var fov = camera.fov + event.deltaY * 0.05;

	camera.fov = THREE.Math.clamp(fov, 10, 75);

	camera.updateProjectionMatrix();

}

function animate() {

	requestAnimationFrame(animate);
	update();

}

function update() {

	if(isUserInteracting === false) {

		lon += 0.1;

	}

	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.Math.degToRad(90 - lat);
	theta = THREE.Math.degToRad(lon);

	camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
	camera.target.y = 500 * Math.cos(phi);
	camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

	camera.lookAt(camera.target);
	//将场景渲染到摄像机
	renderer.render(scene, camera);

}