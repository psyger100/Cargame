"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Car: React.FC = () => {
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

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                1000,
            );
            camera.position.z = 5;
            const renderer = new THREE.WebGLRenderer();
            // const controls = new OrbitControls(camera, renderer.domElement);
            renderer.setSize(window.innerWidth, window.innerHeight);
            containerRef.current?.appendChild(renderer.domElement);
            scene.add(vehicle);
            const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
            scene.add(directionalLight);

            const animate = () => {
                requestAnimationFrame(animate);
                // controls.update();
                renderer.render(scene, camera);
            };
            animate();
            return () => {
                containerRef.current?.removeChild(renderer.domElement);
            };
        }
    }, []);
    return <div ref={containerRef}></div>;
};
export default Car;
