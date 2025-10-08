const npcs = document.querySelectorAll('.npc');
const container = document.querySelector('.npc-container');

npcs.forEach((npc) => {
    const img = npc.querySelector('img');
    const link = npc.dataset.link; // Zielseite aus Attribut

    // Klick auf Bild → gehe zur Zielseite
    img.addEventListener('click', () => {
        if (link) {
            window.location.href = link;
        }
    });

    // Zufällige Startparameter
    let posX = Math.random() * (container.offsetWidth - npc.offsetWidth);
    let direction = Math.random() > 0.5 ? 1 : -1;
    let speed = 0.8 + Math.random() * 0.6;
    let jumpAmplitude = 8 + Math.random() * 6;
    let jumpFrequency = 12 + Math.random() * 5;
    let isPaused = false;

    function randomPause() {
        if (Math.random() < 0.008) {
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
            }, 1000 + Math.random() * 2000);
        }
    }

    function animate() {
        const hovering = npc.matches(':hover');

        if (!isPaused && !hovering) {
            posX += speed * direction;

            // Richtungswechsel an den Rändern
            if (posX <= 0) direction = 1;
            if (posX + npc.offsetWidth >= container.offsetWidth) direction = -1;

            // kleine, scharfe Hüpfbewegung
            const jump = Math.abs(Math.sin(posX / jumpFrequency)) ** 1.5 * jumpAmplitude;
            npc.style.bottom = `${jump}px`;
            npc.style.left = `${posX}px`;

            randomPause();
        } else {
            npc.style.bottom = "0px"; // am Boden bleiben
        }

        requestAnimationFrame(animate);
    }

    animate();
});
