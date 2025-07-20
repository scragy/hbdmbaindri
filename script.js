let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.startX = 0;
    this.startY = 0;
    this.moveX = 0;
    this.moveY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
  }

  init(paper) {
    if (this.isMobile) {
      // Touch events for mobile
      paper.addEventListener('touchstart', (e) => {
        if(this.holdingPaper) return;
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.prevX = this.startX;
        this.prevY = this.startY;
      });

      paper.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if(!this.rotating) {
          this.moveX = e.touches[0].clientX;
          this.moveY = e.touches[0].clientY;
          this.velX = this.moveX - this.prevX;
          this.velY = this.moveY - this.prevY;
        }
        const dirX = e.touches[0].clientX - this.startX;
        const dirY = e.touches[0].clientY - this.startY;
        const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
        const dirNormalizedX = dirX / dirLength;
        const dirNormalizedY = dirY / dirLength;
        const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
        let degrees = 180 * angle / Math.PI;
        degrees = (360 + Math.round(degrees)) % 360;
        if(this.rotating) {
          this.rotation = degrees;
        }
        if(this.holdingPaper) {
          if(!this.rotating) {
            this.currentPaperX += this.velX;
            this.currentPaperY += this.velY;
          }
          this.prevX = this.moveX;
          this.prevY = this.moveY;
          paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        }
      });

      paper.addEventListener('touchend', () => {
        this.holdingPaper = false;
        this.rotating = false;
      });

      // Optional: gesture events for rotation (not supported on all browsers)
      paper.addEventListener('gesturestart', (e) => {
        e.preventDefault();
        this.rotating = true;
      });
      paper.addEventListener('gestureend', () => {
        this.rotating = false;
      });

    } else {
      // Mouse events for desktop
      paper.addEventListener('mousedown', (e) => {
        if(this.holdingPaper) return;
        this.holdingPaper = true;
        paper.style.zIndex = highestZ++;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.prevX = this.startX;
        this.prevY = this.startY;
      });

      document.addEventListener('mousemove', (e) => {
        if (!this.holdingPaper) return;
        this.moveX = e.clientX;
        this.moveY = e.clientY;
        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevX = this.moveX;
        this.prevY = this.moveY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      });

      document.addEventListener('mouseup', () => {
        this.holdingPaper = false;
        this.rotating = false;
      });

      // Optional: rotation with right-click + drag
      paper.addEventListener('contextmenu', (e) => e.preventDefault());
      paper.addEventListener('mousedown', (e) => {
        if (e.button === 2) { // right click
          this.rotating = true;
        }
      });
      document.addEventListener('mouseup', (e) => {
        if (e.button === 2) {
          this.rotating = false;
        }
      });
      document.addEventListener('mousemove', (e) => {
        if (this.rotating && this.holdingPaper) {
          const dirX = e.clientX - this.startX;
          const dirY = e.clientY - this.startY;
          const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
          const dirNormalizedX = dirX / dirLength;
          const dirNormalizedY = dirY / dirLength;
          const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
          let degrees = 180 * angle / Math.PI;
          degrees = (360 + Math.round(degrees)) % 360;
          this.rotation = degrees;
          paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const papers = Array.from(document.querySelectorAll('.paper'));
  papers.forEach(paper => {
    const p = new Paper();
    p.init(paper);
  });

  // Musik: autoplay trigger untuk beberapa browser
  var music = document.getElementById('bg-music');
  function startMusic() {
    music.play();
    document.removeEventListener('touchstart', startMusic);
    document.removeEventListener('click', startMusic);
  }
  document.addEventListener('touchstart', startMusic);
  document.addEventListener('click', startMusic);
});