import PapapaFramework from '../framework';
import * as util from '../lib/util';
import './index.less';
import template from './index.html';

class Numpad extends PapapaFramework {
    constructor(...args) {
        super(template, ...args);
    }
}

export default Numpad;