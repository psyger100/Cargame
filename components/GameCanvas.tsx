"use client";
import React, { useRef, useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import * as THREE from "three";

function Game() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
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

            let zAxisIncliment = 0;
            window.addEventListener("keydown", (e) => {
                if (e.key === "w") {
                    if (zAxisIncliment != 0) {
                        vehicle.position.z += zAxisIncliment;
                        if (zAxisIncliment < -2 || zAxisIncliment) {
                            vehicle.position.x += 0.1;
                        } else {
                            vehicle.position.x -= 0.1;
                        }
                    } else {
                        vehicle.position.x -= 0.1;
                    }

                    camera.lookAt(vehicle.position);
                }
                if (e.key === "s") {
                    vehicle.position.x += 0.1;
                    camera.lookAt(vehicle.position);
                }
                if (e.key === "a") {
                    vehicle.position.z += 0.1;
                    zAxisIncliment += 0.1;
                    vehicle.rotation.y += 0.1;
                    camera.lookAt(vehicle.position);
                }
                if (e.key === "d") {
                    zAxisIncliment -= 0.1;

                    vehicle.position.z -= 0.1;
                    vehicle.rotation.y -= 0.1;
                    camera.lookAt(vehicle.position);
                }
            });

            containerRef.current?.appendChild(renderer.domElement);
            const animate = () => {
                requestAnimationFrame(animate);

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
