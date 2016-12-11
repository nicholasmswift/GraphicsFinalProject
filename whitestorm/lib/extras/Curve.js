'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Curve = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _three = require('three');

var THREE = _interopRequireWildcard(_three);

var _api = require('./api');

var _Object = require('../core/Object');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Curve = function (_WHSObject) {
  (0, _inherits3.default)(Curve, _WHSObject);

  /**
   * Create curve.
   *
   * Todo
   */

  function Curve(params) {
    var _ret;

    (0, _classCallCheck3.default)(this, Curve);

    var _this = (0, _possibleConstructorReturn3.default)(this, Object.getPrototypeOf(Curve).call(this, {
      curve: false,
      points: 50
    }));

    (0, _get3.default)(Object.getPrototypeOf(Curve.prototype), 'setParams', _this).call(_this, params);

    var geometry = new THREE.Geometry();
    geometry.vertices = params.curve.getPoints(params.points);

    var curve = new THREE.Line(geometry, (0, _api.loadMaterial)(params.material)._material);

    _this.setNative(curve);

    var scope = Object.assign(_this, {
      _type: 'curve'
    });

    scope.setNative(param.curve);

    return _ret = scope, (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  /**
   * Add curve to scene.
   */


  (0, _createClass3.default)(Curve, [{
    key: 'addTo',
    value: function addTo(parent) {
      var _scope = this;
      _scope.parent = parent;

      return new Promise(function (resolve, reject) {
        try {
          _scope.parent.getScene().add(_scope.getNative());
          _scope.parent.children.push(_scope);
        } catch (err) {
          console.error(err.message);
          reject();
        } finally {
          if (defaults.debug) {
            console.debug('@WHS.Curve: Curve ' + _scope._type + ' was added to world.', [_scope, _scope.parent]);
          }

          resolve(_scope);
        }
      });
    }

    /**
     * Clone curve.
     */

  }, {
    key: 'clone',
    value: function clone() {
      return new Curve(this.__params).copy(this);
    }

    /**
     * Copy curve.
     *
     * @param {WHS.Curve} source - Source object, that will be applied to this.
     */

  }, {
    key: 'copy',
    value: function copy(source) {
      this.setNative(source.getNative().clone());

      this._type = source._type;

      return this;
    }

    /**
     * Remove this curve from world.
     *
     * @return {WHS.Curve} - this.
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.parent.getScene().remove(this.getNative());

      this.parent.children.splice(this.parent.children.indexOf(this), 1);
      this.parent = null;

      this.emit('remove');

      if (defaults.debug) {
        console.debug('@WHS.Curve: Curve ' + this._type + ' was removed from world', [_scope]);
      }

      return this;
    }
  }]);
  return Curve;
}(_Object.WHSObject);

exports.Curve = Curve;
//# sourceMappingURL=Curve.js.map
