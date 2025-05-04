document.addEventListener('DOMContentLoaded', function () {
    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
      });
    }
  
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.15 });
  
    // Observe all cards
    document.querySelectorAll('.card').forEach(card => {
      observer.observe(card);
    });
    
    // Initialize danger meter animations
    animateDangerMeters();
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          // Update active link
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
          });
          this.classList.add('active');
          
          // Close mobile menu if open
          if (navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
          }
          
          // Scroll to target
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Add active class to nav link based on scroll position
    window.addEventListener('scroll', function() {
      const scrollPosition = window.scrollY;
      
      document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
      
      // Add background to navbar when scrolled
      const navbar = document.querySelector('.main-nav');
      if (scrollPosition > 50) {
        navbar.style.background = 'rgba(0, 0, 0, 0.9)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 0, 0.3)';
      } else {
        navbar.style.background = 'rgba(0, 0, 0, 0.7)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 0, 0.2)';
      }
    });
    
    // Share button functionality
    document.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        // Create a pulse effect on button click
        this.classList.add('pulse-effect');
        
        // Show toast notification
        showToast('Coming soon: Share functionality');
        
        // Remove pulse effect after animation
        setTimeout(() => {
          this.classList.remove('pulse-effect');
        }, 500);
      });
    });
  });
  
  // Function to animate danger meters
  function animateDangerMeters() {
    document.querySelectorAll('.meter-fill').forEach(meter => {
      // Reset width to 0 before animation
      meter.style.width = '0%';
      
      // Trigger animation after a short delay
      setTimeout(() => {
        const parentLevel = meter.parentElement.getAttribute('data-level');
        meter.style.width = parentLevel + '%';
      }, 500);
    });
  }
  
  // Function to scroll to section
  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Update active nav link
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  }
  
  // Toast notification function
  function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
      
      // Style the toast
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.background = 'rgba(0, 50, 0, 0.9)';
      toast.style.color = '#0f0';
      toast.style.padding = '10px 20px';
      toast.style.borderRadius = '5px';
      toast.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
      toast.style.zIndex = '1000';
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      toast.style.fontFamily = 'Creepster, cursive';
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.style.opacity = '1';
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
    }, 3000);
  }
  
  // Particle smoke effect
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.speedX = Math.random() * 2 - 1;
      this.speedY = Math.random() * -2 - 1;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.color = `rgba(0, ${Math.floor(Math.random() * 50) + 200}, 0, ${this.opacity})`;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.size > 0.2) this.size -= 0.1;
      this.opacity -= 0.01;
    }
    
    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Initialize smoke animation if canvas exists
  const initSmokeAnimation = () => {
    const smokeElement = document.querySelector('.smoke-animation');
    if (!smokeElement) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = smokeElement.offsetWidth;
    canvas.height = smokeElement.offsetHeight;
    smokeElement.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Add new particles
      if (Math.random() > 0.9) {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        particles.push(new Particle(x, y));
      }
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx);
        
        // Remove particles that are too small or transparent
        if (particles[i].size <= 0.2 || particles[i].opacity <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }
      
      animationId = requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      cancelAnimationFrame(animationId);
    });
  };
  
  // Initialize smoke animation after page load
  window.addEventListener('load', initSmokeAnimation);
  
  // Add 'pulse-effect' class for button animations
  document.createElement('style').innerHTML = `
    .pulse-effect {
      animation: buttonPulse 0.5s ease;
    }
    
    @keyframes buttonPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(document.createElement('style'));
  
  // Update active link on page load
  window.addEventListener('load', function() {
    // Get current hash or default to home
    const currentHash = window.location.hash || '#home';
    
    // Set active link
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === currentHash) {
        link.classList.add('active');
      }
    });
  });