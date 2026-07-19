(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const button = document.getElementById('write-button');
  const timeline = document.getElementById('timeline');
  if (!button || !timeline) return;

  const toDateKey = (value) => [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
  const fromDateKey = (key) => new Date(`${key}T12:00:00`);
  const toMonthIndex = (value) => (value.getFullYear() * 12) + value.getMonth();
  const fromMonthIndex = (index) => new Date(Math.floor(index / 12), ((index % 12) + 12) % 12, 1, 12);
  const today = new Date();
  const todayKey = toDateKey(today);

  function newDiaryUrl(dateKey) {
    const template = `---\nlayout: post\ndate: ${dateKey}\n---\n\nWrite what happened today.\n\nWhat is one moment you want to remember?\n`;
    const url = new URL(button.dataset.newUrl);
    url.searchParams.set('filename', `${dateKey}-diary.md`);
    url.searchParams.set('value', template);
    return url.toString();
  }

  const writtenDays = Array.from(timeline.querySelectorAll('[data-diary-date]'));
  const writtenByDate = new Map(writtenDays.map((day) => [day.dataset.diaryDate, day]));
  const entriesByDate = new Map(writtenDays.map((day) => {
    const readLink = day.querySelector('.read-link');
    return [day.dataset.diaryDate, {
      url: day.dataset.diaryUrl || (readLink && readLink.href),
      day
    }];
  }));

  writtenDays.forEach((day) => {
    const excerpt = day.querySelector('.excerpt');
    const entryContent = day.querySelector('.entry-content');
    const entry = entriesByDate.get(day.dataset.diaryDate);
    if (!excerpt || !entryContent || !entry || !entry.url) return;

    const images = Array.from(excerpt.querySelectorAll('img'));

    if (images.length > 0) {
      const date = fromDateKey(day.dataset.diaryDate);
      const dateLabel = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
      const thumbnail = document.createElement('a');
      const image = images[0];
      const imageAlt = (image.getAttribute('alt') || '').trim();
      const accessibleAction = document.createElement('span');

      thumbnail.className = 'entry-thumbnail';
      thumbnail.href = entry.url;
      accessibleAction.className = 'sr-only';
      accessibleAction.textContent = `Open diary for ${dateLabel}: `;
      image.removeAttribute('width');
      image.removeAttribute('height');
      image.alt = imageAlt && imageAlt.toLowerCase() !== 'image' ? imageAlt : 'Diary image preview';
      image.loading = 'lazy';
      image.decoding = 'async';
      images.slice(1).forEach((extraImage) => extraImage.remove());
      thumbnail.append(accessibleAction, image);

      entryContent.classList.add('has-thumbnail');
      entryContent.append(thumbnail);
    }
  });

  const todayEntry = writtenByDate.get(todayKey);
  if (todayEntry) {
    button.href = todayEntry.dataset.editUrl;
    button.querySelector('span').textContent = 'Continue today’s diary';
  } else {
    button.href = newDiaryUrl(todayKey);
  }

  const visibleDates = new Set(writtenByDate.keys());
  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset, 12);
    visibleDates.add(toDateKey(day));
  }

  function makeUnwrittenDay(dateKey) {
    const day = fromDateKey(dateKey);
    const weekday = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(day);
    const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(day);
    const dayNumber = String(day.getDate()).padStart(2, '0');
    const article = document.createElement('article');
    article.className = 'timeline-day is-unwritten';
    article.id = `diary-${dateKey}`;
    article.dataset.diaryDate = dateKey;
    article.innerHTML = `
      <div class="day-marker">
        <time datetime="${dateKey}"><span class="weekday">${weekday}</span><strong>${dayNumber}</strong><span>${monthYear}</span></time>
        <i class="timeline-node" aria-hidden="true"><span>○</span></i>
      </div>
      <div class="diary-card empty-day">
        <div>
          <p class="empty-label">No diary for this day</p>
          <p class="empty-message">Nothing was written.</p>
        </div>
        <a href="${newDiaryUrl(dateKey)}" target="_blank" rel="noreferrer">Write this day on GitHub <span>↗</span></a>
      </div>`;
    return article;
  }

  timeline.replaceChildren(...Array.from(visibleDates)
    .sort((a, b) => b.localeCompare(a))
    .map((dateKey) => writtenByDate.get(dateKey) || makeUnwrittenDay(dateKey)));

  const currentDay = timeline.querySelector(`[data-diary-date="${todayKey}"]`);
  if (currentDay) currentDay.classList.add('is-today');

  const summary = document.getElementById('timeline-summary');
  if (summary) {
    const writtenCount = writtenByDate.size;
    summary.textContent = `${writtenCount} ${writtenCount === 1 ? 'day' : 'days'} kept · newest first`;
  }

  const calendarLabel = document.getElementById('calendar-label');
  const calendarSummary = document.getElementById('calendar-summary');
  const calendarGrid = document.getElementById('calendar-grid');
  const previousMonth = document.getElementById('calendar-previous');
  const nextMonth = document.getElementById('calendar-next');
  const todayMonth = document.getElementById('calendar-today');
  if (!calendarLabel || !calendarSummary || !calendarGrid || !previousMonth || !nextMonth || !todayMonth) return;

  const currentMonthIndex = toMonthIndex(today);
  const entryMonthIndexes = Array.from(entriesByDate.keys()).map((key) => toMonthIndex(fromDateKey(key)));
  const minimumMonthIndex = entryMonthIndexes.length > 0 ? Math.min(currentMonthIndex, ...entryMonthIndexes) : currentMonthIndex;
  const maximumMonthIndex = entryMonthIndexes.length > 0 ? Math.max(currentMonthIndex, ...entryMonthIndexes) : currentMonthIndex;
  const monthFormatter = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' });
  const fullDateFormatter = new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  let displayedMonthIndex = currentMonthIndex;

  function renderCalendar() {
    const monthDate = fromMonthIndex(displayedMonthIndex);
    const displayedYear = monthDate.getFullYear();
    const displayedMonth = monthDate.getMonth();
    const firstDay = new Date(displayedYear, displayedMonth, 1, 12);
    const leadingDays = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0, 12).getDate();
    const totalCells = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
    const fragment = document.createDocumentFragment();
    let entryCount = 0;
    let row;

    for (let cellIndex = 0; cellIndex < totalCells; cellIndex += 1) {
      if (cellIndex % 7 === 0) {
        row = document.createElement('div');
        row.className = 'calendar-row';
        fragment.append(row);
      }

      const cell = document.createElement('div');
      const dayNumber = cellIndex - leadingDays + 1;
      cell.className = 'calendar-cell';

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cell.classList.add('is-placeholder');
        cell.setAttribute('aria-hidden', 'true');
        row.append(cell);
        continue;
      }

      const date = new Date(displayedYear, displayedMonth, dayNumber, 12);
      const dateKey = toDateKey(date);
      const entry = entriesByDate.get(dateKey);
      const dayControl = document.createElement(entry ? 'a' : 'span');
      const time = document.createElement('time');
      const fullDate = fullDateFormatter.format(date);

      dayControl.className = 'calendar-day';
      time.dateTime = dateKey;
      time.textContent = String(dayNumber);
      dayControl.append(time);

      if (entry && entry.url) {
        entryCount += 1;
        dayControl.classList.add('has-entry');
        dayControl.href = entry.url;
        dayControl.setAttribute('aria-label', `Read diary for ${fullDate}`);
        const mark = document.createElement('i');
        mark.className = 'calendar-entry-mark';
        mark.setAttribute('aria-hidden', 'true');
        dayControl.append(mark);
      }

      if (dateKey === todayKey) {
        dayControl.classList.add('is-today');
        dayControl.setAttribute('aria-current', 'date');
      }

      cell.append(dayControl);
      row.append(cell);
    }

    const monthName = monthFormatter.format(monthDate);
    calendarLabel.textContent = monthName;
    calendarGrid.replaceChildren(fragment);
    calendarSummary.textContent = entryCount > 0
      ? `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} · choose a filled date to read`
      : 'No diary entries in this month';
    previousMonth.disabled = displayedMonthIndex <= minimumMonthIndex;
    nextMonth.disabled = displayedMonthIndex >= maximumMonthIndex;
    todayMonth.disabled = displayedMonthIndex === currentMonthIndex;
  }

  previousMonth.addEventListener('click', () => {
    if (displayedMonthIndex > minimumMonthIndex) {
      displayedMonthIndex -= 1;
      renderCalendar();
    }
  });

  nextMonth.addEventListener('click', () => {
    if (displayedMonthIndex < maximumMonthIndex) {
      displayedMonthIndex += 1;
      renderCalendar();
    }
  });

  todayMonth.addEventListener('click', () => {
    displayedMonthIndex = currentMonthIndex;
    renderCalendar();
  });

  renderCalendar();
})();
