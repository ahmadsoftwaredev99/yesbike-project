import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import "react-toastify/dist/ReactToastify.css";
import "../components/Navbar.css";
import "../components/Footer.css";

const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <ToastContainer theme="dark" position="top-right" autoClose={2500} />
  </>
);

export default MainLayout;
