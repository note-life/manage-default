import React from 'react';
import { getData, postJSON, deleteData } from '@helper/fetch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import confirm from '@components/confirm';
import message from '@components/message';
import './index.pcss';

class TagManage extends React.Component {
    state = {
        tags: []
    }

    componentDidMount() {
        this.fetchTags();
    }

    fetchTags = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData('/tags', null, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ tags: res });
        }
    }

    addTag = () => {
        const doAdd = async (tag) => {
            const headers = { ut: localStorage.getItem('ut') };
            const res = await postJSON('/tags', { tag }, headers);
    
            if (res.error) {
                message.error(res.error.message);
            } else {
                this.fetchTags();
                message.success('添加成功');
            }
        };

        const content = (
            <TextField
                fullWidth
                ref={(ref) => this.tagInput = ref}
                placeholder="请输入标签名称"
            />
        );

        confirm({
            title: '新增标签',
            content,
            onOk: () => {
                const tagName = this.tagInput.querySelector('input').value

                doAdd(tagName);
            }
        });
    }

    handleDel = (tagId) => {
        let doDel = async (tagId) => {
            const headers = { ut: localStorage.getItem('ut') };
            const res = await deleteData(`/tags/${tagId}`, null, headers);

            if (res.error) {
                message.error(res.error.message);
            } else {
                message.info('已经删除');
                this.fetchTags();
            }
        };

        confirm({
            title: '删除标签',
            content: '确认删除该标签？',
            onOk: () => {
                const { tags } = this.state;

                this.setState({ tags: tags.filter(({ _id }) => tagId !== _id) });

                message.info('已经删除', () => {
                    doDel = null
                    this.fetchTags();
                });

                setTimeout(() => {
                    doDel && doDel(tagId);
                }, 3000);
            }
        });
    }

    render() {
        const { tags } = this.state;

        return (
            <div className="tag-manage">
                <div className="tags">
                    {tags.map(({ name, _id }) => (
                        <div key={_id} className="tag">{name} <i className="material-icons" onClick={this.handleDel.bind(null, _id)}>close</i></div>
                    ))}
                </div>
                <div className="footer">
                    <Button variant="outlined" onClick={this.addTag}>
                        <i className="material-icons">add</i>新增标签
                    </Button>
                </div>
            </div>
        );
    }
}

export default TagManage;
