document.addEventListener('DOMContentLoaded', function() {
    // --- Global Elements ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const heroCanvas = document.getElementById('hero-canvas');
    const projectGrid = document.getElementById('project-grid');
    const modalsContainer = document.getElementById('modals-container');
    const filterContainer = document.getElementById('filter-container');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const cvModalBtn = document.getElementById('cv-modal-btn');
    const cvModal = document.getElementById('cv-modal');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const backToTopBtn = document.getElementById('back-to-top');

    // --- Light/Dark Mode Elements ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const mobileSunIcon = document.getElementById('mobile-sun-icon');
    const mobileMoonIcon = document.getElementById('mobile-moon-icon');
    const htmlEl = document.documentElement;

    let currentLightboxProjectImages = [];
    let currentLightboxIndex = 0;

    // --- Custom Cursor Logic ---
    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', function(e) {
            const posX = e.clientX;
            const posY = e.clientY;
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
        });

        document.body.addEventListener('mouseover', (e) => {
            if (e.target.closest('a, button, .project-card, .cta-link, .nav-link, .bento-item, .slide-image')) {
                document.body.classList.add('cursor-hovered');
            }
        });
        document.body.addEventListener('mouseout', (e) => {
            if (e.target.closest('a, button, .project-card, .cta-link, .nav-link, .bento-item, .slide-image')) {
                document.body.classList.remove('cursor-hovered');
            }
        });
    }

    // --- Animated Mobile Menu ---
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('open');
            if (isOpen) {
                mobileMenu.classList.remove('hidden');
            } else {
                setTimeout(() => mobileMenu.classList.add('hidden'), 300);
            }
        });
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !e.target.closest('#mobile-menu-btn')) {
                 mobileMenu.classList.remove('open');
                 setTimeout(() => mobileMenu.classList.add('hidden'), 300);
            }
        });
        const navLinks = mobileMenu.querySelectorAll('a, button');
        navLinks.forEach(link => link.addEventListener('click', () => {
             mobileMenu.classList.remove('open');
             setTimeout(() => mobileMenu.classList.add('hidden'), 300);
        }));
    }

    // --- Three.js Hero Animation ---
    if (heroCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.z = 5;
        const group = new THREE.Group();
        scene.add(group);
        const linesMaterial = new THREE.LineBasicMaterial({ color: 0x4f46e5, transparent: true, opacity: 0.5 });
        const linesGeometry = new THREE.BufferGeometry();
        const points = [];
        for (let i = 0; i < 100; i++) {
            points.push(new THREE.Vector3((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10));
        }
        linesGeometry.setFromPoints(points);
        const line = new THREE.Line(linesGeometry, linesMaterial);
        group.add(line);
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesMaterial = new THREE.PointsMaterial({ color: 0xec4899, size: 0.05, transparent: true, opacity: 0.7 });
        const particlesVertices = [];
        for (let i = 0; i < 5000; i++) {
            particlesVertices.push((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20);
        }
        particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        group.add(particles);
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });
        function animate() {
            requestAnimationFrame(animate);
            group.rotation.y += 0.0005;
            group.rotation.x += 0.0005;
            camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
            camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- Scroll Animations & Back to Top ---
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animated-element:not(.visible)');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        animatedElements.forEach(el => observer.observe(el));
    }

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }
    
    // --- CV Modal Logic ---
    if (cvModalBtn && cvModal) {
        cvModalBtn.addEventListener('click', () => openModal(cvModal));
        cvModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || e.target === cvModal) {
                closeModal(cvModal);
            }
        });
    }

    // --- Lightbox Logic ---
    function openLightbox(project, startIndex) {
        if (!lightbox || !lightboxImg) return;
        currentLightboxProjectImages = project.slideshow_images;
        currentLightboxIndex = startIndex;
        updateLightboxImage();
        lightbox.classList.remove('opacity-0', 'invisible');
        lightbox.classList.add('opacity-100', 'visible');
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('opacity-100', 'visible');
        lightbox.classList.add('opacity-0', 'invisible');
    }

    function updateLightboxImage() {
        lightboxImg.setAttribute('src', currentLightboxProjectImages[currentLightboxIndex]);
    }

    function showNextLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxProjectImages.length;
        updateLightboxImage();
    }

    function showPrevLightboxImage() {
        currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxProjectImages.length) % currentLightboxProjectImages.length;
        updateLightboxImage();
    }

    if (lightbox && lightboxImg && lightboxClose) {
        lightboxClose.addEventListener('click', () => closeLightbox());
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        lightboxNext.addEventListener('click', () => showNextLightboxImage());
        lightboxPrev.addEventListener('click', () => showPrevLightboxImage());
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('visible')) return;
            if (e.key === 'ArrowRight') showNextLightboxImage();
            if (e.key === 'ArrowLeft') showPrevLightboxImage();
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // --- Project Generation Logic ---
    function generateAllModals(allProjects) {
        modalsContainer.innerHTML = '';
        const modalCategoryColors = { engineering: 'text-indigo-400 bg-indigo-900', 'ml-research': 'text-pink-400 bg-pink-900', design: 'text-teal-400 bg-teal-900' };

        allProjects.forEach(project => {
            let caseStudyHtml;
            if (project.category === 'design') {
                caseStudyHtml = `
                    <div><h4 class="font-bold text-teal-400 mb-2">Project Overview</h4><p class="text-gray-300">${project.case_study.overview || ''}</p></div>
                    <div><h4 class="font-bold text-indigo-400 mb-2">My Contributions</h4><p class="text-gray-300">${project.case_study.contributions || ''}</p></div>
                `;
            } else {
                caseStudyHtml = `
                    <div><h4 class="font-bold text-pink-400 mb-2">The Problem</h4><p class="text-gray-300">${project.case_study.problem}</p></div>
                    <div><h4 class="font-bold text-teal-400 mb-2">The Process</h4><p class="text-gray-300">${project.case_study.process}</p></div>
                    <div><h4 class="font-bold text-indigo-400 mb-2">The Outcome</h4><p class="text-gray-300">${project.case_study.outcome}</p></div>
                `;
            }

            let slidesHtml = '';
            let isFirstSlide = true;
            if (project.youtube_video_ids && project.youtube_video_ids.length > 0) {
                project.youtube_video_ids.forEach(videoId => {
                    if(videoId) { // Ensure videoId is not empty
                        slidesHtml += `
                            <div class="slide video-slide">
                                <iframe class="youtube-iframe" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                            </div>`;
                    }
                });
                isFirstSlide = slidesHtml === '';
            }
            
            if (project.youtube_video_id) {
                slidesHtml += `
                    <div class="slide video-slide">
                        <iframe class="youtube-iframe" src="https://www.youtube.com/embed/${project.youtube_video_id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>`;
                isFirstSlide = false;
            }

            slidesHtml += project.slideshow_images.map((img, index) => {
                const hiddenClass = (!isFirstSlide && index === 0) || (isFirstSlide && index !== 0) ? 'hidden' : '';
                return `<div class="slide ${hiddenClass}" data-index="${index}">
                            <img src="${img}" class="slide-image rounded-lg w-full h-full object-contain cursor-pointer">
                            <div class="expand-text">Click to expand image</div>
                        </div>`;
            }).join('');

            const githubButtonHtml = project.github_link
                ? `<a href="${project.github_link}" target="_blank" rel="noopener noreferrer" class="github-button inline-flex items-center text-sm font-semibold py-2 px-4 rounded-lg transition-colors mt-4">View on GitHub</a>`
                : '';
            
            const progressPdfButtonHtml = project.progress_pdf_url
                ? `<a href="${project.progress_pdf_url}" download class="progress-pdf-button inline-flex items-center text-sm font-semibold py-2 px-4 rounded-lg transition-colors mt-4 ml-2">View Project Progress</a>`
                : '';

            const modalHtml = `
                <div id="${project.id}" class="project-detail-modal modal fixed inset-0 bg-black bg-opacity-90 p-4 sm:p-8 opacity-0 invisible z-[100] overflow-y-auto flex items-center justify-center">
                    <div class="modal-content rounded-lg w-full max-w-6xl max-h-[95vh] flex flex-col transform scale-95 opacity-0">
                        <div class="modal-header flex-shrink-0 p-4 flex justify-between items-center border-b">
                             <h2 class="text-lg md:text-2xl font-bold">Project Details</h2>
                             <button class="modal-close text-4xl font-light cta-link">&times;</button>
                        </div>
                        <div class="flex-grow p-4 md:p-8 overflow-y-auto grid md:grid-cols-2 gap-6 md:gap-8">
                            <div class="slideshow-container relative w-full h-64 md:h-full group">
                                ${slidesHtml}
                                <button class="prev-slide absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full leading-none cta-link">&lt;</button>
                                <button class="next-slide absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full leading-none cta-link">&gt;</button>
                            </div>
                            <div>
                                <h3 class="text-2xl md:text-4xl font-bold mb-4 section-title">${project.title}</h3>
                                <span class="text-xs font-semibold capitalize ${modalCategoryColors[project.category] || 'text-gray-400 bg-gray-900'} bg-opacity-50 py-1 px-3 rounded-full">${project.category.replace('-', ' ')}</span>
                                <div class="flex flex-wrap">
                                    ${githubButtonHtml}
                                    ${progressPdfButtonHtml}
                                </div>
                                <div class="my-6 space-y-6 text-sm md:text-base">
                                    ${caseStudyHtml}
                                </div>
                                <h4 class="text-lg md:text-xl font-bold mb-3">Technologies Used:</h4>
                                <ul class="flex flex-wrap gap-2">
                                    ${project.technologies.map(tech => `<li class="tech-tag text-xs font-semibold py-1 px-3 rounded-full">${tech}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>`;
            modalsContainer.insertAdjacentHTML('beforeend', modalHtml);
        });
    }
    
    function displayProjectCards(projectsToDisplay) {
        if (!projectGrid) return;
        projectGrid.innerHTML = '';
        const categoryColors = { engineering: 'text-indigo-400', 'ml-research': 'text-pink-400', design: 'text-teal-400' };

        projectsToDisplay.forEach(project => {
            const cardHtml = `
                <div class="project-card-wrapper animated-element" data-category="${project.category}">
                    <div class="project-card bg-tertiary rounded-lg overflow-hidden cursor-pointer" data-modal-target="${project.id}">
                        <div class="relative overflow-hidden max-h-64 flex justify-center items-center">
                            <img src="${project.cover_image}" alt="${project.title}" class="card-image w-full" loading="lazy">
                        </div>
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                            <p class="text-desc mb-4 text-sm">${project.short_description}</p>
                            <span class="text-xs font-semibold capitalize ${categoryColors[project.category] || 'text-gray-400'}">${project.category.replace('-', ' ')}</span>
                        </div>
                    </div>
                </div>`;
            projectGrid.insertAdjacentHTML('beforeend', cardHtml);
        });
        initScrollAnimations();
    }

    function setupProjectEventListeners() {
        if (filterContainer) {
            filterContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('filter-btn')) {
                    filterContainer.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    const filter = e.target.dataset.filter;
                    const cards = document.querySelectorAll('#project-grid .project-card-wrapper');
                    
                    cards.forEach(card => {
                        card.classList.add('hidden-project');
                        // Hide immediately for filtering logic
                        card.style.display = 'none';
                    });
                    
                    setTimeout(() => {
                         cards.forEach(card => {
                            const show = filter === 'all' || card.dataset.category === filter;
                            if (show) {
                                card.style.display = 'block';
                                setTimeout(() => {
                                    card.classList.remove('hidden-project');
                                }, 20); // Small delay to trigger transition
                            }
                        });
                    }, 150); // Delay to allow fade-out
                }
            });
        }
        
        document.body.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (card) {
                openModal(document.getElementById(card.dataset.modalTarget));
            }
            
            const projectModal = e.target.closest('.project-detail-modal');
            if (projectModal && (e.target.classList.contains('modal-close') || e.target === projectModal)) {
                closeModal(projectModal);
            }

            if (e.target.classList.contains('slide-image')) {
                const modalId = e.target.closest('.project-detail-modal').id;
                const project = projectsData.find(p => p.id === modalId);
                const slideIndex = parseInt(e.target.closest('.slide').dataset.index);
                if (project) {
                    openLightbox(project, slideIndex);
                }
            }
        });
    }

    function openModal(modal) {
        if (!modal) return;
        modal.classList.remove('invisible', 'opacity-0');
        modal.querySelector('.modal-content').classList.remove('opacity-0', 'scale-95');
        document.body.style.overflow = 'hidden';
        if (modal.classList.contains('project-detail-modal')) {
            setupSlideshow(modal);
        }
    }

    function closeModal(modal) {
        if (!modal) return;
        const iframes = modal.querySelectorAll('iframe');
        if (iframes.length > 0) {
            iframes.forEach(iframe => {
                const iframeSrc = iframe.src;
                iframe.src = iframeSrc;
            });
        }
        modal.querySelector('.modal-content').classList.add('opacity-0', 'scale-95');
        setTimeout(() => {
            modal.classList.add('invisible', 'opacity-0');
            document.body.style.overflow = 'auto';
        }, 300);
    }

    function setupSlideshow(modal) {
        const slides = modal.querySelectorAll('.slide');
        const prevBtn = modal.querySelector('.prev-slide');
        const nextBtn = modal.querySelector('.next-slide');

        if (slides.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            return;
        }
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';

        let currentIndex = 0;
        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.toggle('hidden', i !== index);
            });
            currentIndex = index;
        };

        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide((currentIndex - 1 + slides.length) % slides.length);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSlide((currentIndex + 1) % slides.length);
        });
        showSlide(0);
    }

    // --- Light/Dark Mode Logic ---
    function toggleTheme(theme) {
        if (theme === 'dark') {
            htmlEl.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
            mobileSunIcon.classList.add('hidden');
            mobileMoonIcon.classList.remove('hidden');
        } else {
            htmlEl.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
            mobileSunIcon.classList.remove('hidden');
            mobileMoonIcon.classList.add('hidden');
        }
    }

    if(themeToggleBtn){
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.classList.contains('dark') ? 'light' : 'dark';
            toggleTheme(currentTheme);
        });
    }

    if(mobileThemeToggleBtn){
        mobileThemeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.classList.contains('dark') ? 'light' : 'dark';
            toggleTheme(currentTheme);
        });
    }

    // --- Initial Load ---
    if (typeof projectsData !== 'undefined') {
        // Generate modals for ALL projects first
        generateAllModals(projectsData);
        
        // Get IDs of featured projects from the DOM to filter them out of the main grid
        const featuredProjectElements = document.querySelectorAll('#featured-projects-container .project-card');
        const featuredProjectIds = Array.from(featuredProjectElements).map(el => el.dataset.modalTarget);

        const otherProjects = projectsData.filter(project => !featuredProjectIds.includes(project.id));
        
        otherProjects.sort((a, b) => (a.order || 999) - (b.order || 999));
        displayProjectCards(otherProjects);
        
        setupProjectEventListeners();
        
        initScrollAnimations();
    } else {
        console.error('Project data not found. Make sure projects-data.js is loaded correctly.');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        toggleTheme(savedTheme);
    } else {
        // Default to dark mode if no theme is saved
        toggleTheme('dark'); 
    }
});

