import * as THREE from 'three';
import {Camera} from '../core/Camera';

class PerspectiveCamera extends Camera {
  constructor(params = {}) {
    super(params, 'perspectivecamera');

    this.build(params);
    super.wrap();
  }

  build(params = {}) {
    return new Promise((resolve) => {
      this.setNative(new THREE.PerspectiveCamera(
        params.camera.fov,
        params.camera.aspect,
        params.camera.near,
        params.camera.far
      ));

      resolve();
    });
  }
}

export {
  PerspectiveCamera
};
