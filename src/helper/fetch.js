import  showLogin from '@components/show-login';
import { param2string } from './utils';
import HOST from './host';

const fancy = (url, res) => {
    if (location.pathname !== '/' && res.error && res.error.type === 'authentication_error' && !/\/revoke/.test(url)) {
        showLogin();
    }

    return res;
};


/**
 * POST
 * @param {String} url 
 * @param {Object} data 
 * @param {Object} options 
 */
function post (url, data, opt) {
    const options = {
        method: 'POST',
        headers: {...opt},
        mode: 'cors',
        body: data
    };

    return fetch(`${HOST}${url}`, options).then(res => res.json()).then(fancy.bind(null, url)).catch(error => {
        return { error };
    });
}

/**
 * POST JSON
 * @param {String} url 
 * @param {Object} data 
 * @param {Object} options 
 */
function postJSON (url, data, opt) {
    const options = {
        method: 'POST',
        headers: Object.assign({
            'content-type': 'application/json'
        }, opt),
        mode: 'cors',
        body: data ? JSON.stringify(data) : ''
    };

    return fetch(`${HOST}${url}`, options).then(res => res.json()).then(fancy.bind(null, url)).catch(error => {
        return { error };
    });
}

/**
 * PUT JSON
 * @param {String} url 
 * @param {Object} data 
 * @param {Object} options 
 */
function putJSON (url, data, opt) {
    const options = {
        method: 'PUT',
        headers: Object.assign({
            'content-type': 'application/json'
        }, opt),
        mode: 'cors',
        body: data ? JSON.stringify(data) : ''
    };

    return fetch(`${HOST}${url}`, options).then(res => res.json()).then(fancy.bind(null, url)).catch(error => {
        return { error };
    });
}

/**
 * DELETE JSON
 * @param {String} url 
 * @param {Object} data 
 * @param {Object} options 
 */
function deleteData (url, data, opt) {
    const options = {
        method: 'DELETE',
        headers: Object.assign({
            'content-type': 'application/json'
        }, opt),
        mode: 'cors'
    };

    return fetch(`${HOST}${url}`, options).then(res => res.json()).then(fancy.bind(null, url)).catch(error => {
        return { error };
    });
}

/**
 * GEG DATA
 * @param {String} url 
 * @param {Object} data 
 * @param {Object} opt 
 */
function getData (url, data, opt) {
    const options = {
        method: 'GET',
        headers: Object.assign({
            'content-type': 'application/json'
        }, opt),
        mode: 'cors'
    };

    return fetch(`${HOST}${url}?${param2string(data)}`, options).then(res => res.json()).then(fancy.bind(null, url)).catch(error => {
        return { error };
    });
}

export {
    post,
    postJSON,
    putJSON,
    deleteData,
    getData
}