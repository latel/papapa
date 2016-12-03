Papapa
=======

customizable virtual keyboard for the frontend.

[![Build Status][travis-image]][travis-url]

Install
--------

Prepares
--------

Create a keyboard
-----------------

``` javascript
var keyboard = new Papapa.Numpad();
var keyboard = new Papapa({ type: 'Numpad' });

// create keyboard, bind with a simulated input
var keyboard = new Papapa.Numpad({
    target: document.querySelector('#input')
});

// interactive with physical keyboard
var keyboard = new Papapa.Numpad({
    target: document.querySelector('#input'),
    physical: true
});
```

What is target mode?
----------------

Api
-----

+ popup
    
    pull up the keyboard

+ fold

    fold the keyboard

+ destory

    destory the keyboard

+ on

    register a event listener

+ when

    alias of `on`

+ off

    delete an event listener

+ setValue

    set the current value of the keyboard, only availavle in target mode


Poperties
---------
papapa provides servaral properties.

`$keyboard:` return the dom of the keyboard.

`$target:` return the dom of the target(only in target mode).

`capsLock:` whether keyboard capsLock is active.

`shiftLock:` whether keyboard shiftLock is active.

`size:` return the size the keyboard takes.

`isPopup:` wheter keyboard is popuped.

`value:` return the current value(only in target mode).

`direction:` return the direction.

`disabled:` whether keyboard is currently disabled.

`maxlength:` the maxlength(only in target mode).

`placeHolder:` the placeholder(only in target mode).

`isPlaceHolderVisible:` is the placeholder currently displayed.

`theme:` return the current theme.

`themes:` return avaliable themes.

`state:` return the current keyboard state.

`states:` return avaliable states.


Lifecycle
---------

Known issues
-----------


[travis-image]: https://api.travis-ci.org/latel/papapa.svg
[travis-url]: https://travis-ci.org/latel/papapa