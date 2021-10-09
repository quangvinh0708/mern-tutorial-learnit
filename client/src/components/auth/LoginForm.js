import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
// import { Link, useHistory } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AlertMessage from "../layout/AlertMessage";

const LoginForm = () => {

  //Context
  const { loginUser } = useContext(AuthContext);

  // Constant history
  // const history = useHistory();

  // Local state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  // State status to alert into Login View
  const [alert, setAlert] = useState(null);

  const { username, password } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const login = async (event) => {
    event.preventDefault();
    try {
      const loginData = await loginUser(loginForm);
      // console.log(loginData);
      if (loginData.success) {
        // history.push("/dashboard");
      } else {
        setAlert({ type: "danger", message: loginData.message });
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
      <Form className="my-4" onSubmit={login}>
        {alert != null && <AlertMessage info={alert} />}
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            required
            value={username}
            onChange={onChangeLoginForm}
          />
        </Form.Group>
        <Form.Group className="mt-2">
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={onChangeLoginForm}
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-2">
          Login
        </Button>
      </Form>
      {/* { alert != null && <AlertMessage info={alert} /> } */}
      <p>
        Don't have an account?
        <Link to="/register">
          <Button
            variant="info"
            size="sm"
            className="ml-2"
            style={{ marginLeft: `${7}px` }}
          >
            Register
          </Button>
        </Link>
      </p>
    </>
  );
};

export default LoginForm;
