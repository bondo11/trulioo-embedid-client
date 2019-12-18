"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _truliooClient = _interopRequireDefault(require("./truliooClient.js"));

/*! trulioo-js  */
var truliooClient = new _truliooClient["default"]("PQoy64YSbLQR25aJ", "http://localhost:3222/generateAccessToken");
window.addEventListener("DOMContentLoaded", function () {
  var embedIDBackendURL = "http://localhost:8855/embedid/";
  var element = document.createElement('iframe');
  element.setAttribute('id', 'embedid-module');
  element.setAttribute('src', "".concat(embedIDBackendURL).concat(truliooClient.publicKey));
  document.getElementById('trulioo-embedid').appendChild(element);
  window.addEventListener('message', function _callee(e) {
    var originURL, response, accessToken;
    return _regenerator["default"].async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            originURL = 'http://localhost:8855'; //embedID BE URL

            if (!(e.origin === originURL)) {
              _context.next = 7;
              break;
            }

            _context.next = 4;
            return _regenerator["default"].awrap(fetch("".concat(truliooClient.accessTokenGeneratorURL)));

          case 4:
            response = _context.sent;
            accessToken = JSON.parse(response.data.AccessToken); //console.log('Sending Access Access Token fron client to EmbedID-BE:', accessToken);
            //e.source.postMessage(`Ihackedyou;D`, '*');
            //TODO change

            e.source.postMessage("".concat(accessToken), '*');

          case 7:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  var embedIDModule = document.getElementById("embedid-module");
  embedIDModule.style.width = "100%";
  embedIDModule.style.height = "100%";
  embedIDModule.border = "none";
}, false);