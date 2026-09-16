// =====================================================
// GALERIE / LIGHTBOX
// =====================================================

const galleryImages = document.querySelectorAll(".gallery img");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const tagsContainer = document.getElementById("animal-tags");
const showTagsButton = document.getElementById("show-tags");

let currentImage = 0;
let tagsVisible = false;


// Galerie nur starten, wenn alle benötigten Elemente existieren
if (
    galleryImages.length > 0 &&
    lightbox &&
    lightboxImg &&
    closeBtn &&
    prevBtn &&
    nextBtn &&
    tagsContainer &&
    showTagsButton
) {

    // -------------------------
    // BILD ÖFFNEN
    // -------------------------

    galleryImages.forEach((img, index) => {

        img.addEventListener("click", () => {

            currentImage = index;

            openLightbox();

        });

    });


    function openLightbox() {

        lightbox.classList.add("active");

        document.body.style.overflow = "hidden";

        showCurrentImage();

    }


    // -------------------------
    // AKTUELLES BILD
    // -------------------------

    function showCurrentImage() {

        const image = galleryImages[currentImage];

        lightboxImg.src = image.src;

        tagsVisible = false;

        tagsContainer.classList.remove("visible");

        loadTags(image);

    }


    // -------------------------
    // TIER-TAGS LADEN
    // -------------------------

    function loadTags(image) {

        tagsContainer.innerHTML = "";

        const tagData = image.dataset.tags;


        if (!tagData) {

            showTagsButton.style.display = "none";

            return;

        }


        showTagsButton.style.display = "flex";


        try {

            const tags = JSON.parse(tagData);


            tags.forEach((tag) => {

                const link = document.createElement("a");

                link.classList.add("animal-tag");

                link.textContent = tag.name;

                link.href = tag.link;

                link.style.left = tag.x + "%";

                link.style.top = tag.y + "%";


                tagsContainer.appendChild(link);

            });


        } catch (error) {

            console.error(
                "Fehler bei den Tier-Tags:",
                error
            );

        }

    }


    // -------------------------
    // TAGS EIN-/AUSBLENDEN
    // -------------------------

    showTagsButton.addEventListener("click", (event) => {

        event.stopPropagation();

        tagsVisible = !tagsVisible;


        if (tagsVisible) {

            tagsContainer.classList.add("visible");

        } else {

            tagsContainer.classList.remove("visible");

        }

    });


    // -------------------------
    // NÄCHSTES BILD
    // -------------------------

    nextBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        currentImage++;


        if (currentImage >= galleryImages.length) {

            currentImage = 0;

        }


        showCurrentImage();

    });


    // -------------------------
    // VORHERIGES BILD
    // -------------------------

    prevBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        currentImage--;


        if (currentImage < 0) {

            currentImage =
                galleryImages.length - 1;

        }


        showCurrentImage();

    });


    // -------------------------
    // LIGHTBOX SCHLIESSEN
    // -------------------------

    function closeLightbox() {

        lightbox.classList.remove("active");

        document.body.style.overflow = "";

        tagsContainer.classList.remove("visible");

        tagsVisible = false;

    }


    closeBtn.addEventListener("click", (event) => {

        event.stopPropagation();

        closeLightbox();

    });


    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    // -------------------------
    // TASTATUR
    // -------------------------

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("active")) {

            return;

        }


        if (event.key === "Escape") {

            closeLightbox();

        }


        if (event.key === "ArrowRight") {

            nextBtn.click();

        }


        if (event.key === "ArrowLeft") {

            prevBtn.click();

        }

    });

}



// =====================================================
// NPC / TIERE
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".npc-container");
    const npcs = document.querySelectorAll(".npc");

    // Keine NPCs auf dieser Seite
    if (!container || npcs.length === 0) {
        return;
    }

    npcs.forEach((npc, index) => {

        const img = npc.querySelector("img");
        const link = npc.dataset.link;

        // -------------------------
        // KLICK AUF TIER
        // -------------------------

        if (img) {
            img.addEventListener("click", () => {
                if (link) {
                    window.location.href = link;
                }
            });
        }

        // -------------------------
        // STARTPOSITION
        // -------------------------

        let x =
            Math.random() *
            Math.max(
                0,
                container.clientWidth - npc.offsetWidth
            );

        // Zufällige Richtung
        let direction = Math.random() > 0.5 ? 1 : -1;

        // Langsame Geschwindigkeit
        let speed =
            0.4 +
            Math.random() * 0.6;

        // Sprunghöhe
        let jumpAmplitude =
            10 +
            Math.random() * 10;

        // Unterschiedliche Hüpfbewegung
        let jumpFrequency =
            18 +
            Math.random() * 10;

        // Zufällige Pause
        let isPaused = false;

        // Startposition
        npc.style.left = `${x}px`;
        npc.style.bottom = "20px";


        // -------------------------
        // ZUFÄLLIGE PAUSE
        // -------------------------

        function randomPause() {

            if (Math.random() < 0.0015) {

                isPaused = true;

                setTimeout(() => {
                    isPaused = false;
                }, 1000 + Math.random() * 1500);
            }
        }


        // -------------------------
        // ANIMATION
        // -------------------------

        function move() {

            const hovering = npc.matches(":hover");
            
            if (hovering) {
                npc.style.bottom = "20px";
            }

            // Nur bewegen, wenn Maus NICHT über dem Tier ist
            // und das Tier keine zufällige Pause macht
            if (!hovering && !isPaused) {

                x += speed * direction;


                // Linker Rand
                if (x <= 0) {
                    x = 0;
                    direction = 1;
                }


                // Rechter Rand
                if (
                    x + npc.offsetWidth >=
                    container.clientWidth
                ) {
                    x =
                        container.clientWidth -
                        npc.offsetWidth;

                    direction = -1;
                }


                // Hüpfbewegung
                const jump =
                    Math.abs(
                        Math.sin(
                            x / jumpFrequency
                        )
                    ) *
                    jumpAmplitude;


                npc.style.left = `${x}px`;

                npc.style.bottom =
                    `${20 + jump}px`;


                randomPause();
            }

            // Animation weiterlaufen lassen
            requestAnimationFrame(move);
        }


        // Tiere leicht zeitversetzt starten
        setTimeout(() => {
            move();
        }, index * 150);

    });

});

// =====================================================
// JOURNEY KARUSSELL
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const carousel = document.getElementById("journey-carousel");
    const sections = document.querySelectorAll(".journey-section");

    const upButton = document.getElementById("journeyUp");
    const downButton = document.getElementById("journeyDown");

    const hud = document.getElementById("journey-hud");

    // Journey-Karussell existiert auf dieser Seite nicht
    if (
        !carousel ||
        sections.length === 0 ||
        !upButton ||
        !downButton ||
        !hud
    ) {
        return;
    }

    let currentSection = 0;


    // -------------------------
    // ABSCHNITT ANZEIGEN
    // -------------------------

    function showSection(index) {

        currentSection = index;

        // Jede Section ist 80vh hoch
        carousel.style.transform =
            `translateY(-${currentSection * 80}vh)`;

        // active-Klasse aktualisieren
        sections.forEach((section, i) => {

            if (i === currentSection) {
                section.classList.add("active");
            } else {
                section.classList.remove("active");
            }

        });

        // HUD aktualisieren
        hud.textContent =
            `${currentSection + 1} / ${sections.length}`;
    }


    // -------------------------
    // NACH UNTEN
    // -------------------------

    downButton.addEventListener("click", () => {

        currentSection++;

        // Nach letzter Section wieder zur ersten
        if (currentSection >= sections.length) {
            currentSection = 0;
        }

        showSection(currentSection);

    });


    // -------------------------
    // NACH OBEN
    // -------------------------

    upButton.addEventListener("click", () => {

        currentSection--;

        // Vor erster Section zur letzten
        if (currentSection < 0) {
            currentSection = sections.length - 1;
        }

        showSection(currentSection);

    });


    // -------------------------
    // TASTATUR ↑ ↓
    // -------------------------

    document.addEventListener("keydown", (event) => {

        if (event.key === "ArrowDown") {

            currentSection++;

            if (currentSection >= sections.length) {
                currentSection = 0;
            }

            showSection(currentSection);
        }


        if (event.key === "ArrowUp") {

            currentSection--;

            if (currentSection < 0) {
                currentSection = sections.length - 1;
            }

            showSection(currentSection);
        }

    });

    // -------------------------
// MAUSRAD / SCROLLEN
// -------------------------

let scrollLocked = false;

window.addEventListener(
    "wheel",
    (event) => {

        // Nur reagieren, wenn nicht gerade gewechselt wird
        if (scrollLocked) {
            return;
        }

        // Nach unten scrollen
        if (event.deltaY > 0) {

            // Nur wechseln, wenn es noch einen
            // nächsten Abschnitt gibt
            if (currentSection < sections.length - 1) {

                currentSection++;

                showSection(currentSection);

                scrollLocked = true;
            }
        }

        // Nach oben scrollen
        else if (event.deltaY < 0) {

            // Nur wechseln, wenn es noch einen
            // vorherigen Abschnitt gibt
            if (currentSection > 0) {

                currentSection--;

                showSection(currentSection);

                scrollLocked = true;
            }
        }


        // Kurz warten, damit ein Scroll
        // nicht mehrere Sections überspringt
        if (scrollLocked) {

            setTimeout(() => {
                scrollLocked = false;
            }, 900);

        }

    },
    { passive: true }
);

    // Startzustand
    showSection(0);

});

// =====================================================
// JOURNEY LIGHTBOX
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    const journeyImages =
        document.querySelectorAll(".journey-card img");

    const journeyLightbox =
        document.getElementById("journey-lightbox");

    const journeyLightboxImg =
        document.getElementById("journey-lightbox-img");

    const journeyCaption =
        document.getElementById("journey-lightbox-caption");

    const journeyClose =
        document.querySelector(".journey-close");

    const journeyPrev =
        document.querySelector(".journey-lightbox-prev");

    const journeyNext =
        document.querySelector(".journey-lightbox-next");


    // Falls wir nicht auf der Journey-Seite sind
    if (
        journeyImages.length === 0 ||
        !journeyLightbox ||
        !journeyLightboxImg ||
        !journeyCaption ||
        !journeyClose ||
        !journeyPrev ||
        !journeyNext
    ) {
        return;
    }


    let currentJourneyImage = 0;


    // =========================
    // BILD ANZEIGEN
    // =========================

    function showJourneyImage() {

        const image =
            journeyImages[currentJourneyImage];

        // Bild übernehmen
        journeyLightboxImg.src = image.src;

        // Beschreibung aus data-caption holen
        const caption = image.dataset.caption;

        if (caption) {

            journeyCaption.textContent = caption;
            journeyCaption.style.display = "block";

        } else {

            // Keine Beschreibung vorhanden
            journeyCaption.textContent = "";
            journeyCaption.style.display = "none";

        }
    }


    // =========================
    // LIGHTBOX ÖFFNEN
    // =========================

    journeyImages.forEach((image, index) => {

        image.addEventListener("click", () => {

            currentJourneyImage = index;

            showJourneyImage();

            journeyLightbox.style.display = "flex";

            // normales Scrollen sperren
            document.body.style.overflow = "hidden";

        });

    });


    // =========================
    // NÄCHSTES BILD
    // =========================

    function nextJourneyImage() {

        currentJourneyImage++;

        if (
            currentJourneyImage >=
            journeyImages.length
        ) {
            currentJourneyImage = 0;
        }

        showJourneyImage();
    }


    // =========================
    // VORHERIGES BILD
    // =========================

    function prevJourneyImage() {

        currentJourneyImage--;

        if (currentJourneyImage < 0) {

            currentJourneyImage =
                journeyImages.length - 1;

        }

        showJourneyImage();
    }


    // =========================
    // BUTTON >
    // =========================

    journeyNext.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            nextJourneyImage();

        }
    );


    // =========================
    // BUTTON <
    // =========================

    journeyPrev.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            prevJourneyImage();

        }
    );


    // =========================
    // LIGHTBOX SCHLIESSEN
    // =========================

    function closeJourneyLightbox() {

        journeyLightbox.style.display = "none";

        document.body.style.overflow = "";

    }


    journeyClose.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeJourneyLightbox();

        }
    );


    // Klick auf dunklen Hintergrund
    journeyLightbox.addEventListener(
        "click",
        (event) => {

            if (event.target === journeyLightbox) {

                closeJourneyLightbox();

            }

        }
    );


    // =========================
    // TASTATUR
    // =========================

    document.addEventListener(
        "keydown",
        (event) => {

            // Nur reagieren, wenn
            // Journey-Lightbox geöffnet ist
            if (
                journeyLightbox.style.display !== "flex"
            ) {
                return;
            }


            // Pfeiltaste rechts
            if (event.key === "ArrowRight") {

                event.preventDefault();

                nextJourneyImage();

            }


            // Pfeiltaste links
            if (event.key === "ArrowLeft") {

                event.preventDefault();

                prevJourneyImage();

            }


            // ESC schließt Lightbox
            if (event.key === "Escape") {

                closeJourneyLightbox();

            }

        }
    );

});

