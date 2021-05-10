import React, { useEffect, useState } from "react";
import { FormMsg } from "../../Errors/FormMsg";
import styles from "./ProfileForm.Module.scss";
import { Input, Select } from "antd";
import { useAuth } from "../../Context/AuthContextProvider";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import confirm from "antd/lib/modal/confirm";
import { useHistory } from "react-router-dom";

const { Option } = Select;

export const ProfileForm = () => {
  const [message, setMessage] = useState({ msg: "", status: null });
  const [name, setName] = useState("");
  const [surnames, setSurnames] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [postcode, setPostcode] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  const [nameError, setNameError] = useState("");
  const [surnamesError, setSurnamesError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [postcodeError, setPostcodeError] = useState("");
  const [cityError, setCityError] = useState("");
  const [districtError, setDistrictError] = useState("");

  const { setAuth, auth } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (auth.user != null) {
      setName(auth.user.name);
      setSurnames(auth.user.surnames);
      setAddress(auth.user.address);
      setPhone(auth.user.phone);
      setPostcode(auth.user.postcode);
      setCity(auth.user.city);
      setDistrict(auth.user.district);
    }
  }, [auth]);

  const comunidades = [
    "Andalucia",
    "Aragon",
    "Asturias",
    "Baleares",
    "Canarias",
    "Cantabria",
    "CastillaLeon",
    "CastillaMancha",
    "Cataluña",
    "Valencia",
    "Extremadura",
    "Galicia",
    "Madrid",
    "Murcia",
    "Navarra",
    "PaisVasco",
    "Rioja",
    "Ceuta",
    "Melilla",
  ];

  const validate = () => {
    let nameError = "";
    let surnamesError = "";
    let emailError = "";
    let passwordError = "";
    let addressError = "";
    let phoneError = "";
    let postcodeError = "";
    let cityError = "";
    let districtError = "";

    const namePattern = /^[a-zA-ZÁ-ýÀ-ỳ\']{1,}\s?[a-zA-ZÁ-ýÀ-ỳ\']{0,}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!name) {
      nameError = "Name cannot be blank";
    }

    if (name && !name.match(namePattern)) {
      nameError = "Invalid name";
    }

    if (!surnames) {
      surnamesError = "Surnames cannot be blank";
    }

    if (surnames && !surnames.match(namePattern)) {
      surnamesError = "Invalid Surname'(s)";
    }

    if (email && !email.includes("@")) {
      emailError = "Invalid email";
    }

    if (password && !password.match(passwordPattern)) {
      passwordError =
        "You must include at least 8 characters, including upper and lowercase letters, one number and a special character";
    }

    if (!address) {
      addressError = "Adress cannot be blank";
    }

    if (!phone) {
      phoneError = "Phone cannot be blank";
    }

    if (phone && phone.length !== 9) {
      phoneError = "Phone must be 9 numbers";
    }

    if (!postcode) {
      postcodeError = "Postcode cannot be blank";
    }

    if (postcode && postcode.length !== 5) {
      postcodeError = "Postcode must be 5 numbers";
    }

    if (!city) {
      cityError = "City cannot be blank";
    }

    if (!district) {
      districtError = "District cannot be blank";
    }

    if (
      nameError ||
      surnamesError ||
      emailError ||
      passwordError ||
      addressError ||
      phoneError ||
      postcodeError ||
      cityError ||
      districtError
    ) {
      setNameError(nameError);
      setSurnamesError(surnamesError);
      setEmailError(emailError);
      setPasswordError(passwordError);
      setAddressError(addressError);
      setPhoneError(phoneError);
      setPostcodeError(postcodeError);
      setCityError(cityError);
      setDistrictError(districtError);
      return false;
    }

    return true;
  };

  const updateProfile = async () => {
    if (validate()) {
      setNameError("");
      setSurnamesError("");
      setEmailError("");
      setPasswordError("");
      setAddressError("");
      setPhoneError("");
      setPostcodeError("");
      setCityError("");
      setDistrictError("");

      const res = await fetch(`/api/users/updateprofile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          surnames,
          email,
          password,
          address,
          phone,
          postcode,
          city,
          district,
        }),
      });

      if (res.status === 200) {
        const data = await res.json();
        setAuth({ ...data });
        setMessage({ msg: "Updated Succesfully", status: res.status });
      }
    }
  };

  const showDeleteConfirm = () => {
    confirm({
      title: "Are you sure you wana delete your account?",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        fetch(`/api/users/delete`, {
          method: "GET",
          credentials: "include",
        }).then((res) => {
          if (res.status === 200) {
            fetch(`/api/users/logout`, {
              method: "GET",
              credentials: "include",
            });
            setAuth({
              user: null,
              isLoggedIn: false,
              loading: true,
            });
            history.push("/");
          }
        });
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <div>
          {message.msg && (
            <FormMsg msg={message} clear={() => setMessage({ msg: null })} />
          )}
        </div>
        <p className={styles.header}>Profile</p>
        <div className={styles.inputs}>
          <div className={styles.inputwrapper}>
            <label>Name</label>
            <span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                style={{
                  borderBottom: nameError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{nameError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>Surnames</label>
            <span>
              <input
                value={surnames}
                onChange={(e) => setSurnames(e.target.value)}
                type="text"
                style={{
                  borderBottom: surnamesError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{surnamesError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>New Email</label>
            <span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                style={{
                  borderBottom: emailError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{emailError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>New Password</label>
            <Input.Password
              style={{
                borderBottom: passwordError ? "1px solid red" : "",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.error}>{passwordError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>Address</label>
            <span>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                type="text"
                style={{
                  borderBottom: addressError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{addressError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>Phone number</label>
            <span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="number"
                style={{
                  borderBottom: phoneError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{phoneError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>Postcode</label>
            <span>
              <input
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                type="number"
                style={{
                  borderBottom: postcodeError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{postcodeError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>City</label>
            <span>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                type="text"
                style={{
                  borderBottom: cityError ? "1px solid red" : "",
                }}
              />
            </span>
            <div className={styles.error}>{cityError}</div>
          </div>
          <div className={styles.inputwrapper}>
            <label>District</label>

            <Select
              allowClear
              style={{ width: "100%" }}
              value={district}
              onChange={(e) => setDistrict(e)}
            >
              {comunidades.map((el) => {
                return <Option key={el}>{el}</Option>;
              })}
            </Select>

            <div className={styles.error}>{districtError}</div>
          </div>
        </div>
        <div className={styles.bottons}>
          <button onClick={() => updateProfile()}>Update Profile</button>
          <button onClick={() => showDeleteConfirm()}>Delete Profile</button>
        </div>
      </div>
    </div>
  );
};
