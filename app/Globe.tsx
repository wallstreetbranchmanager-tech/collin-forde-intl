"use client";
import { useEffect, useRef } from "react";

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dead = false;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      if (dead || !(window as any).THREE) return;
      const THREE = (window as any).THREE;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.3, 6.4);
      const hero = canvas.parentElement!;
      const size = () => {
        const w = hero.clientWidth, h = hero.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      size();
      window.addEventListener("resize", size);
      const group = new THREE.Group();
      scene.add(group);
      const R = 2;
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(R, 64, 64),
        new THREE.MeshPhongMaterial({
          color: 0x2f6b78,
          shininess: 8,
          map: loader.load("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg"),
        })
      ));
      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const sun = new THREE.DirectionalLight(0xfff2da, 1.2);
      sun.position.set(-4, 2.2, 3.5);
      scene.add(sun);
      [[26.82, -80.14], [7.88, 98.39], [10.65, -61.52]].forEach(([lat, lon]) => {
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lon + 180) * Math.PI) / 180;
        const d = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), new THREE.MeshBasicMaterial({ color: 0xc9a15e }));
        d.position.set(-R * 1.02 * Math.sin(phi) * Math.cos(theta), R * 1.02 * Math.cos(phi), R * 1.02 * Math.sin(phi) * Math.sin(theta));
        group.add(d);
      });
      group.rotation.y = -0.6;
      group.rotation.x = 0.15;
      const tick = () => {
        if (dead) return;
        requestAnimationFrame(tick);
        group.rotation.y += 0.0014;
        renderer.render(scene, camera);
      };
      tick();
    };
    document.body.appendChild(script);
    return () => { dead = true; script.remove(); };
  }, []);
  return <canvas id="globe-canvas" ref={canvasRef} />;
}
