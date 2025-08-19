tsParticles.load("particles-js", {
  particles: {
    number: {
      value: 60, // Reduced particle count for subtlety
      density: {
        enable: true,
        value_area: 800,
      },
    },
    color: {
      value: "#ffffff", // Particle color
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.3, // Low opacity
      random: true,
    },
    size: {
      value: 2,
      random: true,
    },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#8A93B1", // Line color (our secondary text color)
      opacity: 0.2, // Low line opacity
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.5, // Very slow movement
      direction: "none",
      out_mode: "out",
      bounce: false,
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: {
        enable: false,
        mode: "grab", // Grab effect on hover
      },
      onclick: {
        enable: false, // No action on click
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        line_opacity: 0.4,
      },
    },
  },
  retina_detect: true,
});