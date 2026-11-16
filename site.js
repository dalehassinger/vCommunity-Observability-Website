const shellPicker = document.querySelector('#shell-picker');
const shellButtons = shellPicker.querySelectorAll('button[data-shell]');
const shellBlocks = document.querySelectorAll('[data-commands]');

function selectShell(shell) {
  for (const button of shellButtons) {
    button.setAttribute('aria-pressed', String(button.dataset.shell === shell));
  }

  for (const block of shellBlocks) {
    block.hidden = block.dataset.commands !== shell;
  }
}

for (const button of shellButtons) {
  button.addEventListener('click', () => selectShell(button.dataset.shell));
}

selectShell(/\bWin/i.test(navigator.platform) ? 'powershell' : 'bash');
shellPicker.hidden = false;

if (navigator.clipboard?.writeText) {
  for (const block of document.querySelectorAll('.code-block')) {
    const code = block.querySelector('code');
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-button';
    button.textContent = 'Copy';
    let resetTimer;

    button.addEventListener('click', async () => {
      clearTimeout(resetTimer);
      try {
        await navigator.clipboard.writeText(code.textContent);
        button.textContent = 'Copied';
      } catch {
        const selection = window.getSelection();
        selection.selectAllChildren(code);
        button.textContent = 'Selected';
      }
      resetTimer = setTimeout(() => {
        button.textContent = 'Copy';
      }, 2000);
    });

    block.append(button);
  }
}

const lightbox = document.querySelector('.lightbox');

if (typeof lightbox.showModal === 'function') {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxTitle = document.querySelector('#lightbox-title');

  for (const link of document.querySelectorAll('.screenshot-link')) {
    link.addEventListener('click', (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      lightboxImage.src = link.href;
      lightboxImage.alt = link.querySelector('img').alt;
      lightboxTitle.textContent = link.dataset.caption;
      lightbox.showModal();
    });
  }

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}
