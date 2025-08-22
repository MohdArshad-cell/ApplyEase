// js/particles-config.js
document.addEventListener('DOMContentLoaded', function () {
    tsParticles.load("tsparticles", {
        background: {
            color: {
                value: "transparent"
            }
        },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: {
                    enable: false,
                    mode: "repulse"
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                }
            }
        },
        particles: {
            color: {
                value: "#ffffff"
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.1,
                width: 1
            },
            collisions: {
                enable: true
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce"
                },
                random: false,
                speed: 1,
                straight: false
            },
            number: {
                density: {
                    enable: true,
                    area: 800
                },
                value: 50
            },
            opacity: {
                value: 0.1
            },
            shape: {
                type: "circle"
            },
            size: {
                value: { min: 1, max: 3 }
            }
        },
        detectRetina: true
    });
});