document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".npc-container");
    const npcs = document.querySelectorAll(".npc");

    console.log("Container:", container);
    console.log("NPCs gefunden:", npcs.length);

    if (!container) {
        console.error("FEHLER: .npc-container wurde nicht gefunden!");
        return;
    }

    if (npcs.length === 0) {
        console.error("FEHLER: Keine .npc Elemente gefunden!");
        return;
    }

    npcs.forEach((npc, index) => {

        const img = npc.querySelector("img");
        const link = npc.dataset.link;

        // Klick auf Tier
        if (img) {
            img.addEventListener("click", () => {
                if (link) {
                    window.location.href = link;
                }
            });
        }

        // Startposition
        let x =
            Math.random() *
            Math.max(
                0,
                container.clientWidth - npc.offsetWidth
            );

        // zufällige Richtung
        let direction = Math.random() > 0.5 ? 1 : -1;

        // unterschiedliche Geschwindigkeit
        let speed = 1 + Math.random() * 1.5;

        // Startposition setzen
        npc.style.left = `${x}px`;
        npc.style.bottom = "20px";


        function move() {

            x += speed * direction;

            // linker Rand
            if (x <= 0) {
                x = 0;
                direction = 1;
            }

            // rechter Rand
            if (
                x + npc.offsetWidth >=
                container.clientWidth
            ) {
                x =
                    container.clientWidth -
                    npc.offsetWidth;

                direction = -1;
            }


            // einfache Hüpfbewegung
            const jump =
                Math.abs(
                    Math.sin(x / 20)
                ) * 15;


            npc.style.left = `${x}px`;

            npc.style.bottom =
                `${20 + jump}px`;


            requestAnimationFrame(move);
        }


        // leicht versetzter Start
        setTimeout(() => {
            move();
        }, index * 100);

    });

});
