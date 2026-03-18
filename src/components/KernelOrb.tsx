import React, { useEffect, useRef, useState } from 'react';

const KernelOrb: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [task, setTask] = useState('Analyse du contexte...');
  
  const tasks = [
    "Analyse du contexte...",
    "Exploration de l'espace vectoriel...",
    "Optimisation de la réponse...",
    "Évaluation des singularités Sigma...",
    "Synchronisation des nœuds ERA-5...",
    "Détection des psycho-clusters...",
    "Processus Kernel : PRÊT"
  ];

  useEffect(() => {
    let taskIndex = 0;
    const interval = setInterval(() => {
      taskIndex = (taskIndex + 1) % tasks.length;
      setTask(tasks[taskIndex]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    const particleCount = 200;
    
    // Initialiser les particules en 3D
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        phi: Math.acos(-1 + (2 * i) / particleCount),
        theta: Math.sqrt(particleCount * Math.PI) * Math.acos(-1 + (2 * i) / particleCount),
        radius: 120,
        size: Math.random() * 2 + 1,
        pulseSpeed: 0.02 + Math.random() * 0.05,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }

    let rotation = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Respiration Radiale Pure - Très douce et imperceptible
      const time = Date.now() * 0.0008; // Vitesse ralentie
      // Amplitude réduite à 6 pour une expansion minimale
      const breath = 120 + Math.sin(time) * 6; 
      
      const projected = particles.map(p => {
        // Mouvement de retrait vers le centre et expansion 
        // Pas de rotation spatiale, juste un pulse radial
        const r = breath + Math.sin(time * 2 + p.pulseOffset) * 15;
        
        const x = r * Math.sin(p.phi) * Math.cos(p.theta);
        const y = r * Math.cos(p.phi);
        const z = r * Math.sin(p.phi) * Math.sin(p.theta);
        
        const scale = 500 / (500 - z);
        return {
          px: centerX + x * scale,
          py: centerY + y * scale,
          pz: z,
          scale,
          pulse: (Math.sin(time * 3 + p.pulseOffset) + 1) / 2
        };
      }).sort((a, b) => a.pz - b.pz);

      projected.forEach(p => {
        const alpha = (p.pz + 150) / 300;
        ctx.beginPath();
        
        // Taille des points qui pulse avec l'expansion
        const dotSize = (p.scale * 1.5) * (1 + p.pulse);
        ctx.arc(p.px, p.py, dotSize, 0, Math.PI * 2);
        
        // Couleur plus vive pour l'intensité Kernel
        const intensity = Math.floor(100 + p.pulse * 155);
        ctx.fillStyle = `rgba(34, ${intensity}, 94, ${alpha * 0.95})`;
        
        if (p.pulse > 0.6) {
          ctx.shadowBlur = 10 * p.scale;
          ctx.shadowColor = '#4ade80';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      });

      // Noyau central constant (L'intelligence Kernel)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#4ade80';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#4ade80';
      ctx.fill();

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();
    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col items-center cursor-pointer kernel-orb-container" onClick={onClick}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={300} 
        style={{ filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.3))' }}
      />
    </div>
  );
};

export default KernelOrb;
