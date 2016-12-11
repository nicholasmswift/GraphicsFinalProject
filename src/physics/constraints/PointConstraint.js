import {convertWorldPositionToObject, getObjectId} from '../api';

export class PointConstraint {
  constructor(obja, objb, position) {
    const objecta = obja.getNative();
    let objectb = obja.getNative();

    if (position === undefined) {
      position = objectb;
      objectb = undefined;
    }

    this.type = 'point';
    this.appliedImpulse = 0;
    this.id = getObjectId();
    this.objecta = objecta._physijs.id;
    this.positiona = convertWorldPositionToObject(position, objecta).clone();

    if (objectb) {
      this.objectb = objectb._physijs.id;
      this.positionb = convertWorldPositionToObject(position, objectb).clone();
    }
  }

  getDefinition() {
    return {
      type: this.type,
      id: this.id,
      objecta: this.objecta,
      objectb: this.objectb,
      positiona: this.positiona,
      positionb: this.positionb
    };
  }
}
