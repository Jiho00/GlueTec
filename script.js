const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
function setMotion(enabled) {
  document.documentElement.classList.toggle('no-motion', !enabled);
  motionButton.setAttribute('aria-pressed', String(enabled));
  motionButton.textContent = enabled ? 'Motion on' : 'Motion off';
}
setMotion(!reducedMotion.matches);
motionButton.addEventListener('click', () => setMotion(motionButton.getAttribute('aria-pressed') !== 'true'));
reducedMotion.addEventListener('change', event => setMotion(!event.matches));

const stageDescriptions = [
  'Start with a target protein and an effector that could support its degradation.',
  'Look for a small molecule that stabilizes an interaction between the target and effector.',
  'Test whether the interaction produces degradation. Binding alone does not establish function.'
];
const mechanism = document.querySelector('.mechanism');
document.querySelectorAll('.stage-buttons button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.stage-buttons button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    mechanism.dataset.stage = button.dataset.stage;
    mechanism.setAttribute('aria-label', stageDescriptions[Number(button.dataset.stage)]);
    document.querySelector('#stage-description').textContent = stageDescriptions[Number(button.dataset.stage)];
  });
});

const tabs = [...document.querySelectorAll('.preview-tabs [role="tab"]')];
function selectTab(tab, moveFocus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (moveFocus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
});

const chapterMenu = document.querySelector('.chapter-menu');
chapterMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { chapterMenu.open = false; }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') chapterMenu.open = false; });
document.addEventListener('click', event => { if (!chapterMenu.contains(event.target)) chapterMenu.open = false; });
const chapters = [...document.querySelectorAll('.chapter')];
let scrollPending = false;
function updateChapter() {
  const marker = window.innerHeight * .35;
  let current = chapters[0];
  chapters.forEach(chapter => { if (chapter.getBoundingClientRect().top <= marker) current = chapter; });
  document.querySelector('#chapter-name').textContent = current.dataset.name;
  document.querySelector('#chapter-number').textContent = current.dataset.number;
  chapterMenu.querySelectorAll('a').forEach(link => {
    if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  document.querySelector('.chapter-progress span').style.width = (scrollable > 0 ? window.scrollY / scrollable * 100 : 0) + '%';
  scrollPending = false;
}
window.addEventListener('scroll', () => {
  if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateChapter); }
}, { passive: true });
window.addEventListener('resize', updateChapter);
updateChapter();
