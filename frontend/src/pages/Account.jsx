import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthentication, selectIsLoggedIn } from "../../store/userSlice";
import { getCurrentUser } from "../services/api";
import axios from "axios";

const Account = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const authLoading = useSelector((state) => state.user.authLoading);
  const navigate = useNavigate();


  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (!response.authenticated) {
          dispatch(clearAuthentication());
          navigate("/login");
          return;
        }
        setUser(response.user);
        setIsLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          dispatch(clearAuthentication());
          navigate("/login");
          return;
        }
        setError("Failed to load user data");
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/logout`, {}, { withCredentials: true });
      ["isLogin", "userId", "userName", "userEmail", "user.token"].forEach((key) => {
        localStorage.removeItem(key);
      });
      dispatch(clearAuthentication());
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(clearAuthentication());
        navigate("/login");
        return;
      }
      setError("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (authLoading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Please log in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 mt-14">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.image}
            onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"; }}
            alt={user.fullName}
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">{user.fullName}</h1>
          <p className="text-gray-600 mb-6">{user.email}</p>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            <FiLogOut className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;