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
if (!Detector.webgl) Detector.addGetWebGLMessage();


var camZMin = -12000;
  var camSpeed = 5;
// var stats;
var particles, geometry, materials = [],
    parameters, i, h, color, size;
var mouseX = 0,
    mouseY = 0;
    

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
// standard global variables
var scene, camera, renderer;
var light;
var allCubes = [];

var container;
var controls;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;

// custom global variables
var model, texture;

// kind of like setup()
init();


///////////////////////////////////////////////////////////
// FUNCTIONS 
///////////////////////////////////////////////////////////

function init() {
	
    // SCENE
    // construct environment first
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );


    // LIGHT
    // create light for the scene
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(-1, 1, -1);
    scene.add(light);


    // CAMERA
    // PerspectiveCamera( field of view, aspect, near, far )
    // see more @doc: http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
    camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 4800; //set the position of the camera
    // camera.position.set(0,150,400);				//can also do position.set(x, y, z)
    scene.add(camera); //add camera into the scene


    geometry = new THREE.Geometry();

				for ( i = 0; i < 6000; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Math.random() * 2000 - 1000;
					vertex.y = Math.random() * 2000 - 1000;
					vertex.z = Math.random() * 10000 - 1000;

					geometry.vertices.push( vertex );

				}
//colors
				parameters = [
					[ [1, .5, 0.5], 5 ],
					[ [1, .3, 0.1], 4 ],
					[ [1, .2, 0.5], 3 ],
					[ [1, .1, 0.3], 2 ],
					[ [1, 1, 0.1], 1 ]
				];

				for ( i = 0; i < parameters.length; i ++ ) {

					color = parameters[i][0];
					size  = parameters[i][1];

					materials[i] = new THREE.PointsMaterial( { size: size } );

					particles = new THREE.Points( geometry, materials[i] );

					particles.rotation.x = Math.random() * 6;
					particles.rotation.y = Math.random() * 6;
					particles.rotation.z = Math.random() * 6;

					scene.add( particles );

				}




    // Mesh
    // - Floor
    geo = new THREE.PlaneGeometry(100, 100);
    mat = new THREE.MeshLambertMaterial({ color: 0xed5d9c, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geo, mat);
    plane.position.y = -10;
    plane.rotation.x = -Math.PI / 2;
    // scene.add(plane);

    // Loading External Texture & Model
    var manager = new THREE.LoadingManager(); //Handles and keeps track of loaded and pending data

    // TEXTURE
    texture = new THREE.Texture();
    var loader = new THREE.ImageLoader(manager);
    loader.load('models/Diamond.jpg', function(image) {
        texture.image = image;
        texture.needsUpdate = true;
    });
    mat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    // MODLE (MESH)
    // - Import using OBJLoader.js
    // - reference: http://threejs.org/examples/webgl_loader_obj.html
    var onProgress = function(xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function(xhr) {};

    var loader = new THREE.OBJLoader(manager);
    loader.load('models/Diamond.obj', function(object) {

        // console.log(object);

        // for all the children in the OBJ model
        for (var i = 0; i < object.children.length; i++) {
            if (object.children[i] instanceof THREE.Mesh) {
                // object.children[i].material.map = texture;
                object.children[i].material = mat;
            }
        }

        // for (var i=0;i<10;i++){

        model = object;
        model.scale.set(3, 3, 3);
        model.position.z = -50 + (i * 100);
        model.position.x = -50 + (i * 100);
        console.log(model)
        allCubes.push(model);
        scene.add(model)


        // }


    }, onProgress, onError);


    // RENDERER
    container = document.createElement('div');
    document.body.appendChild(container);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xfdf3a0, 1); //set background color

    container.appendChild(renderer.domElement);


    // EVENTS
    // automatically resize renderer
    window.addEventListener('resize', onWindowResize, false);


    // CONTROLS
    // left click to rotate, middle click/scroll to zoom, right click to pan
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // kind of like draw()/loop()
    animate();



				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );


}

	function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length === 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}


function animate() {
    requestAnimationFrame(animate); //http://creativejs.com/resources/requestanimationframe/
    update();
    render();
}

  function switchCamera() {
        camSpeed = -camSpeed;
        // console.log(camSpeed)
    }

function update() {
    controls.update();

    camera.position.z += camSpeed;
        // console.log(camera.position.z)
        if (camera.position.z > 4800 || camera.position.z < camZMin) {
            switchCamera();
        }


}

function render() {
	var time = Date.now() * 0.00001;

	for ( i = 0; i < scene.children.length; i ++ ) {

					var object = scene.children[ i ];

					if ( object instanceof THREE.Points ) {

						object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

					}

				}
//color changing
				// for ( i = 0; i < materials.length; i ++ ) {

				// 	color = parameters[i][0];

				// 	h = ( 360 * ( color[0] + time ) % 360 ) / 360;
				// 	materials[i].color.setHSL( h, color[1], color[2] );

				// }
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}