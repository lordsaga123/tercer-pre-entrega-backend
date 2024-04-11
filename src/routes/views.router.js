const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/view.controller.js");
const viewsController = new ViewsController();
const checkUserRole = require("../middleware/cheackrole.js");
const passport = require("passport");

router.get("/products", checkUserRole(['usuario']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts.bind(viewsController));

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario']) ,viewsController.renderChat);
router.get("/", viewsController.renderIndex);
router.get("/disconect", viewsController.renderDisconect);

/*router.get("/", passport.authenticate("jwt", { session: false }), viewsController.renderIndex.bind(viewsController));*/

module.exports = router;
