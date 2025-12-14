// J & J Scooter Rentals - Main JavaScript

// ===== TRADE DAYS DATES 2025 =====
const tradeDays2025 = [
  { start: new Date('2025-01-02'), end: new Date('2025-01-05'), label: 'January 2-5' },
  { start: new Date('2025-01-30'), end: new Date('2025-02-02'), label: 'Jan 30 - Feb 2' },
  { start: new Date('2025-02-27'), end: new Date('2025-03-02'), label: 'Feb 27 - Mar 2' },
  { start: new Date('2025-03-27'), end: new Date('2025-03-30'), label: 'March 27-30' },
  { start: new Date('2025-05-01'), end: new Date('2025-05-04'), label: 'May 1-4' },
  { start: new Date('2025-05-29'), end: new Date('2025-06-01'), label: 'May 29 - Jun 1' },
  { start: new Date('2025-07-03'), end: new Date('2025-07-06'), label: 'July 3-6' },
  { start: new Date('2025-07-31'), end: new Date('2025-08-03'), label: 'Jul 31 - Aug 3' },
  { start: new Date('2025-08-28'), end: new Date('2025-08-31'), label: 'August 28-31' },
  { start: new Date('2025-10-02'), end: new Date('2025-10-05'), label: 'October 2-5' },
  { start: new Date('2025-10-30'), end: new Date('2025-11-02'), label: 'Oct 30 - Nov 2' },
  { start: new Date('2025-11-27'), end: new Date('2025-11-30'), label: 'November 27-30' },
  // 2026 dates (examples)
  { start: new Date('2026-01-01'), end: new Date('2026-01-04'), label: 'January 1-4, 2026' },
  { start: new Date('2026-01-29'), end: new Date('2026-02-01'), label: 'Jan 29 - Feb 1, 2026' },
];

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const now = new Date();
  let nextTradeDay = null;

  // Find next Trade Days
  for (const td of tradeDays2025) {
    if (td.start > now) {
      nextTradeDay = td;
      break;
    }
  }

  if (!nextTradeDay) {
    // If no future dates, show zeros
    document.getElementById('days').textContent = '00';
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
    return;
  }

  const diff = nextTradeDay.start - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ===== BOOKING FORM =====
const PRICE = 55;
let quantities = { standard: 0, oversized: 0, wagon: 0 };
let selectedDate = null;
let discountApplied = false;
let discountAmount = 0;

function getUpcomingTradeDays() {
  const now = new Date();
  const upcoming = [];
  let count = 0;

  for (const td of tradeDays2025) {
    if (td.end >= now && count < 2) {
      upcoming.push(td);
      count++;
    }
  }

  return upcoming;
}

function populateDateGrid() {
  const dateGrid = document.getElementById('dateGrid');
  if (!dateGrid) return;

  const upcoming = getUpcomingTradeDays();

  dateGrid.innerHTML = upcoming.map((td, index) => `
    <div class="date-option" onclick="selectDate(${index}, '${td.label}')" id="date-${index}">
      <div class="day">Trade Days</div>
      <div class="date">${td.label}</div>
    </div>
  `).join('');
}

function selectDate(index, label) {
  // Remove selected from all
  document.querySelectorAll('.date-option').forEach(el => el.classList.remove('selected'));
  // Add selected to clicked
  document.getElementById(`date-${index}`).classList.add('selected');
  selectedDate = label;
  updateSummary();
}

function changeQty(type, delta) {
  const maxQty = { standard: 55, oversized: 20, wagon: 25 };
  const newQty = quantities[type] + delta;

  if (newQty >= 0 && newQty <= maxQty[type]) {
    quantities[type] = newQty;
    document.getElementById(`qty-${type}`).textContent = newQty;
    document.getElementById(`price-${type}`).textContent = `$${newQty * PRICE}`;
    updateSummary();
  }
}

function applyDiscount() {
  const code = document.getElementById('discountCode').value.toUpperCase().trim();
  const messageEl = document.getElementById('discountMessage');
  const totalQty = quantities.standard + quantities.oversized + quantities.wagon;

  if (code === 'SENIOR') {
    discountApplied = true;
    discountAmount = 5 * totalQty;
    messageEl.textContent = '✓ Senior discount applied: $5 off per rental';
    messageEl.style.color = 'green';
  } else if (code === 'GROUP' && totalQty >= 3) {
    discountApplied = true;
    discountAmount = 5 * totalQty;
    messageEl.textContent = '✓ Group discount applied: $5 off per rental';
    messageEl.style.color = 'green';
  } else if (code === 'GROUP' && totalQty < 3) {
    messageEl.textContent = '✗ Group discount requires 3+ rentals';
    messageEl.style.color = 'red';
    discountApplied = false;
    discountAmount = 0;
  } else {
    messageEl.textContent = '✗ Invalid discount code';
    messageEl.style.color = 'red';
    discountApplied = false;
    discountAmount = 0;
  }

  updateSummary();
}

function updateSummary() {
  const totalQty = quantities.standard + quantities.oversized + quantities.wagon;
  const subtotal = totalQty * PRICE;

  // Recalculate discount if applied
  if (discountApplied) {
    discountAmount = 5 * totalQty;
  }

  const total = subtotal - discountAmount;

  // Update equipment text
  const equipmentParts = [];
  if (quantities.standard > 0) equipmentParts.push(`${quantities.standard} Standard`);
  if (quantities.oversized > 0) equipmentParts.push(`${quantities.oversized} Oversized`);
  if (quantities.wagon > 0) equipmentParts.push(`${quantities.wagon} Wagon`);

  const summaryDate = document.getElementById('summaryDate');
  const summaryEquipment = document.getElementById('summaryEquipment');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const discountRow = document.getElementById('discountRow');
  const summaryTotal = document.getElementById('summaryTotal');

  if (summaryDate) summaryDate.textContent = selectedDate || 'Select a date';
  if (summaryEquipment) summaryEquipment.textContent = equipmentParts.length > 0 ? equipmentParts.join(', ') : 'None selected';
  if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;

  if (discountRow && summaryDiscount) {
    if (discountApplied && discountAmount > 0) {
      discountRow.style.display = 'flex';
      summaryDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
}

function handleBookingSubmit(e) {
  e.preventDefault();

  const totalQty = quantities.standard + quantities.oversized + quantities.wagon;

  if (!selectedDate) {
    alert('Please select a Trade Days date.');
    return;
  }

  if (totalQty === 0) {
    alert('Please select at least one rental item.');
    return;
  }

  const name = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;

  // Show confirmation modal
  const modal = document.getElementById('confirmationModal');
  const details = document.getElementById('confirmationDetails');

  const subtotal = totalQty * PRICE;
  const total = subtotal - discountAmount;

  const equipmentParts = [];
  if (quantities.standard > 0) equipmentParts.push(`${quantities.standard}x Standard Scooter`);
  if (quantities.oversized > 0) equipmentParts.push(`${quantities.oversized}x Oversized Scooter`);
  if (quantities.wagon > 0) equipmentParts.push(`${quantities.wagon}x Pull Wagon`);

  details.innerHTML = `
    <p><strong>Date:</strong> ${selectedDate}</p>
    <p><strong>Equipment:</strong><br>${equipmentParts.join('<br>')}</p>
    <p><strong>Total:</strong> $${total.toFixed(2)}</p>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <hr style="margin: 15px 0; border: 1px solid #ddd;">
    <p style="font-size: 0.9rem; color: var(--gray);">
      📱 An SMS confirmation has been sent to your phone.<br>
      You'll also receive reminders before your rental date.
    </p>
  `;

  modal.classList.add('show');
}

function closeModal() {
  document.getElementById('confirmationModal').classList.remove('show');
  // Reset form
  window.location.href = 'index.html';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  // Start countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Populate date grid on booking page
  populateDateGrid();

  // Booking form submit
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }
});

// ===== OTTOS AUTOMATION CHAT =====
const chatResponses = {
  'hours': 'We\'re open during Trade Days only:\n• Thursday-Saturday: 8AM - 5PM\n• Sunday: 8AM - 4PM',
  'return': 'Please return your rental by closing time on the day of your rental. That\'s 5PM Thursday-Saturday, or 4PM on Sunday.',
  'breakdown': 'If your scooter breaks down, call us immediately at 972-979-1722 and we\'ll bring you a replacement right away!',
  'price': 'All rentals are $55 per day. We also offer $5 off for seniors (55+) and groups of 3 or more!',
  'location': 'We\'re located at 367 N Trade Days Blvd, Canton TX - 1 mile south of I-20 on Hwy 19, next to IAMERICAFLAGS, near the East Gate.',
  'parking': 'Free parking is available across the street at the Pecan Tree lot.',
  'weight': 'Our Standard scooters hold up to 350 lbs. Our Oversized scooters hold up to 500 lbs with extra-large seats.',
  'battery': 'Standard scooters have a 25-mile range, Oversized have 18 miles. Both are plenty for a full day of shopping!',
  'reservation': 'You can reserve online at our Book Now page for daily rentals, or just walk up during Trade Days!',
  'cancel': 'Cancellations 72+ hours before get a full refund, 24-72 hours get 50%, less than 24 hours are non-refundable.',
  'wagon': 'Our pull wagons are heavy-duty with all-terrain wheels - perfect for hauling your Trade Days treasures or kids!',
  'payment': 'We accept cash, credit cards, and debit cards.',
  'default': 'I\'m here to help! You can ask me about hours, pricing, returns, breakdowns, location, or anything else about our scooter rentals. Or call us at 972-979-1722!'
};

function getChatResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes('hour') || msg.includes('open') || msg.includes('close') || msg.includes('time')) {
    return chatResponses.hours;
  } else if (msg.includes('return') || msg.includes('bring back')) {
    return chatResponses.return;
  } else if (msg.includes('break') || msg.includes('broke') || msg.includes('stuck') || msg.includes('problem')) {
    return chatResponses.breakdown;
  } else if (msg.includes('price') || msg.includes('cost') || msg.includes('how much') || msg.includes('$')) {
    return chatResponses.price;
  } else if (msg.includes('where') || msg.includes('location') || msg.includes('address') || msg.includes('find you')) {
    return chatResponses.location;
  } else if (msg.includes('park')) {
    return chatResponses.parking;
  } else if (msg.includes('weight') || msg.includes('capacity') || msg.includes('heavy') || msg.includes('big')) {
    return chatResponses.weight;
  } else if (msg.includes('battery') || msg.includes('charge') || msg.includes('long') || msg.includes('range')) {
    return chatResponses.battery;
  } else if (msg.includes('reserv') || msg.includes('book') || msg.includes('reserve')) {
    return chatResponses.reservation;
  } else if (msg.includes('cancel') || msg.includes('refund')) {
    return chatResponses.cancel;
  } else if (msg.includes('wagon')) {
    return chatResponses.wagon;
  } else if (msg.includes('pay') || msg.includes('card') || msg.includes('cash')) {
    return chatResponses.payment;
  } else {
    return chatResponses.default;
  }
}

function toggleChat() {
  const chatWindow = document.getElementById('chatWindow');
  if (chatWindow) {
    chatWindow.classList.toggle('open');
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const message = input.value.trim();

  if (!message || !messages) return;

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'chat-message user';
  userMsg.textContent = message;
  messages.appendChild(userMsg);

  input.value = '';
  messages.scrollTop = messages.scrollHeight;

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'typingIndicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  // Bot response after delay
  setTimeout(() => {
    typing.remove();
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-message bot';
    botMsg.textContent = getChatResponse(message);
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  }, 1500);
}

function handleChatKeypress(e) {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
}

// Console message
console.log('%c🛵 J & J Scooter Rentals', 'font-size: 20px; color: #E31837;');
console.log('%cWhy Walk When You Can Ride?', 'font-size: 14px; color: #FFD700;');
console.log('%c🤖 Powered by Ottos Automation', 'font-size: 12px; color: #666;');
