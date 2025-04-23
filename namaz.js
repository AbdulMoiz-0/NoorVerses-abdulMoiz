const namazTimes = {
    fajr: { completed: false },
    zuhur: { completed: false },
    asr: { completed: false },
    maghrib: { completed: false },
    isha: { completed: false },
};

function updateNamazStatus() {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    Object.keys(namazTimes).forEach((namaz) => {
        const namazElement = document.getElementById(namaz).querySelector(".circle");
        if (currentTime >= namazTimes[namaz].time && !namazTimes[namaz].completed) {
            namazElement.classList.remove("disabled");
            namazElement.classList.add("active");
        } else if (!namazTimes[namaz].completed) {
            namazElement.classList.add("disabled");
            namazElement.classList.remove("active");
        }
    });
}

function markNamazCompleted(namaz) {
    if (!namazTimes[namaz].completed) {
        namazTimes[namaz].completed = true;
        document.getElementById(namaz).querySelector(".circle").classList.add("active");
        checkAllNamazCompleted();
    }
}

function checkAllNamazCompleted() {
    const allCompleted = Object.values(namazTimes).every((namaz) => namaz.completed);
    if (allCompleted) {
        const streak = parseInt(localStorage.getItem("streak") || "0", 10) + 1;
        localStorage.setItem("streak", streak.toString());
        document.getElementById("statusMessage").textContent = "✅ All Namaz completed! Streak increased!";
    }
}

function resetNamazStatus() {
    Object.keys(namazTimes).forEach((namaz) => {
        namazTimes[namaz].completed = false;
        document.getElementById(namaz).querySelector(".circle").classList.remove("active");
    });
    document.getElementById("statusMessage").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
    Object.keys(namazTimes).forEach((namaz) => {
        document.getElementById(namaz).querySelector(".circle").addEventListener("click", () => {
            markNamazCompleted(namaz);
        });
    });

    // Reset at midnight
    const now = new Date();
    const timeToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;
    setTimeout(() => {
        resetNamazStatus();
        setInterval(resetNamazStatus, 24 * 60 * 60 * 1000); // Reset every 24 hours
    }, timeToMidnight);

    document.getElementById("homeBtn").addEventListener("click", () => {
        window.location.href = "scanner.htm";
    });
});