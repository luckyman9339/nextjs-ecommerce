import React, { useState, useEffect, useMemo } from "react";
import { ToastContainer } from "react-toastify";
import AuthContext from "../context/AuthContext";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { setToken, getToken, removeToken } from "../api/token";


import "../scss/global.scss";
import 'semantic-ui-css/semantic.min.css'
import "react-toastify/dist/ReactToastify.css";


export default  function MyApp({ Component, pageProps }) {

  const [auth, setAuth] = useState(undefined);
  const [realoadUser, setReloadUser] = useState(false);
  const router = useRouter();

  //Cuando carga la pagina busca el token y si hay setea el token en el estado global de auth
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuth({
        token,
        idUser: jwtDecode(token).id,
      });
    } else {
      setAuth(null);
    }
    setReloadUser(false);
  }, [realoadUser]); //Lo atamos al reloadUser para ejecutar el estado global cuando queramos

  const login = (token) => {
    setToken(token);
    setAuth({
      token,
      idUser: jwtDecode(token).id,
    });
  };

  const logout = () => {
    if (auth) {
      removeToken();
      setAuth(null);
      router.push("/");
    }
  };

  const authData = useMemo(
    () => ({
      auth,
      login: login,
      logout,
      setReloadUser,
    }),
    [auth] //si sufre alguna cambio, se vuelve a ejecutar este memo
  )

  if (auth === undefined) return null; //El usuario aun no esta logueado ni hay token guardado

  return (
    <AuthContext.Provider value={authData}>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </AuthContext.Provider>
  )
}

