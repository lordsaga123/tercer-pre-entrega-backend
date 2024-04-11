const ProductModel = require("../dao/models/product.model.js");
const ProductServices = require("../services/productServices.js");
const productServices = new ProductServices
const CartServices = require("../services/cartServices.js");
const cartServices = new CartServices();

class ViewsController{
    
    async renderProducts (req, res) {
      try {
          const { page = 1, limit = 3 } = req.query;

          const skip = (page - 1) * limit;

          const productos = await ProductModel
              .find()
              .skip(skip)
              .limit(limit);

          const totalProducts = await ProductModel.countDocuments();

          const totalPages = Math.ceil(totalProducts / limit);

          const hasPrevPage = page > 1;
          const hasNextPage = page < totalPages;


          const nuevoArray = productos.map(producto => {
              const { _id, ...rest } = producto.toObject();
              return { id: _id, ...rest }; // Agregar el ID al objeto
          });

          let cartId = null; // Inicializamos cartId como null

          // Verificamos si req.user existe y tiene la propiedad cart
          if (req.user && req.user.cart) {
              cartId = req.user.cart.toString();
          }
  
          res.render("products", {
              productos: nuevoArray,
              hasPrevPage,
              hasNextPage,
              prevPage: page > 1 ? parseInt(page) - 1 : null,
              nextPage: page < totalPages ? parseInt(page) + 1 : null,
              currentPage: parseInt(page),
              totalPages,
              cartId
          });
  
      } catch (error) {
          console.error("Error al obtener productos", error);
          res.status(500).json({
              status: 'error',
              error: "Error interno del servidor"
          });
      }
  }/*{
        try {
           const { page = 1, limit = 3 } = req.query;
           const productos = await ProductModel.getProducts({
              page: parseInt(page),
              limit: parseInt(limit)
           });
     
           const nuevoArray = productos.docs.map(producto => {
              const { _id, ...rest } = producto.toObject();
              return rest;
           });
     
           res.render("products", {
              productos: nuevoArray,
              hasPrevPage: productos.hasPrevPage,
              hasNextPage: productos.hasNextPage,
              prevPage: productos.prevPage,
              nextPage: productos.nextPage,
              currentPage: productos.page,
              totalPages: productos.totalPages,
              user: req.session.user
           });
     
        } catch (error) {
           console.error("Error al obtener productos", error);
           res.status(500).json({
              status: 'error',
              error: "Error interno del servidor"
           });
        }
     };*/

     

async renderIndex (req, res) {
   try {
      const productos = await productServices.getProducts();
      const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
      });

      res.render("index", {
         productos: nuevoArray, 
      /*user: req.session.user*/ });

   } catch (error) {
      console.error("Error al obtener productos", error);
         res.status(500).json({
         error: "Error interno del servidor"
      });
   }
};


async renderCart (req, res){
   const cartId = req.params.cid;

   try {
      const carrito = await cartServices.getCarritoById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));


      res.render("carts", { productos: productosEnCarrito });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
}





//      USUARIOS

// Vista al perfil
async renderProfile (req, res) {
   res.render("profile", { user: req.session.user });
};

// Vista al Login
async renderLogin(req, res) {
    res.render("login");
};
async renderDisconect(req, res) {
   res.render("disconect");
};

// Vista a Registro
async renderRegister(req, res) {
    res.render("register");
};

// Vista a Productos en tiempo real
async renderRealTimeProducts(req, res) {
    try {
        res.render("realtimeproducts");
    } catch (error) {
        console.log("error en la vista real time", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

// Vista al Chat
async renderChat(req, res) {
    res.render("chat");
};

// Vista a Index
/*async renderIndex(req, res) {
    res.render("index");
};*/

}
module.exports = ViewsController





/*const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
   try {
      const productos = await productManager.getProducts();
   
      const nuevoArray = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
      });

      res.render("index", {
            productos: nuevoArray,
            user: req.session.user
      });
   } catch (error) {
      console.error("Error al obtener productos", error);
         res.status(500).json({
         error: "Error interno del servidor"
      });
   }
})

router.get("/products", async (req, res) => {
   try {
      const { page = 1, limit = 3 } = req.query;
      const productos = await productManager.getProducts({
         page: parseInt(page),
         limit: parseInt(limit)
      });

      const nuevoArray = productos.docs.map(producto => {
         const { _id, ...rest } = producto.toObject();
         return rest;
      });

      res.render("products", {
         productos: nuevoArray,
         hasPrevPage: productos.hasPrevPage,
         hasNextPage: productos.hasNextPage,
         prevPage: productos.prevPage,
         nextPage: productos.nextPage,
         currentPage: productos.page,
         totalPages: productos.totalPages,
         user: req.session.user
      });

   } catch (error) {
      console.error("Error al obtener productos", error);
      res.status(500).json({
         status: 'error',
         error: "Error interno del servidor"
      });
   }
});

router.get("/carts/:cid", async (req, res) => {
   const cartId = req.params.cid;

   try {
      const carrito = await cartManager.getCarritoById(cartId);

      if (!carrito) {
         console.log("No existe ese carrito con el id");
         return res.status(404).json({ error: "Carrito no encontrado" });
      }

      const productosEnCarrito = carrito.products.map(item => ({
         product: item.product.toObject(),
         quantity: item.quantity
      }));


      res.render("carts", { productos: productosEnCarrito });
   } catch (error) {
      console.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
   }
});




//      USUARIOS

// Ruta para el formulario de login
router.get("/login", (req, res) => {
   res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
   res.render("register");
});

// Ruta para la vista de perfil
router.get("/profile", (req, res) => {
   res.render("profile", { user: req.session.user });
});
module.exports = router; */