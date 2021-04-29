import nodemailer from "nodemailer";
import fs from "fs";

const sendProducts = async (products) => {
  let userEmail = await fs.promises.readFile("correo.dat", "utf-8");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "test.01090902@gmail.com",
      pass: "thisisatest",
    },
  });

  let htmlText = "";

  products.forEach((product) => {
    htmlText += `
      <tr>
          <td>${product.nombre}</td>
          <td>$${product.precio}</td>
          <td>${product.descripcion}</td>
          <td>
              <img src=${product.url} alt="img"/>
          </td>
      </tr>`;
  });

  const mailOptions = {
    from: "test.01090902@gmail.com",
    to: userEmail,
    subject: "Listado De Productos",
    html: `<head><style>
    h2{color: #040036;}
    td{font-size: 14px; color: #040036; text-align:center;}
    img{width: 50px; height: 50px;}
    </style></head>
    <div>
    <h2>Listado de Productos:</h2>
    <table>
        <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Foto</th>
        </tr>
        ${htmlText}
    </table>
    </div>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return err;
    }
    console.log(info);
  });
};

export default { sendProducts };
