import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera, Html } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
  data: Record<string, any>;
  indicator: 'psy_res' | 'atm' | 'ci';
  timeIndex: number;
  hideLabels?: boolean;
  autoRotate?: boolean;
  atmValue: number;
  eventType?: string;
  showPillars?: boolean;
}

interface CountryMarkerProps {
  position: THREE.Vector3;
  color: string;
  label: string;
  ci: number;
  hideLabels?: boolean;
}

const CountryPulse = ({ position, color, label, ci, hideLabels }: CountryMarkerProps) => {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    // Animation simple pour le feedback visuel
  });

  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Coupling Circle Pulse */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
        <ringGeometry args={[0.03, 0.04 + ci * 0.8, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3 + ci * 2} side={THREE.DoubleSide} depthWrite={false} depthTest={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
        <ringGeometry args={[0.02, 0.025 + ci * 0.4, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.15 + ci} side={THREE.DoubleSide} depthWrite={false} depthTest={false} />
      </mesh>

      {!hideLabels && (
        <Html distanceFactor={8} position={[0, 0.05, 0]} style={{ pointerEvents: 'auto' }}>
          <div className="mono small uppercase" style={{ 
            color: 'white', 
            fontSize: '10px', 
            whiteSpace: 'nowrap', 
            cursor: 'pointer',
            background: 'rgba(2, 6, 23, 0.4)', 
            padding: '2px 6px', 
            border: `1px solid rgba(34, 197, 94, 0.4)`,
            borderRadius: '1px',
            backdropFilter: 'blur(4px)',
            transform: 'translate(-50%, -100%)'
          }}>
            {label}
          </div>
        </Html>
      )}
    </group>
  );
};

const AtmosphericHalo = () => {
  return (
    <mesh scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial 
        color="#22d3ee" 
        transparent 
        opacity={0.05} 
        side={THREE.BackSide} 
      />
    </mesh>
  );
};

const Earth = ({ selectedCountry, onSelectCountry, data, indicator, timeIndex, hideLabels, showPillars, autoRotate, atmValue, eventType }: GlobeProps) => {
  const globeRef = useRef<THREE.Group>(null);
  const surfaceRef = useRef<THREE.Mesh>(null);
  
  // High-res Earth Textures (Blue Marble style)
  const [colorMap, nightMap, bumpMap] = useLoader(THREE.TextureLoader, [
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'
  ]);

  const countryCoords: Record<string, [number, number]> = {
    'FR': [46.2276, 2.2137],
    'DE': [51.1657, 10.4515],
    'IT': [41.8719, 12.5674],
    'ES': [40.4637, -3.7492],
    'UK': [55.3781, -3.4360],
    'PL': [51.9194, 19.1451]
  };

  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const countryMarkers = useMemo(() => {
    return Object.entries(countryCoords).map(([code, [lat, lon]]) => {
      const pos = latLonToVector3(lat, lon, 2.08);
      const countryData = data[code];
      const val = countryData ? (indicator === 'ci' ? (countryData.ci_series ? countryData.ci_series[timeIndex] : 0) : countryData[indicator][timeIndex]) : 0;
      const ciVal = countryData?.ci_series ? countryData.ci_series[timeIndex] : 0;
      
      const t = indicator === 'ci' ? Math.min(1, val * 10) : Math.min(1, Math.max(0, (val + 2.5) / 5));
      const color = new THREE.Color().lerpColors(new THREE.Color('#334155'), new THREE.Color('#22c55e'), t);
      
      return { code, pos, color: '#' + color.getHexString(), val, ciVal };
    });
  }, [data, indicator, timeIndex]);

  useFrame((state, delta) => {
    if (globeRef.current && autoRotate) {
      globeRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Planetary Body */}
      <mesh ref={surfaceRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshPhongMaterial 
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          emissiveMap={nightMap}
          emissive={new THREE.Color('#ffffcc')}
          emissiveIntensity={0.8}
          specular={new THREE.Color('#333333')}
          shininess={5}
        />
      </mesh>
      
      {/* Science Grid Overlay */}
      <mesh>
        <sphereGeometry args={[2.005, 32, 32]} />
        <meshBasicMaterial color="#22c55e" wireframe transparent opacity={0.03} />
      </mesh>

      <AtmosphericHalo />

      {/* Only show label for selected country or pulse for others */}
      {countryMarkers.map(c => {
        const isSelected = c.code === selectedCountry;
        if (!isSelected) {
          return (
            <group key={c.code} position={c.pos}>
              <mesh onClick={() => onSelectCountry(c.code)} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
                <sphereGeometry args={[0.02, 12, 12]} />
                <meshBasicMaterial color={c.color} transparent opacity={0.8} />
              </mesh>
              {/* Pulse circle even when not selected */}
              {showPillars && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0.01]} renderOrder={10}>
                  <ringGeometry args={[0.025, 0.03 + c.ciVal * 0.4, 32]} />
                  <meshBasicMaterial color="#22c55e" transparent opacity={0.2 + c.ciVal * 2} depthWrite={false} depthTest={false} />
                </mesh>
              )}
            </group>
          );
        }
        return (
          <group key={c.code} onClick={() => onSelectCountry(c.code)} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = 'auto')}>
            <CountryPulse 
              position={c.pos} 
              color="#22c55e" 
              label={`${c.code}: ${c.val.toFixed(4)}`} 
              ci={showPillars ? c.ciVal : 0}
              hideLabels={hideLabels}
            />
          </group>
        );
      })}
    </group>
  );
};


const EuropeMap: React.FC<GlobeProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas dpr={[1, 2]} gl={{ antialias: true }} camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <Stars radius={100} depth={50} count={6000} factor={4} saturation={1} fade speed={1} />
        
        {/* Cinematic Solar Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 5, 5]} intensity={2.5} color="#fffcf0" />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#22d3ee" />

        <React.Suspense fallback={<Html center><div className="mono accent uppercase">SYNCHRONIZING EARTH TEXTURES...</div></Html>}>
          <Earth {...props} />
        </React.Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minDistance={3} 
          maxDistance={12} 
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
};

export default EuropeMap;
