import React from 'react';
import { getPicUrl } from '@helper/utils';
import './index.pcss';

const LazyImg = (props) => {
    let imgEle = null;

    const loadBigPic = () => {
        let img = new Image();
        const src = getPicUrl(props.path);

        img.src = src;
        img.onload = () => {
            if (/^images\//.test(props.path)) {
                imgEle && imgEle.setAttribute('src', src);
                img = null;
            }
        }
    }

    loadBigPic();

    return <img className="lazy-img" {...props} src={getPicUrl(props.path, '@thumbnail.jpeg')} ref={ref => imgEle = ref} />
};

export default LazyImg;