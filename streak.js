document.addEventListener('DOMContentLoaded', () => {
    const streak = localStorage.getItem('streak') || '0';
    document.getElementById('streakCount').textContent = `Your current streak is: ${streak}`;

    document.getElementById('backBtn').addEventListener('click', () => {
        // Redirect to hadith.htm
        window.location.href = 'hadith.htm';
    });

    document.getElementById('homeBtn').addEventListener('click', () => {
        // Redirect to scanner.htm
        window.location.href = 'scanner.htm';
    });
});