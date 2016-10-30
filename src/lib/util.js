import mito from 'mito';

export function extend(original, overriten) {
    for (var i in overriten) {
        if (overriten.hasOwnProperty(i)) {
            original[i] = overriten[i];
        }
    }

    return original;
}

export function merge(original, toMerge) {
    for (var i in toMerge) {
        if (toMerge.hasOwnProperty(i) && original[i] === undefined) {
            original[i] = toMerge[i];
        }
    }

    return original;
}

export function render(template, data) {
    var el = document.createElement('DIV');
    el.innerHTML = mito(template)(data || {});
    return el.children[0];
}

export function delegate($el, eventType, selector, fn) {
    if (!$el) {
        return;
    }
    $el.addEventListener(eventType, function (e) {
        let targets = $el.querySelectorAll(selector);
        if (!targets) {
            return;
        }
        findTarget:
            for (let i = 0; i < targets.length; i++) {
                let $node = e.target;
                while ($node) {
                    if ($node == targets[i]) {
                        fn.call($node, e);
                        break findTarget;
                    }
                    $node = $node.parentNode;
                    if ($node == $el) {
                        break;
                    }
                }
            }
    }, false);
}