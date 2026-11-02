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

    // ---- Theme toggle ----
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
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
        return div;
      };

      let commandHistory = [];
      let historyIndex = -1;
      let currentMode = 'normal';

      const commands = {
        help: () => {
          if (currentMode !== 'normal') {
            return ['Anda sedang berada di dalam sub-menu cheatsheet.', 'Ketik "exit" untuk keluar dan kembali ke menu utama.'];
          }
          return [
            'Available commands:',
            '  help        - show this list',
            '  debian      - ubuntu/debian server cheatsheet',
            '  ping <host> - test network latency',
            '  scan <ip>   - simulate port scanner',
            '  whoami      - who am I',
            '  about       - short bio',
            '  skills      - list my skills',
            '  projects    - list my projects',
            '  contact     - how to reach me',
            '  neofetch    - system info flex',
            '  ipinfo      - check public IP & network info',
            '  exit        - exit current view / mode',
            '  clear       - clear the screen'
          ];
        },
        debian: () => {
          cliOutput.innerHTML = '';
          currentMode = 'debian-view';
          return [
            '=== [ MODE: DEBIAN CHEATSHEET ] ===',
            'Ketik "exit" untuk keluar dari mode ini.',
            '--------------------------------------------------',
            'sudo apt update && sudo apt upgrade -y',
            'sudo apt install docker.io docker-compose -y',
            'sudo systemctl enable --now docker'
          ];
        },
        exit: () => {
          if (currentMode === 'normal') {
            return ['Tidak ada sesi aktif untuk ditutup.'];
          }
          currentMode = 'normal';
          cliOutput.innerHTML = '';
          return ['Keluar dari direktori. Kembali ke terminal utama.'];
        },
        ping: (args) => {
          const target = args || 'google.com';
          const time = (Math.random() * 20 + 10).toFixed(1);
          return [
            `PING ${target} (142.250.190.46) 56(84) bytes of data.`,
            `64 bytes from ${target}: icmp_seq=1 ttl=117 time=${time} ms`,
            `--- ${target} ping statistics ---`,
            '1 packets transmitted, 1 received, 0% packet loss'
          ];
        },
        whoami: () => ['nabil_rozikin_maulana'],
        about: () => [
          'Siswa Teknik Komputer dan Jaringan (TKJ).',
          'Fokus: Web Development, Networking, Cyber Security, IoT.'
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
          '3. IoT Monitoring      — ESP32 remote monitoring'
        ],
        contact: () => [
          'Instagram : instagram.com/nblrzknm._',
          'WhatsApp  : wa.me/6288210670848',
          'Email     : nabilrozikin@gmail.com'
        ],
        neofetch: () => [
          'guest@nbrzm',
          '------------',
          'OS: NBRZM.KINN v1.0',
          'Host: TKJ Student',
          'Stack: HTML, CSS, JS',
          'Focus: Web / Network / IoT'
        ],
        ipinfo: async () => {
          try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return [
              `IP Address  : ${data.ip}`,
              `ISP / Org   : ${data.org}`,
              `City        : ${data.city}`,
              `Country     : ${data.country_name}`
            ];
          } catch (error) {
            return ['Error: Gagal mengambil data jaringan.'];
          }
        }
      };

      cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const val = cliInput.value.trim();
          const matched = Object.keys(commands).find(cmd => cmd.startsWith(val));
          if (matched) cliInput.value = matched;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
            historyIndex++;
            cliInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
          }
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex > 0) {
            historyIndex--;
            cliInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
          } else if (historyIndex === 0) {
            historyIndex = -1;
            cliInput.value = '';
          }
        }
        if (e.key === 'Enter') {
          runCommand(cliInput.value);
          cliInput.value = '';
        }
      });

      const runCommand = async (raw) => {
        const fullCmd = raw.trim();
        if (!fullCmd) return;
        printLine(fullCmd, 'cli-line-cmd');
        commandHistory.push(fullCmd);
        historyIndex = -1;

        if (fullCmd.toLowerCase() === 'clear') {
          cliOutput.innerHTML = '';
          return;
        }

        const parts = fullCmd.split(' ');
        const key = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (commands[key]) {
          const res = typeof commands[key] === 'function' ? commands[key](args) : commands[key];
          const output = res instanceof Promise ? await res : res;
          if (Array.isArray(output)) {
            output.forEach(line => printLine(line));
          }
        } else {
          printLine(`command not found: ${fullCmd} — type "help"`, 'cli-line-err');
        }
      };

      printLine('NBRZM.KINN console — type "help" to start.');
      cliOutput.addEventListener('click', () => cliInput.focus());
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

    // ---- Activity heatmap ----
    const heatmapGrid = document.getElementById('heatmapGrid');
    if (heatmapGrid) {
      const weeks = 26;
      const totalDays = weeks * 7;

      for (let i = totalDays - 1; i >= 0; i--) {
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

    // ---- Command palette (Ctrl/Cmd+K) ----
    const cmdkOverlay = document.getElementById('cmdkOverlay');
    const cmdkInput = document.getElementById('cmdkInput');
    const cmdkList = document.getElementById('cmdkList');
    const cmdkTrigger = document.getElementById('cmdkTrigger');
    if (cmdkOverlay && cmdkInput && cmdkList) {
      const paletteCommands = [
        { label: 'Go to Home', hint: 'section', action: () => scrollToId('home') },
        { label: 'Go to About', hint: 'section', action: () => scrollToId('about') },
        { label: 'Go to Skills', hint: 'section', action: () => scrollToId('skills') },
        { label: 'Go to Projects', hint: 'section', action: () => scrollToId('projects') },
        { label: 'Go to Console', hint: 'section', action: () => scrollToId('console') },
        { label: 'Go to Activity', hint: 'section', action: () => scrollToId('activity') },
        { label: 'Go to Testimonials', hint: 'section', action: () => scrollToId('testimonials') },
        { label: 'Go to Certificates', hint: 'section', action: () => scrollToId('certificates') },
        { label: 'Go to Contact', hint: 'section', action: () => scrollToId('contact') },
        { label: 'Toggle Theme', hint: 'action', action: () => { const t = document.getElementById('themeToggle'); if (t) t.click(); } },
        { label: 'Open WhatsApp', hint: 'link', action: () => window.open('https://wa.me/6288210670848', '_blank') },
        { label: 'Open Instagram', hint: 'link', action: () => window.open('https://instagram.com/nblrzknm._', '_blank') }
      ];

      function scrollToId(id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }

      let filtered = paletteCommands.slice();
      let activeIndex = 0;

      function renderList() {
        cmdkList.innerHTML = '';
        if (filtered.length === 0) {
          cmdkList.innerHTML = '<div class="cmdk-empty">No matching command</div>';
          return;
        }
        filtered.forEach((cmd, idx) => {
          const item = document.createElement('div');
          item.className = 'cmdk-item' + (idx === activeIndex ? ' active' : '');
          item.innerHTML = `<span>${cmd.label}</span><span class="cmdk-hint">${cmd.hint}</span>`;
          item.addEventListener('click', () => { cmd.action(); closePalette(); });
          cmdkList.appendChild(item);
        });
      }

      function openPalette() {
        cmdkOverlay.classList.add('open');
        cmdkInput.value = '';
        filtered = paletteCommands.slice();
        activeIndex = 0;
        renderList();
        setTimeout(() => cmdkInput.focus(), 30);
      }

      function closePalette() {
        cmdkOverlay.classList.remove('open');
      }

      if (cmdkTrigger) cmdkTrigger.addEventListener('click', openPalette);

      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          if (cmdkOverlay.classList.contains('open')) closePalette();
          else openPalette();
        }
        if (e.key === 'Escape') closePalette();
      });

      cmdkOverlay.addEventListener('click', (e) => {
        if (e.target === cmdkOverlay) closePalette();
      });

      cmdkInput.addEventListener('input', () => {
        const q = cmdkInput.value.toLowerCase();
        filtered = paletteCommands.filter(c => c.label.toLowerCase().includes(q));
        activeIndex = 0;
        renderList();
      });

      cmdkInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
          renderList();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIndex = Math.max(activeIndex - 1, 0);
          renderList();
        } else if (e.key === 'Enter') {
          if (filtered[activeIndex]) {
            filtered[activeIndex].action();
            closePalette();
          }
        }
      });
    }

    initVisitCounter();
    initContactForm();

  } catch (err) {
    console.error('NBRZM script error:', err);
    const pl = document.getElementById('preloader');
    if (pl) { pl.classList.add('hide'); document.body.style.overflow = ''; }
  }
});

function runQuickCmd(cmd) {
  const input = document.getElementById('cliInput');
  if (input) {
    input.value = cmd;
    const event = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 });
    input.dispatchEvent(event);
  }
}

// BGM ENGINE
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
    bgmBtn.innerHTML = `📊 ON: ${playlist[currentTrackIndex].title}`;
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

// GLOBAL VISIT COUNTER (PROXIED & RESPONSIVE)
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

  // Mengambil data hit dari provider CounterAPI
  fetch("https://api.counterapi.dev/v1/nbrzm-kinn-portfolio/page-views/up")
    .then(res => res.json())
    .then(data => {
      if (data && data.count) {
        renderDigits(data.count);
        localStorage.setItem('nbrzm_views_backup', data.count);
      } else {
        throw new Error('No count');
      }
    })
    .catch(() => {
      // Fallback lokal jika API publik terblokir/spam-filtered
      let count = parseInt(localStorage.getItem('nbrzm_views_backup') || '14', 10) + 1;
      localStorage.setItem('nbrzm_views_backup', count);
      renderDigits(count);
    });
}

// DIRECT CONTACT FORM (WEB3FORMS)
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const btnSubmit = document.getElementById('btnSubmitForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = 'Mengirim...';
      }
      if (formStatus) {
        formStatus.className = 'form-status';
        formStatus.innerText = '';
      }

      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let resJson = await response.json();
        if (response.status === 200) {
          if (formStatus) {
            formStatus.classList.add('success');
            formStatus.innerText = '✅ Pesan berhasil terkirim!';
          }
          contactForm.reset();
        } else {
          if (formStatus) {
            formStatus.classList.add('error');
            formStatus.innerText = resJson.message || 'Gagal mengirim pesan.';
          }
        }
      })
      .catch(() => {
        if (formStatus) {
          formStatus.classList.add('error');
          formStatus.innerText = 'Terjadi kesalahan jaringan.';
        }
      })
      .then(() => {
        if (btnSubmit) {
          btnSubmit.disabled = false;
          btnSubmit.innerText = '✉️ Kirim Pesan';
        }
      });
    });
  }
}

// DATA ISI HALAMAN DETAIL (MODAL)
const modalData = {
    about: {
        title: "🙋‍♂️ ABOUT ME",
        content: `
            <p>Halo! Saya adalah seorang siswa jurusan <b>Teknik Komputer & Jaringan (TKJ/TJKT)</b> yang berfokus pada pengembangan jaringan komputer, administrasi server, dan pemrograman web modern.</p>
            <br>
            <h4>⚡ SKILLS & KEAHLIAN</h4>
            <ul>
                <li><b>Computer Networking:</b> TCP/IP, Subnetting IPv4, Cisco Packet Tracer, Routing Static & Dynamic (RIP/OSPF), MikroTik.</li>
                <li><b>Web Development:</b> HTML5, CSS3, JavaScript, PHP, Laravel Framework.</li>
                <li><b>System Administration:</b> Linux/Debian Server Configuration, Web Server (Apache/Nginx), SSH, FTP.</li>
            </ul>
        `
    },
    dream: {
        title: "🚀 MY DREAM & GOALS",
        content: `
            <p>Cita-cita utama saya adalah berkembang menjadi seorang profesional IT terkemuka di bidang <b>Network Architecture & Cloud Engineering</b>.</p>
            <br>
            <h4>🎯 TARGET JANGKA PENDEK</h4>
            <ul>
                <li>Mendapatkan sertifikasi industri IT internasional (seperti CCNA atau MTCNA).</li>
                <li>Menguasai arsitektur Full-Stack Web Development berbasis Laravel dan sistem RESTful API.</li>
            </ul>
        `
    },
    projects: {
        title: "💻 MY FEATURED PROJECTS",
        content: `
            <p>Berikut adalah beberapa projek utama yang telah saya kembangkan:</p>
            <br>
            <h4>1. Interactive Portfolio Web</h4>
            <p>Website portofolio pribadi dilengkapi dengan fitur CLI terminal interaktif, widget ping real-time, dan pemutar musik BGM.</p>
            <br>
            <h4>2. Perancangan & Routing Jaringan Cisco</h4>
            <p>Simulasi arsitektur jaringan multi-router menggunakan Cisco Packet Tracer dengan implementasi DHCP Server, OSPF Routing, dan VLAN Segmentation.</p>
        `
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

window.addEventListener('click', function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeModal();
    }
});