// =====================================
// GET LUXON
// =====================================
// Luxon is loaded in index.html
// before this JavaScript file.
const DateTime = luxon.DateTime;
// =====================================
// GET HTML ELEMENTS
// =====================================
const ageForm =
  document.getElementById("age-form");
const dateInput =
  document.getElementById("date-input");
const selectedDateText =
  document.getElementById("selected-date");
const calendar =
  document.getElementById("calendar");
const monthYear =
  document.getElementById("month-year");
const calendarDays =
  document.getElementById("calendar-days");
const previousMonth =
  document.getElementById("previous-month");
const nextMonth =
  document.getElementById("next-month");
const errorMessage =
  document.getElementById("error-message");
const result =
  document.getElementById("result");
const yearsOutput =
  document.getElementById("years");
const monthsOutput =
  document.getElementById("months");
const daysOutput =
  document.getElementById("days");
// =====================================
// DATE VARIABLES
// =====================================
// Today's date.
const today =
  DateTime.now().startOf("day");
// Month currently being displayed
// in the datepicker.
let displayedMonth =
  today;
// User's selected birthdate.
let selectedBirthdate = null;
// =====================================
// MONTH NAMES
// =====================================
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
// =====================================
// OPEN DATEPICKER
// =====================================
dateInput.addEventListener(
  "click",
  function () {
    const isOpen =
      dateInput.getAttribute(
        "aria-expanded"
      ) === "true";
    if (isOpen) {
      closeCalendar();
    } else {
      openCalendar();
    }
  }
);
// =====================================
// OPEN CALENDAR FUNCTION
// =====================================
function openCalendar() {
  calendar.hidden = false;
  dateInput.setAttribute(
    "aria-expanded",
    "true"
  );
  // If a date was already selected,
  // show that month.
  if (selectedBirthdate) {
    displayedMonth =
      selectedBirthdate.startOf(
        "month"
      );
  }
  renderCalendar();
}
// =====================================
// CLOSE CALENDAR FUNCTION
// =====================================
function closeCalendar() {
  calendar.hidden = true;
  dateInput.setAttribute(
    "aria-expanded",
    "false"
  );
}
// =====================================
// RENDER CALENDAR
// =====================================
function renderCalendar() {
  // -------------------------------------
  // Display month and year
  // -------------------------------------
  monthYear.textContent =
    `${monthNames[displayedMonth.month - 1]}
     ${displayedMonth.year}`;
  // -------------------------------------
  // Clear existing calendar days
  // -------------------------------------
  calendarDays.innerHTML = "";
  // -------------------------------------
  // Find the first day of the month
  // -------------------------------------
  const firstDay =
    displayedMonth.startOf(
      "month"
    );
  // Luxon uses:
  // Monday = 1
  // Sunday = 7
  //
  // We want Sunday = 0.
  const firstWeekday =
    firstDay.weekday % 7;
  // -------------------------------------
  // Number of days in the month
  // -------------------------------------
  const daysInMonth =
    displayedMonth.daysInMonth;
  // =====================================
  // CREATE EMPTY SPACES
  // =====================================
  for (
    let i = 0;
    i < firstWeekday;
    i++
  ) {
    const emptyDay =
      document.createElement("div");
    emptyDay.classList.add(
      "calendar-day",
      "empty"
    );
    calendarDays.appendChild(
      emptyDay
    );
  }
  // =====================================
  // CREATE DAYS
  // =====================================
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    const date =
      DateTime.local(
        displayedMonth.year,
        displayedMonth.month,
        day
      );
    const dayButton =
      document.createElement("button");
    dayButton.type =
      "button";
    dayButton.classList.add(
      "calendar-day"
    );
    dayButton.textContent =
      day;
    // Accessibility
    dayButton.setAttribute(
      "aria-label",
      date.toFormat(
        "MMMM d, yyyy"
      )
    );
    // -----------------------------------
    // Check if date is today
    // -----------------------------------
    if (
      date.hasSame(
        today,
        "day"
      )
    ) {
      dayButton.classList.add(
        "today"
      );
    }
    // -----------------------------------
    // Disable future dates
    // -----------------------------------
    if (
      date > today
    ) {
      dayButton.disabled =
        true;
      dayButton.classList.add(
        "disabled"
      );
    }
    // -----------------------------------
    // Check selected date
    // -----------------------------------
    if (
      selectedBirthdate &&
      date.hasSame(
        selectedBirthdate,
        "day"
      )
    ) {
      dayButton.classList.add(
        "selected"
      );
    }
    // -----------------------------------
    // Select date
    // -----------------------------------
    dayButton.addEventListener(
      "click",
      function () {
        selectBirthdate(date);
      }
    );
    calendarDays.appendChild(
      dayButton
    );
  }
}
// =====================================
// SELECT BIRTHDATE
// =====================================
function selectBirthdate(date) {
  selectedBirthdate =
    date.startOf("day");
  // Display formatted date.
  selectedDateText.textContent =
    selectedBirthdate.toFormat(
      "dd/MM/yyyy"
    );
  // Change text color.
  dateInput.classList.add(
    "selected"
  );
  // Clear any previous error.
  errorMessage.textContent = "";
  // Close calendar.
  closeCalendar();
  // Re-render so the selected
  // date gets highlighted.
  renderCalendar();
}
// =====================================
// PREVIOUS MONTH
// =====================================
previousMonth.addEventListener(
  "click",
  function () {
    // Don't allow navigating
    // beyond the current month.
    const previous =
      displayedMonth.minus({
        months: 1
      });
    displayedMonth =
      previous;
    renderCalendar();
  }
);
// =====================================
// NEXT MONTH
// =====================================
nextMonth.addEventListener(
  "click",
  function () {
    const next =
      displayedMonth.plus({
        months: 1
      });
    // Don't allow navigating
    // into future months.
    if (
      next <=
      today.startOf("month")
    ) {
      displayedMonth =
        next;
      renderCalendar();
    }
  }
);
// =====================================
// CLOSE CALENDAR WHEN CLICKING OUTSIDE
// =====================================
document.addEventListener(
  "click",
  function (event) {
    const clickedInside =
      dateInput.contains(
        event.target
      ) ||
      calendar.contains(
        event.target
      );
    if (
      !clickedInside &&
      !calendar.hidden
    ) {
      closeCalendar();
    }
  }
);
// =====================================
// CALCULATE AGE
// =====================================
ageForm.addEventListener(
  "submit",
  function (event) {
    event.preventDefault();
    // -----------------------------------
    // VALIDATION
    // -----------------------------------
    if (!selectedBirthdate) {
      errorMessage.textContent =
        "Please select your date of birth.";
      result.hidden = true;
      return;
    }
    // -----------------------------------
    // Make sure date isn't in the future
    // -----------------------------------
    if (
      selectedBirthdate > today
    ) {
      errorMessage.textContent =
        "Birthdate cannot be in the future.";
      result.hidden = true;
      return;
    }
    // -----------------------------------
    // Calculate exact age using Luxon
    // -----------------------------------
    const age =
      today.diff(
        selectedBirthdate,
        [
          "years",
          "months",
          "days"
        ]
      ).toObject();
    // -----------------------------------
    // Display result
    // -----------------------------------
    yearsOutput.textContent =
      Math.floor(
        age.years
      );
    monthsOutput.textContent =
      Math.floor(
        age.months
      );
    daysOutput.textContent =
      Math.floor(
        age.days
      );
    // -----------------------------------
    // Show result
    // -----------------------------------
    result.hidden = false;
  }
);
// =====================================
// INITIALIZE CALENDAR
// =====================================
renderCalendar();