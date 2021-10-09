import { createContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducers/authReducer";
import axios from "axios";

import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from "./constants";
import setAuthToken from "../utils/setAuthToken";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  });

  // Authenticate user
  const loadUser = async () => {
;
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
    }
    
    try {
      //   if(localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      //     const response = await axios.get(`${apiUrl}/auth`);
      //   if (response.data.success) {
      //     dispatch({
      //       type: "SET AUTH",
      //       payload: { isAuthenticated: true, user: response.data.user },
      //     });
      //   }
      //   }
      //   else {
      //     dispatch({
      //           type: "SET AUTH",
      //           payload: { isAuthenticated: false, user: null }
      //   })
      // }

      const response = await axios.get(`${apiUrl}/auth`);
      if (response.data.success) {
        dispatch({
          type: "SET AUTH",
          payload: { isAuthenticated: true, user: response.data.user },
        });
      }
    } catch (error) {
      // console.log(error);
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      dispatch({
        type: "SET AUTH",
        payload: { isAuthenticated: false, user: null },
      });
    }
  };

  useEffect(() => loadUser(), []);

  // Login
  const loginUser = async (userForm) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, userForm);
      if (response.data.success) {
        localStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          response.data.accessToken
        );

        // Change State for redirect to Dashboard after login
        // dispatch({  type: 'SET AUTH' ,payload: {isAuthenticated: true, user: response.data.user }})
        //or
        await loadUser();
      }
      return response.data;
    } catch (err) {
      if (err.response.data) return err.response.data;
      else return { success: false, message: err.message };
    }
  };

  // Register
  const registerUser = async (userForm) => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, userForm);
      if (response.data.success) {
        localStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          response.data.accessToken
        );

        await loadUser();
      }
      return response.data;
    } catch (err) {
      if (err.response.data) return err.response.data;
      else return { success: false, message: err.message };
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({
      type: "SET AUTH",
      payload: { isAuthenticated: false, user: null },
    });
  };

  // Context data
  const authContextData = { loginUser, registerUser, logoutUser, authState };

  // return provider
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
