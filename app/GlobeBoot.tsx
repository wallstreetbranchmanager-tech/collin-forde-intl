"use client";

import { useEffect } from "react";

export default function GlobeBoot() {
  useEffect(() => {
    if (document.getElementById("aes-three")) return;
    const three = document.createElement("script");
    three.id = "aes-three";
    three.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    three.onload = () => {
      if (document.getElementById("aes-boot")) return;
      const boot = document.createElement("script");
      boot.id = "aes-boot";
      boot.src = "/aes-boot.js";
      document.body.appendChild(boot);
    };
    document.body.appendChild(three);
  }, []);
  return null;
}
