import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new Schema({
  nombre: String,
  precio: Number,
  descripcion: String,
  url: String,
});

const product = mongoose.model("products", productSchema);

export default { product };
