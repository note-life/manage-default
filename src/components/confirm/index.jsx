import React from 'react';
import ReactDOM from 'react-dom';

import AlertDialog from './content';

const confirm = (props) => {
    let ele = document.createElement('div');

    ReactDOM.render(<AlertDialog {...props} />, ele);
}

export default confirm;
