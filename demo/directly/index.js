var keyboard = new Papapa.Numpad({
    withDot: true,
    physical: true,
    target: document.querySelector('.input')
});

document.body.addEventListener('touchend', function() {
    keyboard.fold();
}, false);

document.querySelector('.input').addEventListener('touchend', function(ev) {
    ev.stopPropagation();
}, false);

setTimeout(function() {
    keyboard.popup();
}, 1000);