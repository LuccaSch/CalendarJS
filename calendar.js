const daysContainer = document.getElementById('days');
const monthYearDisplay = document.getElementById('monthYear');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

let date = new Date();
let startDate = null;
let endDate = null;

// Mockup de reservas existentes se debe agregar un fetch para conseguir las del servidor
const reservas = [
    { fecha_inicio: '2025-02-15', fecha_fin: '2025-02-20' },
    { fecha_inicio: '2025-01-25', fecha_fin: '2025-01-27' }
];

function parseDate(str) {
    const [year, month, day] = str.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function renderCalendar() {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get first and last day of the current month
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parse reservations into Date objects
    const parsedReservas = reservas.map(reserva => {
        return {
            start: parseDate(reserva.fecha_inicio),
            end: parseDate(reserva.fecha_fin)
        };
    });

    // Update month and year display
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;

    // Clear previous days
    daysContainer.innerHTML = '';

    // Add empty days at the start of the grid
    for (let i = 0; i < firstDay; i++) {
    const emptyDiv = document.createElement('div');
    daysContainer.appendChild(emptyDiv);
    }

    // Add days of the month
    for (let day = 1; day <= lastDate; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayDiv.classList.add('day');

        const currentDate = new Date(year, month, day);

        // Disable past dates
        if (currentDate < today) {
            dayDiv.classList.add('disabled');
        }

        // Disable dates in existing reservations
        for (const reserva of parsedReservas) {
            if (currentDate >= reserva.start && currentDate <= reserva.end) {
            dayDiv.classList.add('disabled');
            break;
            }
        }

        // Apply selected or range class
        if (startDate && currentDate.getTime() === startDate.getTime()) {
            dayDiv.classList.add('selected');
        } else if (endDate && currentDate.getTime() === endDate.getTime()) {
            dayDiv.classList.add('selected');
        } else if (startDate && endDate && currentDate > startDate && currentDate < endDate) {
            dayDiv.classList.add('range');
        }

        // Handle click events
        if (!dayDiv.classList.contains('disabled')) {
            dayDiv.addEventListener('click', () => {
                if (!startDate || (startDate && endDate)) {
                    startDate = currentDate;
                    endDate = null;
                } else if (currentDate < startDate) {
                    startDate = currentDate;
                } else {
                    const tentativeEndDate = currentDate;
                    if (!isOverlapping(startDate, tentativeEndDate, parsedReservas)) {
                        endDate = tentativeEndDate;
                    } else {
                        startDate = null;
                        alert("El rango seleccionado solapa con una reserva existente.");
                    }
                }
                renderCalendar();
            });
        }

        daysContainer.appendChild(dayDiv);
    }
}

//Solapamiento

function isOverlapping(startDate, endDate, parsedReservas) {
    return parsedReservas.some(reserva => overlap(startDate, endDate, reserva));
}

function overlap(startDate, endDate, reserva) {
    return reserva.start <= endDate && startDate <= reserva.end;
}

// Navigation
prevButton.addEventListener('click', () => {
    date.setMonth(date.getMonth() - 1);
    renderCalendar();
});

nextButton.addEventListener('click', () => {
    date.setMonth(date.getMonth() + 1);
    renderCalendar();
});

// Initial render
renderCalendar();