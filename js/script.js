document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (cursorDot && cursorOutline && window.innerWidth > 1024) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const interactives = document.querySelectorAll('a, button, .faq-question, .mobile-toggle, input, textarea, .rec-opt, .sim-opt, .upload-zone, .goal-btn, .unlock-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => document.documentElement.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.documentElement.classList.remove('cursor-hover'));
        });
    }

    // 2. Premium Loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(revealFunc, 500);
        }, 2200);
    }

    // 3. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight * 100}%`;
            scrollProgress.style.width = scroll;
        });
    }

    // 4. Sticky Navbar
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    });

    // 5. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealFunc = () => {
        let windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            let elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) el.classList.add('active');
        });
    };
    window.addEventListener('scroll', revealFunc);

    // 6. Before/After Transformation Slider (Consolidated & Improved)
    const baContainer = document.querySelector('.ba-container');
    if (baContainer) {
        const baBefore = baContainer.querySelector('.ba-before');
        const baSliderLine = baContainer.querySelector('.ba-slider-line');
        const baSliderBtn = baContainer.querySelector('.ba-slider-btn');
        let isDragging = false;
        
        const moveSlider = (e) => {
            if (!isDragging && e.type !== 'touchmove') return;
            const rect = baContainer.getBoundingClientRect();
            let x = e.clientX || (e.touches && e.touches[0].clientX);
            if (!x) return;
            
            let position = ((x - rect.left) / rect.width) * 100;
            position = Math.max(0, Math.min(100, position));
            
            baBefore.style.clipPath = `polygon(0 0, ${position}% 0, ${position}% 100%, 0 100%)`;
            baSliderLine.style.left = `${position}%`;
            baSliderBtn.style.left = `${position}%`;
        };

        const startDragging = () => isDragging = true;
        const stopDragging = () => isDragging = false;

        baContainer.addEventListener('mousedown', startDragging);
        baContainer.addEventListener('touchstart', startDragging);
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
        
        baContainer.addEventListener('mousemove', moveSlider);
        baContainer.addEventListener('touchmove', moveSlider, { passive: true });

        // Sim Options & Range
        const simOpts = document.querySelectorAll('.sim-opt');
        simOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                simOpts.forEach(o => o.classList.remove('active'));
                opt.classList.add('active');
                const afterImg = document.getElementById('sim-after');
                afterImg.style.opacity = '0.5';
                setTimeout(() => afterImg.style.opacity = '1', 300);
            });
        });

        const simRange = document.getElementById('sim-range');
        const simDaysDisplay = document.getElementById('sim-days');
        if(simRange) {
            simRange.addEventListener('input', (e) => {
                simDaysDisplay.innerText = `${e.target.value} Days`;
                const labels = document.querySelectorAll('.ba-label');
                if(labels[1]) labels[1].innerText = `Day ${e.target.value}`;
            });
        }
    }

    // 7. Smart Recommendation Engine Logic
    const openRecBtn = document.getElementById('open-rec-engine');
    const recModal = document.getElementById('rec-modal');
    if(openRecBtn) {
        openRecBtn.addEventListener('click', () => recModal.classList.add('active'));
        
        const steps = document.querySelectorAll('.step');
        const recOpts = document.querySelectorAll('.rec-opt');
        const progressBar = id('rec-progress');
        
        recOpts.forEach(opt => {
            opt.addEventListener('click', () => {
                const stepEl = opt.closest('.step');
                const stepNum = parseInt(stepEl.dataset.step);
                if (stepNum < 3) {
                    stepEl.classList.remove('active');
                    steps[stepNum].classList.add('active');
                    progressBar.style.width = `${((stepNum + 1) / 3) * 100}%`;
                } else {
                    steps.forEach(s => s.classList.remove('active'));
                    id('rec-result').classList.add('active');
                    progressBar.style.width = '100%';
                    id('rec-display').innerHTML = `
                        <div class="glass-card" style="border: 1px solid var(--primary); padding: 2rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">PLATINUM ELITE</h3>
                            <p style="font-size: 2rem; font-weight: 900; color: var(--primary);">৳15,000/mo</p>
                            <p class="text-muted" style="margin-top: 1rem;">Based on your ambitious goals, this plan will yield results in 45 days.</p>
                        </div>
                    `;
                }
            });
        });
    }

    // 8. Live Crowd Meter Logic
    const crowdVal = document.querySelector('.crowd-val');
    const crowdIndicator = document.querySelector('.crowd-indicator');
    if(crowdVal) {
        setInterval(() => {
            const rand = Math.floor(Math.random() * 100);
            let status = rand < 40 ? "Low" : (rand < 80 ? "Medium" : "Peak");
            let color = rand < 40 ? "#4CAF50" : (rand < 80 ? "#FFC107" : "#F44336");
            crowdVal.innerText = `${status} (${rand}%)`;
            crowdIndicator.style.backgroundColor = color;
            crowdIndicator.style.boxShadow = `0 0 10px ${color}`;
        }, 5000);
    }

    // 9. Counter Animation for Stats
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The higher the slower

    const startCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const count = +el.innerText;
        const inc = target / speed;

        if (count < target) {
            el.innerText = Math.ceil(count + inc);
            setTimeout(() => startCounter(el), 1);
        } else {
            el.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // 10. Social Proof Engine
    const proofToasts = document.getElementById('proof-toasts');
    if(proofToasts) {
        const toastData = ["12 people joined this week", "3 slots left for PT", "Rahim just achieved his 90-day goal!"];
        let idx = 0;
        setInterval(() => {
            const t = document.createElement('div');
            t.className = 'toast';
            t.innerHTML = `<i class="ri-notification-3-line"></i> <span class="toast-text">${toastData[idx]}</span>`;
            proofToasts.appendChild(t);
            setTimeout(() => t.classList.add('active'), 100);
            setTimeout(() => { t.classList.remove('active'); setTimeout(() => t.remove(), 500); }, 4000);
            idx = (idx + 1) % toastData.length;
        }, 8000);
    }

    // 11. Currency Converter
    const currToggle = document.querySelector('.currency-toggle');
    if (currToggle) {
        currToggle.addEventListener('click', (e) => {
            const target = e.target.closest('span');
            if (!target) return;
            currToggle.querySelectorAll('span').forEach(s => s.classList.remove('active'));
            target.classList.add('active');
            
            const isUsd = target.dataset.curr === 'USD';
            const prices = document.querySelectorAll('.plan-price');
            prices.forEach(p => {
                const bdt = parseInt(p.dataset.bdt);
                const currSpan = p.querySelector('.currency');
                const valSpan = p.querySelector('.price-val');
                if (isUsd) {
                    currSpan.innerText = '$';
                    valSpan.innerText = Math.round(bdt * 0.0091);
                } else {
                    currSpan.innerText = '৳';
                    valSpan.innerText = bdt.toLocaleString();
                }
            });
        });
    }

    // 12. Flash Sale Countdown Timer
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        let timeLeft = 2 * 60 * 60;
        const timer = setInterval(() => {
            const h = Math.floor(timeLeft / 3600);
            const m = Math.floor((timeLeft % 3600) / 60);
            const s = timeLeft % 60;
            countdownEl.innerText = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            if (timeLeft <= 1800) countdownEl.parentElement.style.color = "#ffff00"; // Warn at 30 mins
            if (timeLeft <= 0) clearInterval(timer);
            timeLeft--;
        }, 1000);
    }

    // 13. Goal-Based Content Switcher
    const goalBtns = document.querySelectorAll('.goal-btn');
    const dynamicContent = document.getElementById('hero-dynamic-content');
    const goalData = {
        weight: { subtitle: "Burn the Fat", title: "LOSE WEIGHT <br><span>FAST & SAFE</span>", desc: "Our high-intensity programs are designed to torch calories instantly." },
        muscle: { subtitle: "Build the Power", title: "GAIN MUSCLE <br><span>BEYOND LIMITS</span>", desc: "Pack on serious mass with elite hypertrophy-focused coaching." },
        fit: { subtitle: "Stay the Best", title: "ELITE FITNESS <br><span>FOR LIFE</span>", desc: "Maintain peak performance with a community that pushes you." }
    };
    goalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const goal = btn.dataset.goal;
            goalBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            dynamicContent.style.opacity = '0';
            setTimeout(() => {
                const d = goalData[goal];
                dynamicContent.querySelector('.section-subtitle').innerText = d.subtitle;
                dynamicContent.querySelector('.hero-title').innerHTML = d.title;
                dynamicContent.querySelector('.hero-desc').innerText = d.desc;
                dynamicContent.style.opacity = '1';
            }, 400);
        });
    });

    // 14. Interactive Price Reveal V2
    const unlockBtnsV2 = document.querySelectorAll('.unlock-btn-v2');
    unlockBtnsV2.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.pricing-card-v2');
            btn.style.display = 'none';
            const joinBtn = card.querySelector('.join-btn-v2');
            if (joinBtn) joinBtn.style.display = 'inline-block';
            window.triggerSuccess();
        });
    });

    // 15. Testimonial Carousel
    const track = id('testimonial-track');
    const dotsContainer = id('carousel-dots');
    if (track) {
        const items = document.querySelectorAll('.testimonial-item');
        items.forEach((_, i) => {
            const d = document.createElement('div');
            d.className = `dot ${i === 0 ? 'active' : ''}`;
            d.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(d);
        });
        const dots = document.querySelectorAll('.dot');
        const goToSlide = (idx) => {
            track.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach(d => d.classList.remove('active'));
            dots[idx].classList.add('active');
        };
        let cur = 0;
        setInterval(() => { cur = (cur + 1) % items.length; goToSlide(cur); }, 3000);
    }

    // 16. Pricing Switcher Logic
    const priceSwitch = id('price-switch');
    if (priceSwitch) {
        const labels = [id('label-monthly'), id('label-yearly')];
        const priceVals = document.querySelectorAll('.price-val-v2');
        
        priceSwitch.addEventListener('click', () => {
            priceSwitch.classList.toggle('active');
            const isYearly = priceSwitch.classList.contains('active');
            
            labels.forEach(l => l.classList.toggle('active'));
            if (isYearly) {
                labels[0].style.color = 'var(--text-muted)';
                labels[1].style.color = 'var(--primary)';
            } else {
                labels[0].style.color = 'var(--primary)';
                labels[1].style.color = 'var(--text-muted)';
            }

            priceVals.forEach(val => {
                const target = isYearly ? val.dataset.yearly : val.dataset.monthly;
                let current = parseInt(val.innerText.replace(',', ''));
                let start = Date.now();
                const duration = 400;
                const animate = () => {
                    let progress = (Date.now() - start) / duration;
                    if (progress > 1) progress = 1;
                    let v = Math.round(current + (target - current) * progress);
                    val.innerText = v.toLocaleString();
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
            });
        });
    }

    // Utility
    function id(n) { return document.getElementById(n); }
    window.triggerSuccess = () => {
        for(let i=0; i<30; i++) {
            const c = document.createElement('div');
            c.style.cssText = `position:fixed; width:10px; height:10px; background:${['#fff', '#9d50bb', '#d4af37'][Math.floor(Math.random()*3)]}; left:50%; top:50%; z-index:10003; pointer-events:none;`;
            document.body.appendChild(c);
            const dx = (Math.random() - 0.5) * window.innerWidth, dy = (Math.random() - 0.5) * window.innerHeight;
            c.animate([{ transform: 'translate(0,0)', opacity:1 }, { transform: `translate(${dx}px,${dy}px)`, opacity:0 }], { duration: 2000 }).onfinish = () => c.remove();
        }
    };
});

