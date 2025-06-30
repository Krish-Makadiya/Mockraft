import React, { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

const LightGradient = ({ className = "", style = {} }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        const neat = new NeatGradient({
            ref: canvasRef.current,
            colors: [
                {
                    color: "#2d5ded",
                    enabled: true,
                },
                {
                    color: "#7c4dff",
                    enabled: true,
                },
                {
                    color: "#f4f4f9",
                    enabled: true,
                },
                {
                    color: "#6B8EFF",
                    enabled: true,
                },
                {
                    color: "#9D7AFF",
                    enabled: true,
                },
            ],
            speed: 4,
            horizontalPressure: 3,
            verticalPressure: 5,
            waveFrequencyX: 2,
            waveFrequencyY: 3,
            waveAmplitude: 5,
            shadows: 0,
            highlights: 2,
            colorBrightness: 1,
            colorSaturation: 7,
            wireframe: false,
            colorBlending: 3,
            backgroundColor: "#003FFF",
            backgroundAlpha: 1,
            grainScale: 2,
            grainSparsity: 0,
            grainIntensity: 0.5,
            grainSpeed: 1,
            resolution: 1,
            yOffset: 0,
        });
        return () => neat.destroy();
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="gradient"
            className={`absolute inset-0 w-full h-full z-0 ${className}`}
            style={style}
        />
    );
};

export default LightGradient;
