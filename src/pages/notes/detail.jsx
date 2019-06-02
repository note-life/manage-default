import React from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import LightTooltip from '@components/light-tooltip';
import TagSelector from '@components/tag-selector';
import PicUploader from '@components/pic-uploader';
import EmojiList from '@components/emoji-list';
import message from '@components/message';
import confirm from '@components/confirm';

import mark from '@helper/mark';
import { getData, postJSON, putJSON } from '@helper/fetch';
import 'codemirror/mode/markdown/markdown';
import './detail.pcss';

const cutMarkdown = (str) => {
    const arr = [];

    let noEmptyLine = 0;
    let codesNum = 0;

    str.split('\n').forEach((v, i) => {
        v = v.trim();

        if (!v) noEmptyLine += 1;

        if (arr.join('').length > 200 || noEmptyLine > 3) return;

        if (/^```/.test(v)) codesNum += 1;

        arr.push(v);
    });

    if (codesNum % 2) arr.push('...\n```');

    return arr.join('\n') + '\n...';
};

const getNoteFromLocal = () => {
    let note = {};

    try{
        const noteStr = localStorage.getItem('note');

        note = noteStr ? JSON.parse(noteStr) : {};
    } catch (error) {}

    return note;
}

class NoteDetail extends React.Component {
    state = {
        unsaved: true,
        open: false,
        note: getNoteFromLocal(),
        tags: [],
        archives: [],
        insertEmoji: []
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        this.fetchTags();
        this.fetchArchives();

        if (id === '-1') return;

        this.fetchNote(id);
    }

    componentWillUnmount() {
        this.clearData();
    }

    clearData = () => {
        localStorage.removeItem('note');
        this.setState({
            unsaved: true,
            open: false,
            note: '',
            tags: [],
            archives: []
        })
    }

    fetchTags = async () => {
        const res = await getData('/tags');

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ tags: res });
        }
    }

    fetchArchives = async () => {
        const res = await getData('/archives');

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ archives: res });
        }
    }

    fetchNote = async (id) => {
        const res = await getData(`/notes/${id}`, null, { ut: localStorage.getItem('ut') });

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ note: res.note });
        }
    }

    backNoteList = () => {
        const { unsaved } = this.state;

        const backList = () => {
            this.clearData();
            this.props.history && this.props.history.push('/notes');
        }

        if (!unsaved) {
            backList();
            return;
        }

        confirm({
            title: '确认离开',
            content: '当前还未保存，确认离开？',
            onOk: () => {
                backList();
            }
        });
    }

    showSendModal = () => {
        if (!this.state.note.content) {
            confirm({
                title: '提示',
                content: '当前内容为空，不能发布',
                onOk: () => {

                },
                onCancel: () => {

                }
            });
        } else {
            this.setState({ open: true });
        }
    }

    showImgModal = () => {
        this.setState({ imgModalVisible: true });
    }

    closImgModal = () => {
        this.setState({
            imgModalVisible: false,
            insertImg: '',
            insertImg1: ''
        });
    }

    showEmojiModal = () => {
        this.setState({ emojiModalVisible: true });
    }

    closEmojiModal = () => {
        this.setState({ emojiModalVisible: false, insertEmoji: [] });
    }

    closSendeModal = () => {
        this.setState({ open: false });
    }

    togglePreview = () => {
        this.setState({ previewMode: !this.state.previewMode });
    }

    handleTitle = (e) => {
        const { note } = this.state;

        note.title = e.target.value;
        this.setState({ note });
    }

    handleCoverImg = (type, value) => {
        const { note } = this.state;

        if (type === 'uploader') {
            note.coverImg = value;
        } else {
            note.coverImg = value.target.value;
        }
        this.setState({ note });
    }

    handleContent = (editor, data, value) => {
        const { note } = this.state;

        note.content = value;
        localStorage.setItem('note', JSON.stringify(note));
        this.setState({ note });
    }

    handleTags = (tags) => {
        const { note } = this.state;

        note.tags = tags;
        this.setState({ note });
    }

    handleArchive = (e) => {
        const { note } = this.state;

        note.archive = e.target.value;
        this.setState({ note });
    }

    handleDraft = (e) => {
        const { note } = this.state;

        note.draft = e.target.checked;
        this.setState({ note });
    }

    handlePrivate = (e) => {
        const { note } = this.state;

        note.private = e.target.checked;
        this.setState({ note });
    }

    handleOk = async () => {
        const { note } = this.state;
        const headers = { ut: localStorage.getItem('ut') };

        note.summary = cutMarkdown(note.content);

        const res = note._id ? await putJSON(`/notes/${note._id}`, note, headers) : await postJSON('/notes', note, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ note: res });

            message.success(note._id ? '修改成功' : '发布成功');
            this.clearData();
            this.closSendeModal();
            this.props.history.push('/notes');
        }
    }

    handleInserImg = (type, e) => {
        if (type === 'input') {
            this.setState({ insertImg: e.target.value });
        } else {
            this.setState({ insertImg1: e, insertImg: e });
        }
    }

    doInsertImg = () => {
        const { insertImg = '' } = this.state;

        this.editor.replaceSelection(`\n![img](${insertImg})`);
        this.closImgModal();
    }

    handleInsertEmoji = (e) => {
        // this.setState({ insertEmoji: e.target.value });
    }

    doInsertEmoji = () => {
        const { insertEmoji = [] } = this.state;

        this.editor.replaceSelection(insertEmoji.join(''));
        // this.emojiList.storeRecents();
        EmojiList.storeEmojiRecents(insertEmoji);
        this.closEmojiModal();
    }

    handleEmojiSelect = (emoji) => {
        let { insertEmoji } = this.state;

        if (insertEmoji.length > 22) {
            message.info('感觉你在搞事情，但貌似我又没证据 🙄.')
        }

        insertEmoji.push(emoji);
        this.setState({ insertEmoji })
    }

    clearInertEmojis = () => {
        this.setState({ insertEmoji: [] });
    }

    renderPreview(data) {
        return mark(data, true);
    }

    fullWindowPreview = () => {
        localStorage.setItem('note', JSON.stringify(this.state.note))
        window.open('/note-preview');
    }

    render () {
        const {
            open, note, tags, archives,
            imgModalVisible, emojiModalVisible, insertImg,
            insertImg1, insertEmoji
        } = this.state;

        const options = {
            mode: 'markdown',
            autofocus: true,
            autosave: true,
            styleActiveLine: true,
            lineWrapping: true,
            matchBrackets: true
        };

        return (
            <div className={`note-detail-wrapper ${this.state.previewMode ? 'preview-mode' : 'full-mode'}`}>
                <CodeMirror
                    className="markdown-editor"
                    value={note.content}
                    options={options}
                    autoSave
                    ref={this.ref}
                    editorDidMount={editor => this.editor = editor }
                    onBeforeChange={this.handleContent}
                />
                <div className="markdown-preview">
                    <Button variant="outlined" className="full-window" onClick={this.fullWindowPreview}>
                        <i className="material-icons">laptop</i>全窗口预览
                    </Button>
                    <div dangerouslySetInnerHTML={{__html: this.renderPreview(note.content)}} />
                </div>
                <div className="tool-bar">
                    <LightTooltip title={note._id ? '更新' : '发布'} placement="right">
                        <Fab className="menu" color="primary" onClick={this.showSendModal}>
                            <i className="material-icons">{note._id ? 'sync' : 'send'}</i>
                        </Fab>
                    </LightTooltip>

                    <LightTooltip title="预览" placement="right">
                        <Fab className="menu" color="primary" onClick={this.togglePreview}>
                            <i className="material-icons">desktop_mac</i>
                        </Fab>
                    </LightTooltip>

                    <LightTooltip title="表情" placement="right">
                        <Fab className="menu" color="primary" onClick={this.showEmojiModal}>
                            <i className="material-icons">tag_faces</i>
                        </Fab>
                    </LightTooltip>

                    <LightTooltip title="插入图片" placement="right">
                        <Fab className="menu" color="primary" onClick={this.showImgModal}>
                            <i className="material-icons">photo_size_select_actual</i>
                        </Fab>
                    </LightTooltip>

                    <LightTooltip title="返回" placement="right">
                        <Fab className="menu" onClick={this.backNoteList}>
                            <i className="material-icons">reply</i>
                        </Fab>
                    </LightTooltip>
                </div>
                <Modal
                    className="modal-wrapper"
                    open={open}
                    onClose={this.closSendeModal}
                >
                    <div className="modal-content">
                        <header><h1>{note._id ? '更新' : '发布'}文章</h1></header>
                        <main>
                            <div className="form-item">
                                <label htmlFor="">文章标题:</label>
                                <TextField
                                    id="title"
                                    className="title-input"
                                    fullWidth
                                    value={note.title || ''}
                                    onChange={this.handleTitle}
                                />
                            </div>
                            <div className="form-item">
                                <label htmlFor="">文章封面:</label>
                                <TextField
                                    id="title"
                                    className="title-input"
                                    fullWidth
                                    value={note.coverImg || ''}
                                    onChange={this.handleCoverImg.bind(null, 'text')}
                                />
                                <PicUploader value={note.coverImg} onChange={this.handleCoverImg.bind(null, 'uploader')} />
                            </div>
                            <div className="form-item">
                                <label htmlFor="">文章标签:</label>
                                <TagSelector tags={tags} value={note.tags} onChange={this.handleTags} />
                            </div>
                           <div className="form-item">
                                <label htmlFor="">归档:</label>
                                <Select value={note.archive || ''} onChange={this.handleArchive} className="archive-selector">
                                    {archives.map(({name, _id}) => (<MenuItem value={name} key={_id}>{name}</MenuItem>))}
                                </Select>
                           </div>
                            <div className="checkbox-item"><Checkbox value="checkedC" checked={note.draft} onChange={this.handleDraft} />存为草稿</div>
                            <div className="checkbox-item"><Checkbox value="checkedC" checked={note.private} onChange={this.handlePrivate} />设为私密</div>
                        </main>
                        <footer>
                            <Button color="primary" onClick={this.closSendeModal}>Cancel</Button>
                            <Button color="primary" onClick={this.handleOk}>OK</Button>
                        </footer>
                    </div>
                </Modal>
            
                <Modal
                    className="modal-wrapper"
                    open={imgModalVisible}
                    onClose={this.closImgModal}
                >
                    <div className="modal-content">
                        <div className="img-input">
                            <TextField
                                fullWidth
                                placeholder="请输入图片链接或点击下方上传图片"
                                value={insertImg || ''}
                                onChange={this.handleInserImg.bind(null, 'input')}
                            />
                        </div>
                        <div className="upload-area">
                            <PicUploader value={insertImg1} onChange={this.handleInserImg.bind(null, 'upload')} />
                        </div>
                        <footer>
                            <Button color="primary" onClick={this.closImgModal}>Cancel</Button>
                            <Button color="primary" onClick={this.doInsertImg}>OK</Button>
                        </footer>
                    </div>
                </Modal>

                <Modal
                    className="modal-wrapper emoji-modal"
                    open={emojiModalVisible}
                    onClose={this.closEmojiModal}
                >
                    <div className="modal-content">
                        <div className="emoji-input">
                            <TextField
                                fullWidth
                                placeholder="请选择表情"
                                value={insertEmoji.join('')}
                                onChange={this.handleInsertEmoji}
                            />
                            <i className="material-icons" onClick={this.clearInertEmojis}>close</i>
                        </div>
                        <div className="">
                            <EmojiList onSelect={this.handleEmojiSelect} />
                        </div>
                        <footer>
                            <Button color="primary" onClick={this.closEmojiModal}>Cancel</Button>
                            <Button color="primary" onClick={this.doInsertEmoji}>OK</Button>
                        </footer>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default NoteDetail;
