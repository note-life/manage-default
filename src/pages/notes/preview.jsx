import React from 'react';
import mark from '@helper/mark';
import './detail.pcss';
import './preview.pcss';

let note = ''

try {
    const noteObj = JSON.parse(localStorage.getItem('note')) || {};

    note = mark(noteObj.content, true) || 'no data';
} catch (err) {}

const Preview = () => {
    document.title = 'Preview';

    return (
        <div className="note-detail-wrapper preview-mode note-preview">
            <div className="markdown-preview">
                <div dangerouslySetInnerHTML={{ __html: note }} />
            </div>
        </div>
    );
}

export default Preview;