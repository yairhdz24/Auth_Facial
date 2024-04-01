import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Layout } from "./pages/Layout";
import { UserSelect } from "./pages/UserSelect";
import { HomePage } from "./pages/HomePage";
import {Register} from "./pages/Register";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="user-select" element={<UserSelect />} />
        <Route path="login" element={<Login />} />
        <Route path="HomePage" element={<HomePage />} />
        <Route path="register" element={<Register />} /> 
        <Route path="*" element={<Navigate to="/" />} />

      </Route>
    </>
  ),
  { basename: "/" }
);

export default router;
