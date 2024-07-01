const alarms = [];
let stopwatchInterval;
let stopwatchTime = 0;
let timerInterval;
let calendarDate = new Date();

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = String(hours % 12 || 12).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  document.getElementById("hours").textContent = formattedHours;
  document.getElementById("minutes").textContent = formattedMinutes;
  document.getElementById("seconds").textContent = formattedSeconds;
  document.getElementById("ampm").textContent = ampm;

  document.getElementById("date").textContent = now.toLocaleDateString();

  const hourDegree = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;
  const minuteDegree = (minutes / 60) * 360 + (seconds / 60) * 6;
  const secondDegree = (seconds / 60) * 360;

  document.getElementById(
    "hour-hand"
  ).style.transform = `rotate(${hourDegree}deg)`;
  document.getElementById(
    "minute-hand"
  ).style.transform = `rotate(${minuteDegree}deg)`;
  document.getElementById(
    "second-hand"
  ).style.transform = `rotate(${secondDegree}deg)`;
}

function toggleClock() {
  const digitalClock = document.getElementById("digital-clock");
  const analogClock = document.getElementById("analog-clock");
  const toggleButton = document.getElementById("toggle-button");

  if (digitalClock.style.display === "none") {
    digitalClock.style.display = "flex";
    analogClock.style.display = "none";
    toggleButton.textContent = "Switch to Analog";
  } else {
    digitalClock.style.display = "none";
    analogClock.style.display = "block";
    toggleButton.textContent = "Switch to Digital";
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const themeButton = document.getElementById("theme-button");
  if (document.body.classList.contains("light")) {
    themeButton.textContent = "Switch to Dark Theme";
  } else {
    themeButton.textContent = "Switch to Light Theme";
  }
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light") ? "light" : "dark"
  );
}

function loadPreferences() {
  const theme = localStorage.getItem("theme");
  if (theme === "light") {
    document.body.classList.add("light");
    document.getElementById("theme-button").textContent =
      "Switch to Dark Theme";
  } else {
    document.body.classList.remove("light");
    document.getElementById("theme-button").textContent =
      "Switch to Light Theme";
  }
  const timezone = localStorage.getItem("timezone") || "local";
  document.getElementById("timezone-select").value = timezone;
}

function updateWeather() {
  // Mock weather information as an example
  document.getElementById("weather").textContent = "Weather: 25°C, Sunny";
}

function setAlarm() {
  const alarmTime = document.getElementById("alarm-time").value;
  const alarmLabel = document.getElementById("alarm-label").value || "Alarm";
  if (!alarmTime) {
    alert("Please select a time for the alarm.");
    return;
  }

  const alarm = { time: alarmTime, label: alarmLabel, active: true };
  alarms.push(alarm);
  updateAlarmsList();
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function updateAlarmsList() {
  const alarmsList = document.getElementById("alarms-list");
  alarmsList.innerHTML = "";

  alarms.forEach((alarm, index) => {
    const alarmItem = document.createElement("div");
    alarmItem.classList.add("alarm-item");
    alarmItem.innerHTML = `
            <span>${alarm.label} - ${alarm.time}</span>
            <button onclick="removeAlarm(${index})">Remove</button>
        `;
    alarmsList.appendChild(alarmItem);
  });
}

function checkAlarms() {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5);
  alarms.forEach((alarm) => {
    if (alarm.active && alarm.time === currentTime) {
      alert(`Alarm: ${alarm.label}`);
      alarm.active = false; // Disable alarm after it rings
    }
  });
}

function removeAlarm(index) {
  alarms.splice(index, 1);
  updateAlarmsList();
  localStorage.setItem("alarms", JSON.stringify(alarms));
}

function updateStopwatchDisplay() {
  const hours = Math.floor(stopwatchTime / 3600);
  const minutes = Math.floor((stopwatchTime % 3600) / 60);
  const seconds = stopwatchTime % 60;
  document.getElementById("stopwatch-display").textContent = `${String(
    hours
  ).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function startStopwatch() {
  document.getElementById("start-stopwatch").disabled = true;
  document.getElementById("stop-stopwatch").disabled = false;
  document.getElementById("reset-stopwatch").disabled = false;
  stopwatchInterval = setInterval(() => {
    stopwatchTime++;
    updateStopwatchDisplay();
  }, 1000);
}

function stopStopwatch() {
  document.getElementById("start-stopwatch").disabled = false;
  document.getElementById("stop-stopwatch").disabled = true;
  clearInterval(stopwatchInterval);
}

function resetStopwatch() {
  document.getElementById("start-stopwatch").disabled = false;
  document.getElementById("stop-stopwatch").disabled = true;
  document.getElementById("reset-stopwatch").disabled = true;
  clearInterval(stopwatchInterval);
  stopwatchTime = 0;
  updateStopwatchDisplay();
}

function updateTimerDisplay(minutes, seconds) {
  document.getElementById("timer-display").textContent = `${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  const timerMinutes =
    parseInt(document.getElementById("timer-minutes").value) || 0;
  const timerSeconds =
    parseInt(document.getElementById("timer-seconds").value) || 0;
  let totalTime = timerMinutes * 60 + timerSeconds;
  updateTimerDisplay(timerMinutes, timerSeconds);

  timerInterval = setInterval(() => {
    totalTime--;
    const minutes = Math.floor(totalTime / 60);
    const seconds = totalTime % 60;
    updateTimerDisplay(minutes, seconds);

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      alert("Timer finished!");
    }
  }, 1000);
}

function generateCalendar() {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  const month = calendarDate.getMonth();
  const year = calendarDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-day");
    calendar.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("calendar-day");
    dayCell.textContent = day;
    if (day === calendarDate.getDate()) {
      dayCell.classList.add("today");
    }
    calendar.appendChild(dayCell);
  }
}

function updateToDoList() {
  const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  const todoListElement = document.getElementById("todo-list");
  todoListElement.innerHTML = "";

  todoList.forEach((todo, index) => {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo-item");
    todoItem.innerHTML = `
            <span>${todo}</span>
            <button onclick="removeToDoItem(${index})">Remove</button>
        `;
    todoListElement.appendChild(todoItem);
  });
}

function addToDoItem() {
  const todoInput = document.getElementById("todo-input");
  const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  if (todoInput.value.trim() !== "") {
    todoList.push(todoInput.value);
    localStorage.setItem("todoList", JSON.stringify(todoList));
    updateToDoList();
    todoInput.value = "";
  }
}

function removeToDoItem(index) {
  const todoList = JSON.parse(localStorage.getItem("todoList")) || [];
  todoList.splice(index, 1);
  localStorage.setItem("todoList", JSON.stringify(todoList));
  updateToDoList();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPreferences();
  updateClock();
  setInterval(updateClock, 1000);
  setInterval(checkAlarms, 1000);
  document
    .getElementById("toggle-button")
    .addEventListener("click", toggleClock);
  document
    .getElementById("theme-button")
    .addEventListener("click", toggleTheme);
  document.getElementById("set-alarm").addEventListener("click", setAlarm);
  document
    .getElementById("start-stopwatch")
    .addEventListener("click", startStopwatch);
  document
    .getElementById("stop-stopwatch")
    .addEventListener("click", stopStopwatch);
  document
    .getElementById("reset-stopwatch")
    .addEventListener("click", resetStopwatch);
  document.getElementById("start-timer").addEventListener("click", startTimer);
  document.getElementById("add-todo").addEventListener("click", addToDoItem);
  generateCalendar();
  updateToDoList();
});
