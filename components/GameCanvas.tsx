"use client";
import React, { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as THREE from "three";

function Game() {
    const containerRef = useRef<HTMLDivElement>(null);
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
            plane;
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
                rotationY -= mouseX * sensitivity; // Update rotationY
            };

            window.addEventListener("mousemove", handleMouseMove);

            // Random Objects falling from the sky.
            const renderShape = () => {
                const geometry = new THREE.BoxGeometry(2, 2, 2);
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const object = new THREE.Mesh(geometry, material);
                object.position.x = Math.random() * 10 - 5;
                object.position.y = 10;
                object.position.z = Math.random() * 10 - 5;
                scene.add(object);
                const animate = () => {
                    requestAnimationFrame(animate);
                    object.position.y -= 0.05;
                    if (object.position.y < -2) {
                        scene.remove(object);
                    }
                };
                animate();
            };

            setInterval(() => {
                renderShape();
            }, 2000);

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

    return (
        <div ref={containerRef}>
            <h1 className="absolute text-white right-20 font-bold text-2xl">SCORE: 0</h1>
        </div>
    );
}

export default Game;
