"use client";
import React, { useRef, useEffect, useState } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import axios from "axios";
import Link from "next/link";

interface GameProps {
    userId: string;
    displayName: string;
}
function Game({ userId, displayName }: GameProps) {
    console.log(userId, displayName);
    const containerRef = useRef<HTMLDivElement>(null);
    const [Score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [lastResults, setLastResults] = useState([]);

    function randomColor() {
        return Math.random() * 0xffffff;
    }

    function createSphereWheel(
        radius: number,
        widthSegments: number,
        heightSegments: number,
    ) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
        return new THREE.Mesh(geometry, material);
    }
    function createCylinderWheel(
        radiusTop: number,
        radiusBottom: number,
        height: number,
        radialSegments: number,
    ) {
        const geometry = new THREE.CylinderGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
        );
        const material = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const wheel = new THREE.Mesh(geometry, material);
        wheel.rotation.x = Math.PI / 2;
        wheel.rotation.z = Math.PI / 2;
        return wheel;
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
            );
            const controls = new OrbitControls(camera, renderer.domElement);
            renderer.render(scene, camera);
            camera.position.z = -0.5;
            camera.position.y = 2;
            camera.position.x = 5;
            const planeGeometry = new THREE.PlaneGeometry(300, 300);

            const planeMaterial = new THREE.MeshBasicMaterial({
                color: 0x00ff00,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0,
            });

            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            scene.add(plane);

            const gridHelper = new THREE.GridHelper(300, 300);
            scene.add(gridHelper);

            const vehicle = new THREE.Group();
            const chassisGeometry = new THREE.BoxGeometry(2, 0.4, 2);
            const chassisMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const chassis = new THREE.Mesh(chassisGeometry, chassisMaterial);
            vehicle.add(chassis);
            const sphereWheelRadius = 0.5;
            const sphereWheelSegments = 32;
            const frontWheel1 = createSphereWheel(
                sphereWheelRadius,
                sphereWheelSegments,
                sphereWheelSegments,
            );
            frontWheel1.position.set(0, -0.5, -1);
            vehicle.add(frontWheel1);
            const cylinderWheelRadius = 0.3;
            const cylinderWheelHeight = 0.45;
            const cylinderWheelSegments = 32;
            const backWheel1 = createCylinderWheel(
                cylinderWheelRadius,
                cylinderWheelRadius,
                cylinderWheelHeight,
                cylinderWheelSegments,
            );
            backWheel1.position.set(1, -0.5, 1);
            vehicle.add(backWheel1);

            const backWheel2 = createCylinderWheel(
                cylinderWheelRadius,
                cylinderWheelRadius,
                cylinderWheelHeight,
                cylinderWheelSegments,
            );
            backWheel2.position.set(-1, -0.5, 1);
            vehicle.add(backWheel2);
            scene.add(vehicle);
            vehicle.position.y = 1;
            vehicle.rotation.y = Math.PI / 2;

            let vehicleSpeed = 0.1;
            let rotationY = vehicle.rotation.y;
            const keys = {};

            document.addEventListener("keydown", (event: any) => {
                // @ts-ignore
                keys[event.key.toLowerCase()] = true;
            });

            document.addEventListener("keyup", (event: any) => {
                // @ts-ignore
                keys[event.key.toLowerCase()] = false;
            });

            const handleMouseMove = (event: any) => {
                const mouseX = event.movementX;
                const sensitivity = 0.001;
                rotationY -= mouseX * sensitivity;
            };

            window.addEventListener("mousemove", handleMouseMove);

            // Random Objects falling from the sky.
            const renderShape = () => {
                const shapes = [
                    "cube",
                    "sphere",
                    "cylinder",
                    "cone",
                    "torus",
                    "octahedron",
                ];
                const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                let geometry;
                switch (randomShape) {
                    case "cube":
                        geometry = new THREE.BoxGeometry(
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                        );
                        break;
                    case "sphere":
                        geometry = new THREE.SphereGeometry(
                            Math.floor(Math.random() * 20),
                            Math.floor(Math.random() * 32),
                            Math.floor(Math.random() * 32),
                        );
                        break;
                    case "cylinder":
                        geometry = new THREE.CylinderGeometry(
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 40),
                        );
                        break;
                    case "cone":
                        geometry = new THREE.ConeGeometry(
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 40),
                        );
                        break;
                    case "torus":
                        geometry = new THREE.TorusGeometry(
                            Math.floor(Math.random() * 4),
                            0.3,
                            Math.floor(Math.random() * 20),
                            Math.floor(Math.random() * 150),
                        );
                        break;
                    case "octahedron":
                        geometry = new THREE.OctahedronGeometry(
                            Math.floor(Math.random() * 8),
                        );
                        break;
                    default:
                        geometry = new THREE.BoxGeometry(
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                            Math.floor(Math.random() * 8),
                        );
                }

                const material = new THREE.MeshBasicMaterial({ color: randomColor() });
                const object = new THREE.Mesh(geometry, material);
                object.position.x = vehicle.position.x - Math.floor(Math.random() * 4);
                object.position.y = 10;
                object.position.z = vehicle.position.z - Math.floor(Math.random() * 4);
                scene.add(object);
                let objectRemoved = false;
                const animate = () => {
                    object.position.y -= 0.05;
                    if (object.position.y < -10 && !objectRemoved && !gameOver) {
                        objectRemoved = true;
                        scene.remove(object);
                        setScore((prev) => prev + 0.5);
                    }
                    if (
                        object.position.x === vehicle.position.x &&
                        vehicle.position.z - object.position.z <= 2 &&
                        object.position.y < 1
                    ) {
                        clearTimeout(randomShapeAtLittleInterval);
                        setGameOver(true);
                    }
                    requestAnimationFrame(animate);
                };
                animate();
            };

            const randomShapeAtLittleInterval = setInterval(() => {
                if (!gameOver) {
                    renderShape();
                }
            }, 1500);

            containerRef.current?.appendChild(renderer.domElement);
            const animate = () => {
                requestAnimationFrame(animate);
                // @ts-ignore
                if (keys["w"]) {
                    vehicle.translateZ(-vehicleSpeed);
                }
                // @ts-ignore
                if (keys["s"]) {
                    vehicle.translateZ(vehicleSpeed);
                }
                vehicle.rotation.y = rotationY;
                camera.position.x = vehicle.position.x + 5;
                camera.position.y = vehicle.position.y + 1;
                camera.position.z = vehicle.position.z + 1;
                camera.lookAt(vehicle.position);

                renderer.render(scene, camera);
            };
            animate();
            return () => {
                containerRef.current?.removeChild(renderer.domElement);
            };
        }
    }, []);
    useEffect(() => {
        if (gameOver && Score != 0) {
            const data = axios.post("/api/addScore", {
                userId: userId,
                score: Score,
            });
            console.log(data);
        }
        const data = async () => {
            return await axios.post("/api/getResults", {
                userId: userId,
            });
        };
        data().then((res) => {
            const result = res.data.map((item: any) => {
                return (
                    <div key={item.id} className="flex  w-[30vw] select-none">
                        <p className=" font-bold text-2xl">{displayName}</p>
                        <p className="pl-[20vw]  font-bold text-2xl mt-1">{item.score}</p>
                    </div>
                );
            });
            setLastResults(result);
        });
    }, [gameOver]);

    return (
        <div ref={containerRef}>
            <h1 className="absolute text-white right-20 font-bold text-2xl">
                SCORE: {Score}
            </h1>
            {gameOver && (
                <div className="absolute right-50 w-full h-full border border-white flex flex-col  items-center  top-0 overflow-hidden">
                    <div className=" border-l-2 border-gray-400 p-4 h-full w-[30vw] border-r-2 flex flex-col items-center bg-gray-400 ">
                        <h1 className=" text-white font-bold text-6xl  ">GAME OVER</h1>
                        <h1 className=" text-white font-bold text-6xl ">{displayName}</h1>
                        <h1 className=" text-black font-bold text-4xl mt-[4vh] ">
                            Results
                        </h1>
                        <div className="w-full ">{lastResults}</div>
                        <Link
                            href={"/"}
                            className="h-[10vh] w-[10vw] border rounded-xl bg-black font-bold text-3xl absolute bottom-[5vh] left-[45vw] flex items-center justify-center select-none"
                        >
                            Exit
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Game;
