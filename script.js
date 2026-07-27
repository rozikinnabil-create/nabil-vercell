// ================= Typing Animation =================

const text = [
    "Web Developer",
    "TKJ Student",
    "Cyber Security",
    "Networking",
    "IoT Developer"
];

let i = 0;
let j = 0;
let current = "";
let isDeleting = false;

function typing() {

    current = text[i];

    if (!isDeleting) {
        document.getElementById("typing").textContent =
            current.substring(0, j++);

        if (j > current.length) {
            isDeleting = true;
            setTimeout(typing, 1200);
            return;
        }

    } else {

        document.getElementById("typing").textContent =
            current.substring(0, j--);

        if (j < 0) {
            isDeleting = false;
            i++;

            if (i >= text.length) {
                i = 0;
            }
        }
    }

    setTimeout(typing, isDeleting ? 50 : 100);

}

typing();


// ================= Navbar Scroll =================

window.addEventListener("scroll", () => {

    const nav = document.querySelector("nav");

    if (window.scrollY > 60) {

        nav.style.background = "rgba(5,8,22,.95)";
        nav.style.boxShadow = "0 10px 30px rgba(0,0,0,.6)";

    } else {

        nav.style.background = "rgba(5,8,22,.75)";
        nav.style.boxShadow = "0 10px 30px rgba(0,0,0,.35)";

    }

});


// ================= Scroll Reveal =================

const reveal = document.querySelectorAll(".card,.stat,.project-card");

window.addEventListener("scroll", () => {

    reveal.forEach(item => {

        const top = item.getBoundingClientRect().top;

        if (top < window.innerHeight - 80) {

            item.classList.add("show");

        }

    });

});

/* ==========================
   BACK TO TOP
========================== */

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topBtn.style.display = "block";

    } else {

        topBtn.style.display = "none";

    }

});

topBtn.onclick = () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

/* ==========================
   LOADER
========================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1200);

});

/* ==========================
   COUNTER
========================== */

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counter = entry.target;

            const target = +counter.dataset.target;

            let count = 0;

            const speed = target / 80;

            const update = () => {

                count += speed;

                if (count < target) {

                    counter.innerText = Math.ceil(count);

                    requestAnimationFrame(update);

                } else {

                    if(target === 100){

    counter.innerText = "100%";

}else{

    counter.innerText = target + "+";

}

                }

            };

            update();

            counterObserver.unobserve(counter);

        }

    });

});

counters.forEach(counter => counterObserver.observe(counter));
/* ==========================
   DARK / LIGHT MODE
========================== */

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("light");

    themeBtn.style.transform = "rotate(360deg) scale(1.2)";

    setTimeout(() => {
        themeBtn.style.transform = "";
    }, 300);

    if(document.body.classList.contains("light")){
        themeBtn.textContent = "☀️";
    }else{
        themeBtn.textContent = "🌙";
    }

});