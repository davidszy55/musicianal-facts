function getSuffix(num) {
    const _ = ["1", "2", "3"]
    const suffix = {
        "1": "st",
        "2": "nd",
        "3": "rd"
    };

    return (num in _) ? suffix[num] : "th";
};

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];
const months = [
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

let today = new Date()
let month = months[today.getMonth()];
let year = today.getFullYear();
let day = days[today.getDay()];
let date = String(today.getDate());
let suffix = getSuffix(date.charAt(date.length - 1));
let dateString = `${day}, ${month} ${date}${suffix}, ${year}`;

document.getElementById("date").innerHTML = dateString;
