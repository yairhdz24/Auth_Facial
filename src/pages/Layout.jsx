import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
// import Footer from "../components/Footer";

const whiteList = ["/HomePage"]; // Rutas que no requieren autenticacion
 
export const Layout = () => {
  const location = useLocation();
  const { account } = JSON.parse(localStorage.getItem("faceAuth")) || {}; // Obtener la cuenta del usuario
 
  if (!account && whiteList.includes(location.pathname)) {  
    return <Navigate to="/" />;
  }

  if (account && !whiteList.includes(location.pathname)) { 
    return <Navigate to="/HomePage" />;
  }

  return (
    <div className="h-90 flex flex-col justify-between"> 
      <Outlet className="grow" />
      {/* <Footer /> */}
    </div>
  );
}


