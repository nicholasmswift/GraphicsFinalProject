const GAME = new WHS.World({
  stats: 'fps', // fps, ms, mb
  autoresize: "window",
  softbody: true,

  gravity: {
    x: 0,
    y: -9.8,
    z: 0
  },

  camera: {
    far: 10000,
    y: 100,
    z: 300
  },

  shadowmap: {
    type: THREE.PCFSoftShadowMap
  },

  background: {
    color: 0xaaaaaa
  }
});

const arm = new WHS.Box({ // Rigidbody (green).
  geometry: {
    width: 160,
    height: 12, 
    depth: 12
  },

  mass: 0,

  material: {
    color: 0x00ff00
  },

  pos: {
    y: 130,
    z: 30
  }
});

arm.addTo(GAME);

const cloth = new WHS.Tube({ // Softbody (blue).
  geometry: {
    path: new THREE.LineCurve3(new THREE.Vector3(0, 90, 0), new THREE.Vector3(0, 70, 0)),
    segments: 20,
    radius: 12,
    radiusSegments: 8,
    closed: false
  },

  mass: 10,
  softbody: true,

  material: {
    color: 0x0000ff,
    kind: 'phong',
    side: THREE.DoubleSide
  }
});

cloth.addTo(GAME);

cloth.appendAnchor(GAME, arm, 0, 1, false);
cloth.appendAnchor(GAME, arm, 20, 1, false);

new WHS.Box({ // Rigidbody (green).
  geometry: {
    width: 72,
    height: 72, 
    depth: 72
  },

  mass: 10,

  material: {
    color: 0x00ff00
  },

  pos: {
    y: 36
  }
}).addTo(GAME);

new WHS.Box({
  geometry: {
    width: 2500,
    height: 1,
    depth: 2500
  },

  mass: 0,

  material: {
    color: 0xff0000,
    kind: 'phong'
  },

  pos: {
    x: 0,
    y: -20,
    z: 0
  }
}).addTo(GAME);

new WHS.DirectionalLight({
  light: {
    color: 0xffffff, // 0x00ff00,
    intensity: 1
  },

  pos: {
    x: 0,
    y: 10,
    z: 30
  },

  target: {
    x: 0,
    y: 0,
    z: 0
  }
}).addTo(GAME);

new WHS.AmbientLight({
  light: {
    color: 0xffffff,
    intensity: 0.5
  }
}).addTo(GAME);

GAME.setControls(WHS.orbitControls());
GAME.start();
