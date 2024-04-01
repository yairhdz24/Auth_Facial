import React, { useState } from "react";
import supabase from "../../backend/supabaseConfig"; // Importa el cliente de Supabase
import { Link } from "react-router-dom";
import ParticlesComponent from "../components/particles";

export const Register = () => {
    const [fullName, setFullName] = useState("");
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [registeredUser, setRegisteredUser] = useState(null); // Estado para almacenar el usuario registrado

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (!fullName || !file) {
            setErrorMessage("Por favor ingresa el nombre y selecciona una foto."); // Mostrar un mensaje de error si faltan datos
            return;
        }
    
        try {
            // Subir la imagen al almacenamiento de Supabase
            const { data: image, error: imageError } = await supabase.storage
                .from("images")
                .upload(file.name, file);
    
            if (imageError) {
                throw imageError;
            }
    
            // Guardar el nombre del archivo en la base de datos
            const { data: user, error: userError } = await supabase
                .from("users2")
                .insert([{ fullName, pictureFileName: file.name }]);
    
            if (userError) {
                throw userError;
            }
    
            console.log("Usuario creado exitosamente:", user);
            console.log("Imagen subida exitosamente:", image);
    
            // Establecer el usuario registrado en el estado
            const newUser = { fullName, pictureFileName: file.name };
            setRegisteredUser(newUser);
    
            // Reiniciar los campos y mensajes de error
            setFullName("");
            setFile(null);
            setErrorMessage(null);
        } catch (error) {
            console.error("Error al crear el usuario:", error.message);
            setErrorMessage("Error al crear el usuario. Por favor inténtalo de nuevo.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tl from-blue-700 to-indigo-900 flex flex-col items-center justify-center">
            <div className="h-auto flex flex-col items-center justify-center gap-[24px] w-full max-w-[520px] mx-auto z-10">
                <ParticlesComponent id="particles-background" />
                <div className="w-full p-10 text-center bg-white rounded-lg shadow-lg z-10 mt-2 mb-10">

                    {!registeredUser ? (
                        // Formulario de registro
                        <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md">
                            <h1 className="text-4xl font-extrabold mb-5 text-black">Registro de Usuario</h1>
                            {/* Input de nombre */}
                            <div className="mb-4">
                                <label htmlFor="fullName" className="block text-left text-black">Nombre:</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-2 mt-1 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    autoComplete="off"
                                />
                            </div>

                            {/* Input de carga de imagen */}
                            <div className={`mb-4 ${file ? 'text-gray-400' : ''}`}>
                                <label htmlFor="picture" className="block text-left text-black mb-2">Cargar Imagen:</label>
                                <label
                                    htmlFor="picture"
                                    className="flex items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-indigo-200 hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center py-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6 text-indigo-500 mb-2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                            />
                                        </svg>
                                        <p className="font-semibold mb-2 text-sm text-gray-500 dark:text-gray-400">
                                            {file ? `Archivo seleccionado: ${file.name}` : "Haga clic para cargar una imagen"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            PNG, JPG o JPEG
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        id="picture"
                                        accept=".png, .jpg, .jpeg"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                            </div>
                            {/* Input de carga de imagen */}
                           
                            {/* Botn de enviar formulario */}
                            <button type="submit" className="bg-indigo-500 px-4 py-2 text-white rounded-md mt-4">
                                Guardar
                            </button>
                        </form>
                    ) : (
                        // Mostrar al usuario registrado
                        <div className="mt-2">
                            <h1 className="text-4xl font-extrabold mb-5 text-black">Te has registrado correctamente :D</h1>
                            <img
                                src={`https://cfdrkjqgibsxervlmzpr.supabase.co/storage/v1/object/public/images/${registeredUser.pictureFileName}`} // Mostrar la imagen que se subió al registro
                                alt={registeredUser.fullName}
                                className="w-24 h-24 rounded-full object-cover mx-auto"
                            />
                            <p className="text-2xl font-semibold mb-5">{registeredUser.fullName}</p>
                            <Link to="/" className="bg-indigo-500 px-4 py-2 text-white rounded-md mt-5 shadow-sm hover:bg-indigo-600 
                                        transition-colors duration-300 ease-in-out cursor-pointer">
                                Continuar
                            </Link>
                        </div>
                    )}

                    {/* Mensaje de error */}
                    {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                </div>
            </div>
        </div>
    );
}


