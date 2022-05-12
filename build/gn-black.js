
// ГЛОБАЛЛЬНЫЕ ПЕРЕМЕННЫЕ 

var container,camera,scene,renderer,controls;
var material,loadModel;
var light,pointLight,hemiLight,dirLight;
var mixer,action,speed,delta;
var clock = new THREE.Clock();
var reverse = false;
var mouse = { x:0,y:0 };
var dX = 0, dY = 0;

// FBX LOADER
var fbxLoader = new THREE.FBXLoader();

//////////////////////////////////////////////////////////////////////

// COLOR MAP LOAD
var imgMap = new THREE.TextureLoader().load( "pic/tex/color.png" );
// imgMap.wrapS = imgMap.wrapT = THREE.RepeatWrapping;
imgMap.wrapS = imgMap.wrapT = THREE.MirroredRepeatWrapping
imgMap.repeat.set( 1, 1 );

// BUMP MAP LOAD
var bumpMap = new THREE.TextureLoader().load( "pic/tex/bump.jpg" );
bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
bumpMap.repeat.set( 4, 4 );

// NORMAL MAP LOAD
var normMap = new THREE.TextureLoader().load( "pic/tex/normal.png" );
normMap.wrapS = normMap.wrapT = THREE.RepeatWrapping;
normMap.repeat.set( 3, 3 );

// ROUGHNESS MAP LOAD
var rougMap = new THREE.TextureLoader().load( "pic/tex/roug.jpg" );
rougMap.wrapS = rougMap.wrapT = THREE.RepeatWrapping;
rougMap.repeat.set( 1, 1 );

// DISPLACE MAP LOAD
var dispMap = new THREE.TextureLoader().load( "pic/tex/displace.jpg" );
dispMap.wrapS = dispMap.wrapT = THREE.RepeatWrapping;
// dispMap.wrapS = dispMap.wrapT = THREE.MirroredRepeatWrapping
dispMap.repeat.set( 1, 1 );

// HDR MAP LOAD
var urls = [
	'pic/tex/hdr/1/px.jpg','pic/tex/hdr/1/nx.jpg',
	'pic/tex/hdr/1/py.jpg','pic/tex/hdr/1/ny.jpg',
	'pic/tex/hdr/1/pz.jpg','pic/tex/hdr/1/nz.jpg'
];

//HDR ЛОЙДЕР
var hdrMap = new THREE.CubeTextureLoader().load(urls);

// ЗАПУСК ФУНКЦИЙ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
init();
loop();

//////////////////////////////////////////////////////////////////////


// ЗАГРУЗКА 3Д МОДЕЛИ, МЕТАРИАЛ, ЗАПУСК АНИМАЦИИ
function load3Dmodel(){

		// HDR MAP  
		// material = new THREE.MeshStandardMaterial({ 
		// 	bumpMap:bumpMap,
		// 	bumpScale:0.002,
		// 	envMap:hdrMap, 
		// 	envMapIntensity: 1.2,
		// 	metalness:1,
		// 	refractionRatio: 0.91,
		// 	roughness:0.99,
		// 	roughnessMap:rougMap,
		// });

				// HDR MAP — BLACK
			material = new THREE.MeshStandardMaterial({ 
			bumpMap:bumpMap,
			bumpScale:0.002,
			envMap:hdrMap, 
			envMapIntensity: 0.2,
			metalness:1,
			refractionRatio: 0.91,
			roughness:0.99,
			// roughness:1.2,
			roughnessMap:rougMap,
		});


		// COLOR MAP 
		// material = new THREE.MeshPhongMaterial({
		// 		color:0xffffff,
		// 		// map:imgMap,
		// 		// bumpMap:bumpMap,
		// 		// bumpScale:0.2,
		// 		// shininess:150,
		// });


		// NORMAL MAP 
		// material = new THREE.MeshPhongMaterial({
		// 			shininess:150,
		// 			color:0x1062cf,
		// 			normalMap:normMap,
		// 			reflectivity:0.5,
		// });

		// DISPLACE MAP  
		// material = new THREE.MeshPhongMaterial({ 
		// 	bumpMap:imgMap,
		// 	bumpScale:0.002,
		// 	// map:imgMap,
		// 	displacementMap:dispMap,
		// 	displacementScale:0,
		// 	displacementBias:0,
		// });


		// ЗАГРУЗКА 3Д МОДЕЛИ

			fbxLoader.load( 'pic/model/gn.fbx', function ( object) {

				object.traverse( function ( child )
				{
					if ( child.isMesh ) 
					{
						child.material = material;
						child.castShadow = true; // ОТБРАСЫВАТЬ ТЕНЬ НА ОБЪЕКТЫ
						child.receiveShadow = true; // ПРИНИМАТЬ ТЕНЬ ОТ ОБЪЕКТОВ
					}
				});

					loadModel = object // ПЕРЕДАЧА ЗАГРУЖЕННОЙ МОДЕЛИ В ПЕРЕМЕННУЮ

					loadModel.scale.set(0.7,0.7,0.7)
					loadModel.position.x = 0;
					loadModel.position.y = 0;

					//УПРАВЛЕНИЕ РАСПОЛОЖЕНИЕМ ТЕКСТУРЫ
					// loadModel.children[0].material.map.offset.x = -0.24;
					// loadModel.children[0].material.map.offset.y = -0.03;

					// ПРОЗРАЧНОСТЬ REFRACTION
    			// material.envMap.mapping = THREE.CubeRefractionMapping;

					//ЗАПУСК АНИМАЦИИ
					mixer = new THREE.AnimationMixer( object );
					action = mixer.clipAction( object.animations[ 0 ] );
					action.clampWhenFinished = true;
					action.loop = THREE.LoopOnce;
					action.play();


					//добавление в сцену модели с анимацией
					scene.add(loadModel);

			});			
}

//////////////////////////////////////////////////////////////////////

// ОСВЕЩЕНИЕ В СЦЕНЕ
function lightScene(){

			//POINT LIGHT
			// pointLight = new THREE.PointLight( 0xffffff, 1, 100 );
			// pointLight.position.set( 10, 10, 10 );
			// scene.add( pointLight );
			//HELPER
			// var pointLightHelper = new THREE.PointLightHelper( pointLight, 3 );
			// scene.add( pointLightHelper );

			// HEMILIGHT
			hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
			hemiLight.color.set( 0xffffff );
			hemiLight.groundColor.set( 0xffffff );
			hemiLight.position.set( 5, 5, 5 );
			scene.add( hemiLight );
			//HELPER
			// var hemiLightHelp= new THREE.HemisphereLightHelper( hemiLight, 5, 0xffffff );
			// scene.add( hemiLightHelp );

			//DIRECTIONALLIGHT
			dirLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
			dirLight.color.set( 0xffffff );
			dirLight.position.set( 2, 2, 2 );
			dirLight.position.multiplyScalar( 1 );
			scene.add( dirLight );
			dirLight.castShadow = true;
			dirLight.shadow.mapSize.width = 2048;
			dirLight.shadow.mapSize.height = 2048;
			var d = 20;
			dirLight.shadow.camera.left = - d;
			dirLight.shadow.camera.right = d;
			dirLight.shadow.camera.top = d;
			dirLight.shadow.camera.bottom = - d;
			dirLight.shadow.camera.far = 300;
			dirLight.shadow.bias = - 0.0001;
			//HELPER
			// var dirLightHelp = new THREE.DirectionalLightHelper( dirLight, 3, 0xffffff );
			// scene.add( dirLightHelp );
}

//ЗНАЧЕНИЯ КУРСОРА ПО X/Y ОСЯМ  
function onMouseMove( event ) {
			mouse.x = ( event.clientX / document.documentElement.clientWidth) * 2 - 1;
			mouse.y = - ( event.clientY / document.documentElement.clientHeight ) * 2 + 1;	
}

//ЗНАЧЕНИЯ ТАЧ СОБЫТИЯ ПО X/Y ОСЯМ  
function onTouchMove(event) {
		  mouse.x = ( event.changedTouches[0].clientX / document.documentElement.clientWidth) * 2 - 1;
		  mouse.y = - ( event.changedTouches[0].clientY / document.documentElement.clientHeight) * 2 + 1;
}

// EASE - IN - OUT
function lerp(ratio, start, end){return (start * (1 - ratio) + end * ratio).toFixed(20)}


//////////////////////////////////////////////////////////////////////


// ИНИЦИАЛИЗАЦИЯ 3Д СЦЕНЫ
function init() {

			container = document.createElement( 'div' );
			document.body.appendChild( container );

			//КАМЕРА
			camera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 100000);
			camera.position.set( 0, 0, 150 );

			//СЦЕНА
			scene = new THREE.Scene();
			// scene.background = new THREE.Color( 0x1062cf ); // ЦВЕТ ФОНА
			// scene.background = new THREE.Color( 0x000000 ); // ЦВЕТ ФОНА
			// scene.background = hdrMap;

			lightScene() // СВЕТ
			load3Dmodel(); // ЗАГРУЗКА 3Д МОДЕЛМ


			// УПРАВЛЕНИЕ КАМЕРОЙ
			controls = new THREE.OrbitControls(camera);

			// ОТКЛЮЧИТЬ ЗУМ
			controls.enableZoom = false;

			//РЕНДЕР
			renderer = new THREE.WebGLRenderer( { antialias:true, alpha:true } );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;

			container.appendChild( renderer.domElement );

			//СОБЫТИЯ НА СТРАНИЦЕ
			window.addEventListener('resize', onWindowResize, false ); // РЕСАЙЗ
			window.addEventListener('mousemove',onMouseMove, false) // КУРСОР
			window.addEventListener('touchmove',onTouchMove, false) // ТАЧ
			window.addEventListener('click',pauseMotion, false) // ПАУЗА
}

// ВЗАИМОДЕЙСТИЯ С ЗАГРУЖЕННОЙ 3Д МОДЕЛЬЮ
function load3DmodelMove(){

			// speed = Math.sin(0.21 * (performance.now() / 20));
			dY = lerp(0.09, dY, mouse.y)
			dX = lerp(0.09, dX, mouse.x)


			// ВРАЩЕНИЕ
			loadModel.rotation.x = -dY;
			loadModel.rotation.y = dX;
			loadModel.rotation.z = dY;

			// ПЕРЕМЕЩЕНИЕ
		 	// loadModel.position.x = dX * 17;
			// loadModel.position.y = dY * 7;
			// loadModel.position.z = dY * 42;

			// РАЗМЕР
			// loadModel.scale.set(dX,dX,dX)

			// ВРАЩЕНИЕ COLOR MAP
			// loadModel.children[0].material.map.offset.x = dX / 4;
			// loadModel.children[0].material.map.offset.y = dY / 4 ;

			// УПРАВЛЕНИЕ DISPLACE MAP
			// loadModel.children[0].material.displacementScale = dX * 12;
			// loadModel.children[0].material.displacementBias = dX * 20;

			// SLOW MOTION
			// action.setEffectiveTimeScale(dX * 4).play()

			// ИСТОЧНИКИ СВЕТА
			// dirLight.position.set( dX * 100, dY * 100, 10 );

}

// PLAY/PAUSE АНИМАЦИИ 3Д МОДЕЛИ
function pauseMotion(){
			if(reverse == false){
				action.paused = true
				reverse = true
			}
			else{
				action.paused = false
				reverse = false
			}
}

//////////////////////////////////////////////////////////////////////

// РЕНДЕР СЦЕНЫ
function loop() {
			requestAnimationFrame( loop );

			// ЗАПУСК АНИМАЦИИ ПО ВРЕМЕНИ
			delta = clock.getDelta();
			mixer.update( delta );

			//ИНТЕРАКТИВ
			load3DmodelMove()


			//РЕНДЕР ВСЕХ ОБЪЕКТОВ СЦЕНЫ
			renderer.render( scene, camera );
}

// РЕСАЙЗ СЦЕНЫ И КАМЕРЫ ОТ РАЗРЕШЕНИЯ ОКНА
function onWindowResize() {
		  var h = document.documentElement.clientHeight
		  var w = document.documentElement.clientWidth
		  camera.aspect = w / h
		  camera.updateProjectionMatrix()
		  renderer.setSize(w, h)
}
