import querystring from 'querystring';
import HOST from './host';

const getUrlParams = function (url = location.search.slice(1)) {
    return querystring.parse(url);
};

const param2string = function (data) {
    let obj = {};

    Object.keys(data || {}).forEach(key => {
        const val = data[key];

        if (val || [false, null, undefined, 0].includes(val)) {
            obj[key] = val;
        }
    });

    return querystring.stringify(obj);
};

const formatDate = function (date) {
    date = new Date(date);

    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const h = date.getHours();
    const mi = date.getMinutes();
    const s = date.getSeconds();

    function foo (num) {
        return `00000${num}`.slice(-2);
    }

    return `${y}-${foo(m)}-${foo(d)} ${foo(h)}:${foo(mi)}:${foo(s)}`;
};

const isEmail = (str) => {
    const pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    return pattern.test(str);
};

const getPicUrl = (host = HOST, path, ext = '.webp') => {
    if (/^(http:\/\/|https:\/\/|\/\/|data:image\/)/.test(path)) return path;

    return path ? `${host}/${path}${ext}` : ''
};

const getSiginedUserInfo = () => {
    let user = {};

    try {
        user = JSON.parse(localStorage.getItem('user')) || {};
    } catch (err) {}

    return user;
}

const filterUserAgentInfo = (userAgent) => {
    const ua = userAgent.toLowerCase();

    let device = 'desktop';
    let browser = 'others';

    if (/chrome/.test(ua)) {
        browser = 'chrome';
    } else if (/firefox/.test(ua)) {
        browser = 'firefox';
    } else if (/(msie|trident)/.test(ua)) {
        browser = 'ie';
    } else if (/edge/.test(ua)) {
        browser = 'edge'
    } else if (/safari/.test(ua) && !/chrome/.test(ua)) {
        browser = 'safari';
    } else if (/(opera|opr)/.test(ua)) {
        browser = 'opera';
    } else {
        browser = 'others';
    }

    // 暂时不区分这么细
    // if (/android/.test(ua)) {
    //     device = 'android';
    // } else if (/iphone/.test(ua)) {
    //     device = 'iphone';
    // } else if (/ipad/.test(ua)) {
    //     device = 'ipad';
    // } else if (/ipad/.test(ua)) {
    //     device = 'ipad';
    // } else if (/(win64|win32|wow64|windows)/.test(ua)) {
    //     device = 'windows';
    // } else if (/macintosh/.test(ua)) {
    //     device = 'mac';
    // } else if (/x11/.test(ua)) {
    //     device = 'linux';
    // }

    if (/mobile/.test(ua)) {
        device = 'mobile';
    } else {
        device = 'desktop';
    }

    return {
        device,
        browser
    }
}

export { getUrlParams, param2string, formatDate, isEmail, getPicUrl, getSiginedUserInfo, filterUserAgentInfo };