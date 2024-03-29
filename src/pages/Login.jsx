import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import AuthIdle from "../assets/images/auth-idle.svg";
import AuthFace from "../assets/images/auth-face.svg";
import Lottie from "react-lottie";
import FaceAuth from "../assets/images/Face_Scaner1.json";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ParticlesComponent from "../components/particles";
import Check from "../assets/images/Check.json";
import FaceScaner from "../assets/images/FaceScaner4.json";

function Login() {
  const [tempAccount, setTempAccount] = useState("");
  const [localUserStream, setLocalUserStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [imageError, setImageError] = useState(false);
  const [counter, setCounter] = useState(10);
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState({});
  const videoRef = useRef();
  const canvasRef = useRef();
  const faceApiIntervalRef = useRef();
  const videoWidth = 640;
  const videoHeight = 360;

  const location = useLocation();
  const navigate = useNavigate();

  if (!location?.state) {
    return <Navigate to="/" replace={true} />;
  }

  const loadModels = async () => {

    await new Promise((resolve) => setTimeout(resolve, 10000)); //Tiempo de carga para los modelos

    const uri = "/models";

    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  useEffect(() => {
    setTempAccount(location?.state?.account);
  }, []);
  useEffect(() => {
    if (tempAccount) {
      loadModels()
        .then(async () => {
          const labeledFaceDescriptors = await loadLabeledImages();
          setLabeledFaceDescriptors(labeledFaceDescriptors);
        })
        .then(() => setModelsLoaded(true));
    }
  }, [tempAccount]);

  useEffect(() => {
    if (loginResult === "SUCCESS") {
      const counterInterval = setInterval(() => {
        setCounter((counter) => counter - 1);
      }, 1000);

      if (counter === 0) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
        localUserStream.getTracks().forEach((track) => {
          track.stop();
        });
        clearInterval(counterInterval);
        clearInterval(faceApiIntervalRef.current);
        localStorage.setItem(
          "faceAuth",
          JSON.stringify({ status: true, account: tempAccount })
        );
        navigate("/protected", { replace: true });
      }

      return () => clearInterval(counterInterval);
    }
    setCounter(5);  // Tiempo para el reconocer el rostro
  }, [loginResult, counter]);

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

      const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      const results = resizedDetections.map((d) =>
        faceMatcher.findBestMatch(d.descriptor)
      );

      if (!canvasRef.current) {
        return;
      }

      canvasRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

      if (results.length > 0 && tempAccount.id === results[0].label) {
        setLoginResult("SUCCESS");
      } else {
        setLoginResult("FAILED");
      }

      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
    }, 1000 / 15);
    faceApiIntervalRef.current = faceApiInterval;
  };

  async function loadLabeledImages() {
    if (!tempAccount) {
      return null;
    }
    const descriptions = [];

    let img;

    try {
      const imgPath =
        tempAccount?.type === "CUSTOM"
          ? tempAccount.picture
          : // : import.meta.env.DEV
          // ? `/temp-accounts/${tempAccount.picture}`
          // : `/react-face-auth/temp-accounts/${tempAccount.picture}`;
          `/temp-accounts/${tempAccount.picture}`;

      img = await faceapi.fetchImage(imgPath);
    } catch {
      setImageError(true);
      return;
    }

    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (detections) {
      descriptions.push(detections.descriptor);
    }

    return new faceapi.LabeledFaceDescriptors(tempAccount.id, descriptions);
  }

  if (imageError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-[24px] max-w-[840px] mx-auto">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-rose-700 sm:text-4xl">
          <span className="block">
            ¡Ups! No hay ninguna imagen de perfil asociada con esta cuenta.
          </span>
        </h2>
        <span className="block mt-4">
          Comuníquese con la administración para registrarse o vuelva a intentarlo más tarde.
        </span>
      </div>
    );
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
            <span className="block text-indigo-600 mt-10">
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
              ¡Ups! No se puede reconocer tu cara.
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
                <div className="">

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

export default Login;
