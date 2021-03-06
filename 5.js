// 浅拷贝
// function clone(source) {
//     let target = {};
//     for (const key in source) {
//         target[key] = source[key];
//     }
//     return target;
// };

// 深拷贝：支持对象和数组
let obj = {
    name: 'zhufeng',
    age: 10,
    home: { name: '北京' },
    hobbies: ['抽烟', '喝酒', '烫头']
};

function clone(source) {
    if (typeof source === 'object') {
        let target = Array.isArray(source) ? [] : {};
        for (const key in source) {
            target[key] = clone(source[key]);
        }
        return target;
    }
    return source;

};
let cloned = clone(obj);
console.log(Array.isArray(cloned.hobbies));

// 解决循环引用
let obj = {
    name: 'zhufeng',
    age: 10,
    home: { name: '北京' },
    hobbies: ['抽烟', '喝酒', '烫头']
};
obj.obj = obj;

function clone(source, map = new Map()) {
    // 只处理引用类型
    if (typeof source === 'object') {
        if (map.get(source)) {
            return map.get(source);
        }
        let target = Array.isArray(source) ? [] : {};
        // 第一次走obj，这时set为空
        map.set(source, target);
        // 循环时会将set的target填充完
        for (const key in source) {
            target[key] = clone(source[key], map);
        }
        return target;
    }
    return source;

};

let cloned = clone(obj);
console.log(cloned.obj);


// 完整版
let obj = {
    married: true,
    age: 10,
    name: 'zhufeng',
    girlfriend: null,
    boyfriend: undefined,
    flag: Symbol('man'),
    home: { name: '北京' },
    set: new Set(),
    map: new Map(),
    getName: function() {},
    hobbies: ['抽烟', '喝酒', '烫头'],
    error: new Error('error'),
    pattern: /^regexp$/ig,
    math: Math,
    json: JSON,
    document: document,
    window: window
};
obj.set.add(1);
obj.map.set('name', 'value');
obj.obj = obj;


function getType(source) {
    return Object.prototype.toString.call(source);
}
// 获取所有的引用类型的 类型格式
let OBJECT_TYPES = [{},
    [], new Map(), new Set(), new Error(), new Date(), /^$/
].map(item => getType(item)); // ['[object Object]','[object Array]','[object Map]','[object Set]','[object Error]','[object Date]','[object RegExp]']
  

// 获取map数据结构的 类型格式
const MAP_TYPE = getType(new Map()); // [object Map] 
// 获取set数据结构的 类型格式
const SET_TYPE = getType(new Set()); // [object Set]

// Error 和 Date可以直接 new 
const CONSTRUCT_TYPE = [new Error(), new Date()].map(item => getType(item)); // [ '[object Error]', '[object Date]' ]

const SYMBOL_TYPE = getType(Symbol('1')); // [object Symbol]


const REGEXP_TYPE = getType(/^$/);// [object RegExp]


function clone(source, map = new Map()) {
    // 获取source的类型
    let type = getType(source);
    //基本数据类型直接返回
    if (!OBJECT_TYPES.includes(type)) {
        return source;
    }
    // 如果已经克隆过了，直接返回
    if (map.get(source)) {
        return map.get(source);
    }
    // 如果时Error/Date实例，可以通过直接 new 创建对应的克隆值
    if (CONSTRUCT_TYPE.includes(type)) {
        return new source.constructor(source);
    }
    let target = new source.constructor();
    map.set(source, target);
    
    // symbol数据类型的处理
    if (SYMBOL_TYPE === type) {
        return Object(Symbol.prototype.valueOf.call(source));
    }
    // 正则类型的处理
    if (REGEXP_TYPE === type) {
        const flags = /\w*$/;
        const target = new source.constructor(source.source, flags.exec(source));
        // 正则重置上次匹配的索引
        target.lastIndex = source.lastIndex;
        return target;
    }
    // set类型处理
    if (SET_TYPE === type) {
        source.forEach(value => {
            target.add(clone(value, map));
        });
        return target;
    }
    // map类型的处理
    if (MAP_TYPE === type) {
        source.forEach((value, key) => {
            target.set(key, clone(value, map));
        });
        return target;
    }

    // 到这里就是普通的Object对象
    let keys = Object.keys(source);
    let length = keys.length;
    let index = 0;
    while (index < length) {
        target[keys[index]] = clone(source[keys[index]], map);
        index++;
    }
    return target;
};


let cloned = clone(obj);
console.log(cloned);
console.log(obj.home === cloned.home);
console.log(obj.set === cloned.set);
console.log(obj.map === cloned.map);
/*
[object Boolean]
[object Number]
[object String]
[object Null]
[object Undefined]
[object Symbol]
[object Object]
[object Function]
[object Array]
[object Error]
[object RegExp]
[object Math]
[object JSON]
[object HTMLDocument]
[object Window]"
*/