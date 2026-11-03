import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from './pages/Signup'
import AccountPage from "./pages/Account";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Navbar from "./components/Navbar";
import Research from "./pages/Research";
import Elections from "./pages/Elections";
import ElectionDetails from "./pages/ElectionDetails";
import News from "./pages/News";
import { clearAuthentication, setAuthenticatedUser } from "../store/userSlice";
import { getCurrentUser } from "./services/api";
import axios from "axios";

function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          dispatch(clearAuthentication());
          ["isLogin", "userId", "userName", "userEmail", "user.token"].forEach((key) => {
            localStorage.removeItem(key);
          });
        }
        return Promise.reject(error);
      }
    );

    ["isLogin", "userId", "userName", "userEmail", "user.token"].forEach((key) => {
      localStorage.removeItem(key);
    });

    getCurrentUser()
      .then((result) => dispatch(setAuthenticatedUser(result.authenticated ? result.user : null)))
      .catch(() => dispatch(clearAuthentication()));

    return () => axios.interceptors.response.eject(interceptorId);
  }, [dispatch]);

  return null;
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/elections" element={<Elections />} />
          <Route path="/elections/:id" element={<ElectionDetails />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/research" element={<Research />} />
          <Route path="/news" element={<News />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;


