(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const button = document.getElementById('write-button');
  const timeline = document.getElementById('timeline');
  if (!button || !timeline) return;

  const toDateKey = (value) => [value.getFullYear(), String(value.getMonth() + 1).padStart(2, '0'), String(value.getDate()).padStart(2, '0')].join('-');
  const fromDateKey = (key) => new Date(`${key}T12:00:00`);
  const today = new Date();
  const todayKey = toDateKey(today);

  const heroDay = document.getElementById('hero-day');
  const heroWeekday = document.getElementById('hero-weekday');
  const heroMonth = document.getElementById('hero-month');
  if (heroDay) heroDay.textContent = String(today.getDate()).padStart(2, '0');
  if (heroWeekday) heroWeekday.textContent = new Intl.DateTimeFormat('en', { weekday: 'long' }).format(today).toUpperCase();
  if (heroMonth) heroMonth.textContent = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(today);

  function newDiaryUrl(dateKey) {
    const template = `---\nlayout: post\ndate: ${dateKey}\nmood: "Today in a few words"\n---\n\nWrite what happened today.\n\nWhat is one moment you want to remember?\n`;
    const url = new URL(button.dataset.newUrl);
    url.searchParams.set('filename', `${dateKey}-diary.md`);
    url.searchParams.set('value', template);
    return url.toString();
  }

  const writtenDays = Array.from(timeline.querySelectorAll('[data-diary-date]'));
  const writtenByDate = new Map(writtenDays.map((day) => [day.dataset.diaryDate, day]));
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
    summary.textContent = `${writtenCount} ${writtenCount === 1 ? 'day' : 'days'} kept · last 7 days shown`;
  }
})();
