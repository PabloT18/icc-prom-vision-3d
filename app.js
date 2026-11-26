const frame = document.querySelector('#module-frame');
const buttons = [...document.querySelectorAll('[data-module]')];
function selectModule(id) {
    const button = buttons.find(b => b.dataset.module === id) || buttons[0];
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    // Removing the previous browsing context also cancels its model loads and timers.
    frame.src = `modules/${button.dataset.module}/index.html`;
    frame.title = button.textContent.trim();
    history.replaceState(null, '', '#' + button.dataset.module);
}
buttons.forEach(b => b.addEventListener('click', () => selectModule(b.dataset.module)));
window.addEventListener('hashchange', () => selectModule(location.hash.slice(1)));
selectModule(location.hash.slice(1));
