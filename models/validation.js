import Joi from "joi";

const validate = async (product) => {
  const productSchema = Joi.object({
    nombre: Joi.string().required(),
    precio: Joi.number().required(),
    descripcion: Joi.string().required(),
    url: Joi.string().required(),
  });

  const { error } = await productSchema.validateAsync(product);
  if (error) {
    return { result: false, error };
  } else {
    return { result: true };
  }
};

export default { validate };
