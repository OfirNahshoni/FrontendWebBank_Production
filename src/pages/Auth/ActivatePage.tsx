import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { activate } from "../../lib/api";
import { notifyError, notifySuccess } from "../../lib/notify";

const ActivatePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasActivated = useRef(false);

  useEffect(() => {
    async function runActivation() {
      if (hasActivated.current) return;
      
      // Parse the pathname manually: /auth/:pincode/:JWT
      // JWT tokens contain dots, so we need to extract everything after the pincode
      const pathParts = location.pathname.split("/").filter(Boolean);
      
      if (pathParts.length < 3 || pathParts[0] !== "auth") {
        notifyError("Activation failed", "Activation link is invalid.");
        navigate("/login", { replace: true });
        return;
      }

      const pincode = pathParts[1];
      // JWT is everything after pincode, join in case there are any slashes
      const JWT = pathParts.slice(2).join("/");
      
      if (!pincode || !JWT) {
        notifyError("Activation failed", "Activation link is invalid.");
        navigate("/login", { replace: true });
        return;
      }

      hasActivated.current = true;

      try {
        await activate(pincode, JWT);
        notifySuccess("Account activated", "You can now login in.");
        navigate("/login", { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Activation failed";
        notifyError("Activation failed", message);
        navigate("/login", { replace: true });
      }
    }

    void runActivation();
  }, [location.pathname, navigate]);

  return null;
};

export default ActivatePage;
