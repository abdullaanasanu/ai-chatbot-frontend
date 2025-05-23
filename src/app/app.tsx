import { Route, Routes } from "react-router-dom";
import { Navbar } from "../component/navbar";
import { Dashboard } from "../pages/dashboard";
import { Home } from "../pages/home";
import { Toaster } from "react-hot-toast";
import AuthHandler from "../component/AuthHandler";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <AuthHandler>
              <Dashboard />
            </AuthHandler>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
