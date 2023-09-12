import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContextComp } from "../MyContext";


const SignUp = () => {
const { animation, setAnimation } = useContextComp();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    secondname: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    name: "",
    secondname: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    setAnimation(true)
  }, []);

  const errorsHandler = (data) => {
    setErrors({
      email: "",
      password: "",
      passwordConfirmation: "",
      name: "",
      secondname: "",
    });
    data.errors &&
      data.errors.forEach((element) => {
        setErrors((prev) => ({ ...prev, [element.path]: element.msg }));
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }, //important!
      body: JSON.stringify(userInfo),
    })
      .then((response) => response.json())
      .then((data) => {
        errorsHandler(data);
        !data.errors && (navigate("/"), setAnimation(false));
      })
      .catch((err) => console.error(err));
  };

  const frontValidation = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    password: /^.\S{5,14}$/, //6-15 no spaces
    passwordConfirmation: /^.\S{5,14}$/,
    name: /^.{1,15}$/,
    secondname: /^.{1,15}$/,
  };

  const inputFun = (e) => {
    const { name, value } = e.target;
    if (name == "password" && value == userInfo.passwordConfirmation) {
      setErrors((prev) => ({ ...prev, passwordConfirmation: "" }));
    } else if (name == "passwordConfirmation" && value == userInfo.password) {
      setErrors((prev) => ({ ...prev, passwordConfirmation: "" }));
    }
    if (errors && name != "passwordConfirmation") {
      frontValidation[name].test(value) &&
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const signUpObject = {
    email: {
      label: "E-mail",
      type: "text",
      name: "email",
      id: "email",
      value: userInfo.email,
      onChange: inputFun,
    },
    password: {
      label: "Password",
      type: "password",
      name: "password",
      id: "password",
      value: userInfo.password,
      onChange: inputFun,
    },
    passwordConfirmation: {
      label: "Password Confirmation",
      type: "password",
      name: "passwordConfirmation",
      id: "passwordConfirmation",
      value: userInfo.passwordConfirmation,
      onChange: inputFun,
    },
    name: {
      label: "Name",
      type: "text",
      name: "name",
      id: "name",
      value: userInfo.name,
      onChange: inputFun,
    },
    secondname: {
      label: "Second Name",
      type: "text",
      name: "secondname",
      id: "secondname",
      value: userInfo.secondname,
      onChange: inputFun,
    },
  };

  return (
    <div id="register" className={animation ? "active" : ""}>
      <div className="form-holder">
        <h3>Register</h3>
        <h3 onClick={()=>{setAnimation(false),navigate('/')}}>X</h3>

        <form onSubmit={handleSubmit}>
          {Object.values(signUpObject).map((element) => {
            return (
              <div key={element.name}>
                <label htmlFor={element.name}>{element.label}</label>
                <input
                  {...element}
                  className={`input ${errors[element.name] ? "active" : ""}`}
                />
                {errors[element.name] && <span>{errors[element.name]}</span>}
              </div>
            );
          })}
          <button type="submit">Submit</button>
        </form>
        <p>Already have an account? 
        <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
};

export default SignUp;
