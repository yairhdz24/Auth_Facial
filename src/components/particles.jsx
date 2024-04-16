import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 

const ParticlesComponent = (props) => {
  const [options, setOptions] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initializeParticles = async () => {
      await initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      });

      setInit(true);
    };

    initializeParticles();
  }, []);

  useEffect(() => {
    if (!init) return;

    const particlesOptions = {
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: false,
            mode: "repulse",
          },
          onHover: {
            enable: false,
            mode: 'grab',
          },
        },
        modes: {
          push: {
            distance: 200,
            duration: 15,
          },
          grab: {
            distance: 10,
          },
        },
      },
      particles: {
        color: {
          value: "#85e8f9",
          opacity: 0.2,
        },
        links: {
          color: "#20a4e8",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 2,
        },
        move: {
          direction: "vertical",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 3,
          straight: true,
        },
        number: {
          density: {
            enable: true,
          },
          value: 100,
        },
        opacity: {
          value: 0.3,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 2, max: 4 },
        },
      },
      detectRetina: true,
    };

    setOptions(particlesOptions);
  }, [init]);

  const particlesLoaded = (container) => {
    console.log(container);
  };

  return options ? <Particles id={props.id} init={particlesLoaded} options={options} /> : null; 
};

export default ParticlesComponent;
