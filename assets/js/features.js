// features.js

// Highlight feature card on hover
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.add('scale-105', 'shadow-lg', 'shadow-cyan-400/60', 'bg-white/5');
  });

  card.addEventListener('mouseleave', () => {
    card.classList.remove('scale-105', 'shadow-lg', 'shadow-cyan-400/60', 'bg-white/5');
  });
});

// Render Lucide icons
lucide.createIcons();
