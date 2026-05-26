import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './LeadershipCarouselTwo.css';

const leadershipActivitiesTwo = [
	{
		id: 1,
		service: 'Research',
		tag: 'Medical AI',
		title: 'Generative MRI Research',
		descriptor: 'Temporal super-resolution for clinical imaging workflows.',
		period: '2025 - Present',
		details:
			'Leading diffusion model research for breast DCE-MRI to reconstruct intermediate frames with high fidelity, enabling more reliable downstream quantitative biomarkers and treatment insight.',
		themeClass: 'activity-theme-one',
	},
	{
		id: 2,
		service: 'Operations',
		tag: 'AI Delivery',
		title: 'AI Ops Team Scaling',
		descriptor: 'Built process discipline from 1 to 20 team members.',
		period: '2023 - 2024',
		details:
			'Scaled annotation and QA operations while maintaining strict SLA reliability. Created predictable execution rhythms and trained leads to keep quality high under deadline pressure.',
		themeClass: 'activity-theme-two',
	},
	{
		id: 3,
		service: 'Creative',
		tag: 'Agency Leadership',
		title: 'E-Commerce Creative Studio',
		descriptor: 'Directed visual systems and growth-ready creative output.',
		period: '2021 - 2024',
		details:
			'Co-founded and led a creative studio delivering conversion-focused brand visuals, product imagery, and campaign assets across global clients with consistent delivery standards.',
		themeClass: 'activity-theme-three',
	},
	{
		id: 4,
		service: 'Community',
		tag: 'Merch Initiative',
		title: 'University Merch Launch',
		descriptor: 'Created a community-first merchandise ecosystem.',
		period: '2022 - 2023',
		details:
			'Launched a university merchandising program from scratch by aligning design, production, and stakeholder approvals, then framing it as a sustainable model for alumni engagement.',
		themeClass: 'activity-theme-four',
	},
	{
		id: 5,
		service: 'Systems',
		tag: 'CRM Rollout',
		title: 'CRM Implementation Sprint',
		descriptor: 'Enabled cross-team adoption in a high-growth environment.',
		period: '2021 - 2022',
		details:
			'Owned CRM selection and rollout during rapid hiring, delivered dashboards, and wrote SOPs that improved visibility for pipeline decisions while reducing onboarding friction.',
		themeClass: 'activity-theme-five',
	},
	{
		id: 6,
		service: 'Engineering',
		tag: 'Team Leadership',
		title: 'Student EV Program',
		descriptor: 'Led an engineering team for international competition.',
		period: '2018 - 2020',
		details:
			'Coordinated multi-disciplinary engineering tasks and iterative performance testing that helped the team deliver a globally recognized result in Shell Eco-Marathon.',
		themeClass: 'activity-theme-six',
	},
];

function wrapIndex(index, total) {
	return (index + total) % total;
}


export default function LeadershipCarouselTwo() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const sectionRef = useRef(null);
	const previewRailRef = useRef(null);
	const heroRowRef = useRef(null);
	const rafRef = useRef(null);
	const heroTargetRef = useRef(0);
	const heroCurrentRef = useRef(0);
	const HERO_SPEED = 1.05; // multiplier: hero moves very slightly faster than previews
	const isTransitioningRef = useRef(false);
	const transitionTimeoutRef = useRef(null);
	const previewCardRefs = useRef([]);
	const scrollRafRef = useRef(null);
	const previewAnimationRef = useRef(null);
	const isProgrammaticPreviewScrollRef = useRef(false);
	const wheelLockRef = useRef(false);
	const wheelUnlockTimeoutRef = useRef(null);

	const total = leadershipActivitiesTwo.length;

	const activeItem = leadershipActivitiesTwo[activeIndex];
	const leftIndex = wrapIndex(activeIndex - 1, total);
	const rightIndex = wrapIndex(activeIndex + 1, total);

	const visibleItems = useMemo(
		() => ({
			left: leadershipActivitiesTwo[leftIndex],
			right: leadershipActivitiesTwo[rightIndex],
		}),
		[leftIndex, rightIndex]
	);

	const animatePreviewToIndex = useCallback((index, duration = 720) => {
		const rail = previewRailRef.current;
		const node = previewCardRefs.current[index];
		if (!rail || !node) return;

		const target = node.offsetLeft - (rail.clientWidth - node.clientWidth) / 2;

		// prefer native smooth scroll when available to offload work to the browser
		if (typeof rail.scrollTo === 'function' && 'scrollBehavior' in document.documentElement.style) {
			isProgrammaticPreviewScrollRef.current = true;
			rail.scrollTo({ left: target, behavior: duration > 0 ? 'smooth' : 'auto' });
			if (previewAnimationRef.current) window.clearTimeout(previewAnimationRef.current);
			previewAnimationRef.current = window.setTimeout(() => {
				isProgrammaticPreviewScrollRef.current = false;
				previewAnimationRef.current = null;
			}, Math.max(300, duration));
			return;
		}

		// fallback to rAF-driven scroll for environments without native smooth scroll
		const start = rail.scrollLeft;
		const delta = target - start;

		if (previewAnimationRef.current) cancelAnimationFrame(previewAnimationRef.current);

		isProgrammaticPreviewScrollRef.current = true;
		const startTime = performance.now();

		const easeOutQuint = (value) => 1 - Math.pow(1 - value, 5);

		const tick = (now) => {
			const elapsed = now - startTime;
			const progress = Math.min(1, elapsed / duration);
			rail.scrollLeft = start + delta * easeOutQuint(progress);

			if (progress < 1) {
				previewAnimationRef.current = requestAnimationFrame(tick);
				return;
			}

			previewAnimationRef.current = null;
			isProgrammaticPreviewScrollRef.current = false;
		};

		previewAnimationRef.current = requestAnimationFrame(tick);
	}, []);

	const goTo = useCallback(
		(index, shouldSync = true) => {
			const nextIndex = wrapIndex(index, total);
			const isWrapJump =
				(activeIndex === total - 1 && nextIndex === 0) ||
				(activeIndex === 0 && nextIndex === total - 1);
			setActiveIndex(nextIndex);
			setDetailsOpen(false);
			// prevent parallax transform from conflicting with framer animations
			isTransitioningRef.current = true;
			if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
			transitionTimeoutRef.current = window.setTimeout(() => {
				isTransitioningRef.current = false;
				transitionTimeoutRef.current = null;
			}, 520);

			if (shouldSync) {
				animatePreviewToIndex(nextIndex, isWrapJump ? 180 : 760);
			}
		},
		[activeIndex, animatePreviewToIndex, total]
	);

	const onPreviewScroll = useCallback(() => {
		if (isProgrammaticPreviewScrollRef.current) return;

		if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);

		scrollRafRef.current = requestAnimationFrame(() => {
			const rail = previewRailRef.current;
			if (!rail) return;

			const centerX = rail.scrollLeft + rail.clientWidth / 2;
			let closestIndex = 0;
			let closestDistance = Number.POSITIVE_INFINITY;

			previewCardRefs.current.forEach((card, index) => {
				if (!card) return;

				const cardCenter = card.offsetLeft + card.clientWidth / 2;
				const distance = Math.abs(cardCenter - centerX);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestIndex = index;
				}
			});

			setActiveIndex((current) => {
				if (current === closestIndex) return current;
				// direction removed; update active index only
				setDetailsOpen(false);
				return closestIndex;
			});
		});
	}, []);

	// Parallax: sync hero row translation to preview rail scroll with smooth lerp
	useEffect(() => {
		const rail = previewRailRef.current;
		const heroRow = heroRowRef.current;
		if (!rail || !heroRow) return;

		const computeTarget = () => {
			const railMax = Math.max(1, rail.scrollWidth - rail.clientWidth);
			const progress = rail.scrollLeft / railMax; // 0..1
			const heroMax = Math.max(0, heroRow.scrollWidth - heroRow.clientWidth);
			const target = progress * heroMax * HERO_SPEED;
			heroTargetRef.current = Math.max(0, Math.min(target, heroMax));
		};

		const onScroll = () => {
			computeTarget();
			if (rafRef.current) return; // ensure rAF loop running
			rafRef.current = requestAnimationFrame(step);
		};

		const step = () => {
			rafRef.current = null;
			if (isTransitioningRef.current) {
				// preserve the current transform while transition runs to avoid jumps
				heroRow.style.transform = `translateX(${-heroCurrentRef.current}px)`;
				// keep the rAF loop running so we resume smoothly when transition ends
				rafRef.current = requestAnimationFrame(step);
				return;
			}
			const cur = heroCurrentRef.current;
			const tgt = heroTargetRef.current;
			const next = cur + (tgt - cur) * 0.08; // lerp
			heroCurrentRef.current = next;
			heroRow.style.transform = `translateX(${-next}px)`;
			// continue animating if not settled
			if (Math.abs(tgt - next) > 0.5) {
				rafRef.current = requestAnimationFrame(step);
			}
		};

		// initial target
		computeTarget();
		rail.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			rail.removeEventListener('scroll', onScroll);
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	useEffect(() => {
		animatePreviewToIndex(0, 0);
		return () => {
			if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
			if (previewAnimationRef.current) cancelAnimationFrame(previewAnimationRef.current);
			if (wheelUnlockTimeoutRef.current) {
				window.clearTimeout(wheelUnlockTimeoutRef.current);
				wheelUnlockTimeoutRef.current = null;
			}
		};
	}, [animatePreviewToIndex]);

	const onHeroWheel = useCallback(
		(event) => {
			const absX = Math.abs(event.deltaX);
			const absY = Math.abs(event.deltaY);
			if (absX === 0 && absY === 0) return;
			if (absY > absX) return;

			const delta = event.deltaX;
			if (Math.abs(delta) < 12) return;

			event.preventDefault();
			event.stopPropagation();

			if (wheelUnlockTimeoutRef.current) window.clearTimeout(wheelUnlockTimeoutRef.current);
			wheelUnlockTimeoutRef.current = window.setTimeout(() => {
				wheelLockRef.current = false;
				wheelUnlockTimeoutRef.current = null;
			}, 190);

			if (wheelLockRef.current) return;

			const nextDirection = delta > 0 ? 1 : -1;
			wheelLockRef.current = true;
			goTo(activeIndex + nextDirection, true, nextDirection);
		},
		[activeIndex, goTo]
	);

	const onPreviewWheel = useCallback(
		(event) => {
			const rail = previewRailRef.current;
			if (!rail) return;

			const absX = Math.abs(event.deltaX);
			const absY = Math.abs(event.deltaY);
			if (absX === 0 && absY === 0) return;
			if (absY > absX) return;

			const delta = event.deltaX;
			if (Math.abs(delta) < 12) return;

			const atStart = rail.scrollLeft <= 0;
			const atEnd = Math.ceil(rail.scrollLeft + rail.clientWidth) >= rail.scrollWidth;
			const shouldWrapRight = atEnd && delta > 0;
			const shouldWrapLeft = atStart && delta < 0;

			if (!shouldWrapRight && !shouldWrapLeft) return;

			event.preventDefault();
			event.stopPropagation();

			const nextDirection = delta > 0 ? 1 : -1;
			goTo(activeIndex + nextDirection, true, nextDirection);
		},
		[activeIndex, goTo]
	);

	useEffect(() => {
		const onKeyDown = (event) => {
			if (event.key === 'ArrowLeft') goTo(activeIndex - 1, true, -1);
			if (event.key === 'ArrowRight') goTo(activeIndex + 1, true, 1);
		};

		window.addEventListener('keydown', onKeyDown);
		return () => {
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [activeIndex, goTo]);

	// cleanup any pending transition timeout on unmount
	useEffect(() => {
		return () => {
			if (transitionTimeoutRef.current) {
				window.clearTimeout(transitionTimeoutRef.current);
				transitionTimeoutRef.current = null;
			}
			if (wheelUnlockTimeoutRef.current) {
				window.clearTimeout(wheelUnlockTimeoutRef.current);
				wheelUnlockTimeoutRef.current = null;
			}
		};
	}, []);

	return (
		<section ref={sectionRef} className="leadership-two-section" id="leadership-two" aria-label="Leadership Activities 2">
			<div className="leadership-two-wrap">
				<header className="leadership-two-header">
					<p className="leadership-two-kicker">Leadership Activities #2</p>
				</header>

				<div className="leadership-two-hero-shell">
					<div ref={heroRowRef} className="leadership-two-hero-row" aria-live="polite">
						<motion.button
							key={`left-${visibleItems.left.id}`}
							type="button"
							className={`leadership-two-hero-card leadership-two-hero-card-side ${visibleItems.left.themeClass}`}
							initial={{ opacity: 0.68 }}
							animate={{ opacity: 0.72 }}
							exit={{ opacity: 0.66 }}
							transition={{ duration: 0.14, ease: 'linear' }}
							onClick={() => goTo(activeIndex - 1, true, -1)}
						>
							<div className="leadership-two-card-tint" />
							<div className="leadership-two-card-content">
								<span className="leadership-two-card-tag">{visibleItems.left.tag}</span>
								<h3>{visibleItems.left.title}</h3>
							</div>
						</motion.button>

						<AnimatePresence mode="wait">
							<motion.article
								key={activeItem.id}
								className={`leadership-two-hero-card leadership-two-hero-card-active ${activeItem.themeClass}`}
								initial={{ opacity: 0.98 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0.97 }}
								transition={{ duration: 0.16, ease: 'linear' }}
								onWheel={onHeroWheel}
							>
								<div className="leadership-two-card-tint" />

								<div className="leadership-two-card-content leadership-two-card-content-active">
									<div className="leadership-two-card-meta">
										<span>{activeItem.tag}</span>
										<span>{activeItem.period}</span>
									</div>

									<h3>{activeItem.title}</h3>
									<p>{activeItem.descriptor}</p>
								</div>

								<div className="leadership-two-details-trigger-wrap">
									<button
										type="button"
										className={`leadership-two-details-trigger ${detailsOpen ? 'is-open' : ''}`}
										onClick={() => setDetailsOpen((value) => !value)}
										aria-expanded={detailsOpen}
									>
										{detailsOpen ? 'Hide Details' : 'More Details'}
									</button>
								</div>

								<AnimatePresence>
									{detailsOpen && (
										<motion.div
											className="leadership-two-details-panel"
											initial={{ opacity: 0.96 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0.95 }}
											transition={{ duration: 0.12, ease: 'linear' }}
										>
											<div className="leadership-two-details-panel-inner">
												<div className="leadership-two-details-service">{activeItem.service}</div>
												<p>{activeItem.details}</p>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.article>
						</AnimatePresence>

						<motion.button
							key={`right-${visibleItems.right.id}`}
							type="button"
							className={`leadership-two-hero-card leadership-two-hero-card-side ${visibleItems.right.themeClass}`}
							initial={{ opacity: 0.68 }}
							animate={{ opacity: 0.72 }}
							exit={{ opacity: 0.66 }}
							transition={{ duration: 0.14, ease: 'linear' }}
							onClick={() => goTo(activeIndex + 1, true, 1)}
						>
							<div className="leadership-two-card-tint" />
							<div className="leadership-two-card-content">
								<span className="leadership-two-card-tag">{visibleItems.right.tag}</span>
								<h3>{visibleItems.right.title}</h3>
							</div>
						</motion.button>
					</div>
				</div>

				<div className="leadership-two-preview-controls" aria-label="Leadership two navigation">
					<button
						type="button"
						className="leadership-two-nav"
						aria-label="Previous leadership activity"
						onClick={() => goTo(activeIndex - 1, true, -1)}
					>
						<ChevronLeft size={18} />
					</button>

					<div className="leadership-two-previews" ref={previewRailRef} onScroll={onPreviewScroll} onWheel={onPreviewWheel}>
						{leadershipActivitiesTwo.map((item, index) => {
							const isActive = index === activeIndex;

							return (
								<button
									key={item.id}
									ref={(node) => {
										previewCardRefs.current[index] = node;
									}}
									type="button"
									className={`leadership-two-preview-card ${item.themeClass} ${isActive ? 'is-active' : ''}`}
									onClick={() => goTo(index, true, index > activeIndex ? 1 : -1)}
									aria-label={`Show ${item.title}`}
								>
									<div className="leadership-two-preview-content">
										<h4>{item.title}</h4>
										<p>{item.descriptor}</p>
									</div>
								</button>
							);
						})}
					</div>

					<button
						type="button"
						className="leadership-two-nav"
						aria-label="Next leadership activity"
						onClick={() => goTo(activeIndex + 1, true, 1)}
					>
						<ChevronRight size={18} />
					</button>
				</div>

				<div className="leadership-two-dots" aria-label="Leadership activity pagination">
					{leadershipActivitiesTwo.map((item, index) => (
						<button
							key={item.id}
							type="button"
							className={`leadership-two-dot ${index === activeIndex ? 'is-active' : ''}`}
							onClick={() => goTo(index, true, index > activeIndex ? 1 : -1)}
							aria-label={`Go to activity ${index + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
