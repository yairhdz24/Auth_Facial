import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./pages/Layout";
import UserSelect from "./pages/UserSelect";
import Protected from "./pages/Protected";
// import UserRegistration from "./pages/UserRegistration"; // Importa el componente UserRegistration

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="user-select" element={<UserSelect />} />
        <Route path="login" element={<Login />} />
        <Route path="protected" element={<Protected />} />
        {/* <Route path="register" element={<UserRegistration />} /> Agrega la ruta de UserRegistration */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </>
  ),
  { basename: "/" }
);

export default router;
