import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim"; 



const ParticlesComponent = (props) => {

  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log(container);
  };


  const options = useMemo(
    () => ({
      // background: {
      //   color: {
      //     value: {
      //       start: "#178ce3",
      //       end: "#02dbfb",
      //       angle: 135

      //     },
      //   },
      // },
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
          // color: "#FFFFFF",
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
          value: 120,
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
    }),
    [],
  );


  return <Particles id={props.id} init={particlesLoaded} options={options} />; 
};

export default ParticlesComponent;