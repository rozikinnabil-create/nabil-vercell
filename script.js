document.addEventListener('DOMContentLoaded', () => {
  try {
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
            if (preloaderLog) preloaderLog.appendChild(line);
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

    // ---- Theme toggle dengan animasi float down ----
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme-animating', 'true');
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('nbrzm-theme', next);

        setTimeout(() => {
          document.documentElement.removeAttribute('data-theme-animating');
        }, 600);
      });
    }

    // ---- Mobile nav toggle ----
    const burger = document.querySelector('.burger');
    const mnav = document.getElementById('mnav');
    if (burger && mnav) {
      burger.addEventListener('click', () => mnav.classList.toggle('open'));
      mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mnav.classList.remove('open')));
    }

    // ---- Scroll reveal ----
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

    // ---- Scroll to top ----
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

    // ---- Typewriter ----
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

    // ---- Animated counters ----
    const stats = document.querySelectorAll('.stat');
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statEl = entry.target;
          const numEl = statEl.querySelector('b');
          if (numEl) {
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
          }
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

    // ---- CLI Console ----
    const cliOutput = document.getElementById('cliOutput');
    const cliInput = document.getElementById('cliInput');
    if (cliOutput && cliInput) {
      const printLine = (text, cls) => {
        const div = document.createElement('div');
        if (cls) div.className = cls;
        div.textContent = text;
        cliOutput.appendChild(div);
        cliOutput.scrollTop = cliOutput.scrollHeight;
        return div;
      };

      const commands = {
        help: () => [
          'Available commands:',
          '  help        - show this list',
          '  debian      - ubuntu/debian server cheatsheet',
          '  ping <host> - test network latency',
          '  whoami      - who am I',
          '  about       - short bio',
          '  skills      - list my skills',
          '  projects    - list my projects',
          '  contact     - how to reach me',
          '  neofetch    - system info flex',
          '  clear       - clear the screen'
        ],
        debian: () => {
          cliOutput.innerHTML = '';
          return [
            '=== [ MODE: DEBIAN CHEATSHEET ] ===',
            '--------------------------------------------------',
            'sudo apt update && sudo apt upgrade -y',
            'sudo apt install docker.io docker-compose -y',
            'sudo systemctl enable --now docker'
          ];
        },
        ping: (args) => {
          const target = args || 'google.com';
          const time = (Math.random() * 20 + 10).toFixed(1);
          return [
            `PING ${target} (142.250.190.46) 56(84) bytes of data.`,
            `64 bytes from ${target}: icmp_seq=1 ttl=117 time=${time} ms`
          ];
        },
        whoami: () => ['nabil_rozikin_maulana'],
        about: () => ['Siswa TKJ, Web Dev, Networking, IoT.'],
        skills: () => ['HTML 90%, CSS 85%, JS 75%, Networking 90%, Arduino 85%'],
        projects: () => ['1. Portfolio  2. Pathfinder  3. IoT Monitoring'],
        contact: () => ['Email: nabilrozikin@gmail.com', 'IG: @nblrzknm._', 'WA: 088210670848'],
        neofetch: () => ['OS: NBRZM.KINN v1.0', 'Host: TKJ Student', 'Stack: HTML/CSS/JS']
      };

      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const raw = cliInput.value.trim();
          cliInput.value = '';
          if (!raw) return;
          printLine(raw, 'cli-line-cmd');
          if (raw.toLowerCase() === 'clear') { cliOutput.innerHTML = ''; return; }
          const parts = raw.split(' ');
          const key = parts[0].toLowerCase();
          const args = parts.slice(1).join(' ');
          if (commands[key]) {
            const res = commands[key](args);
            res.forEach(l => printLine(l));
          } else {
            printLine(`command not found: ${raw} — type "help"`, 'cli-line-err');
          }
        }
      });
      printLine('NBRZM.KINN console — type "help" to start.');
      cliOutput.addEventListener('click', () => cliInput.focus());
    }

    // ---- Clock ----
    const sysClockTime = document.getElementById('sysClockTime');
    const sysUptime = document.getElementById('sysUptime');
    if (sysClockTime && sysUptime) {
      const siteEpoch = new Date('2024-01-01T00:00:00');
      const updateClock = () => {
        const now = new Date();
        sysClockTime.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' WIB';
        sysUptime.textContent = `uptime ${Math.floor((now - siteEpoch) / 86400000)}d`;
      };
      updateClock();
      setInterval(updateClock, 1000);
    }

    // ---- Heatmap ----
    const heatmapGrid = document.getElementById('heatmapGrid');
    if (heatmapGrid) {
      for (let i = 0; i < 182; i++) {
        const cell = document.createElement('div');
        const rand = Math.random();
        let level = 0;
        if (rand > 0.85) level = 4;
        else if (rand > 0.7) level = 3;
        else if (rand > 0.5) level = 2;
        else if (rand > 0.3) level = 1;
        cell.className = `hm-cell hm-${level}`;
        heatmapGrid.appendChild(cell);
      }
    }

    // ---- Card Glow Tracker ----
    document.querySelectorAll('.proj-card, .focus-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      });
    });

    // ---- Project Filters ----
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.proj-card').forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) card.style.display = 'flex';
          else card.style.display = 'none';
        });
      });
    });

    initVisitCounter();
    initContactForm();

  } catch (err) {
    console.error('NBRZM script error:', err);
  }
});

// Quick Copy
function copyContact(text, btnEl) {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btnEl.innerText;
    btnEl.innerText = '✅ Copied!';
    setTimeout(() => { btnEl.innerText = originalText; }, 2000);
  });
}

// BGM Player
const playlist = [
  { title: "Cyber Ambient", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3" },
  { title: "Lofi Chill", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" }
];
let currentTrackIndex = 0;
let isPlaying = false;
const bgmAudio = new Audio();
bgmAudio.volume = 0.3;

function updateBgmUI() {
  const bgmBtn = document.getElementById('bgmTitle');
  if (!bgmBtn) return;
  if (isPlaying) {
    bgmBtn.innerHTML = `<div class="eq-bar"><span></span><span></span><span></span></div> ON: ${playlist[currentTrackIndex].title}`;
  } else {
    bgmBtn.innerHTML = `🎵 BGM: OFF`;
  }
}

function toggleBgm() {
  if (isPlaying) {
    bgmAudio.pause();
    isPlaying = false;
    updateBgmUI();
  } else {
    bgmAudio.src = playlist[currentTrackIndex].url;
    bgmAudio.play().then(() => {
      isPlaying = true;
      updateBgmUI();
    }).catch(() => {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
      bgmAudio.src = playlist[currentTrackIndex].url;
      bgmAudio.play().then(() => {
        isPlaying = true;
        updateBgmUI();
      });
    });
  }
}

// Visit counter
function initVisitCounter() {
  const digitsContainer = document.getElementById('viewDigits');
  if (!digitsContainer) return;

  const renderDigits = (num) => {
    const totalViews = String(num || 1).padStart(6, '0');
    digitsContainer.innerHTML = totalViews
      .split('')
      .map(digit => `<span>${digit}</span>`)
      .join('');
  };

  fetch("https://api.counterapi.dev/v1/nbrzm-kinn-portfolio/page-views/up")
    .then(res => res.json())
    .then(data => {
      if (data && data.count) {
        renderDigits(data.count);
        localStorage.setItem('nbrzm_views_backup', data.count);
      } else throw new Error('No count');
    })
    .catch(() => {
      let count = parseInt(localStorage.getItem('nbrzm_views_backup') || '14', 10) + 1;
      localStorage.setItem('nbrzm_views_backup', count);
      renderDigits(count);
    });
}

// Contact form
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const btnSubmit = document.getElementById('btnSubmitForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btnSubmit) { btnSubmit.disabled = true; btnSubmit.innerText = 'Mengirim...'; }
      if (formStatus) { formStatus.className = 'form-status'; formStatus.innerText = ''; }

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: json
      })
      .then(async (response) => {
        let resJson = await response.json();
        if (response.status === 200) {
          if (formStatus) { formStatus.classList.add('success'); formStatus.innerText = '✅ Pesan berhasil terkirim!'; }
          contactForm.reset();
        } else {
          if (formStatus) { formStatus.classList.add('error'); formStatus.innerText = resJson.message || 'Gagal mengirim pesan.'; }
        }
      })
      .catch(() => {
        if (formStatus) { formStatus.classList.add('error'); formStatus.innerText = 'Terjadi kesalahan jaringan.'; }
      })
      .then(() => {
        if (btnSubmit) { btnSubmit.disabled = false; btnSubmit.innerText = '✉️ Kirim Pesan'; }
      });
    });
  }
}

// Modal
const modalData = {
    about: {
        title: "🙋‍♂️ ABOUT ME",
        content: `<p>Halo! Saya siswa <b>Teknik Komputer & Jaringan (TKJ/TJKT)</b> yang berfokus pada pengembangan jaringan komputer, administrasi server, dan pemrograman web modern.</p>`
    },
    dream: {
        title: "🚀 MY DREAM & GOALS",
        content: `<p>Target karir menjadi Network Engineer & Cloud Engineer profesional.</p>`
    },
    projects: {
        title: "💻 MY FEATURED PROJECTS",
        content: `<p>Projek portofolio mencakup Web Application, Routing Cisco, dan Sistem Monitoring IoT.</p>`
    }
};

function openModal(type) {
    const modal = document.getElementById('detailModal');
    const titleEl = document.getElementById('modalTitle');
    const bodyEl = document.getElementById('modalBody');
    if (modal && modalData[type]) {
        titleEl.innerHTML = modalData[type].title;
        bodyEl.innerHTML = modalData[type].content;
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    if (modal) modal.classList.remove('active');
}

window.addEventListener('click', function(e) {
    const modal = document.getElementById('detailModal');
    if (e.target === modal) closeModal();
});