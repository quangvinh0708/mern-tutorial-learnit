import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import {AuthContext} from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

const RegisterForm = () => {
  const { registerUser } = useContext(AuthContext);

  // Constant history
  // const history = useHistory();

  // Local state
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  // State status to alert into Login View
  const [alert, setAlert] = useState(null);

  const { username, password, confirmPassword } = registerForm;
  const onChangeRegisterForm = (event) =>
    setRegisterForm({
      ...registerForm,
      [event.target.name]: event.target.value,
    });

  const register = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setAlert({ type: "danger", message: "Passwords do not match" });
      setTimeout(() => {
        setAlert(null);
      }, 5000);
      return;
    }

    try {
      const registerData = await registerUser(registerForm);

      if (!registerData.success) {
        console.log(registerData.message);
        setAlert({ type: "danger", message: registerData.message });
        setTimeout(() => {
          setAlert(null);
        }, 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Form className="my-4" onSubmit={register}>
      {alert != null && <AlertMessage info={alert} />}
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            required
            value={username}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={onChangeRegisterForm}
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-2">
          Register
        </Button>
      </Form>
      <p>
        Already have an account?
        <Link to="/login">
          <Button
            variant="info"
            size="sm"
            className="ml-2"
            style={{ "marginLeft": `${7}px` }}
          >
            Login
          </Button>
        </Link>
      </p>
    </>
  );
};

export default RegisterForm;
