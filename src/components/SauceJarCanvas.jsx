import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Creates an ultra-crisp procedural label texture for the Tikka Masala jar
 */
function createSauceJarLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Background - Deep rich spicy tikka reddish-orange
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1024);
  bgGrad.addColorStop(0, '#B71C1C');
  bgGrad.addColorStop(0.2, '#D84315');
  bgGrad.addColorStop(0.7, '#E65100');
  bgGrad.addColorStop(1, '#870000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Gold ornate border
  ctx.strokeStyle = '#FFD54F';
  ctx.lineWidth = 16;
  ctx.strokeRect(30, 30, 964, 964);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, 928, 928);

  // Mandala spice circle pattern
  ctx.save();
  ctx.translate(512, 512);
  ctx.strokeStyle = 'rgba(255, 235, 59, 0.12)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 16; i++) {
    ctx.rotate((Math.PI * 2) / 16);
    ctx.beginPath();
    ctx.arc(0, 200, 150, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Top Heritage
  ctx.fillStyle = '#FFE082';
  ctx.font = '900 32px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '8px';
  ctx.fillText('★ SLOW-SIMMERED CRAFT ★', 512, 140);

  // Flame / Chili emoji icons
  ctx.font = '60px sans-serif';
  ctx.fillText('🌶️ 🔥 🌶️', 512, 230);

  // Main Typography - BOLD FLAVOR
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 78px "Impact", "Arial Black", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  ctx.fillText('BOLD FLAVOR', 512, 335);

  // Main Typography - TIKKA MASALA
  ctx.fillStyle = '#FFCA28';
  ctx.font = '900 92px "Impact", "Arial Black", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('TIKKA MASALA', 512, 440);

  // Subtitle
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#FFF8E1';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('ROASTED KASHMIRI CHILI & HEAVY GHEE', 512, 515);

  // Middle banner
  ctx.fillStyle = '#210c05';
  ctx.fillRect(120, 560, 784, 80);
  ctx.fillStyle = '#FFE082';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('MEDIUM-HOT • VELVETY & RICH • 375 mL', 512, 612);

  // Flavor Grid
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('HEAT INDEX:', 180, 710);
  ctx.fillText('HERBS:', 180, 765);
  ctx.fillText('ORIGIN:', 180, 820);

  ctx.fillStyle = '#FFD54F';
  ctx.textAlign = 'right';
  ctx.fillText('★★★★☆ (SPICY)', 844, 710);
  ctx.fillText('Roasted Kasuri Methi & Ginger', 844, 765);
  ctx.fillText('Old Delhi Royal Recipe', 844, 820);

  // Bottom gold seal
  ctx.fillStyle = '#FFCA28';
  ctx.beginPath();
  ctx.arc(512, 915, 55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#BF360C';
  ctx.font = '900 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100% REAL', 512, 910);
  ctx.fillText('SPICES', 512, 932);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

export default function SauceJarCanvas({ scrollProgress = 0, isMacView = false }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const jarGroupRef = useRef(null);
  const spiceParticlesRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Balanced Cinematic Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 0.85);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    mainLight.position.set(6, 7, 7);
    scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xff5722, 2.8);
    rimLight.position.set(-6, -1, -4);
    scene.add(rimLight);

    const warmPoint = new THREE.PointLight(0xffb300, 1.4, 15);
    warmPoint.position.set(-4, 2, 4);
    scene.add(warmPoint);

    // ==========================================
    // 3D JAR HIERARCHY
    // ==========================================
    const jarGroup = new THREE.Group();
    jarGroupRef.current = jarGroup;
    scene.add(jarGroup);

    // 1. Sauce Liquid Inner Core (Rich deep orange-red Tikka Masala)
    const sauceGeo = new THREE.CylinderGeometry(1.28, 1.25, 3.15, 48);
    const sauceMat = new THREE.MeshStandardMaterial({
      color: 0xc83803,
      roughness: 0.25,
      metalness: 0.08,
    });
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.position.y = -0.15;
    jarGroup.add(sauceMesh);

    // 2. Clear Outer Glass Jar
    const glassGeo = new THREE.CylinderGeometry(1.36, 1.33, 3.35, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.78,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.45,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = -0.1;
    jarGroup.add(glassMesh);

    // Glass Shoulder
    const shoulderGeo = new THREE.CylinderGeometry(1.02, 1.36, 0.45, 48);
    const shoulderMesh = new THREE.Mesh(shoulderGeo, glassMat);
    shoulderMesh.position.y = 1.7;
    jarGroup.add(shoulderMesh);

    // Glass Neck
    const neckGeo = new THREE.CylinderGeometry(1.0, 1.02, 0.35, 48);
    const neckMesh = new THREE.Mesh(neckGeo, glassMat);
    neckMesh.position.y = 2.05;
    jarGroup.add(neckMesh);

    // 3. Golden Metal Twist Cap
    const lidGroup = new THREE.Group();
    const lidGeo = new THREE.CylinderGeometry(1.06, 1.06, 0.42, 48);
    const lidMat = new THREE.MeshStandardMaterial({
      color: 0xcca028,
      metalness: 0.9,
      roughness: 0.28,
    });
    const lidMesh = new THREE.Mesh(lidGeo, lidMat);
    lidMesh.position.y = 2.38;
    lidGroup.add(lidMesh);

    // Lid Rim ring
    const rimRingGeo = new THREE.TorusGeometry(1.05, 0.04, 16, 48);
    rimRingGeo.rotateX(Math.PI / 2);
    const rimRing = new THREE.Mesh(rimRingGeo, lidMat);
    rimRing.position.y = 2.58;
    lidGroup.add(rimRing);
    jarGroup.add(lidGroup);

    // 4. Custom Printed Label
    const labelTex = createSauceJarLabelTexture();
    const labelGeo = new THREE.CylinderGeometry(1.38, 1.38, 2.3, 48, 1, true, -Math.PI * 0.72, Math.PI * 1.44);
    const labelMat = new THREE.MeshStandardMaterial({
      map: labelTex,
      roughness: 0.35,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const labelMesh = new THREE.Mesh(labelGeo, labelMat);
    labelMesh.position.y = -0.1;
    jarGroup.add(labelMesh);

    // 5. Floating Spice Specks / Particles around Jar
    const particleCount = 65;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.6 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      positions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffb74d,
      size: 0.07,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const spiceParticles = new THREE.Points(particleGeo, particleMat);
    spiceParticlesRef.current = spiceParticles;
    scene.add(spiceParticles);

    // Resize Observer for robust resizing inside either fullscreen or simulated laptop
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle levitation
      if (jarGroupRef.current) {
        jarGroupRef.current.position.y = Math.sin(elapsedTime * 1.8) * 0.08;
      }

      // Rotating spice specks
      if (spiceParticlesRef.current) {
        spiceParticlesRef.current.rotation.y = elapsedTime * 0.12;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
      labelTex.dispose();
    };
  }, []);

  // Update Jar Rotation and Transform with Scroll Progress
  useEffect(() => {
    if (!jarGroupRef.current) return;
    const jar = jarGroupRef.current;
    const p = Math.min(Math.max(scrollProgress, 0), 1);

    let targetRotY = 0;
    let targetRotX = 0;
    let targetPosX = 1.25;
    let targetScale = isMacView ? 0.72 : 0.88;

    if (p < 0.25) {
      const sub = p / 0.25;
      targetPosX = 1.25 - sub * 0.25;
      targetRotY = sub * 1.4;
      targetRotX = sub * 0.12;
    } else if (p < 0.55) {
      const sub = (p - 0.25) / 0.3;
      targetPosX = 1.0 - sub * 2.1; // Swings to left side to showcase flavor notes
      targetRotY = 1.4 + sub * 3.4;
      targetRotX = 0.12 - sub * 0.08;
    } else if (p < 0.8) {
      const sub = (p - 0.55) / 0.25;
      targetPosX = -1.1 + sub * 2.2; // Moves to right side over ingredients/recipes
      targetRotY = 4.8 + sub * 1.8;
      targetRotX = 0.04 + sub * 0.3; // Tilted angle
    } else {
      const sub = (p - 0.8) / 0.2;
      targetPosX = 1.1 - sub * 1.1; // Centered hero stance
      targetRotY = 6.6 + sub * 1.2;
      targetRotX = 0.34 - sub * 0.25;
      targetScale *= 1.15;
    }

    // Adapt for smaller viewports
    if (typeof window !== 'undefined' && window.innerWidth < 768 && !isMacView) {
      targetPosX *= 0.3;
      targetScale *= 0.75;
    }

    jar.position.x = targetPosX;
    jar.rotation.y = targetRotY;
    jar.rotation.x = targetRotX;
    jar.scale.set(targetScale, targetScale, targetScale);
  }, [scrollProgress, isMacView]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full pointer-events-none select-none"
      style={{ touchAction: 'none' }}
    />
  );
}
