/* =========================================================================
   AirPixel Studios — app.js
   Vanilla JS + Motion. Implements the Apple fluid-interface principles:
   response on pointer-down, 1:1 direct manipulation, interruptible springs,
   velocity handoff, momentum projection, spatial consistency, reduced motion.
   ========================================================================= */
(function () {
	"use strict";

	// Motion is exposed as `window.Motion` by the CDN UMD build.
	var M = window.Motion || {};
	var animate = M.animate;
	var reduceMotion =
		window.matchMedia &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	function ready(fn) {
		if (document.readyState !== "loading") fn();
		else document.addEventListener("DOMContentLoaded", fn);
	}

	// -----------------------------------------------------------------------
	// Language switch (Cookie-based). Replaces language.js — same behaviour.
	// -----------------------------------------------------------------------
	function currentLang() {
		var c = window.Cookies;
		var lang = c && c.get ? c.get("lang") : null;
		if (!lang) {
			var usr = navigator.language || navigator.userLanguage || "en";
			lang = usr.slice(0, 2) === "de" ? "de" : "en";
			if (c && c.set) c.set("lang", lang, { expires: 365 });
		}
		return lang;
	}

	function applyLang(lang, revealNow) {
		var other = lang === "de" ? "en" : "de";
		// IMPORTANT: only toggle content elements inside <body>. Never match
		// <html>/<head>/<title>, and never the language-switch buttons — the
		// <html> element carries a lang attribute ("en" / "de-DE"), and hiding
		// it would collapse the entire page. Scope the query to document.body.
		var isContent = function (el) {
			return !el.closest("#switch-lang");
		};
		document.body.querySelectorAll('[lang="' + other + '"]').forEach(function (el) {
			if (isContent(el)) el.style.display = "none";
		});
		document.body.querySelectorAll('[lang="' + lang + '"]').forEach(function (el) {
			if (isContent(el)) el.style.display = "";
		});
		document.documentElement.lang = lang === "de" ? "de-DE" : "en";

		var deBtn = document.getElementById("lang-de-btn");
		var enBtn = document.getElementById("lang-en-btn");
		if (deBtn && enBtn) {
			deBtn.classList.toggle("is-active", lang === "de");
			enBtn.classList.toggle("is-active", lang === "en");
		}
		// slide the toggle's highlight pill to the active language
		var toggle = document.getElementById("switch-lang");
		if (toggle) {
			toggle.classList.toggle("is-de", lang === "de");
			toggle.classList.toggle("is-en", lang === "en");
		}
		// Single <title> element carries both languages via data attributes
		// (two <title> tags are invalid HTML). Swap its text on language change.
		var titleEl = document.querySelector("title");
		if (titleEl) {
			var localized = titleEl.getAttribute("data-title-" + lang);
			if (localized) document.title = localized;
		}

		// Language duplicates that were display:none never got revealed by the
		// IntersectionObserver. On a language SWITCH, reveal everything in the
		// now-active language so it isn't blank. On the initial load we skip
		// this so the scroll-reveal animation still plays.
		if (revealNow) revealForLang(lang);
	}

	// Motion settles an animation by leaving an inline transform/opacity on the
	// element. That inline style outranks CSS rules like .card:hover, so we clear
	// it once the animation finishes — the resting look is held by the .is-in
	// class in CSS, and hover transforms work again.
	function clearInline(el) {
		el.style.transform = "";
		el.style.opacity = "";
	}

	// Reveal every .reveal element that belongs to the active language right
	// away. Used after a language switch: the just-shown language's duplicates
	// were display:none, so the IntersectionObserver never fired for them and
	// they'd stay hidden (opacity 0). We can't rely on offsetParent/viewport
	// checks here — layout may not have reflowed yet in the same tick as the
	// display change — so we decide by the element's own [lang] ancestor.
	function revealForLang(lang) {
		var other = lang === "de" ? "en" : "de";
		document.querySelectorAll(".reveal:not(.is-in)").forEach(function (el) {
			// skip reveal elements that live inside the now-hidden language
			if (el.closest('[lang="' + other + '"]')) return;
			el.classList.add("is-in");
			clearInline(el);
		});
	}

	function initLang() {
		var lang = currentLang();
		applyLang(lang);

		var group = document.getElementById("switch-lang");
		if (group) {
			group.addEventListener("click", function (e) {
				var btn = e.target.closest("button[data-lang]");
				if (!btn) return;
				var next = btn.getAttribute("data-lang");
				if (window.Cookies) window.Cookies.set("lang", next, { expires: 365 });
				applyLang(next, true); // true = reveal the switched-to language now
				// restart the typed headline in the newly-visible language
				startTyped();
			});
		}
	}

	// -----------------------------------------------------------------------
	// Typed headline. Replaces typed.js — types, holds, deletes, next.
	// Only runs on the visible-language element.
	// -----------------------------------------------------------------------
	var typedTimer = null;
	function startTyped() {
		if (typedTimer) {
			clearTimeout(typedTimer);
			typedTimer = null;
		}
		// pick the typed span inside the currently visible hero (its ancestor
		// [lang] block is displayed)
		var candidates = document.querySelectorAll("[data-typed]");
		var el = null;
		candidates.forEach(function (c) {
			if (c.offsetParent !== null) el = c; // visible one
		});
		if (!el) return;

		var strings;
		try {
			strings = JSON.parse(el.getAttribute("data-strings"));
		} catch (e) {
			return;
		}
		if (!strings || !strings.length) return;

		if (reduceMotion) {
			// Reduced motion: no character-by-character typing, just show first.
			el.textContent = strings[0];
			return;
		}

		var si = 0,
			ci = 0,
			deleting = false;

		function tick() {
			var word = strings[si];
			if (!deleting) {
				ci++;
				el.textContent = word.slice(0, ci);
				if (ci === word.length) {
					deleting = true;
					typedTimer = setTimeout(tick, 1800); // hold
					return;
				}
				typedTimer = setTimeout(tick, 55);
			} else {
				ci--;
				el.textContent = word.slice(0, ci);
				if (ci === 0) {
					deleting = false;
					si = (si + 1) % strings.length;
					typedTimer = setTimeout(tick, 350);
					return;
				}
				typedTimer = setTimeout(tick, 28);
			}
		}
		el.textContent = "";
		typedTimer = setTimeout(tick, 400);
	}

	// -----------------------------------------------------------------------
	// Scroll reveal. Driven by a CSS transition (.reveal -> .is-in) with a
	// small per-item stagger. We deliberately do NOT set an inline transform
	// via Motion here: an inline transform outranks CSS :hover rules, which
	// stopped cards from lifting on hover. Letting CSS own the resting state
	// keeps hover working and is still interruptible.
	// -----------------------------------------------------------------------
	function initReveal() {
		var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
		if (!items.length) return;

		if (!("IntersectionObserver" in window)) {
			items.forEach(function (el) {
				el.classList.add("is-in");
			});
			return;
		}

		var io = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (!entry.isIntersecting) return;
					var el = entry.target;
					io.unobserve(el);

					// stagger siblings a touch so a grid cascades in
					var siblings = el.parentElement
						? Array.prototype.slice.call(el.parentElement.children).filter(function (c) {
								return c.classList.contains("reveal");
						  })
						: [el];
					var delay = Math.max(0, siblings.indexOf(el)) * 60; // ms

					setTimeout(function () {
						el.classList.add("is-in");
					}, delay);
				});
			},
			{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
		);

		items.forEach(function (el) {
			io.observe(el);
		});
	}

	// -----------------------------------------------------------------------
	// Navbar: materialise on scroll + reflect the section in view.
	// -----------------------------------------------------------------------
	function initNav() {
		var nav = document.getElementById("nav");
		var toTop = document.getElementById("toTop");

		function onScroll() {
			var y = window.scrollY || window.pageYOffset;
			if (nav) nav.classList.toggle("is-scrolled", y > 40);
			if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.6);
		}
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();

		// active nav link via IntersectionObserver on sections
		var links = document.querySelectorAll(".nav-link[href^='#']");
		var byId = {};
		links.forEach(function (a) {
			byId[a.getAttribute("href").slice(1)] = a;
		});
		var sections = document.querySelectorAll("section[data-nav]");
		if ("IntersectionObserver" in window && sections.length) {
			var so = new IntersectionObserver(
				function (entries) {
					entries.forEach(function (entry) {
						if (!entry.isIntersecting) return;
						var id = entry.target.id;
						links.forEach(function (a) {
							a.classList.remove("is-active");
						});
						if (byId[id]) byId[id].classList.add("is-active");
					});
				},
				{ threshold: 0.5 }
			);
			sections.forEach(function (s) {
				so.observe(s);
			});
		}
	}

	// -----------------------------------------------------------------------
	// Mobile menu — slides in from the right, dismisses to the right (§7).
	// -----------------------------------------------------------------------
	function initMenu() {
		var toggle = document.getElementById("navToggle");
		var links = document.getElementById("navLinks");
		if (!toggle || !links) return;

		function close() {
			document.body.classList.remove("menu-open");
			toggle.setAttribute("aria-expanded", "false");
		}
		toggle.addEventListener("click", function () {
			var open = document.body.classList.toggle("menu-open");
			toggle.setAttribute("aria-expanded", open ? "true" : "false");
		});
		links.addEventListener("click", function (e) {
			if (e.target.closest("a")) close();
		});
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape") close();
		});
	}

	// -----------------------------------------------------------------------
	// Drag-to-scroll rails: 1:1 pointer tracking with grab offset, velocity
	// history, and momentum projection on release (Apple's project()).
	// Native scroll still works; this only enhances pointer drags.
	// -----------------------------------------------------------------------
	function project(velocity, decel) {
		decel = decel || 0.998;
		return ((velocity / 1000) * decel) / (1 - decel);
	}

	function initRail(rail) {
		if (!rail) return;
		var down = false,
			moved = false,
			captured = false,
			startX = 0,
			startScroll = 0,
			lastX = 0,
			lastT = 0,
			velocity = 0,
			momentum = null;

		function stopMomentum() {
			if (momentum) {
				cancelAnimationFrame(momentum);
				momentum = null;
			}
		}

		// Kill the browser's native image/link drag (ghost image + copy cursor),
		// which otherwise hijacks the gesture instead of scrolling the rail.
		// CSS -webkit-user-drag covers Blink/WebKit; this covers Firefox too.
		rail.addEventListener("dragstart", function (e) {
			e.preventDefault();
		});

		rail.addEventListener("pointerdown", function (e) {
			if (e.pointerType === "mouse" && e.button !== 0) return;
			down = true;
			moved = false;
			captured = false;
			stopMomentum(); // grabbing mid-glide reverses instantly (§3)
			startX = e.clientX;
			startScroll = rail.scrollLeft;
			lastX = e.clientX;
			lastT = e.timeStamp;
			velocity = 0;
			// NB: pointer capture is set only once a drag actually starts
			// (see pointermove). Capturing on pointerdown would retarget the
			// follow-up click to the rail, so a plain tap on an image would
			// never reach that image's own click handler (lightbox).
		});

		rail.addEventListener("pointermove", function (e) {
			if (!down) return;
			var dx = e.clientX - startX;
			if (Math.abs(dx) > 6) moved = true; // hysteresis before committing
			if (!moved) return;
			if (!captured) {
				// now it's a real drag — capture so tracking survives leaving bounds
				try {
					rail.setPointerCapture(e.pointerId);
				} catch (err) {}
				captured = true;
			}
			rail.classList.add("is-dragging");
			// 1:1 tracking — content stays glued to the finger
			rail.scrollLeft = startScroll - dx;

			var dt = e.timeStamp - lastT;
			if (dt > 0) velocity = ((e.clientX - lastX) / dt) * 1000; // px/s
			lastX = e.clientX;
			lastT = e.timeStamp;
		});

		function release(e) {
			if (!down) return;
			down = false;
			if (captured) {
				try {
					rail.releasePointerCapture(e.pointerId);
				} catch (err) {}
				captured = false;
			}
			if (!moved) {
				rail.classList.remove("is-dragging");
				return;
			}

			// Momentum projection: throw the rail to where the flick is going.
			var target = rail.scrollLeft - project(velocity);
			var max = rail.scrollWidth - rail.clientWidth;
			target = Math.max(0, Math.min(max, target));

			if (reduceMotion || !animate) {
				rail.scrollLeft = target;
				rail.classList.remove("is-dragging");
				return;
			}

			// Spring the remaining distance; carries the release velocity feel.
			var start = rail.scrollLeft;
			var t0 = null;
			var dur = Math.min(900, 300 + Math.abs(velocity) * 0.25);
			function glide(ts) {
				if (t0 === null) t0 = ts;
				var p = Math.min(1, (ts - t0) / dur);
				// easeOutCubic — decel curve, no overshoot on a scroll surface
				var e2 = 1 - Math.pow(1 - p, 3);
				rail.scrollLeft = start + (target - start) * e2;
				if (p < 1) momentum = requestAnimationFrame(glide);
				else {
					momentum = null;
					rail.classList.remove("is-dragging");
				}
			}
			momentum = requestAnimationFrame(glide);
		}

		rail.addEventListener("pointerup", release);
		rail.addEventListener("pointercancel", release);
		// suppress the click that follows a drag (so tiles don't navigate)
		rail.addEventListener(
			"click",
			function (e) {
				if (moved) {
					e.preventDefault();
					e.stopPropagation();
					moved = false;
				}
			},
			true
		);

		// Remember which card the user opened, so returning from a detail page
		// re-centers THAT card (not just a raw scroll offset, which left the
		// card wherever it happened to sit when clicked). Only restore on a
		// back/forward navigation — a fresh load / reload starts at the left.
		if (rail.id) {
			var idxKey = "railIndex:" + rail.id;
			var posKey = "railScroll:" + rail.id;

			// center a given child element within the rail
			function centerChild(child) {
				if (!child) return;
				var target = child.offsetLeft - (rail.clientWidth - child.offsetWidth) / 2;
				var max = rail.scrollWidth - rail.clientWidth;
				rail.scrollLeft = Math.max(0, Math.min(max, target));
			}

			// save the index of the clicked card (bubbles up from the tile)
			rail.addEventListener("click", function (e) {
				if (moved) return; // a drag, not a real click
				var item = e.target.closest(".rail > *, .tile");
				// resolve to a direct child of the rail
				var child = item;
				while (child && child.parentElement !== rail) child = child.parentElement;
				if (!child) return;
				var idx = Array.prototype.indexOf.call(rail.children, child);
				try {
					sessionStorage.setItem(idxKey, String(idx));
				} catch (err) {}
			});

			function navIsBackForward() {
				try {
					var navEntries = performance.getEntriesByType("navigation");
					if (navEntries && navEntries.length) return navEntries[0].type === "back_forward";
					if (performance.navigation) return performance.navigation.type === 2;
				} catch (err) {}
				return false;
			}

			// Restore the saved card centered. Runs a couple of frames out so
			// layout (image widths, fonts) has settled first.
			function restoreRail() {
				var savedIdx = null,
					savedPos = null;
				try {
					savedIdx = sessionStorage.getItem(idxKey);
					savedPos = sessionStorage.getItem(posKey);
				} catch (err) {}
				var apply = function () {
					if (savedIdx !== null && rail.children[parseInt(savedIdx, 10)]) {
						centerChild(rail.children[parseInt(savedIdx, 10)]);
					} else if (savedPos !== null) {
						rail.scrollLeft = parseFloat(savedPos) || 0;
					}
				};
				requestAnimationFrame(function () {
					apply();
					// run again next frame — some browsers finish layout late,
					// which would otherwise leave the card slightly off.
					requestAnimationFrame(apply);
				});
			}

			// Initial load: restore only on back/forward, else clear + start left.
			if (navIsBackForward()) {
				restoreRail();
			} else {
				try {
					sessionStorage.removeItem(idxKey);
					sessionStorage.removeItem(posKey);
				} catch (err) {}
			}

			// bfcache: when the browser restores a frozen page (Safari/Chrome
			// "back"), app.js does NOT re-run — but pageshow fires with
			// persisted=true. Re-center there too so returning always works.
			window.addEventListener("pageshow", function (e) {
				if (e.persisted || navIsBackForward()) restoreRail();
			});

			// also keep a raw scroll offset as a fallback (e.g. mission rail
			// without clickable tiles), saved throttled while scrolling
			var saveTimer = null;
			rail.addEventListener(
				"scroll",
				function () {
					if (saveTimer) return;
					saveTimer = setTimeout(function () {
						saveTimer = null;
						try {
							sessionStorage.setItem(posKey, String(rail.scrollLeft));
						} catch (err) {}
					}, 120);
				},
				{ passive: true }
			);
		}
	}

	function initRails() {
		document.querySelectorAll(".rail").forEach(initRail);
	}

	// -----------------------------------------------------------------------
	// Lightbox: click a mission image to view it full-frame. The rail's
	// capture-phase click handler already swallows clicks that follow a drag,
	// so a drag never opens the viewer — only a genuine tap/click does.
	// -----------------------------------------------------------------------
	function initLightbox() {
		var box = document.getElementById("lightbox");
		if (!box) return;
		var imgEl = document.getElementById("lightbox-img");
		var capEl = document.getElementById("lightbox-cap");
		var imgs = Array.prototype.slice.call(document.querySelectorAll(".mission-img"));
		if (!imgs.length) return;

		var index = 0;
		var lastFocus = null;

		function show(i) {
			index = (i + imgs.length) % imgs.length; // wrap around
			var src = imgs[index];
			imgEl.src = src.currentSrc || src.src;
			imgEl.alt = src.alt || "";
			capEl.textContent = src.alt || "";
		}

		function open(i) {
			lastFocus = document.activeElement;
			show(i);
			box.classList.add("is-open");
			document.body.style.overflow = "hidden"; // lock scroll behind
			var closeBtn = box.querySelector("[data-lightbox-close]");
			if (closeBtn) closeBtn.focus();
		}

		function close() {
			box.classList.remove("is-open");
			document.body.style.overflow = "";
			if (lastFocus && lastFocus.focus) lastFocus.focus();
		}

		imgs.forEach(function (img, i) {
			img.setAttribute("role", "button");
			img.setAttribute("tabindex", "0");
			img.addEventListener("click", function () {
				open(i);
			});
			img.addEventListener("keydown", function (e) {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					open(i);
				}
			});
		});

		box.addEventListener("click", function (e) {
			// click on the scrim (not the image/controls) closes it
			if (e.target === box) close();
		});
		var closeBtn = box.querySelector("[data-lightbox-close]");
		var prevBtn = box.querySelector("[data-lightbox-prev]");
		var nextBtn = box.querySelector("[data-lightbox-next]");
		if (closeBtn) closeBtn.addEventListener("click", close);
		if (prevBtn) prevBtn.addEventListener("click", function () { show(index - 1); });
		if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); });

		document.addEventListener("keydown", function (e) {
			if (!box.classList.contains("is-open")) return;
			if (e.key === "Escape") close();
			else if (e.key === "ArrowLeft") show(index - 1);
			else if (e.key === "ArrowRight") show(index + 1);
		});
	}

	// -----------------------------------------------------------------------
	// Contact form: validate, then hand off to the mail client via mailto,
	// and surface the "almost there" modal. Keeps the original UX intent.
	// -----------------------------------------------------------------------
	function openModal() {
		var modal = document.getElementById("modalSubmitFormInfo");
		if (modal) modal.classList.add("is-open");
	}
	function closeModal() {
		var modal = document.getElementById("modalSubmitFormInfo");
		if (modal) modal.classList.remove("is-open");
	}

	function initForms() {
		["de-cf", "en-cf"].forEach(function (id) {
			var form = document.getElementById(id);
			if (!form) return;
			var note = document.getElementById(id + "-note");

			form.addEventListener("submit", function (e) {
				e.preventDefault();
				var lang = id.slice(0, 2);
				// honeypot
				var hp = form.querySelector(".hp");
				if (hp && hp.value) return;

				var name = form.querySelector("[name=name]").value.trim();
				var email = form.querySelector("[name=email]").value.trim();
				var subject = form.querySelector("[name=subject]").value.trim();
				var message = form.querySelector("[name=message]").value.trim();

				if (!name || !email || !message || !form.checkValidity()) {
					if (note)
						note.textContent =
							lang === "de"
								? "Bitte fülle Name, E-Mail und Nachricht aus."
								: "Please fill in name, email and message.";
					form.reportValidity();
					return;
				}

				var subj =
					subject || (lang === "de" ? "Anfrage über airpixel-studios.com" : "Enquiry via airpixel-studios.com");
				var body =
					(lang === "de" ? "Name: " : "Name: ") +
					name +
					"\n" +
					(lang === "de" ? "E-Mail: " : "Email: ") +
					email +
					"\n\n" +
					message;

				window.location.href =
					"mailto:hello@airpixel-studios.com?subject=" +
					encodeURIComponent(subj) +
					"&body=" +
					encodeURIComponent(body);

				openModal();
				if (note)
					note.textContent =
						lang === "de" ? "Dein E-Mail-Programm wurde geöffnet." : "Your email client has been opened.";
			});
		});

		document.querySelectorAll("[data-close-modal]").forEach(function (b) {
			b.addEventListener("click", closeModal);
		});
		var modal = document.getElementById("modalSubmitFormInfo");
		if (modal) {
			modal.addEventListener("click", function (e) {
				if (e.target === modal) closeModal();
			});
		}
		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape") closeModal();
		});
	}

	// -----------------------------------------------------------------------
	// Smooth anchor scrolling (native, honours reduced-motion via CSS).
	// -----------------------------------------------------------------------
	function initAnchors() {
		document.querySelectorAll('a[href^="#"]').forEach(function (a) {
			a.addEventListener("click", function (e) {
				var href = a.getAttribute("href");
				if (href === "#" || href.length < 2) return;
				var target = document.getElementById(href.slice(1));
				if (!target) return;
				e.preventDefault();
				target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
			});
		});
	}

	// -----------------------------------------------------------------------
	// Google Analytics + opt-out. Ported from the old theme main.js so the
	// cookieconsent integration keeps working (it calls disable_analytics()).
	// -----------------------------------------------------------------------
	function initGA() {
		if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return;
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			window.dataLayer.push(arguments);
		}
		window.gtag = gtag;
		gtag("js", new Date());
		gtag("config", "G-9FDJYXMY95", { anonymize_ip: true });
	}

	// Exposed globally: cookieconsent.js references it on rejection.
	window.disable_analytics = function () {
		var disableStr = "ga-disable-G-9FDJYXMY95";
		document.cookie = disableStr + "=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
		window[disableStr] = true;
		return true;
	};

	// -----------------------------------------------------------------------
	ready(function () {
		initLang();
		initGA();
		startTyped();
		initReveal();
		initNav();
		initMenu();
		initRails();
		initLightbox();
		initForms();
		initAnchors();
	});
})();
