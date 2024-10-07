import React, { useState } from "react";
import useLogin from "../../../hooks/auth/useLogin";

interface LoginFormValues {
  username: string;
  password: string;
}

const LoginFormComponent: React.FC = () => {
  const { handleLogin, isLoading, isError } = useLogin();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formValues, setFormValues] = useState<LoginFormValues>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormValues>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validate = (): boolean => {
    const newErrors: Partial<LoginFormValues> = {};
    if (!formValues.username) {
      newErrors.username = "Username is required";
    }
    if (!formValues.password) {
      newErrors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      handleLogin(formValues);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "dark" : ""}`}>
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold dark:text-white">Login</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              data-test="input-email"
              type="text"
              id="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        {isError && <p className="text-red-500 text-center mt-2">Something went wrong. Please try again.</p>}
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
          &copy;2023 Your Company. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginFormComponent;