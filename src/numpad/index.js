import PapapaFramework from '../framework';
import * as util from '../lib/util';
import './index.less';
import template from './index.html';

class Numpad extends PapapaFramework {
    constructor(...args) {
        super(template, ...args);
    }
    popup(...args) {
        super.popup();
        console.log(222);
    }
    _willPopUp() {

    }
    _didPopUp() {

    }
    _willFold() {

    }
    _didFold() {

    }
    _keyDown() {

    }
}

export default Numpad;