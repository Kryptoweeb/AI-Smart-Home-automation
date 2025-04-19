// Theme Toggle
const toggleTheme = () => {
  document.body.classList.toggle('dark');
  document.getElementById('theme-toggle').textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
};
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Font Size
let fontSize = 16;
const updateFontSize = () => {
  document.body.style.fontSize = `${fontSize}px`;
  document.getElementById('font-size').textContent = `Font Size: ${fontSize}px`;
};
document.getElementById('font-increase').addEventListener('click', () => {
  fontSize = Math.min(fontSize + 2, 24);
  updateFontSize();
});
document.getElementById('font-decrease').addEventListener('click', () => {
  fontSize = Math.max(fontSize - 2, 12);
  updateFontSize();
});

// Theme Selector
const themeCards = document.querySelectorAll('.theme-card');
const themePreview = document.getElementById('theme-preview');
themeCards.forEach(card => {
  card.addEventListener('click', () => {
    themeCards.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    themePreview.style.display = 'block';
    themePreview.textContent = `Previewing ${card.dataset.theme} - Imagine your room glowing!`;
    themePreview.classList.add('fade-in');
    setTimeout(() => themePreview.classList.remove('fade-in'), 1000);
  });
});

// Back to Top
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 300);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Scroll Animations
const animateOnScroll = () => {
  const elements = document.querySelectorAll('.animated-card, .fade-in');
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', animateOnScroll);
animateOnScroll();