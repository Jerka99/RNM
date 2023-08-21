import "./App.css";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
import Home from "./components/Home";
import MyContextComp, { useContextComp } from "./components/MyContext";
import Protected from "./components/Protected";
import Header from "./components/Header";

function App() {
  function Dashboard() {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  }
  return (
    <div>
      <BrowserRouter>
        <MyContextComp>
          <Routes>
            <Route path="/" element={<Dashboard />}>
              <Route element={<Protected />}>
                <Route path="/home" element={<Home />} />
              </Route>
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>
          </Routes>
        </MyContextComp>
      </BrowserRouter>
    </div>
  );
}

export default App;
