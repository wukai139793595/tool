// 获取滚动条滚动距离
function myPageOffset() {
    if (window.pageXOffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft || document.documentElement.scrollLeft,
            y: document.body.scrollTop || documnet.documentElement.scrollTop
        }
    }
}
// 获取视口尺寸
function myClient() {
    if (window.innerWidth) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    } else if (document.compatMode === 'CSS1Compat') {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    } else {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    }
}

// 获取元素位置
HTMLElement.prototype.myOffset = function () {
    var x = this.offsetLeft,
        y = this.offsetTop,
        oDom = this;

    while (oDom !== document.body && oDom !== document.documentElement) {
        x += oDom.offsetParent.offsetLeft + parseInt(myStyle(oDom.offsetParent, "borderLeftWidth"));
        y += oDom.offsetParent.offsetTop + parseInt(myStyle(oDom.offsetParent, "borderTopWidth"));
        oDom = oDom.offsetParent;

    }
    return {
        x: x,
        y: y
    }
}

function myElementOffset(oDom) {
    var x = oDom.offsetLeft,
        y = oDom.offsetTop;
    while (oDom !== document.body && oDom !== document.documentElement) {
        x += oDom.offsetParent.offsetLeft + parseInt(myStyle(oDom.offsetParent, "borderLeftWidth"));
        y += oDom.offsetParent.offsetTop + parseInt(myStyle(oDom.offsetParent, "borderTopWidth"));
        oDom = oDom.offsetParent;
    }
    return {
        x: x,
        y: y
    }
}
// 获取样式
function myStyle(oDom, prop) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(oDom, null)[prop];
    } else {
        return oDom.currentStyle[prop];
    }
}

function myStyleS(oDom, prop) {
    if (window.getComputedStyle) {
        myStyleS = function (oDom, prop) {
            return window.getComputedStyle(oDom, null)[prop];
        }
        return myStyleS();
    } else {
        myStyleS = function (oDom, prop) {
            return oDom.currentStyle[prop];
        }
        return myStyleS();
    }
}
// 绑定事件
function addEvent(oDom, type, handle) {
    if (oDom.addEventListener) {
        oDom.addEventListener(type, handle, false)
    } else if (oDom.attachEvent) {
        oDom.attachEvent('on' + type, function (e) {
            handle.call(oDom);
        })
    } else {
        oDom['on' + type] = handle;
    }
}
// 取消冒泡
function stopBubble(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    } else {
        e.cancelBubble = true;
    }
}
// 取消默认事件
function cancelHandle(e) {
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

function startMove(oDom, target, callback) {
    var speed = {};
    for (var prop in target) {
        if (prop === 'opacity') {
            speed[prop] = (target[prop] - parseFloat(myStyle(oDom, prop)) * 100) / 10;
        } else {
            speed[prop] = (target[prop] - parseInt(myStyle(oDom, prop))) / 10;
        }
    }

    oDom.timer = setInterval(function () {
        var isStop = true;
        for (var prop in target) {
            if (prop === 'opacity') {
                var iCur = parseFloat(myStyle(oDom, prop)) * 100;
                if (Math.abs(iCur - target[prop]) < Math.abs(speed[prop])) {
                    oDom.style[prop] = target[prop] / 100;
                } else {
                    oDom.style[prop] = (iCur + speed[prop]) / 100;
                    isStop = false;
                }
            } else {
                var iCur = parseInt(myStyle(oDom, prop));
                if (Math.abs(iCur - target[prop]) < Math.abs(speed[prop])) {
                    oDom.style[prop] = target[prop] + "px";
                } else {
                    oDom.style[prop] = iCur + speed[prop] + "px";
                    isStop = false;
                }
            }
        }
        if (isStop) {
            clearInterval(oDom.timer);
            typeof callback === "function" ? callback() : "";
        }
    }, 80)
}

var myCookie = {
    setCookie: function (name, value, age) {
        document.cookie = name + "=" + value + ";max-age=" + age;
        return this;
    },
    removeCookie: function (name) {
        return this.setCookie(name, "", -1);
    },
    getCookie: function (name, callback) {
        var cookieArr = document.cookie.split("; ");
        var data = undefined;
        cookieArr.forEach(function (ele, index, self) {
            var eleArr = ele.split("=");
            if (eleArr[0] === name) {
                data = eleArr[1];
            }
        });
        callback(data);
        return this;
    }
}

//快速排序
function quickSort(arr) {
    var left = [];
    var right = [];
    var key = arr[0];
    var mid = [];
    if (arr.length < 2) {
        return arr;
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < key) {
            left.push(arr[i]);
        } else if (arr[i] > key) {
            right.push(arr[i]);
        } else {
            mid.push(arr[i]);
        }
    }
    return [].concat(quickSort(left), mid, quickSort(right))
}
// console.log(quickSort(arr));


// 归并排序
function mergeSort(arr) {
    if (arr.length < 2) {
        return arr;
    }
    var mid = Math.floor(arr.length / 2);
    var left = arr.slice(0, mid);
    var right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
    var result = [];
    while (left.length && right.length) {
        if (left[0] < right[0]) {
            var num = left.shift();
            result.push(num);
            // pop 删除最后一项   shift删除第一箱
        } else {
            var num = right.shift();
            result.push(num);
        }
    }
    return result.concat(left, right);
}

function myExtend(target, origin) {
    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if ({}.toString.call(origin[prop]) === 'object Object') {
                if (!target[prop]) {
                    target[prop] = {};
                }
                myExtend(target[prop], origin[prop]);
            } else if ({}.toString.call(origin[prop]) === 'object Array') {
                if (!target[prop]) {
                    target[prop] = [];
                }
                myExtend(target[prop], origin[prop]);
            } else {
                target[prop] = origin[prop];
            }
        }
    }
}
//promise 源码模拟
(function () {
    class myPromise {
        constructor(fn) {
            if (typeof fn !== 'function') {
                throw Error(`Promise resolver ${fn} is not a functionat new Promise (<anonymous>)`)
            }
            this.status = 'pending';
            this.data = undefined;
            this.resolveCBArr = [];
            this.rejectCBArr = [];
            let resolved = (data) => {
                if (this.status === 'pending') {
                    this.data = data;
                    this.status = 'resolved';
                    setTimeout(() => {
                        this.resolveCBArr.length && this.resolveCBArr.forEach(fn => fn());
                    })
                }
            }
            let rejected = (data) => {
                if (this.status === 'pending') {
                    this.data = data;
                    this.status = 'rejected';
                    setTimeout(() => {
                        this.rejectCBArr.length && this.rejectCBArr.forEach(fn => fn());
                    })
                }
            }
            fn(resolved, rejected)
        }
        then(resolveFn, rejectFn) {
            if (this.status === 'resolved') {
                let res = resolveFn(this.data)
                if (res instanceof myPromise) {
                    return res
                } else {
                    return myPromise.resolve(res)
                }
            } else if (this.status === 'rejected') {
                let res = rejectFn(this.data)

                if (res instanceof myPromise) {
                    return res
                } else {
                    return myPromise.resolve(res)
                }
            } else if (this.status === 'pending') {
                return new myPromise((resolve, reject) => {
                    this.resolveCBArr.push(((resolveFn) => {
                        return () => {
                            var res = resolveFn(this.data);
                            if (res instanceof myPromise) {
                                res.then(resolve, reject)
                            } else {
                                resolve(res)
                            }
                        }
                    })(resolveFn));
                    this.rejectCBArr.push(((rejectFn) => {
                        return () => {
                            var res = rejectFn(this.data);
                            if (res instanceof myPromise) {
                                res.then(resolve, reject)
                            } else {
                                resolve(res)
                            }
                        }
                    })(rejectFn));
                })
            }
        }
        static resolve(res) {
            return new myPromise(function (resolve, reject) {
                resolve(res)
            })
        }
        static reject(res) {
            return new myPromise(function (resolve, reject) {
                reject(res)
            })
        }
    }
})()

//通过class查找dom函数
Document.prototype.myElementsByClassName = function (str) {
    var allDomArr = document.getElementsByTagName('*');
    var domArr = [].slice.call(allDomArr);
    var reg = /\s+/g;
    var strArr = str.replace(reg, ' ').trim().split(' ');
    var result = [];
    domArr.forEach(function (ele, index) {
        var clsArr = ele.className.replace(reg, ' ').trim().split(' ');
        var flag = true;
        var clsObj = {};
        clsArr.forEach(function (e, i){
            clsObj[e] = true;
        })
        strArr.forEach(function (e, i) {
            if(!clsObj[e]){
                flag = false;
            }
        })
        if(flag){
            result.push(ele);
        }
    })
    return result;
}