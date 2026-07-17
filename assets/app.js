(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const button = document.getElementById('write-button');
  if (!button) return;

  const now = new Date();
  const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  const todayEntry = document.querySelector(`[data-entry-date="${date}"]`);
  if (todayEntry) {
    button.href = todayEntry.dataset.editUrl;
    button.querySelector('span').textContent = 'Continue today’s diary';
    return;
  }

  const template = `---\nlayout: post\ntitle: "${date}"\ndate: ${date}\nmood: "Today in a few words"\n---\n\n## Today\n\nWrite what happened today.\n\n## A moment to remember\n\nWhat would you like to keep?\n`;
  const url = new URL(button.dataset.newUrl);
  url.searchParams.set('filename', `${date}-diary.md`);
  url.searchParams.set('value', template);
  button.href = url.toString();
})();
