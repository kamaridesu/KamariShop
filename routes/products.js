const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { sql } = require("../configDB");
const util = require("util");
const { mkdir, rmdir, readdir, unlink } = require("../utility/utils");

router.get("/all", async (req, res) => {
  try {
    // if (req.user === null || req.user.role !== "admin") {
    //   return res.status(401).json();
    // }
    const response = await sql`select id, name, price, quantity, gender, color, description, isdeleted, array_agg(images.image) 
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

router.get("/product/:id", auth, async (req, res) => {
  try {
    if (req.user === null || req.user.role !== "admin") {
      return res.status(401).json({});
    }

    const product = {
      id: req.params.id,
    };

    let response;
    try {
      response = await sql`select id, name, price, quantity, gender, color, description, isdeleted, array_agg(images.image)
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

router.post("/create", auth, async (req, res) => {
  try {
    if (!isProductValid(req, res)) return;

    const id = await createProductTransaction(req);

    return res.json({ msg: "Product created succesfully", id });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.post("/update", auth, async (req, res) => {
  try {
    if (!isProductValid(req, res)) return;

    await updateProductTransaction(req);

    return res.status(200).json({ msg: "Product updated succesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

router.get("/delete/:id", auth, async (req, res) => {
  try {
    if (req.user === null || req.user.role !== "admin") {
      return res.status(401).json({});
    }

    const product = {
      id: req.params.id,
      isdeleted: true,
    };

    const response = await deleteProductTransaction(product, res);

    return res
      .status(200)
      .json({ msg: "Product deleted succesfully", response });
  } catch (error) {
    console.log(error);
    return res.status(500).send();
  }
});

const isProductValid = (req, res) => {
  if (req.user === null || req.user.role !== "admin") {
    res.status(401).json();

    return false;
  }

  if (req.files === null) {
    res.status(400).send({ msg: "Please upload some images" });

    return false;
  }

  const { name, price, description, quantity, color, gender } = req.body;

  let { files } = req.files;

  if (!name || !price || !description || !quantity || !color || !gender) {
    res.status(400).send({ msg: "Please fill and select all the fields" });

    return false;
  }

  return true;
};

const createProductTransaction = async (req) => {
  const { name, price, description, quantity, color, gender } = req.body;

  let { files } = req.files;

  if (!Array.isArray(files)) {
    files = [files];
  }

  return await sql.begin(async (sql) => {
    const create = await sql`INSERT INTO product ${sql(
      req.body,
      "name",
      "price",
      "quantity",
      "gender",
      "color",
      "description"
    )} RETURNING id`;

    let url;

    if (process.env.NODE_ENV === "PROD") {
      url = `/app/client/build/images/${create[0].id}`;
    } else {
      url = `./client/public/images/${create[0].id}`;
    }

    await mkdir(url);

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

const updateProductTransaction = async (req) => {
  const { id, name, price, description, quantity, color, gender } = req.body;

  let { files } = req.files;

  if (!Array.isArray(files)) {
    files = [files];
  }

  await sql.begin(async (sql) => {
    const update = await sql`UPDATE product set ${sql(
      req.body,
      "name",
      "price",
      "quantity",
      "gender",
      "color",
      "description"
    )} WHERE id = ${req.body.id} RETURNING *`;

    await sql`DELETE FROM images WHERE productid = ${update[0].id}`;

    let url;

    if (process.env.NODE_ENV === "PROD") {
      url = `/app/client/build/images/${update[0].id}`;
    } else {
      url = `./client/public/images/${update[0].id}`;
    }

    const currentFiles = await readdir(url);

    for (const file of currentFiles) {
      await unlink(`${url}/${file}`);
    }

    for (let i = 0; i < files.length; i++) {
      files[i].mv = util.promisify(files[i].mv);
      files[i].mv(`${url}/${files[i].md5}`);
      await sql`INSERT INTO images (productid, image) values (${
        update[0].id
      }, ${"/images/" + update[0].id + "/" + files[i].md5})`;
    }
  });
};

const deleteProductTransaction = async (product, res) => {
  return await sql.begin(async (sql) => {
    await sql`UPDATE product set ${sql(product, "isdeleted")} WHERE id = ${
      product.id
    }`;

    const response = await sql`select id, name, price, quantity, gender, color, description, isdeleted, array_agg(images.image) 
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
