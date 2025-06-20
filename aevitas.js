function main() {
	gsap.registerPlugin(ScrollTrigger);

	const aboutHeader = document.querySelector(".about_header");

	function navStuff() {
		const nav = document.querySelector(".nav");

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
						nav.classList.remove("is-scrolled");
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
							nav.classList.add("is-scrolled");
						}
					}

					lastScrollY = currentScrollY; // Update last scroll position
				},
			});
		}

		// helper function to disable scroll
		// function disableScroll(elements) {
		// 	// const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
		// 	// document.body.style.overflow = "hidden";
		// 	// document.body.style.paddingRight = `${scrollBarWidth}px`;
		// 	// if (elements) {
		// 	// 	elements.forEach((el) => {
		// 	// 		el.style.paddingRight = `${scrollBarWidth}px`;
		// 	// 	});
		// 	// }
		// }

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
			tl_nav.pause(0); // Reset animations
			enableScroll();
		}

		// set up GSAP MM
		let mm = gsap.matchMedia();

		mm.add("(min-width: 768px)", () => {
			menuReveal(nav);

			return () => {};
		});

		mm.add("(max-width: 767px)", () => {
			menuReveal(nav);
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

	function contactCTASlider() {
		var splide = new Splide(".contact-slider", {
			autoScroll: {
				speed: 0.5,
			},
			direction: "ttb",
			height: "auto",
			// loop: true,
			type: "loop",
			autoplay: false,
			breakpoints: {
				767: {
					direction: "ltr",
					width: "auto",
				},
			},
		});
		splide.mount(window.splide.Extensions);
	}

	function aboutUs() {
		const section = document.querySelector(".s-about");
		if (!section) return;
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
					invalidateOnRefresh: true,
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

			// Animate scrolling of text items within the section with dynamic resizing
			const scrollTl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: "top 15%",
					end: "+=500%",
					scrub: true,
					invalidateOnRefresh: true,
				},
			});

			scrollTl.set(items, {
				y: () => window.innerHeight - section.offsetTop,
				immediateRender: true,
			});
			scrollTl.to(items, {
				y: () => -(items.offsetHeight + section.offsetTop),
				duration: 1,
			});

			return () => {
				gsap.set(items, { y: 0, immediateRender: true });
			};
		});
	}

	function moveAboutHeader(bool) {
		if (!aboutHeader) return;
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

	function map() {
		let aevitasMap = {};
		aevitasMap.mapElement = document.querySelector(".map_map");
		aevitasMap.ips = [];

		// return if no map on page
		if (!aevitasMap.mapElement) {
			return;
		}

		console.log("Map found, building...");

		// define marker group and add to map
		var markerLayer = new L.featureGroup();

		// Collect destination elements
		const ips = document.querySelectorAll(".map_data-item");
		if (ips.length === 0) {
			console.log("No IP data found.");
			return;
		}

		const animatedPinSVG = `
<svg viewBox="0 0 100 100" width="80" height="80" class="pin_svg">
<circle class="pin_circle-outer" cx="50" cy="50" r="25" />
<circle class="pin_circle-middle" cx="50" cy="50" r="15" />
<circle class="pin_circle-inner" cx="50" cy="50" r="5" />
</svg>
`;

		// Add markers and tooltips
		ips.forEach((ipEl) => {
			const ip = {};
			ip.lat = parseFloat(ipEl.getAttribute("data-ip-lat"));
			ip.long = parseFloat(ipEl.getAttribute("data-ip-long"));
			ip.name = ipEl.getAttribute("data-ip-name");
			ip.imgSrc = ipEl.getAttribute("data-ip-img");
			ip.slug = ipEl.getAttribute("data-ip-slug");
			if (!ip.lat || !ip.long) {
				return;
			}

			const animatedIcon = L.divIcon({
				className: "", // keep it empty if you're styling directly inside SVG
				html: animatedPinSVG,
				iconSize: [80, 80],
				iconAnchor: [40, 40], // centers it visually
			});

			ip.marker = L.marker([ip.lat, ip.long], {
				icon: animatedIcon,
			}).addTo(markerLayer);

			// // Use the createPopupContent function to generate the HTML for each pop-up
			ip.popupContent = createPopupContent({
				imageUrl: ip.imgSrc,
				name: ip.name,
				slug: ip.slug,
				linkUrl: "/investment-platforms/" + ip.slug,
			});

			// Bind the pop-up to the marker
			ip.marker.bindPopup(ip.popupContent, {
				maxWidth: 300,
			});

			aevitasMap.ips.push(ip);
		});

		// Initialize the map
		aevitasMap.map = L.map(aevitasMap.mapElement, {
			attributionControl: false,
			scrollWheelZoom: false,
			center: [0, 0],
			zoom: 0,
			layers: [markerLayer],
			dragging: !L.Browser.mobile,
		});

		aevitasMap.map.zoomControl.remove();
		L.control
			.zoom({
				position: "bottomright",
			})
			.addTo(aevitasMap.map);

		var shapeFileData = L.geoJSON(layerData, {
			style: {
				color: "#68BDE5",
				fillColor: "#055D86",
				weight: 1.5,
				opacity: 1,
				fillOpacity: 1,
			},
		}).addTo(aevitasMap.map);
		// fit map to markers

		aevitasMap.map.fitBounds(markerLayer.getBounds(), { maxZoom: 5 });

		function createPopupContent({ imageUrl, name, linkUrl }) {
			return `
				<div class="popup">
						<img src="${imageUrl}" alt="${name}" class="popup_logo" />
						<a class="button w-button light-ghost" href="${linkUrl}">About Platform</a>
				</div>
			`;
		}
	}

	homeSlider();
	contactCTASlider();

	/* NB order of function calls is important to ensure aboutUs claims its vertical space on the page, otherwise lift anims trigger too early */
	aboutUs();
	subtleLift();
	ScrollTrigger.refresh();

	navStuff();
	map();
}
