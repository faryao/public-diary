(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('.post-content, .excerpt').forEach((container) => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let textNode;

    while ((textNode = walker.nextNode())) textNodes.push(textNode);

    textNodes.forEach((node) => {
      if (node.parentElement.closest('a, code, pre')) return;

      const pattern = /https?:\/\/[^\s<>"']+/gi;
      const fragment = document.createDocumentFragment();
      let cursor = 0;
      let match;

      while ((match = pattern.exec(node.data))) {
        const trailingPunctuation = match[0].match(/[.,!?;:)\]}，。！？；：]+$/);
        const value = trailingPunctuation ? match[0].slice(0, -trailingPunctuation[0].length) : match[0];
        if (!value) continue;

        const link = document.createElement('a');
        link.href = value;
        link.textContent = value;
        link.target = '_blank';
        link.rel = 'noreferrer';

        fragment.append(node.data.slice(cursor, match.index), link);
        cursor = match.index + value.length;
      }

      if (cursor > 0) {
        fragment.append(node.data.slice(cursor));
        node.replaceWith(fragment);
      }
    });
  });

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
      editUrl: day.dataset.editUrl,
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
      const dayControl = document.createElement('a');
      const time = document.createElement('time');
      const fullDate = fullDateFormatter.format(date);

      dayControl.className = 'calendar-day';
      time.dateTime = dateKey;
      time.textContent = String(dayNumber);
      dayControl.append(time);

      if (entry && entry.url) {
        entryCount += 1;
        dayControl.classList.add('has-entry');
        dayControl.href = entry.editUrl;
        dayControl.setAttribute('aria-label', `Edit diary for ${fullDate} on GitHub`);
        const mark = document.createElement('i');
        mark.className = 'calendar-entry-mark';
        mark.setAttribute('aria-hidden', 'true');
        dayControl.append(mark);
      } else {
        dayControl.classList.add('is-empty');
        dayControl.href = newDiaryUrl(dateKey);
        dayControl.setAttribute('aria-label', `Write diary for ${fullDate} on GitHub`);
      }

      dayControl.target = '_blank';
      dayControl.rel = 'noreferrer';

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
      ? `${entryCount} ${entryCount === 1 ? 'entry' : 'entries'} · choose any date to write or edit`
      : 'No entries yet · choose a date to write one';
    previousMonth.disabled = false;
    nextMonth.disabled = displayedMonthIndex >= currentMonthIndex;
    todayMonth.disabled = displayedMonthIndex === currentMonthIndex;
  }

  previousMonth.addEventListener('click', () => {
    displayedMonthIndex -= 1;
    renderCalendar();
  });

  nextMonth.addEventListener('click', () => {
    if (displayedMonthIndex < currentMonthIndex) {
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
