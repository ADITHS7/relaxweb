/*
  RelaxApp Landing Page Logic & Interaction
  Handles navigation scrolling, responsive menu, live host filter list, FAQ accordion, and active call simulator states.
*/

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HEADER SCROLL BACKGROUND EFFECT ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- 2. RESPONSIVE MOBILE MENU ---
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      menuToggle.querySelector('i').className = 'fa-solid fa-bars';
    });
  });

  // --- 3. LIVE HOST FILTERS ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const hostCards = document.querySelectorAll('.host-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      hostCards.forEach(card => {
        const categories = card.getAttribute('data-category');

        if (filterValue === 'all') {
          card.style.display = 'block';
          // Force a reflow for transition
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else if (categories && categories.includes(filterValue)) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // match transition speed
        }
      });
    });
  });

  // --- 4. CALL SIMULATOR STATE MACHINE ---
  const standbyState = document.getElementById('sim-standby');
  const ringingState = document.getElementById('sim-ringing');
  const connectingState = document.getElementById('sim-connecting');
  const activeState = document.getElementById('sim-active');

  const startSimBtn = document.getElementById('start-simulation-btn');
  const standbyTrigger = document.getElementById('standby-trigger');
  const declineCallBtn = document.getElementById('decline-call');
  const acceptCallBtn = document.getElementById('accept-call');
  const endCallBtn = document.getElementById('end-call');

  const muteBtn = document.getElementById('mute-call');
  const camBtn = document.getElementById('cam-call');
  const timerDisplay = document.getElementById('call-timer');

  let callTimerInterval = null;
  let secondsElapsed = 0;

  // Helper to switch states
  function switchState(stateToShow) {
    const states = [standbyState, ringingState, connectingState, activeState];
    states.forEach(state => {
      if (state === stateToShow) {
        state.classList.remove('hidden');
      } else {
        state.classList.add('hidden');
      }
    });
  }

  // Ringing call action
  function ringCall() {
    switchState(ringingState);
    // Auto scroll to simulator for good user experience
    document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
  }

  startSimBtn.addEventListener('click', ringCall);
  standbyTrigger.addEventListener('click', ringCall);

  // Decline call
  declineCallBtn.addEventListener('click', () => {
    switchState(standbyState);
  });

  // Accept call (goes connecting -> active)
  acceptCallBtn.addEventListener('click', () => {
    switchState(connectingState);

    // Simulate connecting delay
    setTimeout(() => {
      switchState(activeState);
      startCallTimer();
    }, 2000);
  });

  // End call
  endCallBtn.addEventListener('click', () => {
    stopCallTimer();
    switchState(standbyState);
  });

  // Toggle buttons inside call screen
  muteBtn.addEventListener('click', () => {
    const icon = muteBtn.querySelector('i');
    muteBtn.classList.toggle('muted');
    if (muteBtn.classList.contains('muted')) {
      icon.className = 'fa-solid fa-microphone-slash';
      muteBtn.style.background = 'rgba(255, 15, 123, 0.4)';
    } else {
      icon.className = 'fa-solid fa-microphone';
      muteBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    }
  });

  camBtn.addEventListener('click', () => {
    const icon = camBtn.querySelector('i');
    camBtn.classList.toggle('disabled');
    if (camBtn.classList.contains('disabled')) {
      icon.className = 'fa-solid fa-video-slash';
      camBtn.style.background = 'rgba(255, 15, 123, 0.4)';
    } else {
      icon.className = 'fa-solid fa-video';
      camBtn.style.background = 'rgba(255, 255, 255, 0.1)';
    }
  });

  // Call timer functionality
  function startCallTimer() {
    secondsElapsed = 0;
    timerDisplay.textContent = '00:00';
    clearInterval(callTimerInterval);
    
    callTimerInterval = setInterval(() => {
      secondsElapsed++;
      const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
      const secs = (secondsElapsed % 60).toString().padStart(2, '0');
      timerDisplay.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  function stopCallTimer() {
    clearInterval(callTimerInterval);
    secondsElapsed = 0;
    timerDisplay.textContent = '00:00';
  }

  // --- 5. FAQ ACCORDION ---
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all faq items first for accordion effect
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
