// Smooth scroll function - WORKING VERSION
function smoothScrollTo(targetElement) {
  if (!targetElement) return false;
  
  const targetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 60;
  const startTop = window.pageYOffset;
  const distance = targetTop - startTop;
  const duration = 800; // Smooth but not too slow
  let startTime = null;
  
  function animateScroll(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Smooth easing function
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    
    const currentTop = startTop + (distance * ease);
    window.scrollTo(0, currentTop);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  
  requestAnimationFrame(animateScroll);
  return true;
}

// Simple parallax effect for background elements
function initSimpleParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    const particles = document.getElementById('particles-js');
    if (particles) {
      particles.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Enhanced particles initialization with fallback
function initParticles() {
  // First try the main particles.js
  if (typeof particlesJS !== 'undefined') {
    try {
      particlesJS('particles-js', {
        particles: {
          number: {
            value: 100,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: '#ffffff'
          },
          shape: {
            type: 'circle',
            stroke: {
              width: 0,
              color: '#000000'
            }
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              opacity_min: 0.1,
              sync: false
            }
          },
          size: {
            value: 3,
            random: true,
            anim: {
              enable: true,
              speed: 2,
              size_min: 0.5,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
              enable: false
            }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: {
              enable: true,
              mode: 'repulse'
            },
            onclick: {
              enable: true,
              mode: 'push'
            },
            resize: true
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4
            },
            push: {
              particles_nb: 4
            }
          }
        },
        retina_detect: true
      });
      console.log('particles.js initialized successfully');
      return true;
    } catch (error) {
      console.log('particles.js failed, creating fallback:', error);
      createFallbackParticles();
      return false;
    }
  } else {
    console.log('particles.js not loaded, creating fallback');
    createFallbackParticles();
    return false;
  }
}

// Robust fallback particles system
function createFallbackParticles() {
  const container = document.getElementById('particles-js');
  if (!container) {
    console.log('particles container not found');
    return;
  }
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);
  
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1';
  canvas.style.pointerEvents = 'none';
  
  let animationId;
  
  function resize() {
    canvas.width = container.offsetWidth || window.innerWidth;
    canvas.height = container.offsetHeight || window.innerHeight;
    console.log('Canvas resized to:', canvas.width, 'x', canvas.height);
  }
  
  resize();
  window.addEventListener('resize', resize);
  
  const particles = [];
  const particleCount = 80;
  const connectionDistance = 120;
  
  // Initialize particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
      life: Math.random() * 100
    });
  }
  
  function updateParticles() {
    particles.forEach(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life += 1;
      
      // Bounce off edges
      if (particle.x <= 0 || particle.x >= canvas.width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= canvas.height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }
      
      // Subtle opacity animation
      particle.opacity = 0.3 + Math.sin(particle.life * 0.02) * 0.2;
    });
  }
  
  function drawParticles() {
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.fill();
    });
  }
  
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    updateParticles();
    drawParticles();
    drawConnections();
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Start animation
  animate();
  console.log('Fallback particles system created and running');
  
  // Cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    if (canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  };
}

// Ensure DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...');
  
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
    });
    console.log('AOS initialized');
  }

  // Initialize simple parallax
  initSimpleParallax();

  // Setup smooth scrolling after loader completes
  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          smoothScrollTo(targetElement);
        }
      });
    });
  }

  // Loader animation
  const TEST_MODE = false;
  const loader = document.getElementById("loader");
  const specialSquare = document.getElementById("special-square");
  const header = document.getElementById("main-header");
  const content = document.getElementById("content");

  if (TEST_MODE) {
    console.log("Loader in test mode — runs indefinitely");
    return;
  }

  // After 2 seconds, hide loader
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
      loader.remove();

      // Show special square in the center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2 - 5.5;
      specialSquare.style.display = "block";
      specialSquare.style.left = `${centerX}px`;
      specialSquare.style.top = `${centerY}px`;
      specialSquare.style.transform = "translateX(-50%)";

      // Shine effect
      setTimeout(() => {
        specialSquare.style.boxShadow = "0 0 30px 15px rgba(255, 255, 255, 0.8)";
        setTimeout(() => {
          specialSquare.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.8)";

          // Step 1: Expand width symmetrically
          setTimeout(() => {
            specialSquare.style.width = "100vw";
            specialSquare.style.left = "50%";

            // After expansion, instant reset position
            setTimeout(() => {
              specialSquare.style.transition = "none";
              specialSquare.style.left = "0";
              specialSquare.style.transform = "none";
              specialSquare.offsetHeight;
              specialSquare.style.transition = "top 0.5s ease, height 0.5s ease, background 0.5s ease, box-shadow 0.5s ease, border-radius 0.5s ease, opacity 0.5s ease";

              // Step 2: Move to top
              setTimeout(() => {
                specialSquare.style.top = "0";

                // Step 3: Expand height and change to header
                setTimeout(() => {
                  specialSquare.style.height = "60px";
                  specialSquare.style.background = "white";
                  specialSquare.style.borderRadius = "0";

                  // Show header and content, fade out special square
                  setTimeout(() => {
                    content.classList.remove("hidden");
                    header.classList.add("show");
                    document.body.classList.add("loaded");
                    
                    // Initialize particles AFTER content is loaded
                    setTimeout(() => {
                      console.log('Attempting to initialize particles...');
                      initParticles();
                      setupSmoothScrolling();
                    }, 500);
                    
                    setTimeout(() => {
                      specialSquare.style.opacity = "0";
                      setTimeout(() => {
                        specialSquare.remove();
                      }, 500);
                    }, 500);
                  }, 500);
                }, 500);
              }, 10);
            }, 500);
          }, 500);
        }, 500);
      }, 100);
    }, 500);
  }, 2000);
});

// Popup handling
function openPopup(title, description, buttonRect) {
  const popup = document.getElementById('popup');
  const popupSquare = document.getElementById('popup-square');
  const popupContent = document.getElementById('popup-content');
  const popupTitle = document.getElementById('popup-title');
  const popupDescription = document.getElementById('popup-description');

  popupSquare.style.display = 'block';
  popupSquare.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
  popupSquare.style.top = `${buttonRect.top + buttonRect.height / 2 + window.pageYOffset}px`;
  popupSquare.style.transform = 'translate(-50%, -50%)';

  popupTitle.textContent = title;
  popupDescription.textContent = description;

  popup.classList.add('show');
  setTimeout(() => {
    popupSquare.style.boxShadow = '0 0 30px 15px rgba(255, 255, 255, 0.8)';
    setTimeout(() => {
      popupSquare.style.boxShadow = 'none';
      popupSquare.style.width = '500px';
      popupSquare.style.height = '300px';
      popupSquare.style.borderRadius = '15px';
      setTimeout(() => {
        popupContent.classList.add('show');
        setTimeout(() => {
          popupSquare.style.opacity = '0';
          setTimeout(() => {
            popupSquare.style.display = 'none';
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }, 100);
}

function closePopup() {
  const popup = document.getElementById('popup');
  const popupSquare = document.getElementById('popup-square');
  const popupContent = document.getElementById('popup-content');

  popupContent.classList.remove('show');
  popupSquare.style.display = 'block';
  popupSquare.style.opacity = '1';
  popupSquare.style.width = '11px';
  popupSquare.style.height = '11px';
  popupSquare.style.borderRadius = '2px';
  setTimeout(() => {
    popup.classList.remove('show');
    setTimeout(() => {
      popupSquare.style.display = 'none';
    }, 500);
  }, 500);
}

// Setup more buttons after content loads
setTimeout(() => {
  document.querySelectorAll('.more-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = button.getAttribute('data-title');
      const description = button.getAttribute('data-description');
      const buttonRect = button.getBoundingClientRect();
      openPopup(title, description, buttonRect);
    });
  });
}, 3500);