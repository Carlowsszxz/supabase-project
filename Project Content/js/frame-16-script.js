
    // Library-themed cursor follower
    (function () {
      const follower = document.getElementById('cursor-follower');
      if (!follower) return;

      // Hide on touch devices
      const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
      if (isTouch) { follower.style.display = 'none'; return; }
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        follower.style.display = 'none'; return;
      }

      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;
      let posX = mouseX;
      let posY = mouseY;
      const ease = 0.08; // Slower, more gentle movement for library theme
      let isVisible = false;

      // Gentle fade in/out on mouse movement
      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
          follower.style.opacity = '0.6';
          isVisible = true;
        }
      }, { passive: true });

      // Fade out when mouse leaves window
      window.addEventListener('mouseleave', () => {
        follower.style.opacity = '0';
        isVisible = false;
      });

      // Smooth following animation
      function animate() {
        posX += (mouseX - posX) * ease;
        posY += (mouseY - posY) * ease;
        follower.style.transform = `translate(${posX}px, ${posY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    })();

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  
