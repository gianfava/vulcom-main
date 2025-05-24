import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthGuard from "./AuthGuard";

import { routes, NO_USER, AUTHENTICATED_USER, ADMIN_USER } from "./routes";

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map((routes) => {
        let element;
        if (routes.userLevel === NO_USER) {
          element = (
            <AuthGuard userLevel={routes.userLevel}>{routes.element}</AuthGuard>
          );
        } else element = routes.element;
        
        return <Route key={routes.path} path={routes.path} element={element} />;
      })}
    </Routes>
  );
}
