let hadithData = [];
let currentHadith = '';
let timerInterval;
let streak = parseInt(localStorage.getItem('streak') || '0', 10);
let completedHadiths = JSON.parse(localStorage.getItem('completedHadiths') || '[]');

// Load hadith data
async function loadHadith() {
    try {
        const response = await fetch('hadith.json'); // Ensure the path is correct
        if (!response.ok) throw new Error('Failed to load hadith');
        hadithData = await response.json();
    } catch (err) {
        console.error('Error loading hadith data:', err);
    }
}

// Start the hadith practice
function startHadithPractice() {
    if (hadithData.length === 0) {
        alert('No hadith data available.');
        return;
    }

    const remainingHadiths = hadithData.filter(hadith => !completedHadiths.includes(hadith.text));

    if (remainingHadiths.length === 0) {
        document.getElementById('hadithText').textContent = "Wow! You bypassed the system.";
        return;
    }

    const randomHadith = remainingHadiths[Math.floor(Math.random() * remainingHadiths.length)];
    currentHadith = randomHadith.text.toLowerCase();
    document.getElementById('hadithText').textContent = randomHadith.text;

    const timeRemaining = parseInt(document.getElementById('timerSelect').value, 10);
    document.getElementById('timer').textContent = timeRemaining;
    document.getElementById('hadithInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;

    let remainingTime = timeRemaining;

    timerInterval = setInterval(() => {
        remainingTime--;
        document.getElementById('timer').textContent = remainingTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            document.getElementById('hadithInput').disabled = false;
            document.getElementById('submitBtn').disabled = false;
        }
    }, 1000);
}

// Submit the hadith input
function submitHadith() {
    const userInput = document.getElementById('hadithInput').value.trim().toLowerCase();
    console.log('User Input:', userInput);
    console.log('Current Hadith:', currentHadith);

    if (userInput === currentHadith) {
        streak++;
        completedHadiths.push(currentHadith);
        localStorage.setItem('streak', streak.toString());
        localStorage.setItem('completedHadiths', JSON.stringify(completedHadiths));
        document.getElementById('resultMessage').textContent = '✅ Correct! Your streak has increased.';
    } else {
        document.getElementById('resultMessage').textContent = '❌ Incorrect. Try again!';
    }

    document.getElementById('hadithInput').value = '';
    document.getElementById('hadithInput').disabled = true;
    document.getElementById('submitBtn').disabled = true;
}

// Redirect to streak page
document.getElementById('streakTabBtn').addEventListener('click', () => {
    window.location.href = 'streak.htm';
});

// Redirect to home page
document.getElementById('homeBtn').addEventListener('click', () => {
    window.location.href = 'scanner.htm';
});

// Load hadith data on page load
loadHadith();

document.getElementById('startBtn').addEventListener('click', startHadithPractice);
document.getElementById('submitBtn').addEventListener('click', submitHadith);