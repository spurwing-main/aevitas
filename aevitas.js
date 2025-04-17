function main() {
	gsap.registerPlugin(ScrollTrigger);

	const aboutHeader = document.querySelector(".about_header");

	function nav() {
		// set some variables
		const menuButton = document.querySelector(".header-bar_menu-btn");
		const menu = document.querySelector(".menu-panel_inner");
		const menuLinks = document.querySelectorAll(".nav-link");
		const menuLinksList = document.querySelector(".menu-panel_menu-links");
		const menuCTA = document.querySelector(".menu-panel_menu-cta");
		const logoWrap = document.querySelector(".header-bar_logo-wrap");
		const bar = document.querySelector(".header-bar_inner");
		let menuOpen = false;
		let tl_nav = gsap.timeline({
			paused: true,
			defaults: { ease: "power3.out" },
		});

		function menuReveal(target) {
			let menuForcedShown = false;
			const hideThreshold = 20; // Distance to scroll before hiding is allowed
			const showThreshold = 10; // Distance from the top where the menu is always shown

			let menuRevealAnim = gsap
				.from(target, {
					yPercent: -100,
					paused: true,
					duration: 0.3,
				})
				.progress(1);

			let lastScrollY = window.scrollY;
			let scrollBuffer = 0;

			let menuScrollTrigger = ScrollTrigger.create({
				start: "top -1px",
				pinSpacing: false,
				onUpdate: (self) => {
					// prevent menu from hiding if it was forced to show
					if (menuForcedShown) {
						return;
					}

					const currentScrollY = window.scrollY;
					const deltaY = currentScrollY - lastScrollY;

					if (currentScrollY <= showThreshold) {
						// Always show menu near top
						menuRevealAnim.play();
						scrollBuffer = 0;
						moveAboutHeader(true);
					} else if (deltaY > 0 && currentScrollY > hideThreshold) {
						// Only hide after scrolling past hideThreshold
						menuRevealAnim.reverse();
						scrollBuffer = 0;
						moveAboutHeader(false);
					} else if (deltaY < 0) {
						// Reveal menu when scrolling up
						scrollBuffer -= deltaY;
						if (scrollBuffer >= 50) {
							menuRevealAnim.play();
							scrollBuffer = 0;
							moveAboutHeader(true);
						}
					}

					lastScrollY = currentScrollY; // Update last scroll position
				},
			});
		}

		function handleNavButtonClick() {
			if (!menuOpen) {
				console.log("open menu");
				tl_nav.play();
				menuButton.innerHTML = "Close";
				disableScroll([bar, menuLinksList]);
				menuOpen = true;
			} else {
				console.log("close menu");
				tl_nav.reverse();
				menuButton.innerHTML = "Menu";
				enableScroll([bar, menuLinksList]);
				menuOpen = false;
			}
		}

		function openNav() {
			tl_nav
				.fromTo(
					menu,
					{ height: 0 },
					{
						height: "100vh",
						duration: 0.75,
					}
				)
				.to(menuButton, { backgroundColor: "#F0F0F0", duration: 0.3 }, "0")
				.fromTo(
					menuLinks,
					{ y: 20, autoAlpha: 0 },
					{ y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.3 },
					"-=0.3"
				)
				.fromTo(menuCTA, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3 }, "-=0.2")
				.to(logoWrap, { color: "#0200c8", duration: 0.3 }, "0");

			// Ensure the click event listener is added only once
			// menuButton.removeEventListener("click", handleNavButtonClick);
			// menuButton.addEventListener("click", handleNavButtonClick);
		}

		// helper function to disable scroll
		function disableScroll(elements) {
			const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = "hidden";
			document.body.style.paddingRight = `${scrollBarWidth}px`;
			if (elements) {
				elements.forEach((el) => {
					el.style.paddingRight = `${scrollBarWidth}px`;
				});
			}
		}

		// helper function to enable scroll
		function enableScroll(elements) {
			document.body.style.overflow = "";
			document.body.style.paddingRight = "";
			if (elements) {
				elements.forEach((el) => {
					el.style.paddingRight = "";
				});
			}
		}

		// helper function to reset menu
		function resetMenu() {
			// menuOpen = false;
			// menuButton.innerHTML = "Menu";
			tl_nav.pause(0); // Reset animations
			enableScroll([bar, menu]);
			// menuButton.removeEventListener("click", handleNavButtonClick);
		}

		// set up GSAP MM
		let mm = gsap.matchMedia();

		mm.add("(min-width: 768px)", () => {
			menuReveal(".nav");

			return () => {};
		});

		mm.add("(max-width: 767px)", () => {
			menuReveal(".nav");
			// reset menu on resize
			return () => {
				resetMenu();
			};
		});
	}

	function homeSlider() {
		// Get all swiper containers
		const swiperContainers = document.querySelectorAll(".hero-slider_list-wrapper");

		swiperContainers.forEach((container) => {
			// Get the swiper-wrapper within the current container
			const swiperWrapper = container.querySelector(".swiper-wrapper");

			// Get all swiper-slide elements within the current container
			const swiperSlides = container.querySelectorAll(".swiper-slide");

			// Clone each swiper-slide element 4 times and append to the swiper-wrapper
			for (let i = 0; i < 4; i++) {
				swiperSlides.forEach((slide) => {
					const clone = slide.cloneNode(true);
					swiperWrapper.appendChild(clone);
				});
			}

			const swiper = new Swiper(container, {
				centeredSlides: true,
				slideToClickedSlide: true /* click on slide to scroll to it */,
				slidesPerView: 1,
				autoplay: {
					delay: 5000,
				},
				navigation: {
					nextEl: ".carousel-arrow_wrap.is-next",
					prevEl: ".carousel-arrow_wrap.is-prev",
				},
				loop: true,
				loopAdditionalSlides: 5 /* render more slides */,
				freeMode: {
					/* allow 'flick scrolling */ enabled: true,
					sticky: true /* snap to slides */,
					minimumVelocity: 0.05,
					momentumVelocityRatio: 0.1,
					momentumRatio: 0.5 /* dial it down a little */,
				},
				effect: "creative" /* enable scaling effect */,
				creativeEffect: {
					limitProgress: 2,
					prev: {
						// Slide scale
						scale: 0.85,
						translate: ["-100%", 0, 0],
						origin: "right center",
						opacity: 0.75,
					},
					next: {
						// Slide scale
						scale: 0.85,
						translate: ["100%", 0, 0],
						origin: "left center",
						opacity: 0.75,
					},
				},
				keyboard: {
					enabled: true,
					onlyInViewport: false,
				},
				on: {
					sliderFirstMove: function () {
						// console.log("sliderFirstMove");
						const activeSlide = this.slides[this.activeIndex];
						const prevSlide = this.slides[this.activeIndex - 1];
						const nextSlide = this.slides[this.activeIndex + 1];
						[activeSlide, prevSlide, nextSlide].forEach((slide) => {
							const video = slide.querySelector("video");
							if (video) {
								video.loop = true;
								video.play();
							}
						});
					},
					afterInit: function () {
						// console.log("Swiper initialised");

						const activeSlide = this.slides[this.activeIndex];
						const video = activeSlide.querySelector("video");
						if (video) {
							video.loop = true;
							video.play();
						}
					},
					transitionEnd: function () {
						// console.log("transitionEnd");
						const activeSlide = this.slides[this.activeIndex];

						this.slides.forEach((slideElement) => {
							const video = slideElement.querySelector("video");
							if (slideElement === activeSlide) {
								if (video) {
									video.loop = true;
									video.play();
								}
							} else {
								if (video) {
									video.pause();
								}
							}
						});
					},
				},
			});
		});
	}

	function aboutUs() {
		const section = document.querySelector(".s-about");
		const imgs = gsap.utils.toArray(".about_imgs .about_img"); // make sure we only get the desktop ones
		const items = document.querySelector(".about_items");

		if (!section || imgs.length === 0 || !items || !aboutHeader) return;
		let mm = gsap.matchMedia();

		mm.add("(min-width: 768px)", () => {
			// Pin the entire section and animate image transitions
			const imgTl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: "top top",
					end: "+=250%",
					scrub: true,
					pin: [section, aboutHeader],
					// onEnter: () => moveHeader(true),
					// onLeave: () => moveHeader(false),
					// onEnterBack: () => moveHeader(true),
					// onLeaveBack: () => moveHeader(false),
				},
			});

			imgs.forEach((img, i) => {
				// set opacity of the first image to 1, others to 0
				gsap.set(img, {
					opacity: i === 0 ? 1 : 0,
				});

				if (i > 0) {
					const prev = imgs[i - 1];
					const step = gsap.timeline();
					step.to(prev, { opacity: 0, duration: 1 });
					step.to(img, { opacity: 1, duration: 1 }, 0);
					imgTl.add(step);
				}

				if (i < imgs.length - 1) {
					imgTl.addPause(); // pause at each image step
				}
			});

			// Animate scrolling of text items within the section
			const sectionTop = section.offsetTop; // distance of section from the top of the page
			const offset = window.innerHeight - sectionTop; // distance of the section from the top of the viewport
			const height = items.offsetHeight; // height of the items

			// Now build the scroll timeline
			const scrollTl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: "top 15%",
					end: "+=500%",
					scrub: true,
					invalidateOnRefresh: true,
				},
			});

			scrollTl.set(items, { y: `${offset}px`, immediateRender: true });
			scrollTl.to(items, { y: `-${height + sectionTop}px`, duration: 1 });
		});
	}

	function moveAboutHeader(bool) {
		aboutHeader.classList.toggle("is-moved", bool);
	}

	function subtleLift() {
		document.querySelectorAll(".anim-lift-trigger").forEach((trigger) => {
			const targets = trigger.querySelectorAll(".anim-lift-target");

			if (targets.length) {
				gsap
					.timeline({
						scrollTrigger: {
							trigger: trigger,
							start: "top 80%",
						},
					})
					.fromTo(
						targets,
						{
							y: 20,
							autoAlpha: 0,
						},
						{
							y: 0,
							autoAlpha: 1,
							duration: 0.3,
							stagger: 0.2,
							onComplete: () => {
								// targets.forEach((target) => {
								// 	console.log("target", target);
								// });
							},
						}
					);
			}
		});
	}

	homeSlider();

	/* order of this important to ensure aboutUs claims its space on the page */
	aboutUs();
	subtleLift();
	ScrollTrigger.refresh();

	nav();
}
