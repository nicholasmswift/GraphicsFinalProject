import * as THREE from 'three';

import {Shape} from '../core/Shape';
import {extend, loadMaterial} from '../extras/api';

class Ring extends Shape {
  constructor(params = {}) {
    super(params, 'ring');

    extend(params.geometry, {
      innerRadius: 0,
      outerRadius: 50,
      thetaSegments: 8,
      phiSegments: 8,
      thetaStart: 0,
      thetaLength: Math.PI * 2
    });

    if (params.build) {
      this.build(params);
      super.wrap('onlyvis');
    }
  }

  build(params = {}) {
    const material = loadMaterial(params.material);

    return new Promise((resolve) => {
      this.setNative(new THREE.Mesh(
        new THREE.RingGeometry(
          params.geometry.innerRadius,
          params.geometry.outerRadius,
          params.geometry.thetaSegments,
          params.geometry.phiSegments,
          params.geometry.thetaStart,
          params.geometry.thetaLength
        ),

        material
      ));

      resolve();
    });
  }

  buildGeometry(params = {}) {
    const GConstruct = params.buffer && !params.softbody ? THREE.RingBufferGeometry : THREE.RingGeometry;

    return new GConstruct(
      params.geometry.innerRadius,
      params.geometry.outerRadius,
      params.geometry.thetaSegments,
      params.geometry.phiSegments,
      params.geometry.thetaStart,
      params.geometry.thetaLength
    );
  }

  set G_innerRadius(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {innerRadius: val}}));
  }

  get G_innerRadius() {
    return this._native.geometry.parameters.innerRadius;
  }

  set G_outerRadius(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {outerRadius: val}}));
  }

  get G_outerRadius() {
    return this._native.geometry.parameters.outerRadius;
  }

  set G_thetaSegments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {thetaSegments: val}}));
  }

  get G_thetaSegments() {
    return this._native.geometry.parameters.thetaSegments;
  }

  set G_phiSegments(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {phiSegments: val}}));
  }

  get G_phiSegments() {
    return this._native.geometry.parameters.phiSegments;
  }

  set G_thetaStart(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {thetaStart: val}}));
  }

  get G_thetaStart() {
    return this._native.geometry.parameters.thetaStart;
  }

  set G_thetaLength(val) {
    this._native.geometry = this.buildGeometry(this.updateParams({geometry: {thetaLength: val}}));
  }

  get G_thetaLength() {
    return this._native.geometry.parameters.thetaLength;
  }

  clone() {
    return new Ring({build: false}).copy(this);
  }
}

export {
  Ring
};
