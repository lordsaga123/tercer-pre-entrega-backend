const express = require("express");
const app = express();
const exphbs = require ("express-handlebars");
const cookieParser = require("cookie-parser");
//Passport: 
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const PUERTO = 8080;
require("./database.js");

/*const session = require("express-session");
const MongoStore = require("connect-mongo");*/

const socket = require("socket.io");

/*const ProductServices = require("./services/productServices.js");
const CartServices = require('./services/cartServices.js');
const ProductController = require('./controllers/product.Controller.js');
const CartController = require('./controllers/cart.Controller.js');*/

// Nuevas instancias de las Clases
/*const productServices = new ProductServices()
const cartServices = new CartServices()
const productController = new ProductController()
const cartController = new CartController()*/

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
/*const sessionRouter = require("./routes/sessions.router.js");*/

// Variables de entorno
const configObject = require("./config/config.js")
const { mongo_url } = configObject

//Middleware
app.use(express.urlencoded({extended : true}));
app.use(express.json());
app.use(express.static("./src/public"));

//PASSPORT
app.use(cookieParser());
app.use(passport.initialize());
initializePassport();

/*app.use(passport.session())*/
/*app.use(session({
    secret: "CookieFirmadaCorrectamente",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://luisjaimevaz:Oliver2017@cluster0.qhzsnxj.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0",
        ttl: 11200
    })
    
    //"mongodb+srv://luisjaimevaz:Oliver2017@cluster0.qhzsnxj.mongodb.net/e-commerce?retryWrites=true&w=majority&appName=Cluster0"

}))*/



//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);


//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Rutas
/*app.use("/", require("./routes/views.router.js")(productServices, cartServices));
app.use("/api/products", require("./routes/products.router.js")(productController));
app.use("/api/carts/", require("./routes/carts.router.js")(cartController));
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);*/

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
/*app.use("/api/sessions", sessionRouter);*/




const httpServer = app.listen(PUERTO, ()=> {
    console.log(`Escuchando en el Puerto ${PUERTO}`);
})


//Chat del E-Commerce
const MessageModel = require("./dao/models/message.model.js");
const io = new socket.Server(httpServer);


io.on("connection",  (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {

        await MessageModel.create(data);
        
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
     
    })
})








/*
//Obtengo el array de productos:
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");


const io = socket(server);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");

    //Enviamos el array de productos al cliente que se conectó:
    socket.emit("productos", await productManager.getProducts());    
    
    //Recibimos el evento "eliminarProducto" desde el cliente:
    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        //Enviamos el array de productos actualizado a todos los productos:
        io.sockets.emit("productos", await productManager.getProducts());
    });

    //Recibimos el evento "agregarProducto" desde el cliente:
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        //Enviamos el array de productos actualizado a todos los productos:
        io.sockets.emit("productos", await productManager.getProducts());
    });
});*/
