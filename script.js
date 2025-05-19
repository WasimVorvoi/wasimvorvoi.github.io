// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on page load
if (currentTheme === 'dark') {
  document.body.setAttribute('data-theme', 'dark');
  themeIcon.classList.remove('fa-moon');
  themeIcon.classList.add('fa-sun');
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  if (currentTheme === 'light') {
    document.body.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    currentTheme = 'dark';
  } else {
    document.body.removeAttribute('data-theme');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
    currentTheme = 'light';
  }
  localStorage.setItem('theme', currentTheme);
});

// Particles background
window.addEventListener('load', function() {
  Particles.init({
    selector: '#particles-canvas',
    maxParticles: 100,
    sizeVariations: 3,
    speed: 0.6,
    color: currentTheme === 'dark' ? '#4338ca' : '#6366f1',
    minDistance: 120,
    connectParticles: true
  });
});

// Update particles color when theme changes
themeToggle.addEventListener('click', () => {
  // Need to destroy and reinitialize particles with new color
  if (window.pJSDom && window.pJSDom[0]) {
    // Only if particlesJS is being used
    window.pJSDom[0].pJS.particles.color.value = currentTheme === 'dark' ? '#818cf8' : '#6366f1';
    window.pJSDom[0].pJS.particles.line_linked.color = currentTheme === 'dark' ? '#818cf8' : '#6366f1';
    window.pJSDom[0].pJS.fn.particlesRefresh();
  } else if (window.particlesJS) {
    // Simple color update for particles.js if present
    try {
      Particles.init({
        selector: '#particles-canvas',
        color: currentTheme === 'dark' ? '#818cf8' : '#6366f1'
      });
    } catch (e) {
      console.log('Particles update failed, but it\'s not critical');
    }
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: 'smooth'
    });
  });
});

// Scroll reveal animation
const revealElements = document.querySelectorAll('section, .card');
revealElements.forEach(element => {
  element.classList.add('hidden');
});

function revealOnScroll() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (elementTop < windowHeight - 100) {
      element.classList.remove('hidden');
      element.classList.add('visible');
    }
  });
}

// Initial check on page load
window.addEventListener('load', revealOnScroll);
// Check on scroll
window.addEventListener('scroll', revealOnScroll);

// Mobile menu toggle functionality (if needed in future)
function setupMobileMenu() {
  // Code for mobile menu can go here if you add it later
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
  setupMobileMenu();
});