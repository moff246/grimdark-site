const bootLines = Array.from(document.querySelectorAll('.boot-line'));
const hero = document.getElementById('hero');
const typedCommand = document.getElementById('typed-command');
const waitlistForm = document.getElementById('waitlist-form');
const formNote = document.getElementById('form-note');
const translationLines = Array.from(document.querySelectorAll('.translate-line'));

const commandText = 'intercede deus mechanicus --awakening host --operator deployment pending';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(base, variance) {
  return base + Math.floor(Math.random() * variance);
}

function charDelay(char, base, variance, fullText = '', currentText = '') {
  let delay = variance > 0 ? jitter(base, variance) : base;

  if (char === ' ') delay += 45;
  if (char === ':' || char === '.') delay += 70;
  if (char === '-') delay += 55;

  const nextWord = fullText.slice(currentText.length).trimStart();
  if (nextWord.startsWith('initiating') && currentText.endsWith(':: ')) {
    delay += 420;
  }

  return delay;
}

async function typeText(text, target, speed = 34, variance = 0) {
  if (!target) return;
  target.textContent = '';
  for (const char of text) {
    target.textContent += char;
    const delay = charDelay(char, speed, variance, text, target.textContent);
    await sleep(delay);
  }
}

async function peelToText(target, nextText, eraseSpeed = 22, typeSpeed = 28) {
  if (!target) return;
  while (target.textContent.length > 0) {
    target.textContent = target.textContent.slice(0, -1);
    await sleep(eraseSpeed);
  }
  await sleep(120);
  for (const char of nextText) {
    target.textContent += char;
    await sleep(typeSpeed);
  }
}

async function cycleTranslations() {
  if (translationLines.length === 0) return;
  await sleep(1800);
  while (true) {
    for (const line of translationLines) {
      await peelToText(line, line.dataset.english || line.textContent, 18, 24);
    }
    await sleep(1600);
    for (const line of translationLines) {
      await peelToText(line, line.dataset.latin || line.textContent, 18, 24);
    }
    await sleep(2200);
  }
}

async function revealBootSequence() {
  for (const [index, line] of bootLines.entries()) {
    const textTarget = line.querySelector('.line-text');
    const lineText = line.dataset.text || '';

    bootLines.forEach((item) => item.classList.remove('active'));
    line.classList.add('visible', 'active');

    if (index === 0) {
      await typeText(lineText, textTarget, 72, 90);
      await sleep(900);
    } else {
      await typeText(lineText, textTarget, 42, 42);
      await sleep(420);
    }

    line.classList.remove('active');
  }

  const lastLine = bootLines[bootLines.length - 1];
  lastLine?.classList.add('active');
  await sleep(350);
  hero?.classList.remove('hidden');
  cycleTranslations();
  await typeText(commandText, typedCommand, 24);
}

if (waitlistForm && formNote) {
  waitlistForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = new FormData(waitlistForm).get('email');
    formNote.textContent = `signal captured :: ${email} :: endpoint not yet bound`;
    waitlistForm.reset();
  });
}

window.addEventListener('load', () => {
  revealBootSequence();
});
