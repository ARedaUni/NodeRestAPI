const express = require("express");
const router = express.Router();
const albumController = require('../controllers/albumController')
const validateToken = require("../middleware/validateTokenHandler");


//routes for album operations
router.get("/", validateToken, albumController.accessAlbum);
router.post("/", albumController.createAlbum);
router.delete("/", albumController.deleteAlbum);

//routes for images of a chosen album
router.get("/:id/images", validateToken, albumController.getAlbumImages);
router.post("/:id/images", validateToken, albumController.createAlbumImage);
router.delete("/:id/images", albumController.deleteAlbumImage);


module.exports = router