document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Preloader boot sequence ----
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderFill');
  const preloaderLog = document.getElementById('preloaderLog');
  const bootLines = [
    '$ booting NBRZM.SYS...',
    '$ loading network modules... OK',
    '$ initializing ESP32 driver... OK',
    '$ mounting portfolio... OK',
    '$ welcome, guest.'
  ];

  if (preloader) {
    if (reduceMotion) {
      preloader.classList.add('hide');
    } else {
      document.body.style.overflow = 'hidden';
      let i = 0;
      const typeNextLine = () => {
        if (i < bootLines.length) {
          const line = document.createElement('div');
          line.textContent = bootLines[i];
          preloaderLog.appendChild(line);
          if (preloaderFill) preloaderFill.style.width = ((i + 1) / bootLines.length * 100) + '%';
          i++;
          setTimeout(typeNextLine, 280);
        } else {
          setTimeout(() => {
            preloader.classList.add('hide');
            document.body.style.overflow = '';
          }, 350);
        }
      };
      setTimeout(typeNextLine, 300);
    }
  }

  // ---- Theme toggle ----
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('nbrzm-theme', next);
    });
  }

  // ---- Mobile nav toggle ----
  const burger = document.querySelector('.burger');
  const mnav = document.getElementById('mnav');
  if (burger && mnav) {
    burger.addEventListener('click', () => mnav.classList.toggle('open'));
    mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mnav.classList.remove('open')));
  }

  // ---- Scroll reveal with stagger ----
  const items = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('in'), idx * 60);
        io.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  items.forEach(i => io.observe(i));

  // ---- Scroll progress bar ----
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progressBar) progressBar.style.width = scrolled + '%';
  });

  // ---- Scroll-to-top button ----
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 480) scrollTopBtn.classList.add('show');
      else scrollTopBtn.classList.remove('show');
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  // ---- Typewriter effect on hero lead paragraph ----
  const typedLead = document.getElementById('typedLead');
  const leadText = "Nabil Rozikin Maulana — siswa Teknik Komputer dan Jaringan yang bikin website, ngoprek Mikrotik, dan merakit robot ESP32. Belajar sambil bikin project yang beneran jalan.";
  if (typedLead) {
    if (reduceMotion) {
      typedLead.textContent = leadText;
    } else {
      let ci = 0;
      const typeChar = () => {
        if (ci <= leadText.length) {
          typedLead.textContent = leadText.slice(0, ci);
          ci++;
          setTimeout(typeChar, 16);
        }
      };
      setTimeout(typeChar, 1700);
    }
  }

  // ---- Custom cursor ----
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring && matchMedia('(hover:hover)').matches) {
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });
    function animateRing(){
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();
    document.querySelectorAll('a, button, .btn, .proj-card, .testi-card, .cert-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
  }

  // ---- Magnetic buttons ----
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  // ---- Tilt effect on project cards ----
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = 'rotateY(0) rotateX(0)'; });
  });

  // ---- Animated counters ----
  const stats = document.querySelectorAll('.stat');
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statEl = entry.target;
        const numEl = statEl.querySelector('b');
        const target = parseInt(numEl.getAttribute('data-count'), 10);
        const suffix = numEl.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1000;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
            statEl.classList.add('counted');
          }
          numEl.textContent = Math.floor(current) + suffix;
        }, stepTime);
        countIO.unobserve(statEl);
      }
    });
  }, { threshold: .4 });
  stats.forEach(s => countIO.observe(s));

  // ---- Animated skill bars ----
  const bars = document.querySelectorAll('.bar-fill');
  const barIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-width') || '0';
        requestAnimationFrame(() => { el.style.width = width + '%'; });
        barIO.unobserve(el);
      }
    });
  }, { threshold: .3 });
  bars.forEach(b => barIO.observe(b));

  // ---- Matrix code rain background ----
  const matrixCanvas = document.getElementById('matrixCanvas');
  if (matrixCanvas && !reduceMotion) {
    const ctx = matrixCanvas.getContext('2d');
    const chars = 'アイウエオカキクケコサシスセソ0123456789#$%&+-*ESP32MIKROTIK'.split('');
    let w, h, columns, drops;

    function resizeMatrix() {
      w = matrixCanvas.width = window.innerWidth;
      h = matrixCanvas.height = window.innerHeight;
      columns = Math.floor(w / 18);
      drops = new Array(columns).fill(1);
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#C6FF3D';
      ctx.font = '16px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 18, drops[i] * 18);
        if (drops[i] * 18 > h && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    }
    setInterval(drawMatrix, 50);
  } else if (matrixCanvas) {
    matrixCanvas.style.display = 'none';
  }

  // ---- Terminal typing widget ----
  const terminalBody = document.getElementById('terminalBody');
  if (terminalBody) {
    const terminalLines = [
      { type: 'cmd', text: 'whoami' },
      { type: 'out', text: 'nabil_rozikin_maulana' },
      { type: 'cmd', text: 'cat role.txt' },
      { type: 'out', text: 'TKJ Student — Web Dev / Networking / IoT' },
      { type: 'cmd', text: 'echo $STATUS' },
      { type: 'out', text: 'OPEN_FOR_COLLABORATION' }
    ];
    const termIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let li = 0;
          const typeLine = () => {
            if (li < terminalLines.length) {
              const row = terminalLines[li];
              const div = document.createElement('div');
              if (row.type === 'cmd') div.className = 'cmd';
              terminalBody.appendChild(div);
              let ci = 0;
              const typeChar = () => {
                if (ci <= row.text.length) {
                  div.textContent = row.text.slice(0, ci);
                  ci++;
                  setTimeout(typeChar, reduceMotion ? 0 : 28);
                } else {
                  li++;
                  setTimeout(typeLine, 260);
                }
              };
              typeChar();
            }
          };
          typeLine();
          termIO.unobserve(entry.target);
        }
      });
    }, { threshold: .3 });
    termIO.observe(terminalBody);
  }

  // ---- Konami code easter egg ----
  const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let konamiPos = 0;
  const toast = document.createElement('div');
  toast.className = 'easter-toast';
  toast.textContent = '⚡ HACKER MODE UNLOCKED — NBRZM.SYS SALUTES YOU';
  document.body.appendChild(toast);
  window.addEventListener('keydown', (e) => {
    konamiPos = (e.key === konamiSeq[konamiPos]) ? konamiPos + 1 : 0;
    if (konamiPos === konamiSeq.length) {
      konamiPos = 0;
      toast.classList.add('show');
      document.documentElement.style.setProperty('--lime', '#39FF14');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  });

  // ---- Interactive console (CLI) ----
  const cliOutput = document.getElementById('cliOutput');
  const cliInput = document.getElementById('cliInput');
  if (cliOutput && cliInput) {
    const printLine = (text, cls) => {
      const div = document.createElement('div');
      if (cls) div.className = cls;
      div.textContent = text;
      cliOutput.appendChild(div);
      cliOutput.scrollTop = cliOutput.scrollHeight;
    };

    const commands = {
      help: () => [
        'Available commands:',
        '  help        - show this list',
        '  whoami      - who am I',
        '  about       - short bio',
        '  skills      - list my skills',
        '  projects    - list my projects',
        '  contact     - how to reach me',
        '  neofetch    - system info flex',
        '  sudo hire-me',
        '  clear       - clear the screen'
      ],
      whoami: () => ['nabil_rozikin_maulana'],
      about: () => [
        'Siswa Teknik Komputer dan Jaringan (TKJ).',
        'Fokus: Web Development, Networking, Cyber Security, IoT.',
        'Belajar sambil bikin project yang beneran jalan.'
      ],
      skills: () => [
        'HTML          [##########] 90%',
        'CSS           [########  ] 85%',
        'JavaScript    [########  ] 75%',
        'Networking    [##########] 90%',
        'Arduino/ESP32 [########  ] 85%'
      ],
      projects: () => [
        '1. Personal Portfolio  — HTML/CSS/JS',
        '2. Robot Pathfinder    — ESP32 line follower',
        '3. IoT Monitoring      — ESP32 remote monitoring',
        'Scroll up to #projects for links.'
      ],
      contact: () => [
        'Instagram : instagram.com/nblrzknm._',
        'WhatsApp  : wa.me/6288210670848',
        'Telegram  : t.me/apalaabing'
      ],
      neofetch: () => [
        '        /\\        guest@nbrzm',
        '       /  \\       -------------',
        '      / /\\ \\      OS: NBRZM.KINN v1.0',
        '     / ____ \\     Host: TKJ Student',
        '    /_/    \\_\\    Shell: nbrzm-cli',
        '                  Uptime: since 2024',
        '                  Stack: HTML, CSS, JS',
        '                  Focus: Web / Network / IoT'
      ],
      'sudo hire-me': () => [
        '[sudo] password for guest: ********',
        'Permission granted.',
        'Redirecting to #contact in 3... 2... 1...'
      ]
    };

    const runCommand = (raw) => {
      const cmd = raw.trim();
      if (!cmd) return;
      printLine(cmd, 'cli-line-cmd');
      if (cmd.toLowerCase() === 'clear') {
        cliOutput.innerHTML = '';
        return;
      }
      const key = cmd.toLowerCase();
      if (commands[key]) {
        commands[key]().forEach(line => printLine(line));
        if (key === 'sudo hire-me') {
          setTimeout(() => {
            document.getElementById('contact').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
          }, 900);
        }
      } else {
        printLine(`command not found: ${cmd} — type "help"`, 'cli-line-err');
      }
    };

    printLine('NBRZM.KINN interactive console — type "help" to start.');
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        runCommand(cliInput.value);
        cliInput.value = '';
      }
    });
    cliOutput.addEventListener('click', () => cliInput.focus());

    // ---- Keyboard shortcut: press "/" to focus console ----
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== cliInput) {
        e.preventDefault();
        document.getElementById('console').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        setTimeout(() => cliInput.focus(), reduceMotion ? 0 : 400);
      }
    });
  }

  // ---- Live system clock + uptime ----
  const sysClockTime = document.getElementById('sysClockTime');
  const sysUptime = document.getElementById('sysUptime');
  if (sysClockTime && sysUptime) {
    const siteEpoch = new Date('2024-01-01T00:00:00');
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      sysClockTime.textContent = timeStr + ' WIB';
      const days = Math.floor((now - siteEpoch) / 86400000);
      sysUptime.textContent = `uptime ${days}d`;
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  // ---- Activity heatmap (GitHub-style) ----
  const heatmapGrid = document.getElementById('heatmapGrid');
  if (heatmapGrid) {
    const weeks = 26;
    const totalDays = weeks * 7;
    const today = new Date();
    const tooltip = document.createElement('div');
    tooltip.className = 'hm-tooltip';
    document.body.appendChild(tooltip);

    for (let i = totalDays - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const cell = document.createElement('div');
      const rand = Math.random();
      let level = 0;
      if (rand > 0.85) level = 4;
      else if (rand > 0.7) level = 3;
      else if (rand > 0.5) level = 2;
      else if (rand > 0.3) level = 1;
      cell.className = `hm-cell hm-${level}`;
      const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
      const commitWord = level === 0 ? 'no activity' : `${level * 2} contributions`;
      cell.addEventListener('mousemove', (e) => {
        tooltip.textContent = `${commitWord} on ${dateStr}`;
        tooltip.style.left = e.clientX + 14 + 'px';
        tooltip.style.top = e.clientY + 14 + 'px';
        tooltip.classList.add('show');
      });
      cell.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
      heatmapGrid.appendChild(cell);
    }
  }

  // ---- Spotlight grid follows cursor in hero ----
  const spotlightGrid = document.getElementById('spotlightGrid');
  const heroEl = document.getElementById('home');
  if (spotlightGrid && heroEl && matchMedia('(hover:hover)').matches) {
    heroEl.addEventListener('mousemove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const mx = ((e.clientX - r.left) / r.width) * 100;
      const my = ((e.clientY - r.top) / r.height) * 100;
      spotlightGrid.style.setProperty('--mx', mx + '%');
      spotlightGrid.style.setProperty('--my', my + '%');
    });
  }

});
