 var width= window.innerWidth;
 var height= window.innerHeight;
 var RADIUS = 0.5;
 
 var dots = [];
 dots.push(new Dots(37,121));

window.onload = function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	// Earth params
	var radius   = RADIUS,
		segments = 128,
		rotation = 0;  

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width/ height, 0.1, 1000);

    //fov:distace from the screen ，camera frustum vertical field of view
    //aspect: camera frustum aspect ratio(display varies with different screens)
    //near:near plane  far:far plane
    
	camera.position.z = 1.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

    scene.add(new THREE.AmbientLight(0xffffff,0.001));

    
       var axisHelper = new THREE.AxisHelper( 5 );
       scene.add( axisHelper );
    
       var spherePoint = createPoints();
       spherePoint.rotation.y = rotation; 
	   scene.add(sphere);
    
       light = new THREE.PointLight( 0xf087a2, 2, 50 );
       light.add( spherePoint );
    
       light.position.set( dots[0].x,dots[0].y,dots[0].z);
 
     
      scene.add( light );
  

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = 0.001; 
	scene.add(sphere);

    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds);

	var stars = createStars(90, 64);
	scene.add(stars);

	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();


	function render() {
		controls.update();
        
		sphere.rotation.y += 0;
		clouds.rotation.y += 0;		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
    
    function createPoints(){
        return new THREE.Mesh(
            new THREE.SphereGeometry( 0.01, 6, 8 ),
            new THREE.MeshBasicMaterial({
                color: 0xf087a2 
            })
            );
    }

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('img/2_no_clouds_4k.jpg'),
				specularMap: THREE.ImageUtils.loadTexture('img/water_4k.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('img/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createStars(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('img/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	} 
    
};