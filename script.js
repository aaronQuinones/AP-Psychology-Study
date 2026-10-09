// =========================
// AP PSYCHOLOGY STUDY HUB
// Brain Explorer
// =========================

console.log("AP Psychology Study Hub loaded!");


// =========================
// BRAIN DATA
// =========================

const brainData = {

    frontal: {
        name: "Frontal Lobe",
        shortName: "Frontal",
        function:
            "Planning, decision-making, personality, impulse control, and voluntary movement.",
        psychology:
            "The frontal lobe contains areas involved in executive functions such as planning, judgment, decision-making, and controlling voluntary movement.",
        remember:
            "Think: FRONTAL = FUTURE planning."
    },

    parietal: {
        name: "Parietal Lobe",
        shortName: "Parietal",
        function:
            "Processes touch and helps with spatial awareness and body position.",
        psychology:
            "The parietal lobe processes somatosensory information such as touch, pressure, pain, and temperature.",
        remember:
            "Think: PARIETAL = PHYSICAL sensation."
    },

    temporal: {
        name: "Temporal Lobe",
        shortName: "Temporal",
        function:
            "Important for hearing, language, memory, and recognizing information.",
        psychology:
            "The temporal lobe processes auditory information and contains areas important for language and memory.",
        remember:
            "Think: TEMPORAL = TALKING and TUNES."
    },

    occipital: {
        name: "Occipital Lobe",
        shortName: "Occipital",
        function:
            "Processes and interprets visual information.",
        psychology:
            "The occipital lobe contains the primary visual cortex and plays a major role in processing information from the eyes.",
        remember:
            "Think: OCCIPITAL = OPTICAL."
    },

    cerebellum: {
        name: "Cerebellum",
        shortName: "Cerebellum",
        function:
            "Helps control balance, coordination, precision, and motor learning.",
        psychology:
            "The cerebellum coordinates voluntary movement and contributes to balance and motor learning.",
        remember:
            "Think: CEREBELLUM = COORDINATION."
    },

    brainstem: {
        name: "Brainstem",
        shortName: "Brainstem",
        function:
            "Controls many automatic survival functions, including breathing and heart rate.",
        psychology:
            "The brainstem connects the brain with the spinal cord and helps regulate basic automatic functions necessary for survival.",
        remember:
            "Think: BRAINSTEM = BASIC survival."
    },

    thalamus: {
        name: "Thalamus",
        shortName: "Thalamus",
        function:
            "Relays most sensory information to the appropriate areas of the brain.",
        psychology:
            "The thalamus acts as an important relay station for sensory information traveling to the cerebral cortex.",
        remember:
            "Think: THALAMUS = TRAFFIC controller."
    },

    hypothalamus: {
        name: "Hypothalamus",
        shortName: "Hypothalamus",
        function:
            "Helps regulate hunger, thirst, temperature, hormones, and other aspects of homeostasis.",
        psychology:
            "The hypothalamus helps maintain homeostasis and connects the nervous system with the endocrine system through its relationship with the pituitary gland.",
        remember:
            "Think: HYPOTHALAMUS = HOMEostasis."
    }

};


// =========================
// BRAIN ORDER
// =========================

const brainParts = [
    "frontal",
    "parietal",
    "temporal",
    "occipital",
    "cerebellum",
    "brainstem",
    "thalamus",
    "hypothalamus"
];

let currentBrainIndex = 0;


// =========================
// DOM ELEMENTS
// =========================

const brainSlider = document.getElementById("brain-slider");
const brainPrev = document.getElementById("brain-prev");
const brainNext = document.getElementById("brain-next");

const brainName = document.getElementById("brain-name");
const brainFunction = document.getElementById("brain-function");
const brainPsychology = document.getElementById("brain-psychology");
const brainRemember = document.getElementById("brain-remember");

const brainCounter = document.getElementById("brain-counter");
const brainNumber = document.getElementById("brain-number");
const brainCurrentLabel = document.getElementById("brain-current-label");

const brainRegions = document.querySelectorAll(".brain-region");


// =========================
// SELECT BRAIN PART
// =========================

function selectBrainPart(part) {

    const index = brainParts.indexOf(part);

    if (index === -1) {
        return;
    }

    currentBrainIndex = index;

    updateBrain();
}


// =========================
// UPDATE BRAIN
// =========================

function updateBrain() {

    const part = brainParts[currentBrainIndex];
    const data = brainData[part];

    if (!data) {
        return;
    }


    // Update information panel

    brainName.textContent = data.name;

    brainFunction.textContent = data.function;

    brainPsychology.textContent = data.psychology;

    brainRemember.textContent = data.remember;


    // Update counter

    const number = currentBrainIndex + 1;

    brainCounter.textContent = `${number} / ${brainParts.length}`;

    brainNumber.textContent =
        String(number).padStart(2, "0");

    brainCurrentLabel.textContent = data.name;


    // Update slider

    brainSlider.value = currentBrainIndex;


    // Remove previous selection

    brainRegions.forEach(region => {

        region.classList.remove("selected");

        region.setAttribute("aria-pressed", "false");

    });


    // Select current region

    const selectedRegion =
        document.getElementById(part);

    if (selectedRegion) {

        selectedRegion.classList.add("selected");

        selectedRegion.setAttribute("aria-pressed", "true");

    }


    // Update button states

    brainPrev.disabled = currentBrainIndex === 0;

    brainNext.disabled =
        currentBrainIndex === brainParts.length - 1;


    // Add subtle visual rotation

    const brain3D =
        document.querySelector(".brain-3d");

    if (brain3D) {

        const rotation =
            -8 + (currentBrainIndex * 2.3);

        brain3D.style.setProperty(
            "--brain-rotation",
            `${rotation}deg`
        );

    }

}


// =========================
// BRAIN REGION CLICK
// =========================

brainRegions.forEach(region => {

    region.addEventListener("click", () => {

        const part =
            region.dataset.brainPart;

        selectBrainPart(part);

    });


    // Keyboard accessibility

    region.addEventListener("keydown", event => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            const part =
                region.dataset.brainPart;

            selectBrainPart(part);

        }

    });

});


// =========================
// SLIDER
// =========================

brainSlider.addEventListener("input", () => {

    const value =
        Number(brainSlider.value);

    if (
        Number.isInteger(value) &&
        value >= 0 &&
        value < brainParts.length
    ) {

        currentBrainIndex = value;

        updateBrain();

    }

});


// =========================
// PREVIOUS BUTTON
// =========================

brainPrev.addEventListener("click", () => {

    if (currentBrainIndex > 0) {

        currentBrainIndex--;

        updateBrain();

    }

});


// =========================
// NEXT BUTTON
// =========================

brainNext.addEventListener("click", () => {

    if (
        currentBrainIndex <
        brainParts.length - 1
    ) {

        currentBrainIndex++;

        updateBrain();

    }

});


// =========================
// KEYBOARD NAVIGATION
// =========================

document.addEventListener("keydown", event => {

    // Don't hijack keyboard controls while typing

    if (
        event.target.tagName === "INPUT" ||
        event.target.tagName === "TEXTAREA"
    ) {
        return;
    }


    if (event.key === "ArrowLeft") {

        if (currentBrainIndex > 0) {

            currentBrainIndex--;

            updateBrain();

        }

    }


    if (event.key === "ArrowRight") {

        if (
            currentBrainIndex <
            brainParts.length - 1
        ) {

            currentBrainIndex++;

            updateBrain();

        }

    }

});


// =========================
// INITIALIZE
// =========================

updateBrain();


/* Unit 0 notes functionality */
document.addEventListener("DOMContentLoaded", () => {
    const unitCard = document.getElementById("unit-0-card");
    const notesSection = document.getElementById("unit-0-notes");
    const notesInput = document.getElementById("unit-0-notes-input");
    const saveButton = document.getElementById("save-unit-0-notes");
    const saveStatus = document.getElementById("unit-0-save-status");
    const backButton = document.getElementById("back-to-units");

    if (
        !unitCard ||
        !notesSection ||
        !notesInput ||
        !saveButton ||
        !saveStatus ||
        !backButton
    ) {
        console.error("Unit 0 workspace elements were not found.");
        return;
    }

    const storageKey = "ap-psychology-unit-0-notes";

    // Load saved notes from this browser.
    try {
        notesInput.value = localStorage.getItem(storageKey) || "";
    } catch (error) {
        console.error("Could not load Unit 0 notes:", error);
    }

    // Open the Unit 0 workspace.
    function openWorkspace() {
        notesSection.hidden = false;
        document.body.classList.add("unit-workspace-active");
        unitCard.setAttribute("aria-expanded", "true");
        notesInput.focus();
    }

    // Return to the unit cards.
    function closeWorkspace() {
        notesSection.hidden = true;
        document.body.classList.remove("unit-workspace-active");
        unitCard.setAttribute("aria-expanded", "false");
        unitCard.focus();
    }

    unitCard.addEventListener("click", openWorkspace);

    unitCard.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openWorkspace();
        }
    });

    backButton.addEventListener("click", closeWorkspace);

    // Save notes in this browser.
    saveButton.addEventListener("click", () => {
        try {
            localStorage.setItem(storageKey, notesInput.value);
            saveStatus.textContent = "Notes saved!";
        } catch (error) {
            saveStatus.textContent =
                "Could not save notes in this browser.";
            console.error("Could not save Unit 0 notes:", error);
        }
    });
});
