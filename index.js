import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import model from "./models/products.js";
import validation from "./models/validation.js";
import fs from "fs";
import sendEmail from "./controllers/sendEmail.js";

//APP USE
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.static(process.cwd() + "\\styles"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//CHECK IF CORREO.DAT EXIST
const dir = "./correo.dat";
const myEmail = "debora.nrolon@gmail.com";

if (!fs.existsSync(dir)) {
  fs.writeFile(dir, myEmail, (err) => {
    if (err) {
      throw new err();
    }
  });
}

//HANDLEBARS CONFIG
app.engine("hbs", handlebars({ extname: ".hbs", defaultLayout: "index.hbs" }));
app.set("views", "./views");
app.set("view engine", "hbs");

//MONGO DB CONFIG
mongoose.connect(
  "mongodb+srv://admin-01090902:01090902@desafizzmod.kfd82.mongodb.net/firstdb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      throw new Error(`Database connection failed: ${err}`);
    } else {
      const server = app.listen(PORT, () => {
        console.log(`Server listening on port: ${server.address().port}`);
      });
      server.on("error", (error) => console.log(`Server error: ${error}`));
    }
  }
);

//ENDPOINTS
let products = [];

//GET FORM
app.get("/", (req, res) => {
  res.render("form", { products });
});

//POST PRODUCTS
app.post("/ingreso", async (req, res) => {
  try {
    let product = req.body;
    products.push(product);
    let val = await validation.validate(product);
    if (products.length % 10 === 0) {
      await sendEmail.sendProducts(products);
      console.log("SON 10");
    }
    if (val.result === true) {
      const newProduct = new model.product(product);
      console.log(product);
      newProduct.save((err) => {
        if (err) {
          throw new Error(`Database connection failed: ${err}`);
        } else {
          res.render("successfully");
        }
      });
    } else {
      console.log("NO FUNCA");
    }
  } catch (error) {
    console.log(error);
  }
});

//GET ALL PRODUCTS
app.get("/listar", async (req, res) => {
  try {
    products = await model.product.find({}).lean();
    res.render("list", { products });
  } catch (err) {
    res.send(`No hay productos para listar.`);
  }
});

//GET EMAIL
app.get("/set-correo", async (req, res) => {
  try {
    res.render("formEmail");
  } catch (err) {
    res.send(`No pudimos recibir la información: ${err}`);
  }
});

//GET EMAIL
app.post("/set-correo", async (req, res) => {
  try {
    let userEmail = req.body;
    let emailStr = JSON.stringify(userEmail);
    await fs.promises.writeFile("./correo.dat", emailStr);
    res.render("successfully");
  } catch (err) {
    res.send(`No se pudo realizar la acción. ${err}`);
  }
});
