import React, { useContext } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import TokenDeployer from "./pages/TokenDeployer/TokenDeployer";
import MyProfile from "./pages/MyProfile/MyProfile";
import TokenInfo from "./pages/TokenInfo/TokenInfo";
import AboutUs from "./pages/About Us/AboutUs";
import CustomScrollbar from "./components/CustomScrollbar";
import { WalletContext } from "./context/WalletContext";
import TransitionComponent from "./components/Transition";
import { AnimatePresence } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();
  const { walletConnected } = useContext(WalletContext);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <TransitionComponent>
              <Home />
            </TransitionComponent>
          }
        />
        <Route
          path="/launch-new-token"
          element={
            walletConnected ? (
              <TransitionComponent>
                <TokenDeployer />
              </TransitionComponent>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/my-profile"
          element={
            walletConnected ? (
              <TransitionComponent>
                <MyProfile />
              </TransitionComponent>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/token-info"
          element={
            <TransitionComponent>
              <TokenInfo />
            </TransitionComponent>
          }
        />
        <Route
          path="/about-us"
          element={
            <TransitionComponent>
              <AboutUs />
            </TransitionComponent>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { walletConnected } = useContext(WalletContext);

  return (
    <CustomScrollbar>
      <Router>
         

      <div className="bg-gradient-to-r from-black via-blue-950 to-blue-900 text-white min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 py-2 sm:py-2 md:py-0 lg:py-0">
            <AnimatedRoutes />
         
        </main>
        
      </div>
     
   

    </Router>
     </CustomScrollbar>
  );
}

export default App;
