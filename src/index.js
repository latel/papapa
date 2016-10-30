/*
 * 虚拟键盘
 * @class Papapa
 * @version 1.0.0
 * @author: Kevinnwang <latelx64@icloud.com>
 * @date: 2016.10.28
 */

'use strict';

// 引入键盘框架、目标键盘模块和样式表
import PapapaFramework from './framework';

import PapapaNumpad from './numpad/index';


/*
    * Papapa虚拟键盘类
    *
    * @class Papapa
    * @param {Object} options - 初始化键盘的选项
    * @constructor
    * @return {Object} 指定类型的微证券虚拟键盘的实例
    */
function Papapa(options) {
    options = 'object' === typeof options ? options : {};

    
    switch (options.keyboardType) {
    
    case 'numpad':
        return new PapapaNumpad(options);
        break;
    
    default:
        throw new TypeError(options.type ? ('papapa keyboard type ' + options.type + ' is not available.') : 'must specialfy a papapa keyboard type.');
        break;
    }
    
}

// 将所有类型的键盘直接挂载为 Papapa 的子类型方便调用
Papapa.Framework = PapapaFramework;

Papapa.Numpad = PapapaNumpad;


// 版本号
Papapa.version = '1.0.0';

module.exports = Papapa;