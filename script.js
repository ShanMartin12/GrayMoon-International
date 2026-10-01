const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const heroVideos = [...document.querySelectorAll('.hero-video')];
const videoControl = document.querySelector('.video-control');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeVideoIndex = 0;
let videoTimer;
let videosPaused = false;

const showNextVideo = () => {
  const outgoingVideo = heroVideos[activeVideoIndex];
  activeVideoIndex = (activeVideoIndex + 1) % heroVideos.length;
  const incomingVideo = heroVideos[activeVideoIndex];

  incomingVideo.currentTime = 0;
  incomingVideo.play().catch(() => {});
  incomingVideo.classList.add('is-active');
  outgoingVideo.classList.remove('is-active');

  window.setTimeout(() => {
    if (!outgoingVideo.classList.contains('is-active')) outgoingVideo.pause();
  }, 1500);
};

const startVideoSequence = () => {
  window.clearInterval(videoTimer);
  if (heroVideos.length > 1) videoTimer = window.setInterval(showNextVideo, 8000);
};

const setVideoState = (paused) => {
  videosPaused = paused;
  if (paused) {
    window.clearInterval(videoTimer);
    heroVideos.forEach(video => video.pause());
    videoControl.querySelector('span').textContent = '▶';
    videoControl.setAttribute('aria-label', 'Play ship and aircraft background videos');
    videoControl.setAttribute('aria-pressed', 'true');
  } else {
    heroVideos[activeVideoIndex].play().catch(() => {});
    startVideoSequence();
    videoControl.querySelector('span').textContent = 'Ⅱ';
    videoControl.setAttribute('aria-label', 'Pause ship and aircraft background videos');
    videoControl.setAttribute('aria-pressed', 'false');
  }
};

setVideoState(reducedMotion.matches);
videoControl.addEventListener('click', () => setVideoState(!videosPaused));
reducedMotion.addEventListener('change', event => setVideoState(event.matches));

const form = document.querySelector('#enquiry-form');
const status = document.querySelector('#form-status');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = new FormData(form).get('name').trim();
  status.textContent = `Thank you${name ? `, ${name}` : ''}. Your enquiry is ready for the Graymoon team.`;
  form.reset();
});

document.querySelector('#year').textContent = new Date().getFullYear();
