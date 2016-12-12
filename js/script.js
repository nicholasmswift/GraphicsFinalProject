//import levelData from './levelData';
//import TexUtils from './utils/textures';
//import EVENTS from './events';
//import {checkForLevel, loop_raycaster, keep_ball} from './loops';

"use strict";

const levelData = [
  {
    level: 1,
    basketY: 20,
    basketDistance: 80,
    basketColor: 0xff0000,

    force: {
      y: 6,
      z: -2
    }
  },
  {
    level: 2,
    basketY: 25,
    basketDistance: 100,
    basketColor: 0x0000ff,

    force: {
      y: 6.2,
      z: -3
    }
  },
  {
    level: 3,
    basketY: 30,
    basketDistance: 120,
    basketColor: 0x00ff00,

    force: {
      y: 6.2,
      z: -4
    }
  },
  {
    level: 4,
    basketY: 25,
    basketDistance: 150,
    basketColor: 0xffff00,

    force: {
      z: -5,
      y: 6.6
    }
  }
];

const IntToHex = (d, padding) => {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return '#' + hex;
};

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

function generateLevelTexture(levelData) {
  /* CANVAS */
  const canvas = document.createElement('canvas');
  canvas.width = 160;
  canvas.height = 80;
  const context = canvas.getContext('2d');

  context.fillStyle = "#000";
  context.beginPath();
  context.rect(0, 0, 160, 80);
  context.fill();

  context.fillStyle = "#2D3134";
  context.beginPath();
  context.rect(5, 5, 150, 70);
  context.fill();

  context.fillStyle = "#000";
  context.beginPath();
  context.arc(80, 40, 40, 0, Math.PI * 2, false);
  context.fill();

  context.font = "Bold 60px Richardson";
  context.fillStyle = levelData.basketColor ? IntToHex(levelData.basketColor, 6) : "#2D3134";
  context.textAlign = "center";
  context.fillText("" + levelData.level, 80, 60);

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
	//APP.camera.getWorldDirection(vector);
	return APP.camera.position;
	//return 0;
}

//TODO:
//	In double click, reposition camera + ball
//	make ball location on screen consistent (centered)
//	Add possibility to change power of shot
//	Add scoreboard

const APP = {
	bgColor: 0xcccccc, //grey
	//bgColor: 0xffffff, //grey

	basketY: 40,
	ballRadius: 6,
	basketColor: 0xff0000,

	getBasketRadius: () => APP.ballRadius + 2,
	basketTubeRadius: 0.5,

	basketDistance: 80,

	getBasketZ: () => APP.getBasketRadius() + APP.basketTubeRadius * 2 - APP.basketDistance+5,

	//goal
	basketGoalDiff: 2.5,
	basketYGoalDiff: () => 1,
	basketYDeep: () => 1,
	goalDuration: 1800, //ms

	doubleTapTime: 300,

	//other variables
	thrown: false,
	doubletap: false,
	goal: false,
	controlsEnabled: true,
	currentlyPlaying: false,

	cursor: {
		x: 0, // Mouse X.
	  y: 0, // Mouse Y.
	  xCenter: window.innerWidth / 2, // Window center X.
	  yCenter: window.innerHeight / 2 // Window center Y.
	},

	force: {
		y: 8, // Kick ball Y force. (8)
    z: -2.5, // Kick ball Z force. (-2.5) // FRONTWARD
	  m: 2400, // Multiplier for kick force. (start 2400)
	  xk: 8 // Kick ball X force multiplier. (8) // L/R

	},

	hudHeight: 24,
	hudColor: 0x68cc3d, // 68cc3d (green) or cccccc or e0ed2f (yellow)

	init() {
		APP.world = new WHS.World({

		    autoresize: "window",
		    softbody: true,

		    background: {
		    	color: APP.bgColor //grey
		    },


		    gravity: {
		    	y: -200
		    },  // Physic gravity.

				// level 1 camera
		    camera: {
						x: 0, // (0)
						y: 10, //APP.basketY/4, (10)
						z: 80, // Move camera. (80)

		        aspect: 45 //(45)
		    }

				// test camera
				/*camera: {
						x: 0,
						y: 100, //APP.basketY/4,
						z: -30, // Move camera.

		        aspect: 90
					}*/
		});

		// Add raycaster variable
    APP.raycaster = new THREE.Raycaster();

		APP.camera = APP.world.getCamera();
		APP.camera.lookAt(new THREE.Vector3(0, APP.basketY/2, -50));
		//APP.camera.lookAt(new THREE.Vector3(0, 0, -50));

		APP.createScene();
		APP.addLights();
		APP.addBasket();
		APP.addBall();
		// test
		APP.addHUD();
		APP.initEvents(); // 5

    // Start the loop.
    APP.keep_ball = keep_ball(APP);
    APP.world.addLoop(APP.keep_ball);
    APP.keep_ball.start();


		APP.world.start();

		APP.initMenu(); // 6
	},

	initEvents() {
	    EVENTS._move(APP);
	    EVENTS._click(APP);
	    EVENTS._keypress(APP);
	    EVENTS._resize(APP);
			EVENTS._scroll(APP);
	},

  updateCoords(e) {
	    e.preventDefault();

	    APP.cursor.x = e.touches && e.touches[0] ? e.touches[0].clientX : e.clientX;
	    APP.cursor.y = e.touches && e.touches[0] ? e.touches[0].clientY : e.clientY;
	},

	checkKeys(e) {
    	e.preventDefault();
			console.log("Key pressed!");
			console.log(e.code);
    	if (e.code === "Space") APP.thrown = false;
			if(e.code === "KeyA") {
				if(!APP.controlsEnabled){
						APP.controlsEnabled = true;
				}
				else {
					APP.controlsEnabled = false;
				}
			};
			if(e.code === "ArrowUp" || e.code==="ArrowDown"){
				if(e.code === "ArrowUp"){
					console.log(APP.force.m);
					console.log(APP.hudHeight);
					APP.force.m += 50;
					APP.hudHeight += 5;
					APP.world.remove(APP.hud);
					APP.addHUD();
					//APP.hud.resetHeight(APP.hudHeight);
					//APP.hud.height.set(APP.hud.height+1);
				}
				else{
					APP.force.m -= 50;
					APP.hudHeight -= 5;
					APP.world.remove(APP.hud);
					APP.addHUD();
					//APP.hud.resetHeight(APP.hudHeight);
					//APP.hud.height.set(APP.hud.height-1);
				}
				if(APP.force.m === 2400){
					//APP.hud.color.set(0x68cc3d);
					APP.hudColor = 0x68cc3d;
					APP.world.remove(APP.hud);
					APP.addHUD();
				}
				else {
					//APP.hud.color.set(0xe0ed2f);
					APP.hudColor = 0xe0ed2f;
					APP.world.remove(APP.hud);
					APP.addHUD();
				}
			}
			if(e.code === "KeyQ"){
				console.log("HELP camera angle");
				console.log(getCameraAngle());
				console.log(getCameraPos());
				console.log(Math.cos(getCameraAngle().x));
				console.log(Math.sin(getCameraAngle().x));
				/*console.log("HELP mouse position");
				console.log(APP.cursor.x);
				console.log(APP.cursor.xCenter);
				console.log(APP.cursor.y);
				console.log(APP.cursor.yCenter);*/
			}
  	},

	checkScroll(){
		e.preventDefault();
		console.log("SCROLL");
	},

  detectDoubleTap() {
		if(APP.controlsEnabled){
			if (!APP.doubletap) { // Wait for second click.
	      	APP.doubletap = true;

	      	setTimeout(() => {
	      	  	APP.doubletap = false;
	      	}, APP.doubleTapTime);

	      	return false;
	    } else { // Double tap triggered.
	    	APP.thrown = false;
	      	APP.doubletap = true;

	      	return true;
	    }
		}
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
				color: APP.bgColor,
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
				color: APP.bgColor,
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

		//APP.ground.__params.material.map = WHS.texture('textures/floor.png', {repeat: {y: 4, x: 10}});
		APP.ground.addTo(APP.world);
		APP.wall.position.y = 180;
    APP.wall.position.z = -APP.basketDistance-20;
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
				tube: APP.basketTubeRadius,
				radialSegments: 16,
				tubularSegments: 16
			},

			mass: 0,

			shadow: {
				cast: false
			},

			material: {
				kind: 'standard',
				color: APP.basketColor,
				metalness: 0.8,
				roughness: 0.5,
				emissive: 0xffccff,
				emissiveIntensity: 0.2
			},

			pos: {
				y: APP.basketY,
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
				width: 41,
				depth: 1,
				height: 28
			},

			mass: 0,

			material: {
				kind: 'standard',
				map: WHS.texture('textures/backboard.jpg'),
				normalScale: new THREE.Vector2(.3, .3),
				metalness: 0,
				roughness:0.3
			},

			pos: {
				y:APP.basketY + 10,
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
				height: APP.basketY + 35
			},

			shadow: {cast: true},

			mass: 0,

			material: {
				kind: 'standard',
				color: 0xcccccc,
				//map: WHS.texture('textures/backboard.jpg'),
				normalScale: new THREE.Vector2(.3, .3),
				metalness: 0,
				roughness:0.3
			},

			pos: {
				y: 0, //APP.basketY, // + 10,
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
		        heightSegments: APP.isMobile ? 2 : 3,
		        radiusSegments: APP.isMobile ? 8 : 16
		    },

      		shadow: {
        		cast: false
      		},

			physics: {
		        pressure: 2000,
		        friction: 0.02,
		        margin: 0.5,
		        anchorHardness: 0.5,
		        viterations: 2,
		        piterations: 2,
		        diterations: 4,
		        citerations: 0
		    },

		    mass: 30,
		    softbody: true,

		    material: {
		        map: WHS.texture('textures/net4.png', {repeat: {y: 2, x: 3}, offset: {y: 0.3}}), // 0.85, 19
		        transparent: true,
		        opacity: 0.7,
		        kind: 'basic',
		        side: THREE.DoubleSide,
		        depthWrite: false
		    },

		    pos: {
		        y: APP.basketY - 8,
		        z: APP.getBasketZ()
		    }

		});

		APP.net.addTo(APP.world);

		for (let i = 0; i < 16; i++) {
        	APP.net.appendAnchor(APP.world, APP.basket, i, 0.8, true);
      	}

	},

	addBall() {
		APP.ball = new WHS.Sphere({
			geometry: {
				buffer: true,
				radius: APP.ballRadius,
				widthSegments: 32,
				heightSegments: 32
			},

			mass: 120,

			material: {
				kind: 'phong',
				map: WHS.texture('textures/ball.png'),
				normalMap: WHS.texture('textures/ball_normal.png'),
				shininess: 20,
				reflectivity: 2,
				normalScale: new THREE.Vector2(.5,.5)
			},

			physics: {
				restitution: 3
			}
		});

		APP.ball.addTo(APP.world);
	},

	addHUD(){
		//const ratio = APP.camera.getNative().getFilmWidth() / APP.camera.getNative().getFilmHeight();
		APP.hud = new WHS.Cylinder({
			geometry: {
				buffer: true,
				radiusTop: 2,
				radiusBottom: 2,
				depth: 2,
				//height: APP.basketY * (APP.force.m / 4800)
				height: APP.hudHeight*2
			},

			shadow: {cast: true},

			mass: 0,

			material: {
				kind: 'standard',
				color: APP.hudColor, // 68cc3d (green) or cccccc or e0ed2f (yellow)
				//map: WHS.texture('textures/backboard.jpg'),
				normalScale: new THREE.Vector2(.3, .3),
				metalness: 0,
				roughness:0.3
			},

			pos: {
				y: -20, //APP.basketY, // + 10, or 0
				//y: ((APP.basketY + 35)/2)-this.height/2,
				z: APP.getBasketZ() - APP.getBasketRadius() -2
			},
		});

		APP.hud.addTo(APP.world);
		//APP.ProgressLoader.step();
		//var hudTexture = new THREE.Texture(hudCanvas);

	},

	throwBall(e) {
	    e.preventDefault();

	    if (!APP.detectDoubleTap() && APP.controlsEnabled && !APP.thrown) {
				const ang = getCameraAngle();
				const pos = getCameraPos();

				const F_LR = APP.force.xk * (APP.cursor.x - APP.cursor.xCenter);
				const F_UP = APP.force.y * APP.force.m;
				const F_FORWARD = APP.force.z * APP.force.m;

				const F_LR_ADJ = F_LR*Math.cos(ang.x) - F_FORWARD*Math.sin(ang.x);
				const F_UP_ADJ = F_UP;
				const F_FORWARD_ADJ = F_FORWARD*Math.cos(ang.x) - F_LR*Math.sin(ang.x);

	    	const vector = new THREE.Vector3(
	      	//APP.force.xk * (APP.cursor.x - APP.cursor.xCenter),
	      	//APP.force.y * APP.force.m,
	      	//APP.force.z * APP.force.m
					F_LR_ADJ,F_UP_ADJ,F_FORWARD_ADJ
      	);

      	APP.ball.setLinearVelocity(new THREE.Vector3(0, 0, 0)); // Reset gravity affect.

      	APP.ball.applyCentralImpulse(vector);

      	vector.multiplyScalar(10 / APP.force.m)
      	vector.y = vector.x;
      	vector.x = APP.force.y;
		    vector.z = 0;

		    APP.ball.setAngularVelocity(vector); // Reset gravity affect.
		    APP.thrown = true;
		    //APP.menu.attempts++;
	    }
	 },

	keepBall() {
	    const cursor = APP.cursor;
			const ang = getCameraAngle();
			const pos = getCameraPos();

	    //const x = (cursor.x - cursor.xCenter) / window.innerWidth * 32;
	    //const y = - (cursor.y - cursor.yCenter) / window.innerHeight * 32;
			const x = (cursor.x - cursor.xCenter) / window.innerWidth * 32;
			const y = - (cursor.y - cursor.yCenter) / window.innerHeight * 32;

	    APP.ball.position.set(pos.x+80*Math.sin(ang.x)+x*Math.cos(ang.x), y, pos.z-80*Math.cos(ang.x)+x*Math.sin(ang.x));
	},
};

const EVENTS = {
	_click(APP) {

    window.addEventListener('mouseup', APP.throwBall);
    window.addEventListener('mouseup', () => {
      const el = APP.world.getRenderer().domElement;

      if (!el.fullscreenElement && APP.isMobile) {
        if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        if (el.mozRequestFullscreen) el.mozRequestFullscreen();
        if (el.msRequestFullscreen) el.msRequestFullscreen();
        if (el.requestFullscreen) el.requestFullscreen();
      }
    });
  },

  _move(APP) {
    ['mousemove', 'touchmove'].forEach((e) => {
      window.addEventListener(e, APP.updateCoords);
    });
  },

  _keypress(APP) {
    window.addEventListener('keypress', APP.checkKeys);
  },

  _resize(APP) {
    APP.cursor.xCenter = window.innerWidth / 2;
    APP.cursor.yCenter = window.innerHeight / 2;

    window.addEventListener('resize', () => {
      const style = document.querySelector('.whs canvas').style;

      style.width = '100%';
      style.height = '100%';
    });
  },

	_scroll(APP){
		window.addEventListener('scroll',APP.checkScroll);
	}

}

const keep_ball = (APP) => {
  return new WHS.Loop(() => {
    if (!APP.thrown) APP.keepBall();

    const BLpos = APP.ball.position;
    const BSpos = APP.basket.position

    if (BLpos.distanceTo(BSpos) < APP.basketGoalDiff
      && Math.abs(BLpos.y - BSpos.y + APP.basketYDeep()) < APP.basketYGoalDiff()
      && !APP.goal) APP.onGoal(BLpos, BSpos);
  });
}


APP.init();

console.log( APP.world);

/*

var canvas = document.getElementsByTagName('body');
console.log(canvas);
var para = document.createElement('p');//, 'para');
var node = document.createTextNode("This is new.");
para.appendChild(node);
canvas.appendChild(para);
//canvas.height = 80%;
var ctx = canvas.getContext('2d');
ctx.font = "30px Arial";
ctx.fillText("Hello World", 0,0);
 // Start animations and physics simulation.

*/
