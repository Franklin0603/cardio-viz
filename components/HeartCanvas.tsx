"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface Props {
  bpm: number;
  rhythm: string;
}

type ViewMode = "abstract" | "fullbody" | "anatomical";

const LABELS = [
  { id: "aorta",     text: "Aorta",             px: 53, py: 14 },
  { id: "svc",       text: "Superior Vena Cava", px: 18, py: 20 },
  { id: "pulm",      text: "Pulmonary Trunk",    px: 66, py: 34 },
  { id: "rv",        text: "Right Ventricle",    px: 18, py: 62 },
  { id: "lv",        text: "Left Ventricle",     px: 66, py: 68 },
  { id: "ra",        text: "Right Atrium",       px: 20, py: 38 },
  { id: "la",        text: "Left Atrium",        px: 64, py: 20 },
];

// ── Procedural realistic heart builder ────────────────────────────────────────
function buildRealisticHeart(scene_or_group: THREE.Object3D) {
  const group = new THREE.Group();

  const heartMat = new THREE.MeshPhongMaterial({
    color: 0xb01830, emissive: 0x3a0008,
    specular: 0xff8877, shininess: 55,
  });
  const darkMat = new THREE.MeshPhongMaterial({
    color: 0x8a1020, emissive: 0x200005,
    specular: 0xcc6655, shininess: 30,
  });
  const vesselMat = new THREE.MeshPhongMaterial({
    color: 0x991525, emissive: 0x200005, shininess: 40,
  });
  const veinMat = new THREE.MeshPhongMaterial({
    color: 0x1a2d7a, emissive: 0x000618, shininess: 40,
  });

  // ── Main ventricular body (left+right fused) ──────────────────────────────
  // Left ventricle — dominant, rounded cone
  const lvGeo = new THREE.SphereGeometry(1.0, 32, 24);
  const lvPos = lvGeo.attributes.position;
  for (let i = 0; i < lvPos.count; i++) {
    const x = lvPos.getX(i), y = lvPos.getY(i), z = lvPos.getZ(i);
    // Elongate downward into apex
    const newY = y < 0 ? y * 1.55 : y * 0.85;
    // Flatten front-back slightly
    const newZ = z * 0.78;
    // Taper toward apex
    const taper = y < 0 ? 1 + y * 0.18 : 1;
    lvPos.setXYZ(i, x * taper * 0.92, newY, newZ);
  }
  lvGeo.computeVertexNormals();
  const lv = new THREE.Mesh(lvGeo, heartMat);
  lv.position.set(0.25, -0.1, 0);
  group.add(lv);

  // Right ventricle — flatter, wraps left side of LV
  const rvGeo = new THREE.SphereGeometry(0.78, 28, 20);
  const rvPos = rvGeo.attributes.position;
  for (let i = 0; i < rvPos.count; i++) {
    const x = rvPos.getX(i), y = rvPos.getY(i), z = rvPos.getZ(i);
    rvPos.setXYZ(i, x * 0.65, y < 0 ? y * 1.3 : y * 0.8, z * 0.7);
  }
  rvGeo.computeVertexNormals();
  const rv = new THREE.Mesh(rvGeo, darkMat);
  rv.position.set(-0.7, -0.05, 0.15);
  group.add(rv);

  // ── Atria (upper chambers) ────────────────────────────────────────────────
  // Left atrium — back upper
  const laGeo = new THREE.SphereGeometry(0.62, 24, 18);
  const laPos = laGeo.attributes.position;
  for (let i = 0; i < laPos.count; i++) {
    const x = laPos.getX(i), y = laPos.getY(i), z = laPos.getZ(i);
    laPos.setXYZ(i, x * 0.9, y * 0.72, z * 0.75);
  }
  laGeo.computeVertexNormals();
  const la = new THREE.Mesh(laGeo, heartMat);
  la.position.set(0.4, 0.82, -0.28);
  group.add(la);

  // Right atrium — front upper right
  const raGeo = new THREE.SphereGeometry(0.55, 24, 18);
  const raPos = raGeo.attributes.position;
  for (let i = 0; i < raPos.count; i++) {
    const x = raPos.getX(i), y = raPos.getY(i), z = raPos.getZ(i);
    raPos.setXYZ(i, x * 0.78, y * 0.68, z * 0.72);
  }
  raGeo.computeVertexNormals();
  const ra = new THREE.Mesh(raGeo, darkMat);
  ra.position.set(-0.72, 0.75, 0.18);
  group.add(ra);

  // ── Great vessels ─────────────────────────────────────────────────────────
  // Aorta — ascending then arching
  const aortaPts = [
    new THREE.Vector3(0.3, 0.9, 0.1),
    new THREE.Vector3(0.5, 1.5, 0.05),
    new THREE.Vector3(0.4, 2.0, -0.15),
    new THREE.Vector3(0.0, 2.3, -0.3),
    new THREE.Vector3(-0.5, 2.2, -0.3),
  ];
  const aortaCurve = new THREE.CatmullRomCurve3(aortaPts);
  const aortaGeo = new THREE.TubeGeometry(aortaCurve, 24, 0.155, 12, false);
  group.add(new THREE.Mesh(aortaGeo, vesselMat));

  // Aortic arch branches (brachiocephalic etc.)
  const branchPts = [new THREE.Vector3(0.2, 2.15, -0.2), new THREE.Vector3(0.6, 2.6, -0.1), new THREE.Vector3(0.7, 3.1, 0.0)];
  const bGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(branchPts), 10, 0.07, 8);
  group.add(new THREE.Mesh(bGeo, vesselMat));

  // Pulmonary trunk — left and up
  const pulPts = [
    new THREE.Vector3(-0.3, 0.85, 0.25),
    new THREE.Vector3(-0.6, 1.3, 0.2),
    new THREE.Vector3(-0.9, 1.7, 0.05),
    new THREE.Vector3(-1.2, 1.9, -0.1),
  ];
  const pulGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pulPts), 16, 0.12, 10);
  group.add(new THREE.Mesh(pulGeo, vesselMat));

  // Superior vena cava — coming down from above right
  const svcPts = [
    new THREE.Vector3(-0.65, 0.9, 0.1),
    new THREE.Vector3(-0.7, 1.5, 0.05),
    new THREE.Vector3(-0.65, 2.2, 0.0),
    new THREE.Vector3(-0.5, 2.9, -0.05),
  ];
  const svcGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(svcPts), 16, 0.1, 10);
  group.add(new THREE.Mesh(svcGeo, veinMat));

  // Inferior vena cava — from below
  const ivcPts = [
    new THREE.Vector3(-0.6, 0.55, 0.0),
    new THREE.Vector3(-0.65, 0.05, -0.05),
    new THREE.Vector3(-0.6, -0.5, -0.1),
  ];
  const ivcGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ivcPts), 10, 0.09, 8);
  group.add(new THREE.Mesh(ivcGeo, veinMat));

  // Pulmonary veins (4 — pairs left and right)
  const pvPositions = [
    [0.55, 0.72, -0.35], [0.62, 0.58, -0.32],
    [0.10, 0.78, -0.38], [0.16, 0.62, -0.36],
  ];
  pvPositions.forEach(([x, y, z]) => {
    const pvPts = [
      new THREE.Vector3(x, y, z as number),
      new THREE.Vector3(x + 0.3, y + 0.1, (z as number) - 0.2),
      new THREE.Vector3(x + 0.6, y + 0.05, (z as number) - 0.35),
    ];
    const pvGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pvPts), 8, 0.055, 7);
    group.add(new THREE.Mesh(pvGeo, veinMat));
  });

  // ── Coronary arteries (surface vessels) ───────────────────────────────────
  const coronaryMat = new THREE.MeshPhongMaterial({
    color: 0x8a1525, emissive: 0x180003, shininess: 60,
  });
  const coroBlue = new THREE.MeshPhongMaterial({
    color: 0x1530a0, emissive: 0x000315, shininess: 50,
  });

  // Left anterior descending
  const ladPts = [
    new THREE.Vector3(0.05, 0.65, 0.42),
    new THREE.Vector3(0.1, 0.1, 0.52),
    new THREE.Vector3(0.12, -0.5, 0.50),
    new THREE.Vector3(0.08, -1.0, 0.42),
    new THREE.Vector3(0.0, -1.45, 0.28),
  ];
  const ladGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ladPts), 20, 0.038, 7);
  group.add(new THREE.Mesh(ladGeo, coronaryMat));

  // Circumflex branch
  const lcxPts = [
    new THREE.Vector3(0.05, 0.65, 0.42),
    new THREE.Vector3(-0.3, 0.7, 0.38),
    new THREE.Vector3(-0.7, 0.5, 0.22),
    new THREE.Vector3(-0.9, 0.1, 0.1),
  ];
  const lcxGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lcxPts), 14, 0.032, 7);
  group.add(new THREE.Mesh(lcxGeo, coronaryMat));

  // Right coronary
  const rcaPts = [
    new THREE.Vector3(-0.3, 0.68, 0.35),
    new THREE.Vector3(-0.65, 0.4, 0.3),
    new THREE.Vector3(-0.82, 0.0, 0.2),
    new THREE.Vector3(-0.75, -0.5, 0.05),
    new THREE.Vector3(-0.55, -0.95, -0.05),
  ];
  const rcaGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rcaPts), 18, 0.033, 7);
  group.add(new THREE.Mesh(rcaGeo, coronaryMat));

  // Small coronary veins (blue)
  const cvPts = [
    new THREE.Vector3(0.3, 0.55, 0.4),
    new THREE.Vector3(0.5, 0.2, 0.45),
    new THREE.Vector3(0.55, -0.3, 0.4),
    new THREE.Vector3(0.4, -0.8, 0.3),
  ];
  const cvGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cvPts), 14, 0.028, 6);
  group.add(new THREE.Mesh(cvGeo, coroBlue));

  // ── Pericardial fat patches ───────────────────────────────────────────────
  const fatMat = new THREE.MeshPhongMaterial({
    color: 0xd4a855, emissive: 0x1a0a00,
    transparent: true, opacity: 0.55, shininess: 10,
  });
  [[0.15, 0.55, 0.45], [-0.4, 0.3, 0.38], [0.5, -0.2, 0.42]].forEach(([x, y, z]) => {
    const fg = new THREE.SphereGeometry(0.12, 8, 6);
    const fm = new THREE.Mesh(fg, fatMat);
    fm.position.set(x, y, z);
    fm.scale.set(1.4, 0.6, 0.9);
    group.add(fm);
  });

  // Center the whole group
  group.position.set(0, -0.3, 0);
  return group;
}

// ── Full body silhouette builder ──────────────────────────────────────────────
function buildBody() {
  const group = new THREE.Group();

  // Semi-transparent skin material
  const skinMat = new THREE.MeshPhongMaterial({
    color: 0x0d1520, emissive: 0x05080f,
    transparent: true, opacity: 0.72,
    side: THREE.DoubleSide,
  });
  const skinEdge = new THREE.MeshPhongMaterial({
    color: 0x1a2535, emissive: 0x080c14,
    transparent: true, opacity: 0.5,
    side: THREE.DoubleSide, wireframe: false,
  });

  // Torso
  const torsoGeo = new THREE.CylinderGeometry(1.55, 1.35, 5.5, 48, 4);
  const torsoPos = torsoGeo.attributes.position;
  for (let i = 0; i < torsoPos.count; i++) {
    const x = torsoPos.getX(i), y = torsoPos.getY(i), z = torsoPos.getZ(i);
    // Make it more body-shaped — narrower at waist, wider at chest
    const waistFactor = 1 - 0.18 * Math.exp(-((y + 0.5) ** 2) / 1.5);
    const chestFactor = 1 + 0.12 * Math.exp(-((y - 1.2) ** 2) / 0.8);
    // Flatten front-back
    const depthFactor = 0.72;
    torsoPos.setXYZ(i, x * waistFactor * chestFactor, y, z * depthFactor);
  }
  torsoGeo.computeVertexNormals();
  const torso = new THREE.Mesh(torsoGeo, skinMat);
  group.add(torso);

  // Shoulders — more natural rounded shape
  [-1.65, 1.65].forEach((sx, idx) => {
    const shGeo = new THREE.SphereGeometry(0.75, 24, 18);
    const shPos = shGeo.attributes.position;
    for (let i = 0; i < shPos.count; i++) {
      const x = shPos.getX(i), y = shPos.getY(i), z = shPos.getZ(i);
      shPos.setXYZ(i, x * 1.1, y * 0.65, z * 0.62);
    }
    shGeo.computeVertexNormals();
    const sh = new THREE.Mesh(shGeo, skinMat);
    sh.position.set(sx, 1.8, 0);
    group.add(sh);

    // Upper arm stub
    const armGeo = new THREE.CylinderGeometry(0.38, 0.32, 1.8, 16);
    const arm = new THREE.Mesh(armGeo, skinMat);
    arm.position.set(sx * 1.22, 0.9, 0);
    arm.rotation.z = idx === 0 ? 0.22 : -0.22;
    group.add(arm);
  });

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.32, 0.42, 1.1, 20);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 3.25, 0);
  group.add(neck);

  // Head — slightly oval
  const headGeo = new THREE.SphereGeometry(0.72, 24, 20);
  const headPos = headGeo.attributes.position;
  for (let i = 0; i < headPos.count; i++) {
    const x = headPos.getX(i), y = headPos.getY(i), z = headPos.getZ(i);
    headPos.setXYZ(i, x * 0.88, y * 1.12, z * 0.82);
  }
  headGeo.computeVertexNormals();
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 4.45, 0);
  group.add(head);

  // Ribcage wireframe — subtle
  const ribMat = new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.5 });
  for (let i = 0; i < 7; i++) {
    const y = 1.8 - i * 0.52;
    const width = 1.2 - i * 0.04;
    [-1, 1].forEach(side => {
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(side * 0.22, y, 0.28),
        new THREE.Vector3(side * width * 0.85, y + 0.06, 0.0),
        new THREE.Vector3(side * width, y - 0.18, -0.28)
      );
      const pts = curve.getPoints(24);
      const rg = new THREE.BufferGeometry().setFromPoints(pts);
      group.add(new THREE.Line(rg, ribMat));
    });
    // Sternum
    const stPts = [new THREE.Vector3(-0.22, y, 0.28), new THREE.Vector3(0.22, y, 0.28)];
    const stg = new THREE.BufferGeometry().setFromPoints(stPts);
    group.add(new THREE.Line(stg, ribMat));
  }

  // Spine
  const spineMat = new THREE.LineBasicMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.35 });
  const spinePts = Array.from({ length: 12 }, (_, i) =>
    new THREE.Vector3(0, 2.2 - i * 0.42, -0.55)
  );
  const spineGeo = new THREE.BufferGeometry().setFromPoints(spinePts);
  group.add(new THREE.Line(spineGeo, spineMat));

  // Major vessels visible through body
  const artMat = new THREE.MeshPhongMaterial({ color: 0xcc1a2a, emissive: 0x280005, transparent: true, opacity: 0.88 });
  const venMat = new THREE.MeshPhongMaterial({ color: 0x1a2daa, emissive: 0x000518, transparent: true, opacity: 0.82 });

  // Descending aorta
  const dAoPts = [
    new THREE.Vector3(0.0, 2.0, -0.2),
    new THREE.Vector3(-0.08, 0.5, -0.3),
    new THREE.Vector3(-0.1, -1.2, -0.28),
    new THREE.Vector3(-0.05, -2.4, -0.22),
  ];
  group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(dAoPts), 20, 0.09, 10), artMat));

  // Inferior vena cava (body)
  const ivcBodyPts = [
    new THREE.Vector3(0.28, 0.6, -0.2),
    new THREE.Vector3(0.26, -0.8, -0.22),
    new THREE.Vector3(0.22, -2.2, -0.18),
  ];
  group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ivcBodyPts), 16, 0.08, 8), venMat));

  // Subclavian / arm vessels
  [[-1, artMat], [1, venMat]].forEach(([side, mat]) => {
    const s = side as number;
    const pts = [
      new THREE.Vector3(s * 0.4, 1.8, 0.1),
      new THREE.Vector3(s * 1.1, 1.6, 0.05),
      new THREE.Vector3(s * 1.55, 1.0, 0.0),
    ];
    group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 10, 0.055, 7), mat as THREE.Material));
  });

  // Carotid arteries
  [-0.18, 0.18].forEach((cx, i) => {
    const cPts = [
      new THREE.Vector3(cx, 2.2, 0.1),
      new THREE.Vector3(cx * 0.9, 3.0, 0.08),
      new THREE.Vector3(cx * 0.8, 3.8, 0.05),
    ];
    const cMat = i === 0 ? artMat : venMat;
    group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cPts), 10, 0.048, 7), cMat));
  });

  // Iliac vessels (lower)
  [[-0.3, artMat], [0.3, venMat]].forEach(([cx, mat]) => {
    const x = cx as number;
    const pts = [
      new THREE.Vector3(x * 0.5, -2.2, -0.15),
      new THREE.Vector3(x * 0.85, -2.8, -0.1),
    ];
    group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 6, 0.06, 7), mat as THREE.Material));
  });

  // Glowing body outline
  const outlineMat = new THREE.MeshBasicMaterial({ color: 0x1a3a6a, transparent: true, opacity: 0.12, side: THREE.BackSide });
  const outlineGeo = new THREE.CylinderGeometry(1.75, 1.55, 5.7, 32);
  const outline = new THREE.Mesh(outlineGeo, outlineMat);
  outline.scale.set(1.08, 1.02, 0.85);
  group.add(outline);

  return group;
}

export default function HeartCanvas({ bpm, rhythm }: Props) {
  const mountRef      = useRef<HTMLDivElement>(null);
  const frameRef      = useRef<number>(0);
  const clockRef      = useRef(new THREE.Clock());
  const rendRef       = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef     = useRef<THREE.PerspectiveCamera | null>(null);
  const camTgtRef     = useRef({ x: 0, y: 0, z: 5 });
  const camCurRef     = useRef({ x: 0, y: 0, z: 5 });
  const lookTgtRef    = useRef({ x: 0, y: 0, z: 0 });

  // Mesh refs
  const abstractGrpRef  = useRef<THREE.Group | null>(null);
  const bodyGrpRef      = useRef<THREE.Group | null>(null);
  const realHeartRef    = useRef<THREE.Group | null>(null);
  const bodyHeartRef    = useRef<THREE.Group | null>(null); // heart inside body
  const matRef          = useRef<THREE.MeshPhongMaterial | null>(null);
  const glowMatRef      = useRef<THREE.MeshPhongMaterial | null>(null);
  const p1Ref           = useRef<THREE.PointLight | null>(null);
  const heartLightRef   = useRef<THREE.PointLight | null>(null);
  const glbLoadedRef    = useRef(false);

  const [view, setView]           = useState<ViewMode>("abstract");
  const [transitioning, setTrans] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [hovered, setHovered]     = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, container.clientWidth / container.clientHeight, 0.1, 200);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendRef.current = renderer;

    // ── Abstract heart (View 1) ───────────────────────────────────────────
    const abstractGrp = new THREE.Group();
    abstractGrpRef.current = abstractGrp;
    scene.add(abstractGrp);

    const shape = new THREE.Shape();
    shape.moveTo(0, 0.25);
    shape.bezierCurveTo(0, 0.25, -0.1, 0.9, -0.9, 0.9);
    shape.bezierCurveTo(-1.6, 0.9, -1.6, 0, -1.6, 0);
    shape.bezierCurveTo(-1.6, -0.55, -1.1, -1.1, 0, -1.6);
    shape.bezierCurveTo(1.1, -1.1, 1.6, -0.55, 1.6, 0);
    shape.bezierCurveTo(1.6, 0, 1.6, 0.9, 0.9, 0.9);
    shape.bezierCurveTo(0.1, 0.9, 0, 0.25, 0, 0.25);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.7, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.18, bevelThickness: 0.18 });
    geo.center();
    const mat = new THREE.MeshPhongMaterial({ color: 0xcc1133, emissive: 0x440010, specular: 0xff8899, shininess: 90 });
    matRef.current = mat;
    const heart = new THREE.Mesh(geo, mat);
    abstractGrp.add(heart);
    const glowMat = new THREE.MeshPhongMaterial({ color: 0xff2255, emissive: 0xff0033, transparent: true, opacity: 0.07, side: THREE.BackSide });
    glowMatRef.current = glowMat;
    const glow = new THREE.Mesh(geo, glowMat);
    glow.scale.setScalar(1.08);
    abstractGrp.add(glow);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0xff3366, wireframe: true, transparent: true, opacity: 0.06 });
    abstractGrp.add(new THREE.Mesh(geo, wireMat));

    // ── Full body (View 2) ────────────────────────────────────────────────
    const bodyGrp = buildBody();
    bodyGrp.visible = false;
    bodyGrpRef.current = bodyGrp;
    scene.add(bodyGrp);

    // Heart inside body (procedural, always available)
    const bHeart = buildRealisticHeart(scene);
    bHeart.position.set(0.1, 0.3, 0.15);
    bHeart.scale.setScalar(0.52);
    bHeart.visible = false;
    bodyHeartRef.current = bHeart;
    scene.add(bHeart);

    // ── Standalone anatomical heart (View 3) ─────────────────────────────
    const rHeart = buildRealisticHeart(scene);
    rHeart.visible = false;
    realHeartRef.current = rHeart;
    scene.add(rHeart);

    // Try load GLB if public/heart.glb exists
    const tryLoadGLB = async () => {
      try {
        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js" as any);
        const loader = new GLTFLoader();
        loader.load(
          "/heart.glb",
          (gltf: any) => {
            const model = gltf.scene;
            model.scale.setScalar(1.0);
            model.position.set(0, -0.3, 0);
            // Replace procedural with GLB
            scene.remove(rHeart);
            realHeartRef.current = model;
            model.visible = false;
            scene.add(model);

            // Also replace body heart
            scene.remove(bHeart);
            const bModel = gltf.scene.clone();
            bModel.scale.setScalar(0.52);
            bModel.position.set(0.1, 0.3, 0.15);
            bModel.visible = false;
            bodyHeartRef.current = bModel;
            scene.add(bModel);

            glbLoadedRef.current = true;
          },
          undefined,
          () => { /* GLB not found — use procedural */ }
        );
      } catch { /* GLTFLoader not available */ }
    };
    tryLoadGLB();

    // ── Heart glow light ──────────────────────────────────────────────────
    const heartLight = new THREE.PointLight(0xff2233, 0, 6);
    heartLight.position.set(0.1, 0.2, 1.2);
    scene.add(heartLight);
    heartLightRef.current = heartLight;

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x223355, 0.9));
    const p1 = new THREE.PointLight(0xff2244, 3, 20);
    p1.position.set(2, 2, 4);
    p1.castShadow = true;
    scene.add(p1);
    p1Ref.current = p1;
    const p2 = new THREE.PointLight(0x2244cc, 1.8, 20);
    p2.position.set(-3, 1, 3);
    scene.add(p2);
    const rim = new THREE.DirectionalLight(0xff8866, 0.7);
    rim.position.set(-3, 3, -2);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0x4488ff, 0.4);
    fill.position.set(3, -1, 2);
    scene.add(fill);
    const top = new THREE.PointLight(0xffeedd, 1.2, 15);
    top.position.set(0, 5, 2);
    scene.add(top);

    // ── Beat function ─────────────────────────────────────────────────────
    const getBeat = (t: number) => {
      const period = 60 / bpm;
      const phase = (t % period) / period;
      if (phase < 0.08) return 1 + Math.sin((phase / 0.08) * Math.PI) * 0.1;
      if (phase < 0.16) return 1 + Math.sin(((phase - 0.08) / 0.08) * Math.PI) * 0.05;
      return 1;
    };

    // ── Animation loop ────────────────────────────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const beat = getBeat(t);

      // Camera lerp
      const cur = camCurRef.current, tgt = camTgtRef.current, lk = lookTgtRef.current;
      cur.x += (tgt.x - cur.x) * 0.045;
      cur.y += (tgt.y - cur.y) * 0.045;
      cur.z += (tgt.z - cur.z) * 0.045;
      camera.position.set(cur.x, cur.y, cur.z);
      camera.lookAt(lk.x, lk.y, lk.z);

      // Abstract heart animate
      if (abstractGrp.visible) {
        heart.rotation.y = t * 0.35;
        heart.rotation.x = Math.sin(t * 0.3) * 0.07;
        heart.scale.setScalar(beat);
        glow.rotation.copy(heart.rotation);
        glow.scale.setScalar(beat * 1.08);
        const pulse = 0.3 + 0.3 * Math.sin(t * (bpm / 60) * Math.PI * 2);
        mat.emissive.setRGB(pulse * 0.3 + (beat - 1) * 1.5, 0, pulse * 0.05);
        glowMat.opacity = 0.05 + (beat - 1) * 0.8;
        p1.intensity = 2.5 + (beat - 1) * 25;
      }

      // Realistic heart beat (Views 2 & 3)
      const animateRealisticHeart = (grp: THREE.Group | null) => {
        if (!grp || !grp.visible) return;
        grp.scale.setScalar(beat * (grp === realHeartRef.current ? 1.0 : 0.52));
        // Rotate slowly in anatomical view
        if (grp === realHeartRef.current) {
          grp.rotation.y = t * 0.2;
          grp.rotation.x = Math.sin(t * 0.15) * 0.04;
        }
        // Update heart materials emissive
        grp.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            const m = (child as THREE.Mesh).material as THREE.MeshPhongMaterial;
            if (m && m.emissive && m.color.r > 0.4) {
              m.emissive.setRGB(0.14 + (beat - 1) * 1.2, 0, 0);
            }
          }
        });
        if (heartLightRef.current) {
          heartLightRef.current.intensity = (beat - 1) * 18;
        }
      };

      animateRealisticHeart(realHeartRef.current);
      animateRealisticHeart(bodyHeartRef.current);

      renderer.render(scene, camera);
    };
    animate();

    const ro = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [bpm]);

  // ── View transitions ──────────────────────────────────────────────────────
  const handleClick = () => {
    if (transitioning) return;
    setTrans(true);
    setShowLabels(false);

    if (view === "abstract") {
      // → Full body
      abstractGrpRef.current && (abstractGrpRef.current.visible = false);
      bodyGrpRef.current     && (bodyGrpRef.current.visible     = true);
      bodyHeartRef.current   && (bodyHeartRef.current.visible   = true);
      realHeartRef.current   && (realHeartRef.current.visible   = false);
      camTgtRef.current  = { x: 0, y: 0.5, z: 13 };
      lookTgtRef.current = { x: 0, y: 0.2, z: 0 };
      setView("fullbody");
      setTimeout(() => setTrans(false), 1000);

    } else if (view === "fullbody") {
      // → Anatomical close-up
      bodyGrpRef.current   && (bodyGrpRef.current.visible   = false);
      bodyHeartRef.current && (bodyHeartRef.current.visible = false);
      realHeartRef.current && (realHeartRef.current.visible = true);
      camTgtRef.current  = { x: 0, y: 0, z: 5.5 };
      lookTgtRef.current = { x: 0, y: -0.2, z: 0 };
      setView("anatomical");
      setTimeout(() => { setShowLabels(true); setTrans(false); }, 1000);

    } else {
      // → Back to abstract
      abstractGrpRef.current && (abstractGrpRef.current.visible = true);
      bodyGrpRef.current     && (bodyGrpRef.current.visible     = false);
      bodyHeartRef.current   && (bodyHeartRef.current.visible   = false);
      realHeartRef.current   && (realHeartRef.current.visible   = false);
      camTgtRef.current  = { x: 0, y: 0, z: 5 };
      lookTgtRef.current = { x: 0, y: 0, z: 0 };
      setView("abstract");
      setTimeout(() => setTrans(false), 1000);
    }
  };

  const hint =
    view === "abstract"  ? "CLICK · VIEW ANATOMY" :
    view === "fullbody"  ? "CLICK · ZOOM IN"       :
                           "CLICK · RESET VIEW";

  const viewLabel =
    view === "abstract"  ? "ABSTRACT VIEW"    :
    view === "fullbody"  ? "FULL BODY VIEW"   :
                           "ANATOMICAL VIEW";

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%", cursor: transitioning ? "wait" : "pointer" }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* BPM */}
      <div style={{ position: "absolute", top: 20, left: 24, fontFamily: '"Share Tech Mono", monospace', pointerEvents: "none" }}>
        <div style={{ fontSize: 64, color: "var(--red)", textShadow: "0 0 30px rgba(255,34,68,0.5)", lineHeight: 1 }}>{bpm}</div>
        <div style={{ fontSize: 11, color: "rgba(255,34,68,0.5)", letterSpacing: "0.3em", marginTop: 4 }}>BPM</div>
      </div>

      {/* Rhythm */}
      <div style={{ position: "absolute", top: 20, right: 24, fontFamily: '"Share Tech Mono", monospace',
        fontSize: 11, color: "var(--green)", letterSpacing: "0.18em", textAlign: "right", pointerEvents: "none",
        maxWidth: 200, wordBreak: "break-word" }}>
        {rhythm}
      </div>

      {/* View label */}
      <div style={{
        position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
        fontFamily: '"Share Tech Mono", monospace', fontSize: 9,
        color: "rgba(0,255,136,0.35)", letterSpacing: "0.28em", pointerEvents: "none",
      }}>
        {viewLabel}
      </div>

      {/* Click hint */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        fontFamily: '"Share Tech Mono", monospace', fontSize: 10,
        color: hovered ? "rgba(0,255,136,0.75)" : "rgba(0,255,136,0.22)",
        letterSpacing: "0.22em", transition: "all 0.3s",
        background: "rgba(0,0,0,0.45)", padding: "5px 16px",
        border: hovered ? "1px solid rgba(0,255,136,0.35)" : "1px solid transparent",
        pointerEvents: "none",
      }}>
        {hint}
      </div>

      {/* Pulse rings — abstract only */}
      {view === "abstract" && (
        <div style={{ position: "absolute", top: "50%", left: "50%", pointerEvents: "none" }}>
          <PulseRing delay={0} />
          <PulseRing delay={0.38} />
        </div>
      )}

      {/* Anatomical labels */}
      {showLabels && view === "anatomical" && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {LABELS.map((lbl, i) => (
            <div key={lbl.id} style={{
              position: "absolute", left: `${lbl.px}%`, top: `${lbl.py}%`,
              animation: `fadeInLabel 0.4s ease ${i * 0.1}s both`,
            }}>
              <div style={{
                background: "rgba(3,8,20,0.92)",
                border: "1px solid rgba(0,255,136,0.4)",
                borderRadius: 2, padding: "4px 10px",
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 10, color: "rgba(0,255,136,0.95)",
                letterSpacing: "0.1em", whiteSpace: "nowrap",
                boxShadow: "0 0 14px rgba(0,255,136,0.08)",
              }}>
                {lbl.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GLB hint for fullbody/anatomical */}
      {view === "fullbody" && (
        <div style={{
          position: "absolute", bottom: 50, right: 20,
          fontFamily: '"Share Tech Mono", monospace', fontSize: 9,
          color: "rgba(0,255,136,0.2)", letterSpacing: "0.12em", pointerEvents: "none",
        }}>
          DROP heart.glb IN /public TO UPGRADE MODEL
        </div>
      )}

      <style>{`
        @keyframes expand {
          0%   { width: 80px;  height: 80px;  opacity: 0.6; }
          100% { width: 300px; height: 300px; opacity: 0;   }
        }
        @keyframes fadeInLabel {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function PulseRing({ delay }: { delay: number }) {
  return (
    <div style={{
      position: "absolute", borderRadius: "50%",
      border: "1px solid rgba(255,34,68,0.18)",
      transform: "translate(-50%, -50%)",
      animation: `expand 1.1s ease-out ${delay}s infinite`,
    }} />
  );
}
