import * as util from './lib/util';
import './framework.less';
import tplTarget from './target.html';
import tplKeyboard from './keyboard.html';

const ClassNames = { // 键盘的样式Hooks
        Keyboard: 'papapa-keyboard',
        Target: 'papapa-target',
        Empty: 'papapa-keyboard-empty',
        Popup: 'papapa-keyboard-popup',
        ThemedBy: 'papapa-keyboard-theme--',
        StateAt: 'papapa-keyboard-state--',
        Direction: {
            Landscape: 'papapa-direction-landscape'
        },
        Key: 'papapa-keyboard-key',
        KeyTap: 'papapa-keyboard-key--tap',
        HasPlaceHolder: 'papapa-keyboard-hasplaceholder',
        HasPlaceHolderVisible: 'papapa-keyboard-haspalceholder--visible',
        Disable: 'papapa-keyboard-disable',
        ShiftLock: 'papapa-keyboard-shiftlock',
        CapsLock: 'papapa-keyboard-capslock',
        Cursor: 'papapa-target-cursor'
    },
    Direction = {
        Portrait: 'portrait',
        Landscape: 'landscape'
    };

class PapapaFramework {
    constructor(template, options) {
        this._index = PapapaFramework.index++;
        this._options = options = options || {}; // 键盘实例的配置
        this._template = template || tplKeyboard;
        this._state = { // 键盘实例可用的状态
            normal: true
        };
        this._events = {}; // 记录注册的事件

        this.$keyboard = null; // 键盘的容器
        this.$target = null; // 绑定的虚拟input容器
        
        this.maxLength = Infinity;
        this.isPopup = false; // 键盘是否已弹起
        this.value = ''; // 当前的值
        this.isEmpty = true; // 当前值是否为空
        this.isDisabled = false; // 是否被禁用
        this.hasPlaceHolder = false; // 是否有placeholder
        this.hasPlaceHolderVisible = false; // placeholder是否可见
        this.direction = Direction.Portrait;
        this.capsLock = false;
        this.shiftLock = false;


        this._initDymaticProperties();
        this._prepareKeyboard();
        this._prepareTarget();
        this._watchDirectionChanges();
        this._bindEvents();
    }

    setValue(newValue) {
        var currentValue;
        if (this.$target/* && this._options.pattern.test(newValue)*/) {
            currentValue = this.value;
            if (this._dispatchEvent('change', currentValue, newValue)) {
                this.value = newValue;
                this.$target.children[0].innerHTML = newValue;
                if (this.value) {
                    this._class.remove(
                        PapapaFramework.ClassNames.HasPlaceHolderVisible,
                        PapapaFramework.ClassNames.Empty
                    );
                    this.$target.classList.add(PapapaFramework.ClassNames.Cursor);
                }
                else {
                    this._class.add(PapapaFramework.ClassNames.Empty);
                }
            }
            else {
                this._dispatchEvent('unchange', currentValue, newValue)
            }
        }
    }

    popup() {
        if (this._dispatchEvent('popup')) {
            this._class.add(PapapaFramework.ClassNames.Popup);
            this.isPopup = true;
            if (this.$target && !this.value) {
                this._class.remove(PapapaFramework.ClassNames.HasPlaceHolderVisible);
                this.$target.classList.add(PapapaFramework.ClassNames.Cursor);
                this.$target.children[0].innerHTML = '';
            }
        }
        else {
            this._dispatchEvent('unpopup');
        }
    }

    fold() {
        if (this._dispatchEvent('fold')) {
            this._class.remove(PapapaFramework.ClassNames.Popup);
            this.isPopup = false;
            if (!this.value) {
                this.$target.children[0].innerHTML = this._options.placeHolder;
                this._class.add(PapapaFramework.ClassNames.HasPlaceHolderVisible);
                if (this.$target) {
                    this.$target.classList.remove(PapapaFramework.ClassNames.Cursor);
                }
            }
        }
        else {
            this._dispatchEvent('unfold');
        }
    }

    destory() {
        if (this._dispatchEvent('event')) {
            console.log('destoried');
        }
    }

    on(eventName, handler) {
        if ('string' === typeof eventName && 'function' === typeof handler) {
            return this._registerEvent(eventName, handler);
        }
    }

    when(...args) {
        this.on(...args);
    }

    off(eventName, eventId) {
        if ('string' === typeof eventName) {
            this._delEvent(eventName, eventId);
        }
    }

    _initDymaticProperties() {
        var self = this;

        Object.defineProperties(this, {
            size: {
                configurable: false,
                get: function() {
                    return {
                        width: self.$keyboard.offsetWidth,
                        height: self.$keyboard.offsetHeight
                    };
                }
            }
        });
    }

    _prepareTarget() {
        var preSetValue;
        if (this._options.target instanceof Element) {
            this.$target = this._options.target;
            this.$target.classList.add(PapapaFramework.ClassNames.Target);

            util.merge(this._options, {
                maxLength: this.$target.getAttribute('maxlength'),
                placeHolder: this.$target.getAttribute('placeholder'),
                pattern: this.$target.getAttribute('pattern')
            });
            this._options.pattern = this._options.pattern || /.*/g;

            if ((this.hasPlaceHolder = this._options.target.getAttribute('placeholder') ? true : false)) {
                this._class.add(
                    PapapaFramework.ClassNames.HasPlaceHolder,
                    PapapaFramework.ClassNames.HasPlaceHolderVisible
                );
            }
            if (this._options.target.innerHTML) {
                preSetValue = this.$target.innerHTML;
                this.hasPlaceholderVisible = false;
                this._class.remove(
                    PapapaFramework.ClassNames.Empty,
                    PapapaFramework.ClassNames.HasPlaceHolderVisible
                );
                this._class.add(PapapaFramework.ClassNames.Empty);
            }
            else if (this.hasPlaceHolder) {
                this.$target.children[0].innerHTML = this._options.placeHolder;
            }
            this.$target.innerHTML = '';
            this.$target.insertAdjacentElement('beforeend', util.render(tplTarget));
            this.$target.children[0].style.height = this.$target.offsetHeight + 'px';
            this.setValue(preSetValue);
        }
        else {
            delete this._options.target;
        }
    }

    _prepareKeyboard() {
        if (this._template) {
            this.$keyboard = util.render(this._template, {
                options: this._options
            });
            this.$keyboard.id = this._index;
            document.body.appendChild(this.$keyboard);
        }
        else {
            throw new Error('papapa keyboard template is not ready.');
        }
    }

    _applyTheme(themeName) {

    }

    _changeInternalState(state) {

    }

    _watchDirectionChanges() {
        var self = this, orientation = ['portrait', , 'landscape'][window.orientation & 2];

        this.direction = orientation;
        if (PapapaFramework.ClassNames.Direction.Landscape === orientation) {
            self._class.add(PapapaFramework.ClassNames.Direction.Landscape);
        }

        function orientationChangeHandler() {
            if (PapapaFramework.Direction.Landscape === ['portrait', , 'landscape'][window.orientation & 2]) {
                self.direction = PapapaFramework.Direction.Landscape;
                self._class.add(PapapaFramework.ClassNames.Direction.Landscape);
            }
            else {
                self.direction = PapapaFramework.Direction.Portrait;
                self._class.remove(PapapaFramework.ClassNames.Direction.Landscape);
            }

            self._dispatchEvent('orientationchange', self.direction);
        }

        window.addEventListener('orientationchange', orientationChangeHandler, false);
    }

    _registerEvent(eventName, handler) {
        this._properEventMapType(eventName);
        this._events[eventName].push(handler);
        return handler;
    }

    _delEvent(eventName, handlerId) {
        this._properEventMapType(eventName);
        if (undefined === handlerId) {
            delete this._events[eventName];
        }
        else {
            for (var i = 0; i < this._events[eventName].length; i++) {
                if (this._events[eventName][i] === handlerId) {
                    this._events[eventName] = this._events[eventName].slice(0, i).concat(this._events[eventName].slice(i + 1));
                    break;
                }
            }
        }
    }

    _dispatchEvent(eventName) {
        var checkResult = true, result;
        this._properEventMapType(eventName);
        for (var i = 0; i < this._events[eventName].length; i++) {
            result = this._events[eventName][i].apply(this, Array.prototype.slice.call(arguments, 1));
            // 如果已经标记为错误，就一直保持为错误
            checkResult = checkResult ? result : checkResult;
        }
        return checkResult;
    }

    _properEventMapType(eventName) {
        this._events[eventName] = this._events[eventName] || [];
    }

    get _class() {
        var self = this;
        return {
            add: function(...args) {
                self.$keyboard.classList.add(...args);
                if (self._options.target) {
                    self.$target.classList.add(...args);
                }
            },
            remove: function(...args) {
                self.$keyboard.classList.remove(...args);
                if (self._options.target) {
                    self.$target.classList.remove(...args);
                }
            }
        }
    }

    _bindEvents() {
        var self = this;
        util.delegate(this.$keyboard, 'touchstart', '.' + PapapaFramework.ClassNames.Key, function(ev) {
            ev.stopPropagation();
            this.classList.add(PapapaFramework.ClassNames.KeyTap);
        });
        util.delegate(this.$keyboard, 'touchend', '.' + PapapaFramework.ClassNames.Key, function(ev) {
            var keyCode = +this.getAttribute('data-key');
            ev.stopPropagation();
            this.classList.remove(PapapaFramework.ClassNames.KeyTap);
            if (self._dispatchEvent('keyup', keyCode)) {
                switch (keyCode) {
                case 8:
                    self.setValue(self.value.slice(0, -1));
                    break;

                case 13:
                    self.fold();
                    break;

                default:
                    self.setValue(self.value + String.fromCharCode(keyCode));
                    break;
                }
            }
        });
        if (this._options.physical) {
            // 监听并响应真实键盘
            window.addEventListener('keydown', function(ev) {
                switch(ev.keyCode) {
                case 16:
                    self.shiftLock = true;
                    self._class.add(PapapaFramework.ClassNames.ShiftLock);
                    break;
                case 20:
                    self.capsLock = true;
                    self._class.add(PapapaFramework.ClassNames.CapsLock);
                    break;
                default:
                    break;
                }
            });
            window.addEventListener('keyup', function(ev) {
                switch(ev.keyCode) {
                case 16:
                    self.shiftLock = false;
                    self._class.remove(PapapaFramework.ClassNames.ShiftLock);
                    break;

                case 20:
                    self.capsLock = false;
                    self._class.remove(PapapaFramework.ClassNames.CapsLock);
                    break;

                case 8:
                    self.setValue(self.value.slice(0, -1));
                    break;

                case 13:
                    self.fold();
                    break;

                default:
                    self.setValue(self.value + String.fromCharCode((self.capsLock || self.shiftLock) ? ev.keyCode : (ev.keyCode + 32)));
                    break;
                }
            });
        }
        if (this.$target) {
            this.$target.addEventListener('touchend', function(ev) {
                self.popup();
                ev.stopPropagation();
            }, false);
        }
    }
}

PapapaFramework.index = 0;
PapapaFramework.ClassNames = ClassNames;
PapapaFramework.Direction = Direction;

export default PapapaFramework;