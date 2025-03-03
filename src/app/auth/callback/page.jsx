'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        try {
          const response = await fetch(`/api/auth0/callback`, {
            method:'POST',
            headers: {'Content-type': 'application/json'},
            body:JSON.stringify({ code: authCode })
          });
          const data = await response.json();
          if (data.token) {
            localStorage.setItem("token", data.token);
            router.push("/");
          }
        } catch (error) {
          console.error("Error en la autenticación:", error);
        }
      }
    };
    handleAuth();
  },[router]);
}