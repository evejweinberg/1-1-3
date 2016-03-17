/*
 * Made by @jhclaura (Laura Chen, jhclaura.com)
 * for Three.js Pop-Up Workshops
 * X'mas season 2015
 *
 * @Topic: Import 3D Model
 */

////////////////////////////////////////////////////////////	
// SET_UP_VARIABLES
////////////////////////////////////////////////////////////

// standard global variables
var scene, camera, renderer;
var light;
var camSpeed = 1;

var container;
var controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
   // an array to store our particles in
      particles = [];

// custom global variables
var model, texture;

// kind of like setup()
init();


///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////
			
function init() 
{
	// SCENE
	// construct environment first
	scene = new THREE.Scene();


	// LIGHT
	// create light for the scene
	light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(1,1,1);
	scene.add(light);
	light = new THREE.DirectionalLight( 0xffffff, 1);
	light.position.set(-1,1,-1);
	scene.add(light);


	// CUBE (MESH)
	// needs geometry + material
	var geo = new THREE.BoxGeometry(20,20,20);
	var mat = new THREE.MeshLambertMaterial( {color: 0xffff00} );
	cube = new THREE.Mesh( geo, mat );
	cube.position.x = -10;
	scene.add(cube);

	for(var i=0; i<50; i++ ){
		for(var j=0; j<50; j++) {
			mat = new THREE.MeshLambertMaterial( {color: Math.random() * 0xffffff} );	// random colors!
			var mesh = new THREE.Mesh( geo, mat );
			mesh.position.set(-1000+(40*i),(j*20),(j*40))
			scene.add(mesh);
		}
	}
	/////////CUBES END


	// CAMERA
	// PerspectiveCamera( field of view, aspect, near, far )
	// see more @doc: http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 100;						//set the position of the camera
	// camera.position.set(0,150,400);				//can also do position.set(x, y, z)
	scene.add(camera);
	makeParticles();								//add camera into the scene

	// Mesh
	// - Floor
	geo = new THREE.PlaneGeometry(100,900);
	mat = new THREE.MeshLambertMaterial( {color: 0xed5d9c, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh(geo, mat);
	plane.position.y = -10;
	plane.rotation.x = -Math.PI/2;
	scene.add(plane);

	// Loading External Texture & Model
	var manager = new THREE.LoadingManager();		//Handles and keeps track of loaded and pending data

	// TEXTURE
	texture = new THREE.Texture();
	var loader = new THREE.ImageLoader( manager );
	loader.load( 'models/flower/Flower_txt.jpg', function ( image ) {
		texture.image = image;
		texture.needsUpdate = true;
	} );
	mat = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );

	// MODLE (MESH)
	// - Import using OBJLoader.js
	// - reference: http://threejs.org/examples/webgl_loader_obj.html
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			// console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) {
	};

	var loader = new THREE.OBJLoader( manager );
	loader.load( 'models/Cube.obj', function (object) {

		// console.log(object);

		// for all the children in the OBJ model
		for(var i=0; i<object.children.length; i++){
			if ( object.children[i] instanceof THREE.Mesh ) {
				// object.children[i].material.map = texture;
				object.children[i].material = mat;
			}
		}

		// v_old
		// object.traverse( function ( child ) {
		// 	if ( child instanceof THREE.Mesh ) {
		// 		child.material.map = texture;
		// 	}
		// } );

		model = object;
		model.scale.set(7,7,7);
		model.position.z = -50;
		scene.add( model );

	}, onProgress, onError );


	// RENDERER
	container = document.createElement('div');
	document.body.appendChild(container);
	renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0xfdf3a0, 1);			//set background color

	container.appendChild(renderer.domElement);

	
	// EVENTS
	// automatically resize renderer
	window.addEventListener( 'resize', onWindowResize, false );

	
	// CONTROLS
	// left click to rotate, middle click/scroll to zoom, right click to pan
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	
	// kind of like draw()/loop()
	animate();
}


function animate() 
{
    requestAnimationFrame( animate );				//http://creativejs.com/resources/requestanimationframe/
	update();
	render();		
}

function update()
{
	updateParticles();
	camera.position.z += camSpeed;
	// console.log(camera.position.z)
	if (camera.position.z>700 || camera.position.z <-100)
{
	switchCamera();
}

// 	camera.position.z += camSpeed;
// }	else {
// 	camera.position.z -= camSpeed;
// }	
	controls.update();
}

function switchCamera(){
camSpeed = -camSpeed;
// console.log(camSpeed)
}

function render() 
{	
	renderer.render( scene, camera );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}




////////////////////////////////////////////////////////////////
    function makeParticles() {

      var particle, material;
      // we're gonna move from z position -1000 (far away) 
      // to 1000 (where the camera is) and add a random particle at every pos. 
      for (var zpos = -1000; zpos < 1000; zpos += 20) {


        var geometryB = new THREE.SphereGeometry(0.4);
        var materialB = new THREE.MeshBasicMaterial();
        particle = new THREE.Mesh(geometryB, materialB);

        // give it a random x and y position between -500 and 500
        particle.position.x = Math.random() * 1000 - 500;
        particle.position.y = Math.random() * 1000 - 500;

        // set its z position
        particle.position.z = zpos;

        // scale it up a bit
        particle.scale.x = particle.scale.y = 10;

        // add it to the scene
        scene.add(particle);

        // and to the array of particles. 
        particles.push(particle);
      }

    }

        // there isn't a built in circle particle renderer 
    // so we have to define our own. 
    function particleRender(context) {

      // we get passed a reference to the canvas context
      context.beginPath();
      // and we just have to draw our shape at 0,0 - in this
      // case an arc from 0 to 2Pi radians or 360º - a full circle!
      context.arc(0, 0, 1, 0, Math.PI * 2, true);
      context.fill();
    };

    // moves all the particles dependent on mouse position

    function updateParticles() {

      // iterate through every particle
      for (var i = 0; i < particles.length; i++) {

        particle = particles[i];

        // and move it forward dependent on the mouseY position. 
        // particle.position.z += camSpeed;

        // if the particle is too close move it to the back
        if (particle.position.z > 1000) particle.position.z -= 2000;

      }

    }
