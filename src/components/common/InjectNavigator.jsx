// src/components/common/InjectNavigator.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { injectNavigate } from "@/services/common/api";

export default function InjectNavigator() {
  const navigate = useNavigate();

  useEffect(() => {
    injectNavigate(navigate); 
  }, [navigate]);

  return null;
}
