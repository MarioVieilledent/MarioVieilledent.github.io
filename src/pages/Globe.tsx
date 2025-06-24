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
  const controls = useRef<OrbitControls>(null);
  const renderer = useRef<THREE.WebGLRenderer>(null);
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
      controls.current = new OrbitControls(camera.current, canvas.current);
      renderer.current = new THREE.WebGLRenderer({
        canvas: canvas.current,
        antialias: true,
      });
      renderer.current.setPixelRatio(window.devicePixelRatio);
      renderer.current.setSize(width, height, false);
      initScene();
      animate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  const initScene = () => {
    if (camera.current && controls.current) {
      camera.current.position.set(0, 0, 5);
      controls.current.target.set(0, 0, 0);

      controls.current.enableDamping = true; // Smooth camera roation
      controls.current.dampingFactor = 0.15;

      controls.current.minDistance = 0.5;
      controls.current.maxDistance = 20; // Prevent users from zooming too far in or out

      controls.current.update();
    }

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

  useEffect(() => {
    if (!renderer.current || !camera.current) return;

    renderer.current.setSize(window.innerWidth, window.innerHeight);
    renderer.current.setPixelRatio(window.devicePixelRatio);

    const onResize = () => {
      if (renderer.current && camera.current) {
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const animate = () => {
    requestAnimationFrame(animate);
    if (camera.current && controls.current && renderer.current) {
      updateControlSensitivity(camera.current, controls.current);
      renderer.current.render(scene.current, camera.current);
      controls.current.update();
    }
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

      const z = 5;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera.current?.position]);

  return <canvas ref={canvas}></canvas>;
};

export default Globe;
