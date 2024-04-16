import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Lottie from "react-lottie";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ParticlesComponent from "../components/particles";
import Check from "../assets/images/Check.json";
import FaceScaner from "../assets/images/FaceScaner4.json";
import supabase from "../../backend/supabaseConfig";


export const Login = () => {
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [counter, setCounter] = useState(10);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const [imageError, setImageError] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;

  const location = useLocation();
  const navigate = useNavigate();

  if (!location?.state?.account) {
    return <Navigate to="/" replace={true} />;
  }

  useEffect(() => {
    setSelectedAccount(location.state.account);
  }, []);

  const loadModels = async () => {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Tiempo de carga para los modelos 10 segundos

    const uri = "/models";

    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri); // Cargar el modelo SSD MobileNet
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri); // Cargar el modelo de landmarks
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri); // Cargar el modelo de reconocimiento facial
  };

  useEffect(() => {
    if (selectedAccount) {
      loadModels()
        .then(async () => {
          const labeledFaceDescriptors = await loadLabeledImages(selectedAccount); // Cargar las imagenes de los usuarios para el reconocimiento facial
          setLabeledFaceDescriptors(labeledFaceDescriptors); 
        })
        .then(() => setModelsLoaded(true))
        .catch(error => console.error("Error loading models:", error));
    }
  
    return () => {
      clearInterval(faceApiIntervalRef.current);
    };
  }, [selectedAccount]);

  useEffect(() => {
    if (loginResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1); // Contador para el reconocimiento del rostro de la tabla de descriptores
      }, 1000); 

      if (counter === 0) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        localUserStream.getTracks().forEach((track) => { // Detener el video 
          track.stop();
        });
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);
        localStorage.setItem(
          "faceAuth",
          JSON.stringify({ status: true, account: selectedAccount })
        ); 
        navigate("/HomePage", { replace: true }); // Redirigir a la pagina protegida
      }

      return () => clearInterval(counterInterval);
    }
    setCounter(3);  // Tiempo para el reconocer el rostro
  }, [loginResult, counter]);
  
  
  const scanFace = async () => {
    faceapi.matchDimensions(canvasRef.current, videoRef.current);
    const faceApiInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptors();
      const resizedDetections = faceapi.resizeResults(detections, {
        width: videoWidth,
        height: videoHeight,
      });
  
      if (!labeledFaceDescriptors.length) {
        console.error("No hay descriptores de rostros cargados.");
        return;
      }
  
      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors); // UMBRALIZATION del faceMatcher
  
      const results = resizedDetections.map((d) => 
        faceMatcher.findBestMatch(d.descriptor)
      );
  
      if (!canvasRef.current) {
        return;
      }
  
      canvasRef.current.getContext("2d").clearRect(0, 0, videoWidth, videoHeight); // Limpiar el canvas antes de dibujar 
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
  
      if (results.length > 0) {
        // console.log("Resultados de detección facial:", results); //depuracion para ver el label y la distancia del rostro
        if (results[0].label !== "unknown" && results[0].distance < 0.5) {
          setLoginResult("SUCCESS");
        } else {
          setLoginResult("FAILED");
        }
      }
  
      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval; // Guardar la referencia del intervalo en el useRef inicializado
  };

  const getLocalUserVideo = async () => { 
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };

  async function loadLabeledImages(account) { //funcion para cargar las imagenes de los usuarios
    if (!account) {
      return null;
    }
    const descriptions = [];

    try {
      const { data: userData, error } = await supabase  //peticion en la bd se supabase para extraer el id del usuario
        .from("users2")
        .select("pictureFileName")
        .eq("id", account.id)
        .single();

      if (error) {
        throw error;
      }

      const imgFileName = userData.pictureFileName;
      // console.log("Nombre de archivo de imagen:", imgFileName); //depuracion para ver el nombre de la imagen

      const response = await fetch(`https://cfdrkjqgibsxervlmzpr.supabase.co/storage/v1/object/public/images/${imgFileName}`); //peticion para obtener la imagen del usuario del bucket
      const blob = await response.blob();
      const img = await faceapi.bufferToImage(blob);
      // console.log("Imagen cargada en FaceAPI:", img); //depuracion para ver la imagen cargada

      const detections = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        descriptions.push(new faceapi.LabeledFaceDescriptors(account.id.toString(), [detections.descriptor])); //almacenar los descriptores de los rostros en un arreglo
      }
    } catch (error) {
      console.error("Error loading image:", error);
      setImageError(true);
      return null;
    }

    return descriptions.length > 0 ? descriptions : null; //retornar los descriptores de los rostros 
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-700 to-indigo-900 flex flex-col items-center justify-center">
      <ParticlesComponent id="particles-background" />
      <div className="h-auto mt-30 flex flex-col items-center justify-center bg-white py-4 px-4 
     md:py-8 md:px-10 max-w-screen-lg mx-auto rounded-2xl shadow-xl mb-8 z-10 ">


        {/* Pantalla de carga de los modelos */}
        {!localUserStream && !modelsLoaded && (

          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">
              Estas intentando Iniciar Sesión con tu Rostro.
            </span>
            <span className="block text-indigo-600 mt-2">Cargando Modelos...</span>
          </h2>

        )}

        {/* Pagina de Escanear el Rostro */}
        {!localUserStream && modelsLoaded && (

          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block text-indigo-600">
              Escanee su rostro para iniciar sesión completamente.
            </span>
          </h2>

        )}

        {/* Pagina cuando das a escanear El Rostro  SI SE RECONOCE EL ROSTRO*/}
        {localUserStream && loginResult === "SUCCESS" && (
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block text-indigo-600 ">
              ¡Hemos reconocido tu cara con éxito!
            </span>
            <span className="block text-indigo-600 mb-5">
              Por favor espera {counter} segundos...
            </span>
          </h2>
        )}

        {/* PANTALLA SI NO SE RECONOCE EL ROSTRO */}
        {localUserStream && loginResult === "FAILED" && (
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
            <span className="block mt-[20px] mb-10">
              ¡Ups! No se puede reconocer tu rostro :{"("}.
            </span>
          </h2>
        )}

        {/* PANTALLA DE PENDIENTE AL ESCANEAR EL ROSTRO */}
        {localUserStream && !faceApiLoaded && loginResult === "PENDING" && (
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block mt-[20px]">Escaneando Rostro...</span>
          </h2>
        )}

        {/* Pantalla del screen del video */}

        <div className="w-full">
          {/* <ParticlesComponent id="particles-background" /> */}
          <div className="relative flex flex-col items-center" >
            {/* className="relative flex flex-col items-center p-[30px] */}
            <video
              muted
              autoPlay
              ref={videoRef}
              height={videoHeight}
              width={videoWidth}
              onPlay={scanFace}
              style={{
                objectFit: "fill",
                height: "360px",
                borderRadius: "20px",
                display: localUserStream ? "block" : "none",
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                display: localUserStream ? "block" : "none",
              }}
            />
          </div>
          {!localUserStream && (
            <>

              {/* Pantalla de Cargando los modelos */}
              {modelsLoaded ? (
                <div>

                  <Lottie style={{ pointerEvents: 'none' }}
                    options={{
                      animationData: FaceScaner,
                      loop: true,
                      autoplay: true,
                    }}
                    height={400}
                    width={300}

                  />
                  {/* <img
                  alt="loading models"
                  src={AuthFace}
                  className="cursor-pointer my-8 mx-auto object-cover h-[272px]"
                /> */}

                  <button
                    onClick={getLocalUserVideo}
                    type="button"
                    className="flex justify-center items-center w-full py-3 px-5 mr-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg border border-gray-200 "
                  >
                    ESCANEAR ROSTRO
                  </button>
                </div>
              ) : (

                // Carga de Modelos antes de hacer el LOGIN
                <>

                  <Lottie style={{ pointerEvents: 'none' }}
                    options={{
                      animationData: Check,
                      loop: true,
                      autoplay: true,
                    }}
                    height={300}
                    width={500}
                  />
                  <button
                    disabled
                    type="button"
                    className="cursor-not-allowed flex justify-center items-center w-full py-2.5 px-5 text-sm font-medium text-white bg-indigo-600 rounded-lg border border-gray-200 hover:bg-indigo-500 hover:text-gray-200 "
                  >
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline mr-2 w-4 h-4 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="#77f2de"
                      />
                    </svg>
                    Espere mientras se cargan los modelos..
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}