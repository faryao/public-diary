(function () {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  const button = document.getElementById('write-button');
  if (!button) return;

  const now = new Date();
  const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  const template = `---\nlayout: post\ntitle: "Today’s title"\ndate: ${date}\nmood: "A short thought"\n---\n\nStart writing here.\n`;
  const url = new URL(button.href);
  url.searchParams.set('filename', `${date}-my-entry.md`);
  url.searchParams.set('value', template);
  button.href = url.toString();
})();

