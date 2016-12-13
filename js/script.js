"use strict";

const MAX_LEVELS = 4;

//global variables
var bgColor = 0xcccccc; //grey

var basketY = 40;
var ballRadius = 6;
var basketColor = 0xff0000; //red

var BasketRadius = ballRadius + 2;
var basketTubeRadius = 0.5;
var basketDistance = 80;
var basketGoalDiff = 2.5;

var goalDuration = 1800; //ms

var doubleTapTime = 300;

//other variables
var thrown = false;
var doubletap = false;
var goal = false;
var controlsEnabled = false;

var hudHeight = 24;
var hudColor = 0x68cc3d; //green
var currentLvlIndex = 0;

//Object contains camera positions and stats for each level
const levelData = [
	{
		level: 0,
		camX: 0,
		camY: 200,
		camZ: 80,
		attempts: 0,
		baskets: 0,
		accuracy: 0
	},
	{
		level: 1,
		camX: 0,
		camY: 10,
		camZ: 80,
		attempts: 0,
		baskets: 0,
		accuracy: 0
	},
	{
		level: 2,
		camX: 40,
		camY: 10,
		camZ: 80,
		attempts: 0,
		baskets: 0,
		accuracy: 0
	},
	{
		level: 3,
		camX: -80,
		camY: 10,
		camZ: 80,
		attempts: 0,
		baskets: 0,
		accuracy: 0
	},
	{
		level: 4,
		camX: -30,
		camY: 10,
		camZ: 160,
		attempts: 0,
		baskets: 0,
		accuracy: 0
	}

];

var currentLvl = levelData[0];


function updateAppForLevel(){
	var i = currentLvlIndex;
	var d = levelData[i];
	APP.currentLvl = levelData[i];
	APP.camera.x = d.camX;
	APP.camera.y = d.camY;
	APP.camera.z = d.camZ;
	APP.world.camera.position.set(d.camX,d.camY,d.camZ);
	APP.camera.lookAt(new THREE.Vector3(0, basketY/2, -50));
}

function addScore(lvl){
	console.log(lvl);
	var body = document.body;
	var dv = document.createElement('div');
	dv.id = "scoreDiv";
	dv.style.zIndex = "1";
	dv.style.position = "absolute";
	dv.style.left = "100px";
	dv.style.top = "150px";
	dv.style.color = "white";

	var txt1 = document.createElement('p');
	var t1n1 = document.createTextNode("Level: ");
	var t1n2 = document.createTextNode(levelData[lvl].level);
	txt1.appendChild(t1n1);
	txt1.appendChild(t1n2);

	var br = document.createElement('br');

	var txt2 = document.createElement('p');
	var t2n1 = document.createTextNode("Attempts: ");
	var t2n2 = document.createTextNode(levelData[lvl].attempts);
	txt2.appendChild(t2n1);
	txt2.appendChild(t2n2);

	var txt3 = document.createElement('p');
	var t3n1 = document.createTextNode("Baskets: ");
	var t3n2 = document.createTextNode(levelData[lvl].baskets);
	txt3.appendChild(t3n1);
	txt3.appendChild(t3n2);

	var txt4 = document.createElement('p');
	var t4n1 = document.createTextNode("Accuracy: ");
	var t4n2 = document.createTextNode(levelData[lvl].accuracy);
	txt4.appendChild(t4n1);
	txt4.appendChild(t4n2);


	dv.appendChild(txt1);
	dv.appendChild(br);
	dv.appendChild(txt2);
	dv.appendChild(br);
	dv.appendChild(txt3);
	dv.appendChild(br);
	dv.appendChild(txt4);
	body.appendChild(dv);
}

function remScore(){
	var body = document.body;
	var itm = document.getElementById("scoreDiv");
	body.removeChild(itm);
}

function addStartMsg(app){
	var body = document.body;
	var dv = document.createElement('div');
	dv.id = "startMsgDiv";
	dv.style.zIndex = "1";
	dv.style.position = "absolute";
	dv.style.left = "100px";
	dv.style.top = "150px";
	dv.style.color = "white";

	var txt1 = document.createElement('p');
	var t1n1 = document.createTextNode("ENTER TO BEGIN");
	txt1.appendChild(t1n1);
	dv.appendChild(txt1);
	body.appendChild(dv);
}

function remStartMsg(app){
	var body = document.body;
	var itm = document.getElementById("startMsgDiv");
	body.removeChild(itm);
}

function generateMenuTexture(menu) {
  /* CONFIG */
  const leftPadding = 1700;

  /* CANVAS */
  const canvas = document.createElement('canvas');
  canvas.width = 2000;
  canvas.height = 1000;
  const context = canvas.getContext('2d');

  context.font = "Bold 100px Richardson";
  context.fillStyle = "#2D3134";
  context.fillText("Time", 0, 150);
  context.fillText(menu.time.toFixed() + 's.', leftPadding, 150);

  context.fillText("Attempts", 0, 300);
  context.fillText(menu.attempts.toFixed(), leftPadding, 300);

  context.fillText("Accuracy", 0, 450);
  context.fillText(menu.accuracy.toFixed(), leftPadding, 450);

  context.font = "Normal 200px FNL";
  context.textAlign = "center";
  context.fillText(menu.markText, 1000, 800);

  const image = document.createElement('img');
  image.src = canvas.toDataURL();

  const texture = new THREE.Texture(image);
  texture.needsUpdate = true;

  return texture;
};

function getCameraAngle(){
	var vector = new THREE.Vector3();
	APP.camera.getWorldDirection(vector);
	return vector;
}

function getCameraPos(){
	var vector = new THREE.Vector3(APP.camera.x,APP.camera.y,APP.camera.z);
	return APP.camera.position;
}

const cursor = {
	x: 0, // Mouse X.
	y: 0, // Mouse Y.
	xCenter: window.innerWidth / 2, // Window center X.
	yCenter: window.innerHeight / 2 // Window center Y.
}

const force = {
		y: 8, // Kick ball Y force. (8)
    z: -2.5, // Kick ball Z force. (-2.5) // FRONTWARD
    m: 1250, // Multiplier for kick force. (start 2400)
  	xk: 8 // Kick ball X force multiplier. (8) // L/R
}

//event handlers
const EVENTS = {

	click(APP) {
    	window.addEventListener('mouseup', APP.throwBall);
    	window.addEventListener('mouseup', () => {
    		const el = APP.world.getRenderer().domElement;
    	});
  	},

  	move(APP) {
    	['mousemove', 'touchmove'].forEach((e) => {
      		window.addEventListener(e, updateCoords);
    	});
  	},

  	keypress(APP) {
    	window.addEventListener('keypress', checkKeys);
  	}
}

function updateCoords(e) {
	//e.preventDefault();
	cursor.x = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
	cursor.y = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
}

function checkKeys(e) {
    if (e.code === "Space")
    	thrown = false;

	if(e.code === "Enter"){
		remStartMsg(APP);
		APP.addBall();
		currentLvlIndex++;
		updateAppForLevel();
		addScore(currentLvlIndex);
		APP.keep_ball = keep_ball(APP);
		APP.world.addLoop(APP.keep_ball);
	    APP.keep_ball.start();
		controlsEnabled = true;
				//reset world
	}
	if(e.code === "Equal"){
		console.log("increment level");
		if(currentLvlIndex>0 && currentLvlIndex<MAX_LEVELS){
			currentLvlIndex++;
			remScore();
			updateAppForLevel();
			addScore(currentLvlIndex);
		}
				//reset world
	}
	if(e.code === "Minus"){
		console.log("decrement level");
		if(currentLvlIndex>1 && currentLvlIndex<=MAX_LEVELS){
			currentLvlIndex--;
			remScore();
			updateAppForLevel();
			addScore(currentLvlIndex);
		}
				//reset world
	}
	if(e.code === "ArrowUp" || e.code==="ArrowDown"){
				if(e.code === "ArrowUp"){
					force.m += 50;
					hudHeight += 5;
					console.log(force.m);
					console.log(hudHeight);
					APP.world.remove(APP.hud);
					APP.addHUD();
					//APP.hud.resetHeight(APP.hudHeight);
					//APP.hud.height.set(APP.hud.height+1);
				}
				else{
					force.m -= 50;
					hudHeight -= 5;
					console.log(force.m);
					console.log(hudHeight);
					APP.world.remove(APP.hud);
					APP.addHUD();
					//APP.hud.resetHeight(APP.hudHeight);
					//APP.hud.height.set(APP.hud.height-1);
				}
				if(force.m === 1250){
					//APP.hud.color.set(0x68cc3d);
					hudColor = 0x68cc3d;
					APP.world.remove(APP.hud);
					APP.addHUD();
				}
				else {
					//APP.hud.color.set(0xe0ed2f);
					hudColor = 0xe0ed2f;
					APP.world.remove(APP.hud);
					APP.addHUD();
				}

			}
}

function detectDoubleTap() {
	if(controlsEnabled){
		if (!doubletap) { // Wait for second click.
	  		doubletap = true;
	  		setTimeout(() => { doubletap = false; }, doubleTapTime);
	  		return false;
		} else { // Double tap triggered.
	   		thrown = false;
    		doubletap = true;
      		return true;
    	}
	}
}

const keep_ball = (APP) => {
  return new WHS.Loop(() => {
    if (!thrown) APP.keepBall();

    const BLpos = APP.ball.position;
    const BSpos = APP.basket.position

    if (BLpos.distanceTo(BSpos) < basketGoalDiff && Math.abs(BLpos.y - BSpos.y + APP.basketYDeep()) < APP.basketYGoalDiff() && !goal)
    	APP.onGoal();
  });
}

//holds infor for main application

const APP = {


	getBasketRadius: () => ballRadius + 2,
	getBasketZ: () => APP.getBasketRadius() + basketTubeRadius * 2 - basketDistance+5,
	basketYGoalDiff: () => 1,
	basketYDeep: () => 1,


	init() {
		APP.world = new WHS.World({
		    autoresize: "window",
		    softbody: true,
		    background: { color: bgColor }, //grey
		    gravity: { y: -200 },  // Physic gravity.
			// level 1 camera
		    camera: {
				x: 0, // (0)
				y: 200, //APP.basketY/4, (10)
				z: 80, // Move camera. (80)
		        aspect: 45 //(45)
		    }
		});

		APP.camera = APP.world.getCamera();
		APP.camera.lookAt(new THREE.Vector3(0, basketY/2, -50));

		APP.createScene();
		APP.addLights();
		APP.addBasket();

		APP.addHUD();
		addStartMsg(APP);
		APP.initEvents();

		APP.world.start();
	},

	initEvents() {
	    EVENTS.move(APP);
	    EVENTS.click(APP);
	    EVENTS.keypress(APP);
	},


	createScene() {
		APP.ground = new WHS.Plane({
			geometry: {
				buffer: true,
				width: 1000,
				height:800
			},

			mass: 0,

			material: {
				kind: 'phong',
				color: bgColor,
				map: WHS.texture('textures/floor.png', {repeat: {y: 4, x: 10}}),

			},

			pos: {
				y:-20,
				z:100,
			},

			rot: {
				x: -Math.PI/2
			}
		});

		APP.wall = new WHS.Plane({
			geometry: {
				buffer: true,
				width: 1000,
				height:800
			},

			mass: 0,

			material: {
				kind: 'phong',
				color: bgColor,
				map: WHS.texture('textures/background.jpg'), //{repeat: {y: 4, x: 10}}), //offset: {y: 0.3}}),

			},

			pos: {
				y:-20,
				z:120,
			},

			rot: {
				x: -Math.PI/2
			}
		});

		APP.ground.addTo(APP.world);
		APP.wall.position.y = 180;
    	APP.wall.position.z = -basketDistance-20;
    	APP.wall.rotation.x = 0;
    	APP.wall.addTo(APP.world);

	},

	addLights() {
		APP.light = new WHS.PointLight({
			light: {
				distance: 300,
				intensity: 1,
				angle: Math.PI
			},

			shadowmap: {
		        width: 1024,
		        height: 1024,

		        left: -50,
		        right: 50,
		        top: 50,
		        bottom: -50,

		        far: 150,
		        fov: 90,
	      	},

	      	pos: {
	      		x: 50,
	        	y: 100,
	        	z: 0
	      	},
	    });

	    APP.light.addTo(APP.world);

		new WHS.AmbientLight({
	      	light: {
	        	intensity: 0.3
	      	}
	    }).addTo(APP.world);
	},

	addBasket() {
		APP.basket = new WHS.Torus({
			geometry: {
				buffer: true,
				radius: APP.getBasketRadius(),
				tube: basketTubeRadius,
				radialSegments: 16,
				tubularSegments: 16
			},

			mass: 0,

			shadow: {
				cast: false
			},

			material: {
				kind: 'standard',
				color: basketColor,
				metalness: 0.8,
				roughness: 0.5,
				emissive: 0xffccff,
				emissiveIntensity: 0.2
			},

			pos: {
				y: basketY,
				z: APP.getBasketZ()
			},

			physics: { type: 'concave' },

			rot: {
				x: Math.PI/2
			}
		});

		APP.basket.addTo(APP.world);

		APP.backboard = new WHS.Box({
			geometry: {
				buffer: true,
				width: 40,
				depth: 1,
				height: 25
			},

			mass: 0,

			material: {
				kind: 'standard',
				map: WHS.texture('textures/backboard.jpg'),
				metalness: 0,
				roughness:1
			},

			pos: {
				y:basketY + 10,
				z: APP.getBasketZ() - APP.getBasketRadius()
			}
		});

		APP.backboard.addTo(APP.world);

		APP.post = new WHS.Cylinder({
			geometry: {
				buffer: true,
				radiusTop: 1.5,
				radiusBottom: 1.5,
				depth: 2,
				height: basketY + 35
			},

			shadow: {cast: true},

			mass: 0,

			material: {
				kind: 'standard',
				color: 0xcccccc,
				metalness: .5,
				roughness:0.8
			},

			pos: {
				y: 0,
				z: APP.getBasketZ() - APP.getBasketRadius() -2
			}
		});

		APP.post.addTo(APP.world);

		APP.net = new WHS.Cylinder({
			geometry: {
				radiusTop: APP.getBasketRadius(),
				radiusBottom: APP.getBasketRadius() - 3,
		        height: 15,
		        openEnded: true,
		        heightSegments: 5,
		        radiusSegments: 16
		    },

      		shadow: {
        		cast: false
      		},

			physics: {
		        pressure: 2000,
		        friction: 0.05,
		        margin: 0.5//,
		        //viterations: 2,
		        //piterations: 2,
		        //diterations: 4
		    },

		    mass: 30,
		    softbody: true,

		    material: {
		        map: WHS.texture('textures/net4.png', {repeat: {y: 2, x: 3.5}, offset: {y: 0.5}}), // 0.85, 19
		        transparent: true,
		        opacity: .7,
		        kind: 'basic',
		        side: THREE.DoubleSide//,
		        //depthWrite: false
		    },

		    pos: {
		        y: basketY - 8,
		        z: APP.getBasketZ()
		    }

		});

		APP.net.addTo(APP.world);

		for (let i = 0; i < 16; i++) {
        	APP.net.appendAnchor(APP.world, APP.basket, i, .8, true);
      	}

	},

	addBall() {
		APP.ball = new WHS.Sphere({
			geometry: {
				buffer: true,
				radius: ballRadius,
				widthSegments: 32,
				heightSegments: 32
			},

			mass: 60,

			material: {
				kind: 'phong',
				map: WHS.texture('textures/ball.png'),
				normalMap: WHS.texture('textures/ball_normal.png')

			},

			physics: {
				restitution: 2.5
			}
		});

		APP.ball.addTo(APP.world);
	},

	addHUD(){
		APP.hud = new WHS.Cylinder({
			geometry: {
				buffer: true,
				radiusTop: 2,
				radiusBottom: 2,
				depth: 2,
				height: hudHeight*2
			},

			shadow: {cast: true},

			mass: 0,

			material: {
				kind: 'standard',
				color: hudColor, // 68cc3d (green) or cccccc or e0ed2f (yellow)
				normalScale: new THREE.Vector2(.3, .3),
				metalness: 0,
				roughness:0.3
			},

			pos: {
				y: -20, //APP.basketY, // + 10, or 0
				z: APP.getBasketZ() - APP.getBasketRadius() -2
			},
		});

		APP.hud.addTo(APP.world);

	},

	throwBall(e) {
	    var mult = force.m;

	    if (!detectDoubleTap() && controlsEnabled && !thrown) {
			const ang = getCameraAngle();
			const pos = getCameraPos();

			const F_X = force.xk * (cursor.x - cursor.xCenter);
			const F_Y = force.y * force.m;
			const F_Z = force.z * force.m;

			const F_X_ADJ = F_X*Math.cos(ang.x) - F_Z*Math.sin(ang.x);
			const F_Y_ADJ = F_Y;
			const F_Z_ADJ = F_Z*Math.cos(ang.x) - F_X*Math.sin(ang.x);

	    	const vector = new THREE.Vector3( F_X_ADJ, F_Y_ADJ, F_Z_ADJ );

      		APP.ball.setLinearVelocity(new THREE.Vector3(0, 0, 0)); // Reset gravity affect.

      		APP.ball.applyCentralImpulse(vector);

      		vector.multiplyScalar(10 / force.m)
      		vector.y = vector.x;
      		vector.x = force.y;
		    vector.z = 0;

		    APP.ball.setAngularVelocity(vector); // Reset gravity affect.
		    thrown = true;
			levelData[currentLvlIndex].attempts++;
			levelData[currentLvlIndex].accuracy = levelData[currentLvlIndex].baskets / levelData[currentLvlIndex].attempts * 100;
			remScore();
			addScore(currentLvlIndex);
	    }
	 },

	keepBall() {
		//reset goal
		goal = false;
		const ang = getCameraAngle();
		const pos = getCameraPos();

		const x = (cursor.x - cursor.xCenter) / window.innerWidth * 32;
		const y = - (cursor.y - cursor.yCenter) / window.innerHeight * 32;

	    APP.ball.position.set(pos.x+80*Math.sin(ang.x)+x*Math.cos(ang.x), y, pos.z-80*Math.cos(ang.x)+x*Math.sin(ang.x));
	},

	onGoal(){
		if(!goal){
			goal = true;
			levelData[currentLvlIndex].baskets++;
			levelData[currentLvlIndex].accuracy = levelData[currentLvlIndex].baskets / levelData[currentLvlIndex].attempts * 100;
			remScore();
			addScore(currentLvlIndex);
		}
	}
};





//initialize application
APP.init();
