import React, { useState, useEffect } from "react";
import styles from "./ProductForm.Module.scss";
import { AiOutlineCloudUpload, AiOutlinePlus } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { FormMsg } from "../../Errors/FormMsg";
import TextareaAutosize from "react-textarea-autosize";
import { useHistory, useParams } from "react-router";
import useQuery from "../../Hooks/useQuery";

export const ProductForm = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState({ msg: "", status: null });
  const history = useHistory();
  const { loading, data, status, setApiOptions } = useQuery({
    url: id ? `/api/products/product/${id}` : null,
    method: "GET",
  });

  useEffect(() => {
    if (loading === false && data.msg) {
      if (status === 200 && data.id) {
        history.push(`/products/editproduct/${data.id}`);
        setMessage({ msg: data.msg, status: status });
        return;
      }
      setMessage({ msg: data.msg, status: status });
      return;
    }
    if (loading === false && id && data[0].id) {
      setName(data[0].name);
      setPrice(data[0].price);
      setDescription(data[0].description);
      setQuantity(data[0].quantity);
      setGender(data[0].gender);
      setColor(data[0].color);
      data[0].images.forEach((url) => {
        fetch(`${url}`, { method: "GET" })
          .then((response) => response.blob())
          .then((blob) => {
            blob.url = URL.createObjectURL(blob);
            setFiles((prev) => [...prev, blob]);
          });
      });
    }
  }, [loading]);

  const handleImages = async (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      file.url = URL.createObjectURL(file);
      setFiles([...files, file]);
    }
  };

  const handleSubmit = async () => {
    let formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("color", color);
    formData.append("gender", gender);

    if (id) {
      formData.append("id", id);
      setApiOptions({
        url: `/api/products/update`,
        method: "POST",
        body: formData,
      });
    } else {
      setApiOptions({
        url: `/api/products/create`,
        method: "POST",
        body: formData,
      });
    }
  };

  return (
    <div>
      <div className={styles.msg}>
        {message.msg && (
          <FormMsg msg={message} clear={() => setMessage({ msg: null })} />
        )}
      </div>
      <div className={styles.container}>
        <div>
          <div>
            {files.length > 0 && <Images files={files} setIndex={setIndex} />}
            {files.length > 0 && files.length < 4 && (
              <label htmlFor="input">
                <AiOutlinePlus />
              </label>
            )}
          </div>
          <div>
            <input
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              onChange={handleImages}
              id="input"
            />
            {files.length === 0 ? (
              <label htmlFor="input">
                <AiOutlineCloudUpload />
              </label>
            ) : (
              <Preview
                files={files}
                setFiles={setFiles}
                setIndex={setIndex}
                index={index}
              />
            )}
          </div>
        </div>
        <div>
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label>Price</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label>Quantity</label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label>Description</label>
            <TextareaAutosize
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div>
            <label>Select Gender</label>
            <div>
              <div
                className={gender === "man" ? styles.genderActive : null}
                onClick={() => setGender("man")}
              >
                Man
              </div>
              <div
                className={gender === "female" ? styles.genderActive : null}
                onClick={() => setGender("female")}
              >
                Female
              </div>
            </div>
          </div>
          <div>
            <Colors color={color} setColor={setColor} />
          </div>
          <div>
            <button onClick={(e) => handleSubmit()}>
              {id ? "UPDATE PRODUCT" : "CREATE PRODUCT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Colors = ({ color, setColor }) => {
  const colors = [
    "white",
    "silver",
    "gray",
    "black",
    "red",
    "maroon",
    "yellow",
    "olive",
    "lime",
    "green",
    "aqua",
    "teal",
    "blue",
    "navy",
    "fuchsia",
    "purple",
  ];

  return colors.map((el, index) => {
    return (
      <button
        key={index}
        className={color === el ? styles.active : null}
        onClick={() => setColor(el)}
      >
        <div style={{ backgroundColor: el }}></div>
      </button>
    );
  });
};

const Images = ({ files, setIndex }) => {
  return files.map((file, index) => {
    return (
      <label key={`${file.name}-${index}`}>
        <img src={file.url} alt={file.name} onClick={() => setIndex(index)} />
      </label>
    );
  });
};

const Preview = ({ files, setFiles, setIndex, index }) => {
  return (
    <>
      <button
        onClick={() => {
          setFiles(files.filter((el, i) => i !== index));
          setIndex(0);
        }}
      >
        <BsFillTrashFill />
      </button>
      <img src={files[index].url} alt="" />
    </>
  );
};
