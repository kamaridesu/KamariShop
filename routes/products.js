const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { sql } = require("../configDB");
const util = require("util");
const { mkdir, rmdir, readdir, unlink } = require("../utility/utils");

//ruta para obtener todos los productos que no esten en estado eliminado
router.get("/all", async (req, res) => {
  try {
    const response =
      await sql`select id, name, price, stock, gender, color, description, isdeleted, array_agg(images.image) 
        as images 
        from product 
        inner join images 
        on images.productid = product.id
        where isdeleted = false
        GROUP BY product.id;`;

    if (!response.count) {
      return res.status(400).json({ response: [] });
    }

    return res.json({ response });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para obtener un producto segun id
router.get("/product/:id", async (req, res) => {
  try {
    const product = {
      id: req.params.id,
    };

    let response;
    try {
      response =
        await sql`select id, name, price, stock, gender, color, description, isdeleted, array_agg(images.image)
        as images
        from product
        inner join images
        on images.productid = product.id
        WHERE id = ${product.id}
        GROUP BY product.id;`;
    } catch (error) {
      return res.status(404).json({});
    }

    if (!response.count) {
      return res.status(404).json({});
    }

    return res.json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para crear un producto desde el panel de admin
router.post("/create", auth, async (req, res) => {
  try {
    // se comprueba si los campos son validos
    if (!isProductValid(req, res)) return;

    //si son validos ejecutamos la transaction
    const id = await createProductTransaction(req);

    return res.json({ msg: "Product created succesfully", id });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para actualizar el producto
router.post("/update", auth, async (req, res) => {
  try {
    // se comprueba si los campos son validos
    if (!isProductValid(req, res)) return;

    //si son validos ejecutamos la transaction
    await updateProductTransaction(req);

    return res.status(200).json({ msg: "Product updated succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para eliminar un producto segun el id
router.get("/delete/:id", auth, async (req, res) => {
  try {
    //validamos que el usuario es un admin
    if (req.user === null || req.user.role !== "admin") {
      return res.status(401).json({});
    }

    const product = {
      id: req.params.id,
      isdeleted: true,
    };

    //ejecutamos la transaction
    const response = await deleteProductTransaction(product, res);

    return res
      .status(200)
      .json({ msg: "Product deleted succesfully", response });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para obtener la lista de deseos segun el usuario
router.get("/wishlisted", auth, async (req, res) => {
  try {
    //verificamos que hay un usuario logueado
    if (req.user === null) {
      return res.status(401).json({});
    }

    //obtenemos los productos en la lista
    const response =
      await sql`SELECT * FROM wishlist join product on product.id = productid WHERE userid = ${req.user.id}`;

    if (!response.count) {
      return res.json({ response: [] });
    }

    return res.json({ response: response.map((v) => v.productid) });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para obtener la cesta segun el usuario
router.get("/basket", auth, async (req, res) => {
  try {
    //verificamos que hay un usuario logueado
    if (req.user === null) {
      return res.status(401).json({});
    }

    //obtenemos los productos en la cesta
    const response = await sql`
    SELECT productid, basket.quantity FROM basket 
    join product on product.id = productid
    WHERE userid = ${req.user.id}`;

    if (!response.count) {
      return res.json({ response: [] });
    }

    return res.json({ response });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para realizar operaciones crud de la cesta
router.post("/basket/:operation/", auth, async (req, res) => {
  try {
    //verificamos que hay un usuario logueado
    if (req.user === null) {
      return res.status(401).json({});
    }

    const row = {
      userid: req.user.id,
      productid: req.body.id,
      quantity: req.body.quantity,
    };

    // agregamos en la cesta en caso de que exista producto hacemos un update a la cantidad
    if (req.params.operation === "add") {
      await sql`INSERT INTO basket ${sql(
        row,
        "userid",
        "productid",
        "quantity"
      )} ON CONFLICT (userid, productid) DO UPDATE SET quantity = ${
        row.quantity
      }`;

      return res.json({});
    } else if (req.params.operation === "remove") {
      //si la cantidad es distinta a cero hacemos un update al producto
      if (row.quantity !== 0) {
        await sql`UPDATE basket SET ${sql(row, "quantity")} WHERE userid = ${
          row.userid
        } and productid = ${row.productid}`;
      } else {
        // si es 0 eliminamos el producto de la cesta
        await sql`DELETE FROM basket WHERE userid = ${row.userid} and productid = ${row.productid}`;
      }
      return res.json({});
    }

    return res.status(400).json({});
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//ruta para realizar operaciones crud de la lista de deseos
router.post("/wishlist/:id/:operation", auth, async (req, res) => {
  try {
    //verificamos que hay un usuario logueado
    if (req.user === null) {
      return res.status(401).json({});
    }

    const row = {
      userid: req.user.id,
      productid: req.params.id,
    };

    const response = await sql`SELECT * FROM wishlist`;

    if (req.params.operation === "add") {
      //agregamos a la tabla el producto
      await sql`INSERT INTO wishlist ${sql(row, "userid", "productid")}`;
    } else {
      //eliminamos el producto de la tabla
      await sql`DELETE FROM wishlist WHERE userid = ${row.userid} AND productid = ${row.productid}`;
    }

    return res.json({});
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

//function de validar producto en el formulario
const isProductValid = (req, res) => {
  //validamos que el usuario es un admin
  if (req.user === null || req.user.role !== "admin") {
    res.status(401).json();
    return false;
  }

  //verificamos que haya foto(s) subida(s)
  if (req.files === null) {
    res.status(400).send({ msg: "Please upload some images" });

    return false;
  }

  const { name, price, description, stock, color, gender } = req.body;

  let { files } = req.files;

  //verificamos los campos que no esten vacios
  if (!name || !price || !description || !stock || !color || !gender) {
    res.status(400).send({ msg: "Please fill and select all the fields" });
    return false;
  }

  return true;
};

//funcion de crear producto mediante transaccion
const createProductTransaction = async (req) => {
  const { name, price, description, stock, color, gender } = req.body;

  let { files } = req.files;

  if (!Array.isArray(files)) {
    files = [files];
  }

  //iniciamos la transaccion
  return await sql.begin(async (sql) => {
    //insertamos producto
    const create = await sql`INSERT INTO product ${sql(
      req.body,
      "name",
      "price",
      "stock",
      "gender",
      "color",
      "description"
    )} RETURNING id`;

    let url;

    if (process.env.NODE_ENV === "PROD") {
      url = `./client/build/images/${create[0].id}`;
    } else {
      url = `./client/public/images/${create[0].id}`;
    }

    //creamos directorio
    await mkdir(url);

    //insertamos la imagen en la carpeta y en la tabla de imagenes
    for (let i = 0; i < files.length; i++) {
      files[i].mv = util.promisify(files[i].mv);
      await files[i].mv(`${url}/${files[i].md5}`);
      await sql`INSERT INTO images (productid, image) values (${
        create[0].id
      }, ${"/images/" + create[0].id + "/" + files[i].md5})`;
    }
    return create[0].id;
  });
};

//funcion de actualizar producto mediante transaccion
const updateProductTransaction = async (req) => {
  const { id, name, price, description, stock, color, gender } = req.body;

  let { files } = req.files;

  if (!Array.isArray(files)) {
    files = [files];
  }

  //iniciamos la transaccion
  await sql.begin(async (sql) => {
    //actualizamos el producto
    const update = await sql`UPDATE product set ${sql(
      req.body,
      "name",
      "price",
      "stock",
      "gender",
      "color",
      "description"
    )} WHERE id = ${req.body.id} RETURNING *`;

    //eliminamos las imagenes del producto
    await sql`DELETE FROM images WHERE productid = ${update[0].id}`;

    let url;

    if (process.env.NODE_ENV === "PROD") {
      url = `./client/build/images/${update[0].id}`;
    } else {
      url = `./client/public/images/${update[0].id}`;
    }

    //accedemos a los archivos del directorio
    const currentFiles = await readdir(url);

    //eliminamos las imagenes
    for (const file of currentFiles) {
      await unlink(`${url}/${file}`);
    }

    //insertamos la imagen en la carpeta y en la tabla de imagenes
    for (let i = 0; i < files.length; i++) {
      files[i].mv = util.promisify(files[i].mv);
      files[i].mv(`${url}/${files[i].md5}`);
      await sql`INSERT INTO images (productid, image) values (${
        update[0].id
      }, ${"/images/" + update[0].id + "/" + files[i].md5})`;
    }
  });
};

//funcion de eliminar producto mediante transaccion
const deleteProductTransaction = async (product, res) => {
  return await sql.begin(async (sql) => {
    //eliminamos el producto
    await sql`UPDATE product set ${sql(product, "isdeleted")} WHERE id = ${
      product.id
    }`;

    const response =
      await sql`select id, name, price, stock, gender, color, description, isdeleted, array_agg(images.image) 
        as images 
        from product 
        inner join images 
        on images.productid = product.id
        where isdeleted = false
        GROUP BY product.id;`;

    if (!response.count) {
      return res.status(400).json({ response: [] });
    }

    return response;
  });
};

module.exports = router;
