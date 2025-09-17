     document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('theme-toggle');
            
            // Theme toggle functionality
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                
                // Save theme preference to localStorage
                const isDarkMode = document.body.classList.contains('dark-mode');
                localStorage.setItem('darkMode', isDarkMode);
            });
            
            // Check for saved theme preference
            if (localStorage.getItem('darkMode') === 'true') {
                document.body.classList.add('dark-mode');
            }

            // principles (content used for petals and modal)
            const principles = [
                { id: 'seva', sanskrit: 'सेवा', title: 'Seva', subtitle: 'Selfless Service', icon: '🤲', angle: 0 },
                { id: 'ahimsa', sanskrit: 'अहिंसा', title: 'Ahimsa', subtitle: 'Non-Violence', icon: '🕊️', angle: 45 },
                { id: 'satya', sanskrit: 'सत्य', title: 'Satya', subtitle: 'Truthfulness', icon: '💎', angle: 90 },
                { id: 'asteya', sanskrit: 'अस्तेय', title: 'Asteya', subtitle: 'Non-Stealing', icon: '🙏', angle: 135 },
                { id: 'santosha', sanskrit: 'संतोष', title: 'Santosha', subtitle: 'Contentment', icon: '🏔️', angle: 180 },
                { id: 'brahmacharya', sanskrit: 'ब्रह्मचर्य', title: 'Brahmacharya', subtitle: 'Right Energy', icon: '🌊', angle: 225 },
                { id: 'svadhyaya', sanskrit: 'स्वाध्याय', title: 'Svadhyaya', subtitle: 'Self-Study', icon: '📚', angle: 270 },
                { id: 'tapas', sanskrit: 'तपस्', title: 'Tapas', subtitle: 'Discipline', icon: '🔥', angle: 315 }
            ];

            // modal data (more detailed descriptions)
            const valueData = {
                seva: {
                    title: "Seva (Selfless Service)",
                    sanskrit: "सेवा",
                    description: "Work that serves humanity without expectation of reward. Creating value that uplifts communities and heals the planet.",
                    practice: "I dedicate at least one day each month to community service and integrate giving back into all my business ventures."
                },
                ahimsa: {
                    title: "Ahimsa (Non-Violence)",
                    sanskrit: "अहिंसा",
                    description: "Harmony with all living beings through conscious choices. Sustainable practices that honor the earth and its inhabitants.",
                    practice: "All my products are cruelty-free and sustainably sourced, respecting all life forms and ecosystems."
                },
                satya: {
                    title: "Satya (Truthfulness)",
                    sanskrit: "सत्य",
                    description: "Authentic expression and alignment between thoughts, words, and actions in all endeavors.",
                    practice: "I practice transparency in all business dealings and maintain integrity in my communications."
                },
                asteya: {
                    title: "Asteya (Non-Stealing)",
                    sanskrit: "अस्तेय",
                    description: "Respect for others' efforts and resources. Building abundance through fair exchange and generosity.",
                    practice: "I source materials ethically and ensure fair compensation for collaborators and partners."
                },
                santosha: {
                    title: "Santosha (Contentment)",
                    sanskrit: "संतोष",
                    description: "Finding abundance in simplicity. Rejecting consumerism and the myth of scarcity. Living fully with less.",
                    practice: "I practice minimalism and mindful consumption, finding joy in experiences rather than possessions."
                },
                brahmacharya: {
                    title: "Brahmacharya (Right Use of Energy)",
                    sanskrit: "ब्रह्मचर्य",
                    description: "Mindful conservation and direction of life force energy toward spiritual growth.",
                    practice: "I consciously channel my creative energy toward projects that align with my highest purpose."
                },
                svadhyaya: {
                    title: "Svadhyaya (Self-Study)",
                    sanskrit: "स्वाध्याय",
                    description: "Continuous inner exploration through meditation, breathwork, and mindful living. Knowing myself to better serve others.",
                    practice: "I maintain a daily meditation practice and regularly journal to deepen self-awareness."
                },
                tapas: {
                    title: "Tapas (Discipline)",
                    sanskrit: "तपस्",
                    description: "Consistent practice and purification through focused effort and dedicated action.",
                    practice: "I follow a disciplined daily routine that balances work, practice, and rest without compromise."
                }
            };

            // DOM refs
            const petalsWrapper = document.querySelector('.petals-wrapper');
            const svg = document.querySelector('.sacred-connections');
            const container = document.querySelector('.mandala-container');
            const modal = document.getElementById('value-modal');
            const modalTitle = document.getElementById('modal-title');
            const modalSanskrit = document.getElementById('modal-sanskrit');
            const modalDescription = document.getElementById('modal-description');
            const modalPractice = document.getElementById('modal-practice');
            const modalClose = document.querySelector('.modal-close');

            // create / render function
            function renderMandala() {
                petalsWrapper.innerHTML = '';
                while (svg.firstChild) svg.removeChild(svg.firstChild);

                const rect = container.getBoundingClientRect();
                const cx = rect.width / 2;
                const cy = rect.height / 2;

                // adaptive radius (use CSS variable fallback)
                const base = Math.min(rect.width, rect.height);
                const radiusOuter = Math.round(base * 0.36); // distance from center for petals
                const radiusInnerOffset = Math.round(base * 0.02); // tiny offset for nicer look

                principles.forEach((p, i) => {
                    // calculate angle evenly (not rely on pre-specified angle)
                    const angleDeg = i * (360 / principles.length);
                    const angleRad = (angleDeg) * Math.PI / 180;

                    // compute position; we'll use transform rotate/translate trick so petal faces upright
                    const x = cx + Math.cos(angleRad) * radiusOuter;
                    const y = cy + Math.sin(angleRad) * radiusOuter;

                    // create petal element
                    const el = document.createElement('button');
                    el.className = `petal petal-${p.id}`;
                    el.setAttribute('type', 'button');
                    el.setAttribute('aria-label', `${p.title} — ${p.subtitle}`);
                    el.dataset.id = p.id;
                    el.innerHTML = `
                        <div class="icon">${p.icon}</div>
                        <div class="sanskrit">${p.sanskrit}</div>
                        <div class="title">${p.title}</div>
                        <div class="mini-tooltip" role="status"><strong>${p.title}</strong><div style="font-size:12px;color:#6b5a4d;margin-top:6px">${p.subtitle}</div></div>
                    `;

                    // We use a compound transform:
                    // 1) translate(-50%,-50%) to center the element origin
                    // 2) rotate(angle) translate(radius) rotate(-angle) to place it on circle while keeping orientation upright
                    const transform = `translate(-50%,-50%) rotate(${angleDeg}deg) translate(${radiusOuter}px) rotate(${-angleDeg}deg)`;
                    el.style.transform = transform;

                    // Add slight scale/size variation by index to add organic look
                    const scaleMod = 1 + ((i % 3) * 0.03);
                    el.style.width = `calc(var(--petal-size) * ${scaleMod})`;
                    el.style.height = `calc(var(--petal-size) * ${scaleMod})`;

                    petalsWrapper.appendChild(el);

                    // draw connection line in SVG
                    const ns = 'http://www.w3.org/2000/svg';
                    const line = document.createElementNS(ns, 'line');
                    line.setAttribute('class', 'connection-line');
                    line.setAttribute('x1', cx);
                    line.setAttribute('y1', cy);
                    line.setAttribute('x2', x);
                    line.setAttribute('y2', y);
                    svg.appendChild(line);

                    // interactions: open modal on click
                    el.addEventListener('click', (ev) => {
                        ev.stopPropagation();
                        openModal(p.id);
                    });

                    // hover effect on line
                    el.addEventListener('mouseenter', () => {
                        line.style.stroke = document.body.classList.contains('dark-mode') 
                            ? 'rgba(46, 204, 113, 0.45)' 
                            : 'rgba(224, 192, 111, 0.45)';
                        line.style.strokeWidth = '2.8';
                    });
                    
                    el.addEventListener('mouseleave', () => {
                        line.style.stroke = document.body.classList.contains('dark-mode') 
                            ? 'rgba(46, 204, 113, 0.18)' 
                            : 'rgba(142, 110, 99, 0.18)';
                        line.style.strokeWidth = '1.8';
                    });
                });
            }

            // open modal using valueData
            function openModal(id) {
                const d = valueData[id];
                if (!d) return;
                modalTitle.textContent = d.title;
                modalSanskrit.textContent = d.sanskrit;
                modalDescription.textContent = d.description;
                modalPractice.textContent = d.practice;
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }

            // close modal
            function closeModal() {
                modal.classList.remove('active');
                modal.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }

            // close handlers
            modalClose.addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
            document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

            // center symbol click
            document.querySelector('.center-symbol').addEventListener('click', () => {
                alert('ॐ — The universal sound of consciousness — center of the mandala.');
            });

            // initial render + responsive
            renderMandala();
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(renderMandala, 160);
            });

            // Re-render mandala when theme changes to update colors
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.attributeName === 'class') {
                        // Small delay to ensure CSS variables have updated
                        setTimeout(renderMandala, 50);
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
