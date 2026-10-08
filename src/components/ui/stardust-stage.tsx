"use client";

import { useEffect, useRef } from "react";

type StardustStageProps = {
  className?: string;
  density?: number;
  durationMs?: number;
};

type Star = { x: number; y: number; r: number; a: number; phase: number };

export default function StardustStage({ className = "", density = 1, durationMs = 14000 }: StardustStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pointerX = 0;
    let pointerY = 0;
    let easedX = 0;
    let easedY = 0;
    const started = performance.now();
    let seed = 17;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    let stars: Star[] = [];

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed = 17;
      stars = Array.from({ length: Math.round(Math.min(420, (width * height) / 3200) * density) }, () => ({
        x: random() * width,
        y: random() * height,
        r: random() > 0.9 ? 1.5 : 0.65 + random() * 0.6,
        a: 0.16 + random() * 0.58,
        phase: random() * Math.PI * 2,
      }));
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = (event.clientX - bounds.left) / Math.max(1, bounds.width) - 0.5;
      pointerY = (event.clientY - bounds.top) / Math.max(1, bounds.height) - 0.5;
    };

    const dot = (x: number, y: number, r: number, alpha = 1) => {
      context.globalAlpha = Math.max(0, Math.min(1, alpha));
      context.fillRect(Math.round(x), Math.round(y), r, r);
    };

    const dottedLine = (x1: number, y1: number, x2: number, y2: number, step: number, alpha: number) => {
      const length = Math.hypot(x2 - x1, y2 - y1);
      const count = Math.max(1, Math.floor(length / step));
      for (let i = 0; i <= count; i++) {
        const t = i / count;
        dot(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, i % 5 === 0 ? 2 : 1.25, alpha);
      }
    };

    const dottedArc = (cx: number, cy: number, rx: number, ry: number, a1: number, a2: number, step: number, alpha: number) => {
      const distance = Math.max(rx, ry) * Math.abs(a2 - a1);
      const count = Math.max(1, Math.floor(distance / step));
      for (let i = 0; i <= count; i++) {
        const t = a1 + ((a2 - a1) * i) / count;
        dot(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, i % 6 === 0 ? 2 : 1.2, alpha);
      }
    };

    const drawCosmos = (time: number, progress: number, cx: number, cy: number, unit: number, alpha: number) => {
      const ringRadius = unit * 0.2;
      for (let i = 0; i < 112; i++) {
        const angle = (i / 112) * Math.PI * 2 - Math.PI / 2 + time * 0.025;
        const lit = ((i / 112) * 1.12) < progress;
        const wobble = Math.sin(time * 1.4 + i) * 1.2;
        dot(cx + Math.cos(angle) * (ringRadius + wobble), cy + Math.sin(angle) * (ringRadius + wobble), i % 4 === 0 ? 2.5 : 1.5, alpha * (lit ? 0.95 : 0.24));
      }

      for (let i = 0; i < 44; i++) {
        const angle = (i / 44) * Math.PI * 2 + Math.sin(i * 31.7) * 0.025;
        const travel = ((time * (0.11 + progress * 0.6) + i * 0.071) % 1);
        const length = ringRadius * 1.25 + Math.pow(travel, 1.65) * unit * 0.48;
        const x = cx + Math.cos(angle) * length;
        const y = cy + Math.sin(angle) * length;
        dot(x, y, 1 + Math.sin(travel * Math.PI) * 1.1, alpha * Math.sin(travel * Math.PI) * (0.2 + progress * 0.68));
      }

      const core = unit * (0.04 + progress * 0.018);
      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2 + time * 0.3;
        dot(cx + Math.cos(angle) * core, cy + Math.sin(angle) * core, 2, alpha * 0.7);
      }
      dot(cx, cy, 3.5 + progress * 2, alpha);
    };

    const drawStage = (time: number, cx: number, cy: number, unit: number, alpha: number) => {
      if (alpha <= 0.01) return;
      const stageW = Math.min(width * 0.76, height * 1.2);
      const left = cx - stageW * 0.46;
      const right = cx + stageW * 0.46;
      const top = height * 0.12;
      const spring = top + height * 0.37;
      const floor = height * 0.88;
      const rx = (right - left) / 2;
      const ry = spring - top;
      const step = Math.max(4, unit * 0.009);

      // Dotted proscenium arch and the twin lines that frame the stage.
      dottedLine(left, floor, left, spring, step, alpha * 0.65);
      dottedArc(cx, spring, rx, ry, Math.PI, Math.PI * 2, step, alpha * 0.72);
      dottedLine(right, spring, right, floor, step, alpha * 0.65);
      dottedLine(left + 9, floor, left + 9, spring + 4, step * 1.4, alpha * 0.28);
      dottedArc(cx, spring + 4, rx - 9, ry - 4, Math.PI, Math.PI * 2, step * 1.4, alpha * 0.3);
      dottedLine(right - 9, spring + 4, right - 9, floor, step * 1.4, alpha * 0.28);
      dottedLine(left - 18, floor, right + 18, floor, step * 1.2, alpha * 0.7);

      // A stippled crescent moon.
      const moonR = Math.min(width, height) * 0.065;
      const moonX = cx + pointerX * 14;
      const moonY = top + height * 0.16 + pointerY * 8;
      dottedArc(moonX, moonY, moonR, moonR, -Math.PI * 0.82, Math.PI * 0.82, 4, alpha * 0.7);
      dottedArc(moonX - moonR * 0.42, moonY - moonR * 0.04, moonR * 0.85, moonR * 0.9, -Math.PI * 0.76, Math.PI * 0.76, 4, alpha * 0.25);

      // Clouds made from small points, with a gentle horizontal drift.
      for (let i = 0; i < 330; i++) {
        const side = i % 2 ? -1 : 1;
        const t = (i * 0.61803398875) % 1;
        const y = top + height * (0.31 + t * 0.34);
        const cloudWidth = width * (0.08 + (0.5 - Math.abs(t - 0.5)) * 0.12);
        const x = cx + side * (width * 0.12 + t * width * 0.16) + Math.sin(time * 0.12 + i) * 2;
        if (Math.abs(x - cx) < cloudWidth) dot(x, y, i % 7 === 0 ? 2 : 1, alpha * (0.12 + (1 - t) * 0.2));
      }

      // Curtains hang in sparse, vertical folds.
      for (let fold = 0; fold < 13; fold++) {
        const t = fold / 12;
        const lx = left + t * stageW * 0.14;
        const rx2 = right - t * stageW * 0.14;
        dottedLine(lx, top + Math.sin(t * Math.PI) * 14, lx, floor - 14, step * 2.2, alpha * (0.35 - t * 0.12));
        dottedLine(rx2, top + Math.sin(t * Math.PI) * 14, rx2, floor - 14, step * 2.2, alpha * (0.35 - t * 0.12));
      }

      // A tiny lone figure and its reflected light on the stage floor.
      const figureY = floor - height * 0.12;
      dottedArc(cx, figureY - height * 0.095, unit * 0.011, unit * 0.011, 0, Math.PI * 2, 2, alpha * 0.95);
      dottedLine(cx, figureY - height * 0.08, cx, figureY, 2, alpha * 0.9);
      dottedLine(cx, figureY - height * 0.055, cx - unit * 0.014, figureY - height * 0.018, 2, alpha * 0.72);
      dottedLine(cx, figureY - height * 0.055, cx + unit * 0.014, figureY - height * 0.018, 2, alpha * 0.72);
      dottedLine(cx, figureY, cx - unit * 0.012, figureY + height * 0.03, 2, alpha * 0.72);
      dottedLine(cx, figureY, cx + unit * 0.012, figureY + height * 0.03, 2, alpha * 0.72);
      for (let i = 0; i < 42; i++) {
        const x = cx + (i - 21) * step * 1.7;
        const y = floor + Math.sin(i * 0.45 + time * 0.3) * 2;
        dot(x, y, 1.2, alpha * (0.35 - Math.abs(i - 21) * 0.012));
      }
    };

    const render = (now: number) => {
      const elapsed = reduceMotion ? 0 : (now - started) / 1000;
      const cycle = (elapsed * 1000) % Math.max(8000, durationMs);
      const p = cycle / Math.max(8000, durationMs);
      const phase = p < 0.43 ? p / 0.43 : p < 0.59 ? 1 : p < 0.88 ? 1 - (p - 0.59) / 0.29 : 0;
      const eased = phase * phase * (3 - 2 * phase);
      const progress = Math.min(1, p / 0.43);
      easedX += (pointerX - easedX) * 0.055;
      easedY += (pointerY - easedY) * 0.055;
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#f2f0ea";

      const unit = Math.min(width, height);
      const cx = width / 2 + easedX * 13;
      const cy = height * 0.47 + easedY * 9;
      for (const star of stars) {
        const twinkle = 0.68 + Math.sin(elapsed * 1.7 + star.phase) * 0.28;
        dot(star.x + easedX * star.r * 3, star.y + easedY * star.r * 3, star.r, star.a * twinkle);
      }

      drawCosmos(elapsed, progress, cx, cy, unit, 1 - eased * 0.75);
      drawStage(elapsed, cx, cy, unit, eased * 0.88);

      // Pointer parallax is deliberately restrained to keep the scene calm.
      context.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener("pointermove", onPointerMove);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
    };
  }, [density, durationMs]);

  return <canvas ref={canvasRef} className={`stardust-canvas ${className}`} aria-hidden="true" />;
}
