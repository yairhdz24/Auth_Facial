import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ParticlesComponent from "../components/particles";
import Footer from "../components/Footer";
import { Loading } from '../components/loading'; // Importa el componente de carga
import Lottie from "react-lottie";
import FaceAuth from '../assets/images/FaceScaner.json';

export const Home = () => {
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar si se está cargando la página

  useEffect(() => {
    // Simula un tiempo de carga 
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 7500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : ( // Muestra el contenido principal una vez que isLoading es false
        <>
          <div className="flex justify-center items-center h-screen bg-gradient-to-tl from-blue-700 to-indigo-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10">
              <div className=" items-center">
                <div className="md:order-1 z-10 flex flex-col items-center md:items-center mb">
                  <div className="mb-5 d-flex justify-content-center" style={{ pointerEvents: 'none' }}>
                    <Lottie
                      options={{
                        animationData: FaceAuth,
                        loop: true,
                        autoplay: true,
                      }}
                      height={150}
                      width={300}
                    />
                  </div>
                  <h1 className="text-5xl font-bold text-white mb-5 text-center md:text-left" style={{ textShadow: "3px 4px 8px rgba(0, 0, 0, 0.2)" }}>
                    Bienvenido a
                  </h1>
                  <h1 className="block  text-4xl tracking-tight font-extrabold  sm:text-5xl md:text-6xl bg-clip-text 
                  text-transparent bg-gradient-to-r from-cyan-400 to-indigo-300" style={{ textShadow: "3px 3px 3px rgba(0, 255, 255, 0.4)" }}>
                    FaceAuthenticator
                  </h1>
                  <div className="mt-8 text-md text-white max-w-3xl mx-4 md:mx-0 lg:mx-auto bg-gray-800 p-6 rounded-lg">
                    <p>
                      FaceAuthenticator es una aplicación web de autenticación basada en reconocimiento
                      facial, desarrollada utilizando React e inteligencia artificial de reconocimiento facial.
                    </p>
                    <p>
                      El objetivo principal de la aplicación es ofrecer un sistema de autenticación
                      confiable y eficiente mediante el análisis y la verificación de las características faciales del usuario.
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <Link
                      to={"/user-select"}
                      className="flex gap-2 mt-7 w-fit items-center mx-auto md:mx-0 cursor-pointer z-10 py-3 px-6 rounded-full 
               hover:shadow-lg hover:scale-105 transform transition duration-300
               bg-gradient-to-r from-indigo-300 to-indigo-500 hover:bg-opacity-80"
                    >
                      <span className="text-white text-lg font-bold">Iniciar Sesión</span>
                    </Link>
                    <Link
                      to={"/register"}
                      className="flex gap-2 mt-7 w-fit items-center mx-auto md:mx-0 cursor-pointer z-10 py-3 px-6 rounded-full 
               hover:shadow-lg hover:scale-105 transform transition duration-300
               bg-gradient-to-r from-indigo-300 to-indigo-500 hover:bg-opacity-80"
                    >
                      <span className="text-white text-lg font-bold">Registrarse</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ParticlesComponent/>
        </>
      )}
      {!isLoading && ( // Muestra el footer solo cuando isLoading es false
        <div className="h-90 flex flex-col justify-between">
          <Footer />
        </div>
      )}
    </>
  );
};
