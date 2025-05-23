import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { API_URL } from "../../utils/config";
import { useAtom } from "jotai";
import { userAtom } from "../../utils/store/auth";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  // state
  const [user, setUser] = useAtom(userAtom);
  const [mode, setMode] = useState("login");

  //   routes
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    

    try {
      const email = e.target.email.value;
      const password = e.target.password.value;

      // Call login API
      const response = await axios.post(API_URL + "user/login", {
        email,
        password,
      });

      if (response.status === 200) {
        // Handle successful login
        console.log("response", response.data);
        setUser(response.data);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        // Handle error
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle error
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const name = e.target.name.value;
      const email = e.target.email.value;
      const password = e.target.password.value;

      // Call register API
      const response = await axios.post(API_URL + "user/register", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        // Handle successful registration
        console.log("response", response.data);
        setUser(response.data);
        toast.success("Registration successful!");
        navigate("/dashboard");
      } else {
        // Handle error
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle error
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <div className="container px-8 mx-auto my-10">
        <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
          <img
            src="/hero.svg"
            alt="Hero"
            className="w-full md:w-2/3 h-auto col-span-1 md:col-span-3"
          />
          {/* Login Card */}
          <div className="w-full md:w-1/3">
            <div className="card bg-base-100 w-full shadow-lg">
              <div className="card-body flex flex-col items-center">
                {mode === "login" && (
                  <>
                    <h2 className="card-title text-3xl">Login</h2>
                    <p className="text-sm text-gray-500">
                      Enter your credentials to access the AI Chatbot.
                    </p>
                    <form className="w-full" onSubmit={handleLogin}>
                      <fieldset className="fieldset w-full">
                        <label className="label">Email</label>
                        <input
                          type="email"
                          className="input w-full"
                          placeholder="Email"
                          name="email"
                        />

                        <label className="label">Password</label>
                        <input
                          type="password"
                          className="input w-full"
                          placeholder="Password"
                          name="password"
                        />

                        <button className="btn btn-neutral mt-4">Login</button>
                      </fieldset>
                    </form>
                    <p className="text-sm text-gray-500 mt-4">
                      Don't have an account?{" "}
                      <a
                        className="text-sm text-blue-500 cursor-pointer"
                        onClick={() => setMode("register")}
                      >
                        Register here.
                      </a>
                    </p>
                  </>
                )}
                {mode === "register" && (
                  <>
                    <h2 className="card-title text-3xl">Register</h2>
                    <p className="text-sm text-gray-500">
                      Create an account to access the AI Chatbot.
                    </p>
                    <form className="w-full" onSubmit={handleRegister}>
                      <fieldset className="fieldset w-full">
                        <label className="label">Name</label>
                        <input
                          type="text"
                          className="input w-full"
                          placeholder="Name"
                          name="name"
                        />

                        <label className="label">Email</label>
                        <input
                          type="email"
                          className="input w-full"
                          placeholder="Email"
                          name="email"
                        />

                        <label className="label">Password</label>
                        <input
                          type="password"
                          className="input w-full"
                          placeholder="Password"
                          name="password"
                        />

                        <button className="btn btn-neutral mt-4">
                          Register
                        </button>
                      </fieldset>
                    </form>
                    <p className="text-sm text-gray-500 mt-4">
                      Already have an account?{" "}
                      <a
                        className="text-sm text-blue-500 cursor-pointer"
                        onClick={() => setMode("login")}
                      >
                        Login here.
                      </a>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
