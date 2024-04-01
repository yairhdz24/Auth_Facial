import React, { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";
import { Link } from "react-router-dom";
import ParticlesComponent from "../components/particles";
import supabase from "../../backend/supabaseConfig";
import { Skeleton } from "./skeleton";

export const UserSelect = () => {
  const [selected, setSelected] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data: usersData, error } = await supabase
          .from("users2")
          .select("*");
        if (error) {
          throw error;
        }
        setUsers(usersData);
        setSelected(usersData[0]);
        setLoading(false); // Cambio en el estado de carga una vez que se han cargado los usuarios
      } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
        setErrorMessage("Error al obtener usuarios. Por favor, inténtalo de nuevo.");
      }
    }

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-700 to-indigo-900 flex flex-col items-center justify-center">
      <div className="h-auto flex flex-col items-center justify-center gap-[24px] w-full max-w-[520px] mx-auto z-10">
        <ParticlesComponent id="particles-background" />
        <div className="w-full p-10 text-center bg-white rounded-lg shadow-lg z-10 mt-2 mb-10">
          <h1 className="text-4xl font-extrabold mb-5 text-black">
            Elige un usuario para iniciar sesión
          </h1>

          <div className="mx-auto w-full max-w-md overflow-y-auto max-h-72">
            {loading ? ( // Verificacion de carga para mostrar el skeleton
              <Skeleton/>
            ) : (
              <RadioGroup value={selected} onChange={setSelected}>
                <RadioGroup.Label className="sr-only">Seleccionar usuario</RadioGroup.Label>
                <div className="space-y-2">
                  {users.map((user) => (
                    <RadioGroup.Option
                      key={user.id}
                      value={user}
                      className={({ checked }) =>
                        `${checked ? "bg-indigo-600 bg-opacity-75 text-white" : "bg-white"
                        } relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                      }
                    >
                      {({ checked }) => (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center">
                            <div className="text-sm">
                              <RadioGroup.Label
                                as="div"
                                className={`flex items-center gap-x-6 font-medium ${checked ? "text-white" : "text-gray-900"
                                  }`}
                              >
                                {user.pictureFileName ? (
                                  <img
                                    className="object-cover h-10 w-10 rounded-full"
                                    src={`https://cfdrkjqgibsxervlmzpr.supabase.co/storage/v1/object/public/images/${user.pictureFileName}`}
                                    alt={user.fullName}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                                )}
                                {user.fullName}
                              </RadioGroup.Label>
                            </div>
                          </div>
                          {checked && (
                            <div className="shrink-0 text-white">
                              <CheckIcon className="h-6 w-6" />
                            </div>
                          )}
                        </div>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>
            )}
            {errorMessage && (
              <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <Link
              to="/login"
              state={{ account: selected }}
              className="flex items-center rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 
              transition-colors duration-300 ease-in-out cursor-pointer"
            >
              Continuar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="ml-1.5 h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
