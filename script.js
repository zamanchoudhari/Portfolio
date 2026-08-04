const heroSection = document.querySelector('.hero');
const heroFrame = document.getElementById('heroFrame');
const totalFrames = 300;
const frameSources = Array.from({ length: totalFrames }, (_, index) =>
  `ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`
);

let frameIndex = 0;
let animationFrameId = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function preloadFrames() {
  frameSources.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function updateHeroFrame() {
  if (!heroSection || !heroFrame) {
    return;
  }

  const sectionTop = heroSection.offsetTop;
  const sectionHeight = heroSection.offsetHeight;
  const start = sectionTop;
  const end = sectionTop + sectionHeight - window.innerHeight;
  const rawProgress = (window.scrollY - start) / Math.max(1, end - start);
  const progress = clamp(rawProgress, 0, 1);
  const nextIndex = Math.round(progress * (frameSources.length - 1));

  if (nextIndex !== frameIndex) {
    frameIndex = nextIndex;
    heroFrame.src = frameSources[frameIndex];
  }

  animationFrameId = null;
}

function scheduleHeroFrameUpdate() {
  if (!animationFrameId) {
    animationFrameId = window.requestAnimationFrame(updateHeroFrame);
  }
}

preloadFrames();
if (heroFrame) {
  heroFrame.src = frameSources[0];
}

window.addEventListener('scroll', scheduleHeroFrameUpdate, { passive: true });
window.addEventListener('resize', scheduleHeroFrameUpdate);
window.addEventListener('load', scheduleHeroFrameUpdate);

scheduleHeroFrameUpdate();

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 700);
  }
});

const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');
menuBtn?.addEventListener('click', () => {
  nav?.classList.toggle('active');
});

const typing = document.querySelector('.typing');
const words = ['Web Developer', 'UI/UX Designer', 'Full-Stack Developer'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typing) {
    return;
  }

  const currentWord = words[wordIndex];
  if (!deleting) {
    typing.textContent = currentWord.substring(0, charIndex++);
    if (charIndex > currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1200);
      return;
    }
  } else {
    typing.textContent = currentWord.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeEffect, deleting ? 50 : 120);
}

typeEffect();

const reveals = document.querySelectorAll('section, .project-card, .skill-card, .timeline-card, .info-card');
function revealSection() {
  const trigger = window.innerHeight - 100;
  reveals.forEach((item) => {
    const top = item.getBoundingClientRect().top;
    if (top < trigger) {
      item.classList.add('show');
    }
  });
}
window.addEventListener('scroll', revealSection);
revealSection();

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const top = section.offsetTop - 120;
    const height = section.offsetHeight;
    if (scrollY >= top) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

const topBtn = document.createElement('div');
topBtn.className = 'top-btn';
topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
document.body.appendChild(topBtn);
window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    topBtn.classList.add('active');
  } else {
    topBtn.classList.remove('active');
  }
});
topBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const contactForm = document.getElementById('contactForm');
const contactName = document.getElementById('contactName');
const contactEmail = document.getElementById('contactEmail');
const contactMessage = document.getElementById('contactMessage');
const sendMessageButton = document.getElementById('sendMessageButton');
const contactFeedback = document.getElementById('contactFeedback');
const errorMessages = Array.from(contactForm ? contactForm.querySelectorAll('.error-message') : []);

const aiStockAnalyzerImage = document.getElementById('aiStockAnalyzerImage');
const aiStockImages = [
  'assets/images/pic1.png',
  'assets/images/pic2.png',
  'assets/images/pic3.png',
  'assets/images/pic4.png'
];
let aiStockTimer = null;
let aiStockIndex = 0; // current displayed index
let aiStockRunning = false;
const aiDisplayDuration = 1200; // ms each image stays visible (1.2s)
const aiFadeDuration = 400; // ms for fade transition

// ensure transition style
if (aiStockAnalyzerImage) {
  aiStockAnalyzerImage.style.transition = `opacity ${aiFadeDuration}ms ease`;
  aiStockAnalyzerImage.style.opacity = '1';
  aiStockAnalyzerImage.src = aiStockImages[0];
}

// preload helper
function preloadAiImages() {
  aiStockImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function scheduleAiNext() {
  // schedule the next change only if running
  if (!aiStockRunning) return;
  aiStockTimer = setTimeout(() => {
    if (!aiStockRunning) return;

    // determine next index following the requested sequence
    let nextIndex;
    if (aiStockIndex === 0) {
      nextIndex = 1;
    } else if (aiStockIndex >= aiStockImages.length - 1) {
      nextIndex = 1;
    } else {
      nextIndex = aiStockIndex + 1;
    }

    const nextSrc = aiStockImages[nextIndex];
    const tmp = new Image();
    tmp.onload = () => {
      // fade out, swap src when fade completes, then fade in
      const onFadeOut = (e) => {
        if (e && e.propertyName && e.propertyName !== 'opacity') return;
        aiStockAnalyzerImage.removeEventListener('transitionend', onFadeOut);
        aiStockAnalyzerImage.src = nextSrc;
        // force reflow then fade in
        requestAnimationFrame(() => {
          aiStockAnalyzerImage.style.opacity = '1';
        });
        aiStockIndex = nextIndex;
        // schedule next after visible duration + small buffer
        scheduleAiNext();
      };

      // start fade out
      aiStockAnalyzerImage.addEventListener('transitionend', onFadeOut);
      aiStockAnalyzerImage.style.opacity = '0';
    };
    tmp.onerror = () => {
      // if preload fails, still advance index and schedule next
      aiStockIndex = nextIndex;
      scheduleAiNext();
    };
    tmp.src = nextSrc;
  }, aiDisplayDuration);
}

function startAiStockHoverAnimation() {
  if (!aiStockAnalyzerImage || aiStockRunning) return;
  aiStockRunning = true;
  aiStockIndex = 0;
  aiStockAnalyzerImage.src = aiStockImages[0];
  aiStockAnalyzerImage.style.opacity = '1';
  preloadAiImages();
  scheduleAiNext();
}

function stopAiStockHoverAnimation() {
  aiStockRunning = false;
  if (aiStockTimer) {
    clearTimeout(aiStockTimer);
    aiStockTimer = null;
  }
  if (!aiStockAnalyzerImage) return;

  const onReset = (e) => {
    if (e && e.propertyName && e.propertyName !== 'opacity') return;
    aiStockAnalyzerImage.removeEventListener('transitionend', onReset);
    aiStockAnalyzerImage.src = aiStockImages[0];
    aiStockIndex = 0;
    requestAnimationFrame(() => {
      aiStockAnalyzerImage.style.opacity = '1';
    });
  };

  // fade out then reset to pic1 and fade in
  const currentOpacity = parseFloat(getComputedStyle(aiStockAnalyzerImage).opacity || '1');
  if (currentOpacity === 0) {
    // already invisible — reset immediately
    onReset();
  } else {
    aiStockAnalyzerImage.addEventListener('transitionend', onReset);
    aiStockAnalyzerImage.style.opacity = '0';
  }
}

function sanitizeInput(value) {
  const temp = document.createElement('div');
  temp.textContent = value;
  return temp.innerHTML.trim();
}

function setFieldError(input, message) {
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.textContent = message;
    input.classList.add('invalid-field');
    input.style.borderColor = '#ff4d4d';
    input.style.boxShadow = '0 0 0 2px rgba(255, 77, 77, 0.12)';
  }
}

function clearFieldError(input) {
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains('error-message')) {
    errorElement.textContent = '';
    input.classList.remove('invalid-field');
    input.style.borderColor = '';
    input.style.boxShadow = '';
  }
}

function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateForm() {
  let isValid = true;
  clearFieldError(contactName);
  clearFieldError(contactEmail);
  clearFieldError(contactMessage);

  const nameValue = contactName.value.trim();
  const emailValue = contactEmail.value.trim();
  const messageValue = contactMessage.value.trim();

  if (!nameValue) {
    setFieldError(contactName, 'Please enter your name.');
    isValid = false;
  }

  if (!emailValue) {
    setFieldError(contactEmail, 'Please enter your email address.');
    isValid = false;
  } else if (!validateEmail(emailValue)) {
    setFieldError(contactEmail, 'Please enter a valid email address.');
    isValid = false;
  }

  if (!messageValue) {
    setFieldError(contactMessage, 'Please enter your message.');
    isValid = false;
  }

  return isValid;
}

function setFeedback(message, isError = false) {
  contactFeedback.textContent = message;
  contactFeedback.style.color = isError ? '#ff4d4d' : '#00ffab';
}

function setLoading(isLoading) {
  sendMessageButton.disabled = isLoading;
  sendMessageButton.textContent = isLoading ? 'Sending...' : 'Send Message';
}

function clearForm() {
  contactName.value = '';
  contactEmail.value = '';
  contactMessage.value = '';
}

function sendEmail(event) {
  event.preventDefault();
  if (!validateForm()) {
    setFeedback('Please fix the highlighted fields before sending.', true);
    return;
  }

  if (sendMessageButton.disabled) {
    return;
  }

  setFeedback('');
  setLoading(true);

  const formData = new URLSearchParams();
  formData.append('name', sanitizeInput(contactName.value));
  formData.append('email', sanitizeInput(contactEmail.value));
  formData.append('message', sanitizeInput(contactMessage.value));
  formData.append('_subject', 'New Portfolio Contact Message');
  formData.append('_captcha', 'false');
  formData.append('_template', 'table');

  fetch('https://formsubmit.co/ajax/choudharizaman@gmail.com', {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: formData
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      setFeedback("Message sent successfully! I'll get back to you soon.");
      clearForm();
      setLoading(false);
    })
    .catch((error) => {
      console.error('Form submission error:', error);
      setFeedback('Failed to send message. Please try again later.', true);
      setLoading(false);
    });
}

if (contactForm) {
  contactForm.addEventListener('submit', sendEmail);
  [contactName, contactEmail, contactMessage].forEach((field) => {
    field.addEventListener('input', () => {
      clearFieldError(field);
      setFeedback('');
    });
  });
  const aiStockCard = document.querySelector('.project-card:nth-of-type(2)');
  if (aiStockCard && aiStockAnalyzerImage) {
    aiStockCard.addEventListener('mouseenter', startAiStockHoverAnimation);
    aiStockCard.addEventListener('mouseleave', stopAiStockHoverAnimation);
  }
}

const adminProjectCard = document.querySelector('.admin-project-card');
const adminProjectImages = [
  'assets/images/pho1.png',
  'assets/images/pho2.png',
  'assets/images/pho3.png',
  'assets/images/pho4.png'
];
const adminProjectImageA = document.getElementById('adminProjectImageA');
const adminProjectImageB = document.getElementById('adminProjectImageB');
let adminProjectTimer = null;
let adminProjectIndex = 0;
let adminProjectActiveLayer = 0;
let adminProjectRunning = false;
const adminProjectDisplay = 2200; // ms each image stays visible
const adminProjectFade = 650; // ms cross-fade duration

function preloadAdminProjectImages() {
  adminProjectImages.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

function setAdminProjectDefault() {
  adminProjectIndex = 0;
  adminProjectActiveLayer = 0;
  if (adminProjectImageA) {
    adminProjectImageA.src = adminProjectImages[0];
    adminProjectImageA.style.opacity = '1';
  }
  if (adminProjectImageB) {
    adminProjectImageB.src = adminProjectImages[0];
    adminProjectImageB.style.opacity = '0';
  }
}

function scheduleAdminProjectNext() {
  if (!adminProjectRunning) return;
  adminProjectTimer = setTimeout(() => {
    if (!adminProjectRunning) return;

    const nextIndex = (adminProjectIndex + 1) % adminProjectImages.length;
    const nextLayer = adminProjectActiveLayer === 0 ? adminProjectImageB : adminProjectImageA;
    const currentLayer = adminProjectActiveLayer === 0 ? adminProjectImageA : adminProjectImageB;
    const nextSrc = adminProjectImages[nextIndex];

    if (!nextLayer || !currentLayer) return;

    const tmp = new Image();
    tmp.onload = () => {
      nextLayer.src = nextSrc;
      nextLayer.style.transition = `opacity ${adminProjectFade}ms ease`;
      currentLayer.style.transition = `opacity ${adminProjectFade}ms ease`;
      nextLayer.style.opacity = '1';
      currentLayer.style.opacity = '0';
      adminProjectActiveLayer = adminProjectActiveLayer === 0 ? 1 : 0;
      adminProjectIndex = nextIndex;
      scheduleAdminProjectNext();
    };
    tmp.onerror = () => {
      adminProjectIndex = nextIndex;
      scheduleAdminProjectNext();
    };
    tmp.src = nextSrc;
  }, adminProjectDisplay);
}

function startAdminProjectHoverAnimation() {
  if (!adminProjectCard || adminProjectRunning || !adminProjectImageA || !adminProjectImageB) return;
  adminProjectRunning = true;
  setAdminProjectDefault();
  preloadAdminProjectImages();
  scheduleAdminProjectNext();
}

function stopAdminProjectHoverAnimation() {
  adminProjectRunning = false;
  if (adminProjectTimer) {
    clearTimeout(adminProjectTimer);
    adminProjectTimer = null;
  }
  if (!adminProjectImageA || !adminProjectImageB) return;

  const currentLayer = adminProjectActiveLayer === 0 ? adminProjectImageA : adminProjectImageB;
  const resetLayer = adminProjectActiveLayer === 0 ? adminProjectImageB : adminProjectImageA;

  resetLayer.src = adminProjectImages[0];
  resetLayer.style.transition = `opacity ${adminProjectFade}ms ease`;
  currentLayer.style.transition = `opacity ${adminProjectFade}ms ease`;
  resetLayer.style.opacity = '1';
  currentLayer.style.opacity = '0';
  adminProjectActiveLayer = adminProjectActiveLayer === 0 ? 1 : 0;
  adminProjectIndex = 0;
}

setAdminProjectDefault();
if (adminProjectCard) {
  adminProjectCard.addEventListener('mouseenter', startAdminProjectHoverAnimation);
  adminProjectCard.addEventListener('mouseleave', stopAdminProjectHoverAnimation);
}

const glow = document.createElement('div');
glow.style.position = 'fixed';
glow.style.width = '250px';
glow.style.height = '250px';
glow.style.borderRadius = '50%';
glow.style.background = 'rgba(255,45,85,.12)';
glow.style.pointerEvents = 'none';
glow.style.filter = 'blur(70px)';
glow.style.zIndex = '-1';
document.body.appendChild(glow);
window.addEventListener('mousemove', (e) => {
  glow.style.left = e.clientX - 125 + 'px';
glow.style.top = e.clientY - 125 + 'px';
});

const heroImg = document.querySelector('.hero-right img');
let direction = 1;
setInterval(() => {
  if (heroImg) {
    heroImg.style.transform = `translateY(${direction * 10}px)`;
  }
  direction *= -1;
}, 2500);

console.log('Portfolio Developed by Zaman Choudhari');
