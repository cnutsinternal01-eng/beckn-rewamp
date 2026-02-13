gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollTrigger.normalizeScroll(true);


if (ScrollTrigger.isTouch !== 1) {
  // only create if it's not a touch-only device...
  let smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    normalizeScroll: {
      allowNestedScroll: [".bn-mobilenav", ".bn-header__mobile-menu", '#usecasecardsMobile', '.bn-section--home-possibilities']
    },
    smooth: 2,
    smoothTouch: 0.1,
    ignoreMobileResize: true,
  })
}




const breakpoints = {
  mobile: 576,
  tablet: 768,
  laptop: 992
};

// On DOM Ready
const onReady = () => {
  const main = document.querySelector('.bn-main');
  const sectionHome = main.querySelector('.bn-section--home-hero');
  const sectionFuture = main.querySelector('.bn-section--home-future');
  const sectionInfinite = main.querySelector('.bn-section--home-infinite');
  const bgWrap = main.querySelector('.bn-bgwrap');
  const bgBackdrop = bgWrap.querySelector('.bn-bgwrap .bn-bgwrap__backdrop');
  const streakDesktop = bgBackdrop.querySelector("#lineStreak");
  const streakMobile = bgBackdrop.querySelector("#lineStreakMobile")

  const lineStops = [43.6, 65.6];

  const networkAnim = () => {
    const bgSvg = main.querySelector("#bgSvg");

    // Group element queries for better organization
    const elements = {
      paths: bgSvg.querySelectorAll(".line"),
      shapes: bgSvg.querySelectorAll(".shape"),
      strokeLines: bgSvg.querySelectorAll(".stroke-line"),
      filterShapes: bgSvg.querySelectorAll(".filter-shape"),
    };

    const networkTl = gsap.timeline({
      id: "networkTl",
      paused: true,
      scrollTrigger: {
        trigger: sectionHome,
        start: "top center",
        end: "bottom top",
        toggleActions: "play pause resume pause",
      },
    });

    const defaults = {
      duration: gsap.utils.random(2, 6),
      repeat: 0,
      ease: "power2.inOut",
    };

    // Label for sequencing
    networkTl.addLabel("lineIntro");

    // Animate paths with consistent logic
    elements.paths.forEach((path, index) => {
      const totalLength = path.getTotalLength();
      networkTl.add(
        gsap.fromTo(
          path,
          { strokeDasharray: totalLength, strokeDashoffset: totalLength },
          { strokeDashoffset: 0, ...defaults }
        ),
        index * 0.2
      );
    });

    // Set initial strokeLine properties
    gsap.set(elements.strokeLines, {
      strokeDasharray: (i, el) => `100 ${el.getTotalLength()}`,
      strokeDashoffset: (i, el) => el.getTotalLength() + 156,
      opacity: 0,
    });

    // Animate strokeLines
    const strokeLineAnimations = [
      {
        properties: { opacity: 1, duration: 0.5 },
        labelOffset: "lineIntro+=6",
      },
      {
        properties: { strokeDashoffset: 0, opacity: 1, duration: 12 },
        labelOffset: "lineIntro+=1",
      },
    ];

    strokeLineAnimations.forEach(({ properties, labelOffset }) => {
      networkTl.to(
        elements.strokeLines,
        {
          ...properties,
          stagger: { each: 1, repeat: -1 },
        },
        labelOffset
      );
    });

    // Generic shape animation utility
    const animateShapes = (shapes, options, stagger) => {
      networkTl.add(
        gsap.to(shapes, { ...options, stagger }),
        "lineIntro"
      );
    };

    // Animate shapes and filterShapes
    animateShapes(
      elements.shapes,
      {
        rotate: (i) => (i % 2 === 0 ? -360 : 360),
        scale: gsap.utils.random(0.8, 1),
        transformOrigin: "50% 50%",
        duration: () => Math.round(gsap.utils.random(20, 60)),
        repeat: -1,
        yoyo: true,
        ease: "none",
      },
      0.2
    );

    animateShapes(
      elements.filterShapes,
      {
        scale: gsap.utils.random(0.8, 1),
        transformOrigin: "50% 50%",
        duration: () => Math.round(gsap.utils.random(3, 5)),
        repeat: -1,
  
  
        yoyo: true,
        ease: "power2.inOut",
      },
      0.2
    );
  };
  networkAnim();

  // Find PathLenght for Desktop & Mobile streaks
  function setStreakLineslength() {
    const redStreaks = bgBackdrop.querySelectorAll('.red-stroke');
    redStreaks.forEach(streak => streak.style.setProperty('--path-length', streak.getTotalLength()))
  }

  setStreakLineslength()
  // Find PathLenght for Desktop & Mobile streaks: End



  // Future: Start
  const infiniteTitle = sectionInfinite.querySelector('.bn-section__title');
  const slides = sectionFuture.querySelectorAll('.bn-slides .bn-slide');
  const slidesPagination = sectionFuture.querySelectorAll('.bn-slides .bn-slides__pagination span');

  const pagination = {
    default: 12,
    active: 36
  };

  // Intial First slide
  gsap.set(slides[0], { autoAlpha: 1 });
  gsap.set(slidesPagination[0], { height: pagination.active, backgroundColor: "var(--light-grey)" });

  // Create GSAP MatchMedia instance
  const mm = gsap.matchMedia();

  // Handle slide transitions
  let activeSlideIndex = 0;
  function handleSlideTransition(progress) {
    const targetSlideIndex = Math.round(progress * (slides.length - 1));

    // Avoid redundant updates
    if (targetSlideIndex === activeSlideIndex) return;

    // Update slides
    gsap.to(slides[activeSlideIndex], {
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.inOut",
    });

    gsap.to(slides[targetSlideIndex], {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power2.inOut",
    });

    // Update pagination
    gsap.to(slidesPagination[activeSlideIndex], {
      height: pagination.default,
      backgroundColor: "transparent",
      duration: 0.3,
      ease: "power4.out",
    });

    gsap.to(slidesPagination[targetSlideIndex], {
      height: pagination.active,
      backgroundColor: "var(--light-grey)",
      duration: 0.3,
      ease: "power4.out",
    });

    // Update active slide index
    activeSlideIndex = targetSlideIndex;
  }

  // Define responsive ScrollTrigger configurations
  mm.add(
    {
      isMobile: "(max-width: 991px)",
      isDesktop: "(min-width: 992px)"
    },
    (context) => {
      const { isMobile, isDesktop } = context.conditions;

      if(isDesktop) {
        console.log("Desktop configuration applied");
        // First, create futureScrollTrigger
        const futureScrollTrigger = ScrollTrigger.create({
          id: "futureTimeline",
          trigger: "#passingLineWrap",
          // scrub: 0.5,
          // scrub: true,
          pin: true,
          pinnedContainer: sectionFuture,
          // pinSpacer: (sectionFuture.scrollHeight + slides[0].clientHeight),
          // anticipatePin: 1,
          start: "top top",
          end: () => "+=" + (sectionFuture.scrollHeight + slides[0].clientHeight),
          onUpdate: self => handleSlideTransition(self.progress),
          // markers: true,
          // invalidateOnRefresh: true,
          // preventOverlaps: "group1"
        })

        // Then create infiniteTl timeline, using futureScrollTrigger's end value
        const infiniteTl = gsap.timeline({
          id: "infiniteTl",
          scrollTrigger: {
            trigger: infiniteTitle,
            // scrub: true,
            start: () => `+=${futureScrollTrigger.end - sectionInfinite.offsetTop - 100} +=90%`,
            end: () => `+=70%`,
            onEnter: () => bgWrap.classList.add('bn-bgwrap--inverse'),
            onLeaveBack: () => bgWrap.classList.remove('bn-bgwrap--inverse'),
            refreshPriority: 3,
            // scrub: 0.5,
            // scrub: true,
            // markers: true,
            // invalidateOnRefresh: true,
            // preventOverlaps: "group1"
          }
        });
        setStreamlineBackdropHeight();
        window.addEventListener("resize", () => {
          // ScrollTrigger.refresh();
          setStreamlineBackdropHeight()
        });
      }
      // Desktop: ENd
      // Mobile: Start
      if(isMobile) {
        console.log("Tablet configuration applied");
        // First, create futureScrollTrigger
        const futureScrollTrigger = ScrollTrigger.create({
          id: "futureTimeline",
          trigger: "#passingLineWrap",
          // scrub: 0.5,
          pin: true,
          pinnedContainer: sectionFuture,
          // anticipatePin: 1,
          start: "top top",
          end: () => "+=" + (sectionFuture.scrollHeight + slides[0].clientHeight),
          onUpdate: (self) => handleSlideTransition(self.progress),
          // markers: true, // Debugging markers for testing
          // invalidateOnRefresh: true,
        });

        // Then create infiniteTl timeline, using futureScrollTrigger's end value
        const infiniteTl = gsap.timeline({
          id: "infiniteTl",
          scrollTrigger: {
            trigger: infiniteTitle,
            start: () => `top+=${futureScrollTrigger.end - window.innerHeight} +=90%`,
            end: "+=70%",
            // scrub: true,
            onEnter: () => bgWrap.classList.add("bn-bgwrap--inverse"),
            onLeaveBack: () => bgWrap.classList.remove("bn-bgwrap--inverse"),
            refreshPriority: 3,
            // markers: true, // Debugging markers for testing
            // invalidateOnRefresh: true,
          },
        });

        setStreamlineBackdropHeight();
        window.addEventListener("resize", () => {
          setStreamlineBackdropHeight()
        });
      }
  });
          
  ScrollTrigger.refresh();

  // Adjust backdrop height dynamically
  function setStreamlineBackdropHeight() {
    bgBackdrop.style.height = sectionFuture.offsetHeight + sectionInfinite.offsetHeight + "px";
  }

  // Initialize slides and pagination
  gsap.set(slides, { autoAlpha: 0 });
  gsap.set(slides[0], { autoAlpha: 1 }); // Show the first slide by default
  gsap.set(slidesPagination, { height: pagination.default, backgroundColor: "transparent" });
  gsap.set(slidesPagination[0], { height: pagination.active, backgroundColor: "var(--light-grey)" });

  // ScrollTrigger.refresh();
  // Future: End


  // function setPossibilitiesTitleMargin() {
  //   const possibilitiesTitleMarginTop = main.querySelector('#streakSvg').clientHeight - main.querySelector('#futureStreakLine').offsetHeight;
  //   console.log(possibilitiesTitleMarginTop)
  //   if (window.innerWidth >= breakpoints.laptop) main.querySelector('#possibilities .bn-section__title').style.marginTop = possibilitiesTitleMarginTop;
  // }
  // setPossibilitiesTitleMargin();
    
  // window.addEventListener('resize', setPossibilitiesTitleMargin());
  // Future & Infinite: End

    const marquees = document.querySelectorAll(".bn-industries__marquee");
    const sectionPossibilities = main.querySelector('.bn-section--home-possibilities');

    mm.add(
      {
        isMobile: "(max-width: 699px)",
        isDesktop: "(min-width: 700px)"
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions;
        // console.log("Tablet configuration applied ovther animation");

        marquees.forEach((marquee) => {
          const marqueeItems = marquee.querySelectorAll(".bn-industry");

          const reversed =
            marquee.getAttribute("data-reversed") === "true" ? true : false;

          const loop = horizontalLoop(marqueeItems, {
            repeat: -1,
            paddingRight: isDesktop ? 40 : 20,
            speed: isDesktop ? 0.5 : 0.25,
            // paused: true,
            reversed
          });

          marqueeItems.forEach(function (item) {
            item.addEventListener("mouseenter", () => loop.pause());
            item.addEventListener("mouseleave", () => reversed ? loop.reverse() : loop.play());
          });

          // ScrollTrigger.create({
          //   id: "horizontalMarquee",
          //   trigger: sectionInfinite,
          //   start: "top bottom", //when the top of the marquee hits the bottom of the viewport
          //   endTrigger: sectionPossibilities,
          //   end: "bottom bottom", //when the bottom of the marquee hits the top of the viewport
          //   markers: true,
          //   refreshPriority: 3,
          //   onToggle: (self) => {
          //     self.isActive ? reversed ? loop.reverse() : loop.play() : loop.pause();
          //   }
          // });
        });
      }
    );

  ScrollTrigger.refresh();


    /*
  This helper function makes a group of elements animate along the x-axis in a seamless, responsive loop.
  
  Features:
   - Uses xPercent so that even if the widths change (like if the window gets resized), it should still work in most cases.
   - When each item animates to the left or right enough, it will loop back to the other side
   - Optionally pass in a config object with values like "speed" (default: 1, which travels at roughly 100 pixels per second), paused (boolean),  repeat, reversed, and paddingRight.
   - The returned timeline will have the following methods added to it:
     - next() - animates to the next element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
     - previous() - animates to the previous element using a timeline.tweenTo() which it returns. You can pass in a vars object to control duration, easing, etc.
     - toIndex() - pass in a zero-based index value of the element that it should animate to, and optionally pass in a vars object to control duration, easing, etc. Always goes in the shortest direction
     - current() - returns the current index (if an animation is in-progress, it reflects the final index)
     - times - an Array of the times on the timeline where each element hits the "starting" spot. There's also a label added accordingly, so "label1" is when the 2nd element reaches the start.
   */
    function horizontalLoop(items, config) {
      items = gsap.utils.toArray(items);
      config = config || {};
      let tl = gsap.timeline({
        repeat: config.repeat,
        paused: config.paused,
        defaults: { ease: "none" },
        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
      }),
        length = items.length,
        startX = items[0].offsetLeft,
        times = [],
        widths = [],
        xPercents = [],
        curIndex = 0,
        pixelsPerSecond = (config.speed || 1) * 100,
        snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), // some browsers shift by a pixel to accommodate flex layouts, so for example if width is 20% the first element's width might be 242px, and the next 243px, alternating back and forth. So we snap to 5 percentage points to make things look more natural
        totalWidth,
        curX,
        distanceToStart,
        distanceToLoop,
        item,
        i;
      gsap.set(items, {
        // convert "x" to "xPercent" to make things responsive, and populate the widths/xPercents Arrays to make lookups faster.
        xPercent: (i, el) => {
          let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
          xPercents[i] = snap(
            (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
            gsap.getProperty(el, "xPercent")
          );
          return xPercents[i];
        }
      });
      gsap.set(items, { x: 0 });
      totalWidth =
        items[length - 1].offsetLeft +
        (xPercents[length - 1] / 100) * widths[length - 1] -
        startX +
        items[length - 1].offsetWidth *
        gsap.getProperty(items[length - 1], "scaleX") +
        (parseFloat(config.paddingRight) || 0);
      for (i = 0; i < length; i++) {
        item = items[i];
        curX = (xPercents[i] / 100) * widths[i];
        distanceToStart = item.offsetLeft + curX - startX;
        distanceToLoop =
          distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
        tl.to(
          item,
          {
            xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
            duration: distanceToLoop / pixelsPerSecond
          },
          0
        )
          .fromTo(
            item,
            {
              xPercent: snap(
                ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
              )
            },
            {
              xPercent: xPercents[i],
              duration:
                (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
              immediateRender: false
            },
            distanceToLoop / pixelsPerSecond
          )
          .add("label" + i, distanceToStart / pixelsPerSecond);
        times[i] = distanceToStart / pixelsPerSecond;
      }
      function toIndex(index, vars) {
        vars = vars || {};
        Math.abs(index - curIndex) > length / 2 &&
          (index += index > curIndex ? -length : length); // always go in the shortest direction
        let newIndex = gsap.utils.wrap(0, length, index),
          time = times[newIndex];
        if (time > tl.time() !== index > curIndex) {
          // if we're wrapping the timeline's playhead, make the proper adjustments
          vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
          time += tl.duration() * (index > curIndex ? 1 : -1);
        }
        curIndex = newIndex;
        vars.overwrite = true;
        return tl.tweenTo(time, vars);
      }
      tl.next = (vars) => toIndex(curIndex + 1, vars);
      tl.previous = (vars) => toIndex(curIndex - 1, vars);
      tl.current = () => curIndex;
      tl.toIndex = (index, vars) => toIndex(index, vars);
      tl.times = times;
      tl.progress(1, true).progress(0, true); // pre-render for performance
      if (config.reversed) {
        tl.vars.onReverseComplete();
        tl.reverse();
      }
      return tl;
    }

  // Initialize vertical marquees for left and right columns
  const additionalY = { val: 0 };
  let additionalYAnim;
  let offset = 0;
  const stacks = gsap.utils.toArray(".bn-usecasecards__stack");

  stacks.forEach((stack, i) => {
    const cards = stack.childNodes;

    // DUPLICATE IMAGES FOR LOOP
    cards.forEach((card) => {
      var clone = card.cloneNode(true);
      stack.appendChild(clone);
    });

    // SET ANIMATION
    cards.forEach((item) => {
      let columnHeight = item.parentElement.clientHeight;
      let direction = i % 2 !== 0 ? "+=" : "-="; // Change direction for odd columns

      gsap.to(item, {
        y: direction + Number(columnHeight / 2),
        duration: 40,
        repeat: -1,
        ease: "none",
        modifiers: {
          y: gsap.utils.unitize((y) => {
            if (direction == "+=") {
              offset += additionalY.val;
              y = (parseFloat(y) - offset) % (columnHeight * 0.5);
            } else {
              offset += additionalY.val;
              y = (parseFloat(y) + offset) % -Number(columnHeight * 0.5);
            }

            return y;
          })
        }
      })
    });
  });

  // Possibilities: End

  // Seciton - Community: Start
  const communityAnim = () => {
    const sectionCommunity = main.querySelector('.bn-section--home-community'),
      commnunityCards = sectionCommunity.querySelectorAll(".bn-communitycards__item");

    mm.add(
      {
        isMobile: "(max-width: 1079px)",
        isDesktop: "(min-width: 1080px)"
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions;

        if(isDesktop) {
          const communityTl = gsap.timeline({
            id: "communityTimeline",
            scrollTrigger: {
              trigger: sectionCommunity,
              scrub: 1,
              start: "top center",
              end: "bottom center",
              // markers: true,
              onEnter: () => {
                gsap
                  .from(commnunityCards, {
                    opacity: 0,
                    y: () => `+=${commnunityCards.length * 25}`,
                    duration: 1,
                    stagger: 0.2,
                    ease: "expo",
                  }, "-=0.8");
              }
            }
          });
        }
      }
    )

  }

  


  const visualStickyContainer = document.querySelector('.bn-section--home-visual-design .bn-sticycolumn');
  // Seciton - Community: End
  function initializeScrollTrigger() {
    mm.add(
      {
        isMobile: "(max-width: 1079px)",
        isDesktop: "(min-width: 1080px)"
      },
      (context) => {
        const { isMobile, isDesktop } = context.conditions;

        if (isDesktop) {
          ScrollTrigger.create({
            trigger: '.bn-section--home-visual-design .bn-section__title',
            pin: true,
            start: "top",
            end: "+=75%",
            // markers: true,
            pinSpacing: "margin",
            onEnter: (self) => {
              gsap.to(self.trigger, { marginTop: "150px", duration: 0.3 });
            },
            onLeaveBack: (self) => {
              gsap.to(self.trigger, { marginTop: "0px", duration: 0.3 });
            },
          });

        }
      }
    )
  }

  // Call the function on load
  initializeScrollTrigger();
  communityAnim();

  // Reinitialize on window resize
  // window.addEventListener('resize', () => {
  //   ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Kill existing triggers
  //   initializeScrollTrigger();
  // });
  
  // ScrollTrigger.refresh();


  // Section - Newspanel: Start
  const newsPanelThumbsSwiper = new Swiper('#newsChannelBrandsThumbs', {
    loop: true,
    loopedSlides: 6, 
    centeredSlides: true,
    spaceBetween: 40,
    slideToClickedSlide: true,
    slidesPerView: "auto",
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    breakpoints: {
      992: {
        spaceBetween: 64,
      },
      1200: {
        spaceBetween: 84,
      }
    }
  });

  const newsPanelContentSwiper = new Swiper('#newsChannelsTop', {
    // Optional parameters
    slidesPerView: 1,
    spaceBetween: 40,
    loop: true,
    loopedSlides: 6,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    }, 
    autoplay: {
      delay: 3000
    }
  });

  newsPanelContentSwiper.controller.control = newsPanelThumbsSwiper;
  newsPanelThumbsSwiper.controller.control = newsPanelContentSwiper;  
  // Section - Newspanel: End

  let usecasecardsmobile;
  

  const breakpointChecker = function () {
    // if larger viewport and multi-row layout needed
    if (window.innerWidth >= breakpoints.laptop) {
      // clean up old instances and inline styles when available
      if (usecasecardsmobile !== undefined) usecasecardsmobile.destroy(true, true);
      // or/and do nothing
      return;
      // else if a small viewport and single column layout needed
    } else if (window.innerWidth <= breakpoints.laptop) {
      // fire small viewport version of swiper
      return enableUsecaseCardsMobileSwiper();
    }
  };

  const enableUsecaseCardsMobileSwiper = ()  => {
    usecasecardsmobile = new Swiper('#usecasecardsMobile', {
      // Optional parameters
      slidesPerView: 1.6,
      spaceBetween: 40,
      freeMode: true,
      centeredSlides: true,
      loop: true,
      autoplay: {
        delay: 3000
      },
      mousewheel: {
        releaseOnEdges: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 40,
        }
      }
    });
  }

  breakpointChecker();
  window.addEventListener("resize", breakpointChecker)

}

// After the dom has been loaded.
document.addEventListener("DOMContentLoaded", onReady);