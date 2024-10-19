let timers = [];

// Event listener for starting a new timer
document.getElementById('start-timer').addEventListener('click', () => {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    // Validate that the time input is not all zero
    if (hours === 0 && minutes === 0 && seconds === 0) {
        alert("Please set a valid time!");
        return;
    }

    const totalTimeInSeconds = (hours * 3600) + (minutes * 60) + seconds;
    createTimer(totalTimeInSeconds);

    // Clear input fields after setting the timer
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
});

// Automatically move the cursor to the next input field
document.getElementById('hours').addEventListener('input', () => {
    if (document.getElementById('hours').value.length >= 2) {
        document.getElementById('minutes').focus();
    }
});
document.getElementById('minutes').addEventListener('input', () => {
    if (document.getElementById('minutes').value.length >= 2) {
        document.getElementById('seconds').focus();
    }
});

// Create a new timer and start countdown
function createTimer(duration) {
    let timeRemaining = duration;
    const timerID = Date.now(); // Unique ID for the timer
    const alarmSound = new Audio('alarm.mp3'); 

    displayNewTimer(timerID, timeRemaining);

    // Countdown interval for the timer
    const intervalID = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay(timerID, timeRemaining);

        // Check if the timer has reached zero
        if (timeRemaining <= 0) {
            clearInterval(intervalID);
            timerEnded(timerID, alarmSound);
        }
    }, 1000);

    // Store timer information
    timers.push({ id: timerID, intervalID, alarmSound });
}

// Update the timer's display
function updateTimerDisplay(timerID, timeRemaining) {
    const timerElement = document.getElementById(`timer-${timerID}`);
    if (!timerElement) return;

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    timerElement.querySelector('.time-left').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Display a newly created timer in the list
function displayNewTimer(timerID, duration) {
    const timerDiv = document.createElement('div');
    timerDiv.className = 'timer-item';
    timerDiv.id = `timer-${timerID}`;

    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    timerDiv.innerHTML = `
        <span class="time-left">${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</span>
        <button class="delete-button" onclick="stopTimer(${timerID})">Delete</button>
    `;

    const timersList = document.getElementById('timers-list');
    if (timersList.textContent === 'You have no timers currently!') {
        timersList.textContent = '';
    }
    timersList.appendChild(timerDiv);
}

// Handle when a timer reaches zero
function timerEnded(timerID, alarmSound) {
    const timerElement = document.getElementById(`timer-${timerID}`);
    if (timerElement) {
        timerElement.classList.add('timer-ended');
        timerElement.querySelector('.time-left').textContent = 'Timer Is Up!';
        alarmSound.play();

        // Change the delete button to a stop button with a black background
        const stopButton = timerElement.querySelector('.delete-button');
        stopButton.textContent = 'Stop';
        stopButton.style.backgroundColor = 'black';
        stopButton.style.color = 'white';
        stopButton.setAttribute('onclick', `stopAlarm(${timerID})`);
    }
}

// Stop and remove the timer
function stopTimer(timerID) {
    const timerInfo = timers.find(timer => timer.id === timerID);
    if (timerInfo) {
        clearInterval(timerInfo.intervalID);
        timers = timers.filter(timer => timer.id !== timerID);
    }

    const timerElement = document.getElementById(`timer-${timerID}`);
    if (timerElement) timerElement.remove();

    // Display a message if no timers are left
    if (timers.length === 0) {
        document.getElementById('timers-list').textContent = 'You have no timers currently!';
    }
}

// Stop the alarm sound and remove the timer
function stopAlarm(timerID) {
    const timerInfo = timers.find(timer => timer.id === timerID);
    if (timerInfo && timerInfo.alarmSound) {
        timerInfo.alarmSound.pause();
        timerInfo.alarmSound.currentTime = 0;
    }

    stopTimer(timerID);
}
