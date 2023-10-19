import React from "react";
import { useContextComp } from "./MyContext";
import { Navigate, Outlet } from "react-router";
import Loading from "./Loading";
import ChatHolder from "../components/Chat/ChatHolder";

const Protected = () => {
  const { user, loading, serverColdStart } = useContextComp();

  return serverColdStart ? (
    <div id="server-connection-indicator">
      <Loading />
    </div>
  ) : loading ? (
    <Loading />
  ) : user.email ? (
    <>
      <Outlet />
      <ChatHolder />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default Protected;
