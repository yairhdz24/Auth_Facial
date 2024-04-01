import React from "react";
import { Link } from "react-router-dom";
import ParticlesComponent from "../components/particles";
import Footer from "../components/Footer";
import Lottie from "react-lottie";
import FaceAuth from '../assets/images/FaceScaner.json';

export const Home = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gradient-to-tl from-blue-700 to-indigo-900">
        <ParticlesComponent id="particles-background" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
          <div className=" items-center">
            {/* <div className="md:order-2 z-10 ml-20 md:ml-0">
            <img
              alt="auth image"
              src={AuthImage}
              className="w-90 h-100 md:max-h-90"
            />
          </div> */}
            <div className="md:order-1 z-10 flex flex-col items-center md:items-center mb">
              <div className="mb-5" style={{ pointerEvents: 'none' }}>
                <Lottie
                  options={{
                    animationData: FaceAuth,
                    loop: true,
                    autoplay: true,
                  }}
                  height={300}
                  width={300}

                />
              </div>
              {/* <img src={Logo} alt="" className="h-40 mb-2" /> */}
              <h1 className="text-5xl font-bold text-white mb-5 text-center md:text-left" style={{ textShadow: "3px 4px 8px rgba(0, 0, 0, 0.2)" }}>
                Bienvenido a
              </h1>
              <h1 className="block  text-4xl tracking-tight font-extrabold  sm:text-5xl md:text-6xl bg-clip-text 
              text-transparent bg-gradient-to-r from-cyan-400 to-indigo-300" style={{ textShadow: "3px 3px 3px rgba(0, 255, 255, 0.4)" }}>
                FaceAuthenticator
              </h1>
              <p className="mt-8 text-md text-white max-w-3xl mx-4 md:mx-0 lg:mx-auto bg-gray-800 p-6 rounded-lg">
                FaceAuthenticator es una aplicación web de autenticación basada en reconocimiento
                facial, desarrollada utilizando React e inteligencia Atificial de Reconocimiento facial.
                El principal objetivo de la aplicación es ofrecer un sistema de autenticación
                confiable y eficiente mediante el análisis y la verificación de las características faciales del usuario.
                
              </p>
              <div className="flex gap-4">
                <Link
                  to={"/user-select"}
                  className="flex gap-2 mt-7 w-fit items-center mx-auto md:mx-0 cursor-pointer z-10 py-3 px-6 rounded-full 
             hover:shadow-lg hover:scale-105 transform transition duration-300
             bg-gradient-to-r from-indigo-300 to-indigo-500 hover:bg-opacity-80"
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg> */}
                  <span className="text-white text-lg font-bold">Iniciar Sesion</span>
                </Link>

                {/*BOTON REGISTRO */}
                <Link
                  to={"/register"}
                  className="flex gap-2 mt-7 w-fit items-center mx-auto md:mx-0 cursor-pointer z-10 py-3 px-6 rounded-full 
             hover:shadow-lg hover:scale-105 transform transition duration-300
             bg-gradient-to-r from-indigo-300 to-indigo-500 hover:bg-opacity-80"
                >
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="white"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg> */}
                  <span className="text-white text-lg font-bold">Registrate</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-90 flex flex-col justify-between">
        <Footer />
      </div>
    </>
  );
}
