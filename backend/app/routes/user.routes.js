const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const express = require("express");
const app = express();
const multer = require('multer');
const fs = require('fs');
const path = require("path");

var dir = './uploads';
var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }
  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.mp4') {
      return callback(null, false)
    }
    callback(null, true)
  }
});

module.exports = function (app) {
  // app.use(function (req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user/getissue", controller.getuserBoard);

  app.post("/api/test/user/addissue" ,upload.any(), controller.adduserBoard);
  app.post("/api/test/user/updateissue",upload.any(), controller.updateuserBoard);
  app.post("/api/test/user/deleteissue" ,controller.deleteuserBoard);

  app.get("/api/test/admin", [authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
};