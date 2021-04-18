const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { sql } = require("../configDB");
const util = require("util");
const fs = require("fs");
const { mkdir, rmdir, readdir, unlink } = require("../utility/utils");

if (process.env.NODE_ENV === "PROD") {
  console.log("products", fs.readdirSync("/"));
  console.log("products", fs.readdirSync("/app"));
  console.log("products", fs.readdirSync("./client"));
  console.log("products", fs.readdirSync("./client/build"));
  console.log("products", fs.readdirSync("./client/build/images"));
  console.log("products", __dirname);
}

router.get("/all", auth, async (req, res) => {
  try {
    if (req.user === null || req.user.role !== "admin") {
      return res.status(401).json();
    }
    const response = await sql`select id, name, price, quantity, gender, color, description, isdeleted, array_agg(images.image) 
        as images 
        from product 
        inner join images 
        on images.productid = product.id
        GROUP BY product.id;`;

    if (!response.count) {
      return res.status(400).json([]);
    }

    return res.json(response);
  } catch (err) {
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

    try {
      const response = await sql`select id, name, price, quantity, gender, color, description, isdeleted, array_agg(images.image)
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
      return res.status(400).json({
        msg: "Product with id: " + id + " does not exist",
        success: false,
      });
    }
    console.log("hi");
    return res.json(response);
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

router.post("/create", auth, async (req, res) => {
  try {
    if (!isProductValid(req, res)) return;

    await createProductTransaction(req);
    return res.json({ msg: "Product created succesfully" });
  } catch (err) {
    console.log(err);
    console.log(__dirname);
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

  await sql.begin(async (sql) => {
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
  });
};

module.exports = router;
