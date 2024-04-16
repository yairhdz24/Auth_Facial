import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import Loadings from "../assets/images/Loading.json";
import "../index.css";

export const Loading = () => {
    const [dots, setDots] = useState(""); // Estado para almacenar los puntos

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prevDots => {
                if (prevDots === "...") return "."; // Reinicia el estado si llega a "..."
                return prevDots + ".";
            });
        }, 500);

        return () => clearInterval(interval); 
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-85">
            <div className="text-white text-center" style={{ pointerEvents: 'none' }}>
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: Loadings,
                    }}
                    height={650}
                    width={500}
                />
                <h1 className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight font-extrabold -mt-24 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-indigo-300" style={{ textShadow: "3px 3px 3px rgba(0, 255, 255, 0.4)" }}>
                  FaceAuthenticator
                </h1>
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-8 loading-text">
                    Cargando{dots}
                </p>
            </div>
        </div>
    );
};
