'use client';

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useArchitectStore } from '../../store/useArchitectStore';

export function FPSCameraController() {
  const { camera } = useThree();
  const cameraMode = useArchitectStore((state) => state.settings.cameraMode);
  const plot = useArchitectStore((state) => state.plot);

  const keys = useRef<Record<string, boolean>>({});
  const moveSpeed = 0.35;
  const personEyeHeight = 5.0; // 5 ft person height

  useEffect(() => {
    if (cameraMode !== 'fps') return;

    // Position camera at eye height of a 5 ft tall person inside room center
    camera.position.set(plot.w / 2, personEyeHeight, plot.h / 2 + 6);
    camera.lookAt(plot.w / 2, personEyeHeight, plot.h / 2);

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [cameraMode, camera, plot]);

  useFrame(() => {
    if (cameraMode !== 'fps') return;

    // Get forward vector relative to camera look direction
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0; // Lock vertical tilt movement to horizontal walk plane
    forward.normalize();

    // Right vector for strafing (A = Left, D = Right)
    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    if (keys.current['w'] || keys.current['arrowup']) {
      camera.position.addScaledVector(forward, moveSpeed);
    }
    if (keys.current['s'] || keys.current['arrowdown']) {
      camera.position.addScaledVector(forward, -moveSpeed);
    }
    if (keys.current['a'] || keys.current['arrowleft']) {
      camera.position.addScaledVector(right, -moveSpeed); // Moves LEFT
    }
    if (keys.current['d'] || keys.current['arrowright']) {
      camera.position.addScaledVector(right, moveSpeed); // Moves RIGHT
    }

    // Lock Y height to 5.0 ft (5 ft tall person)
    camera.position.y = personEyeHeight;
  });

  if (cameraMode !== 'fps') return null;

  return (
    <PointerLockControls selector="#fpsCanvasOverlay" />
  );
}
