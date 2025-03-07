import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RouletteWheelProps {
  isSpinning?: boolean;
}

export default function RouletteWheel({
  isSpinning = false,
}: RouletteWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [ballPosition, setBallPosition] = useState({ angle: 0, distance: 0 });

  // Animation frame reference
  const animationRef = useRef<number>();
  const speedRef = useRef(0);
  const ballSpeedRef = useRef(0);

  // Draw the wheel
  const drawWheel = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    rotation: number,
  ) => {
    // Numbers on the wheel
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
      24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
    ];

    const sliceAngle = (Math.PI * 2) / numbers.length;

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw outer rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#ffd700"; // Gold color
    ctx.stroke();

    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();

    // Apply rotation to the entire wheel
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.translate(-centerX, -centerY);

    // Draw pockets
    numbers.forEach((number, i) => {
      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius - 5, startAngle, endAngle);
      ctx.closePath();

      // Color based on number
      if (number === 0) {
        ctx.fillStyle = "#00b300"; // Bright green for 0
      } else if (
        [
          1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
        ].includes(number)
      ) {
        ctx.fillStyle = "#ff0000"; // Bright red
      } else {
        ctx.fillStyle = "#000"; // Black
      }

      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw number
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px Arial";
      ctx.translate(radius - 20, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(number.toString(), 0, 0);
      ctx.restore();
    });

    ctx.restore(); // Restore after wheel rotation

    // Draw center (not affected by rotation)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700"; // Gold center
    ctx.fill();

    // Add inner center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#111";
    ctx.fill();
  };

  // Draw the ball
  const drawBall = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    ballPos: { angle: number; distance: number },
  ) => {
    const ballRadius = 5;
    const ballX = centerX + Math.cos(ballPos.angle) * ballPos.distance;
    const ballY = centerY + Math.sin(ballPos.angle) * ballPos.distance;

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Add shine to ball
    const gradient = ctx.createRadialGradient(
      ballX - 1,
      ballY - 1,
      0,
      ballX,
      ballY,
      ballRadius,
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    gradient.addColorStop(1, "rgba(200, 200, 200, 0.2)");
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Update rotation - always keep a minimum rotation for visual interest
    setRotation((prev) => prev + Math.max(speedRef.current, 0.001));

    // Update ball position - always keep a minimum movement
    setBallPosition((prev) => ({
      angle: prev.angle + Math.max(ballSpeedRef.current, 0.002),
      distance: prev.distance,
    }));

    // Slow down the wheel but maintain minimum movement
    if (speedRef.current > 0.001) {
      speedRef.current *= 0.99;
    }

    if (ballSpeedRef.current > 0.002) {
      ballSpeedRef.current *= 0.995;
    }

    // Occasionally add a small burst of speed to simulate activity
    if (Math.random() < 0.01) {
      speedRef.current += 0.005;
      ballSpeedRef.current += 0.008;
    }

    // Draw the wheel and ball
    drawWheel(ctx, centerX, centerY, radius, rotation);
    drawBall(ctx, centerX, centerY, radius, ballPosition);

    // Always continue animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Initial setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 240;
    canvas.height = 240;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Initial ball position
    setBallPosition({
      angle: Math.random() * Math.PI * 2,
      distance: radius - 20,
    });

    // Draw initial state
    drawWheel(ctx, centerX, centerY, radius, rotation);
    drawBall(ctx, centerX, centerY, radius, ballPosition);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handle spinning state changes
  useEffect(() => {
    if (isSpinning) {
      // Start spinning with random speed
      speedRef.current = Math.random() * 0.03 + 0.02;
      ballSpeedRef.current = -(Math.random() * 0.05 + 0.03); // Ball spins opposite direction

      // Ensure animation is running
      if (!animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    }
  }, [isSpinning]);

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          3D Wheel Visualization
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center p-2">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="rounded-full border-2 border-yellow-500/40 shadow-lg shadow-yellow-500/10"
            width="240"
            height="240"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent to-black/40 pointer-events-none"></div>
        </div>
      </CardContent>
    </Card>
  );
}
