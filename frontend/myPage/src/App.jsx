import "./App.css";
import SignIn from "./components/sign-In-Up/SignIn";
import SignUp from "./components/sign-In-Up/SignUp";
import { Navigate, Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
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
            <Route path='*' element={<Navigate to='/home' />} />
          </Routes>
        </MyContextComp>
      </BrowserRouter>
    </div>
  );
}

export default App;
