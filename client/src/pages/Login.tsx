import React, { useState } from "react";
import { heroSectionData } from "../assets/assets";
import { Link } from "react-router-dom";
import { BikeIcon, UserIcon } from "lucide-react";

const Login = () => {
  const [loginState, setLoginState] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => (window.location.href = "/"), 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
        <img
          src={heroSectionData.hero_image}
          alt=""
          className="absolute inset-0 object-cover h-full bg-center opacity-10"
        />
        <div className="relative text-center px-12">
          <h2 className="text-4xl font-semibold text-white mb-4">
            Welcome back to Instacart
          </h2>
          <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">
            Fresh groceries and organic produce, delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
        <div className="w-full max-w-md">
          {/* Form header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <BikeIcon className="size-8 text-app-green" />
              <span className="text-2xl font-semibold text-app-green">
                Instacart
              </span>
            </Link>
            <h1 className="text-2xl font-semibold text-app-green mb-2">
              {loginState ? "Sign in to your account" : "Create an account"}
            </h1>
            <p className="text-sm text-app-text-light">
              {loginState
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() => setLoginState(!loginState)}
                className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors"
              >
                {loginState ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!loginState && (
              <label className="text-sm flex flex-col gap-1">
                Name
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border transition-all"
                  />
                </div>
              </label>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
