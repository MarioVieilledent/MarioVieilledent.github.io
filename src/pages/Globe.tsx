import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createTileMesh } from "../utils/mathUtils";
import { TileManager } from "../utils/tileFetching";
import { clamp } from "three/src/math/MathUtils.js";

const DEFAULT_FOV = 45;

const Globe = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<THREE.Scene>(new THREE.Scene());
  const camera = useRef<THREE.PerspectiveCamera>(null);
  let controls: OrbitControls;
  let renderer: THREE.WebGLRenderer;
  const tilesGroup = new THREE.Group();

  useEffect(() => {
    if (canvas.current) {
      const width = canvas.current.clientWidth;
      const height = canvas.current.clientHeight;
      camera.current = new THREE.PerspectiveCamera(
        DEFAULT_FOV,
        width / height,
        0.1,
        1000
      );
      controls = new OrbitControls(camera.current, canvas.current);
      renderer = new THREE.WebGLRenderer({
        canvas: canvas.current,
        antialias: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height, false);
      initScene();
      animate();
    }
  }, [canvas]);

  const initScene = () => {
    camera.current?.position.set(0, 0, 5);
    controls.target.set(0, 0, 0);

    controls.enableDamping = true; // Smooth camera roation
    controls.dampingFactor = 0.15;

    controls.minDistance = 0.5;
    controls.maxDistance = 20; // Prevent users from zooming too far in or out

    controls.update();

    scene.current.add(new THREE.AmbientLight(0xffffff, 1.5));

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(2, 3, 1);
    scene.current.add(directionalLight);

    // Tiles group
    scene.current.add(tilesGroup);

    // Sphere

    const sphereGeometry = new THREE.SphereGeometry(0.95, 64, 64);
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0x0077ff, // 0x223344 0x0077ff
      transparent: true,
      opacity: 0.5,
      wireframe: false,
    });
    const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.current.add(globe);
  };

  const updateControlSensitivity = (
    camera: THREE.Camera,
    controls: OrbitControls
  ) => {
    const distance = camera.position.length(); // from origin

    // Customize these values
    const minDistance = 1.01; // just above surface
    const maxDistance = 2;

    const t = clamp(
      (distance - minDistance) / (maxDistance - minDistance),
      0,
      1
    );

    // Sensitivity mapping (log or power-based curve for smoother scale)
    controls.zoomSpeed = 0.1 + 2 * t ** 2; // from 0.1 to 1.6
    controls.rotateSpeed = 0.1 + 1.0 * t ** 2; // from 0.1 to 1.1
    controls.panSpeed = 0.1 + 1.5 * t ** 2;
  };

  //  Handle resize based on canvas' parent element
  useEffect(() => {
    if (!canvas.current || !canvas.current.parentElement) return;
    const resize = () => {
      const parent = canvas.current?.parentElement;
      if (parent) {
        renderer.setSize(parent.clientWidth, parent.clientHeight, false);
        if (camera.current) {
          camera.current.aspect = parent.clientWidth / parent.clientHeight;
          camera.current.updateProjectionMatrix();
        }
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.current.parentElement);
    resize();
    return () => observer.disconnect();
  }, []);

  const animate = () => {
    requestAnimationFrame(animate);
    camera.current ? updateControlSensitivity(camera.current, controls) : {};
    camera.current ? renderer.render(scene.current, camera.current) : {};
    controls.update();
  };

  useEffect(() => {
    if (camera.current) {
      // console.log("position", camera.current.position);

      // const [lon, lat] = cartesianToLatLon(camera.current.position);
      // console.log("coord", lon, lat);

      // const { x, y } = latLonToTile(lat, lon, 3);
      // console.log("x y ", x, y);

      const tileManager = new TileManager(
        (z, x, y) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
        // (z, x, y) => `https://tile.opentopomap.org/${z}/${x}/${y}.png`
      );

      const z = 4;

      for (let x = 0; x < 2 ** z; x++) {
        for (let y = 0; y < 2 ** z; y++) {
          tileManager.loadTile(z, x, y).then((image) => {
            const texture = new THREE.Texture(image);
            texture.needsUpdate = true;

            const mesh = createTileMesh(z, x, y, texture);
            tilesGroup.add(mesh);
          });
        }
      }
    }
  }, [camera.current?.position]);

  return (
    <div className="w-100 h-100">
      <canvas ref={canvas}></canvas>
    </div>
  );
};

export default Globe;
