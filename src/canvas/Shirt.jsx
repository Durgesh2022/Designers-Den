import React, { useRef } from 'react';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { useFrame } from '@react-three/fiber';
import { Decal, useGLTF, useTexture } from '@react-three/drei';

import state from '../store';

const Shirt = () => {
  const snap = useSnapshot(state);
  const { nodes, materials } = useGLTF('/shirt_baked.glb');
  const shirtRef = useRef();

  const logoTexture = useTexture(snap.logoDecal);
  const fullTexture = useTexture(snap.fullDecal);
  const backLogoTexture = useTexture(snap.backLogoDecal);
  const pocketLogoTexture = useTexture(snap.pocketLogoDecal);

  useFrame((state, delta) => {
    // Smoothly update the material color
    easing.dampC(materials.lambert1.color, snap.color, 0.25, delta);

    // Apply rotation to the shirt group
    if (shirtRef.current) {
      shirtRef.current.rotation.y += 0.01; // Adjust the rotation speed here
    }
  });

  const stateString = JSON.stringify(snap);

  return (
    <group ref={shirtRef} key={stateString}>
      <mesh
        castShadow
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        dispose={null}
      >
        {snap.isFullTexture && (
          <Decal
            position={[0, 0, 0]}
            rotation={[0, 0, 0]}
            scale={1}
            map={fullTexture}
          />
        )}

        {snap.isLogoTexture && (
          <>
            {/* Main Logo */}
            <Decal
              position={[0, 0.0, 0.15]} // Position for main logo
              rotation={[0, 0, 0]}
              scale={0.15}
              map={logoTexture}
              map-anisotropy={16}
              depthTest={false}
              depthWrite={true}
            />

            {/* Pocket Logo Overlaying the Main Logo */}
            {snap.isLogoTexture && (
              <Decal
                position={[0.10, 0.12, 0.10]} // Slightly above the main logo for overlay
                rotation={[0, 0, 0]}
                scale={0.06} // Smaller scale for pocket logo
                map={pocketLogoTexture}
                map-anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
          </>
        )}

        {/* Back Logo */}
        {snap.isLogoTexture && (
          <Decal
            position={[0, 0.04, -0.15]}
            rotation={[0, Math.PI, 0]}
            scale={0.15}
            map={backLogoTexture}
            map-anisotropy={16}
            depthTest={false}
            depthWrite={true}
          />
        )}
      </mesh>
    </group>
  );
};

export default Shirt;
