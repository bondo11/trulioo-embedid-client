"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var TruliooClient = function TruliooClient(publicKey, accessTokenGeneratorURL) {
  (0, _classCallCheck2["default"])(this, TruliooClient);
  this.publicKey = publicKey;
  this.accessTokenGeneratorURL = accessTokenGeneratorURL;
};

exports["default"] = TruliooClient;