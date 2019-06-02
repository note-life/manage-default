import React from 'react';
import { getData, postJSON, deleteData } from '@helper/fetch';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import confirm from '@components/confirm';
import message from '@components/message';
import './index.pcss';

class ArchiveManage extends React.Component {
    state = {
        archives: []
    }

    componentDidMount() {
        this.fetcharchives();
    }

    fetcharchives = async () => {
        const headers = { ut: localStorage.getItem('ut') };
        const res = await getData('/archives', null, headers);

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({ archives: res });
        }
    }

    addArchive = () => {
        const doAdd = async (archive) => {
            const headers = { ut: localStorage.getItem('ut') };
            const res = await postJSON('/archives', { archive }, headers);
    
            if (res.error) {
                message.error(res.error.message);
            } else {
                this.fetcharchives();
                message.success('添加成功');
            }
        };

        const content = (
            <TextField
                fullWidth
                ref={(ref) => this.archiveInput = ref}
                placeholder="请输入归档名称"
            />
        );

        confirm({
            title: '新增归档',
            content,
            onOk: () => {
                const archiveName = this.archiveInput.querySelector('input').value

                doAdd(archiveName);
            }
        });
    }

    handleDel = (archiveId) => {
        let doDel = async (archiveId) => {
            const headers = { ut: localStorage.getItem('ut') };
            const res = await deleteData(`/archives/${archiveId}`, null, headers);

            if (res.error) {
                message.error(res.error.message);
            } else {
                message.info('已经删除');
                this.fetcharchives();
            }
        };

        confirm({
            title: '删除归档',
            content: '确认删除该归档？',
            onOk: () => {
                const { archives } = this.state;

                this.setState({ archives: archives.filter(({ _id }) => archiveId !== _id) });

                message.info('已经删除', () => {
                    doDel = null
                    this.fetcharchives();
                });

                setTimeout(() => {
                    doDel && doDel(archiveId);
                }, 3000);
            }
        });
    }

    render() {
        const { archives } = this.state;

        return (
            <div className="archive-manage">
                <div className="archives">
                    {archives.map(({ name, _id }) => (
                        <div key={_id} className="archive">{name} <i className="material-icons" onClick={this.handleDel.bind(null, _id)}>close</i></div>
                    ))}
                </div>
                <div className="footer">
                    <Button variant="outlined" onClick={this.addArchive}>
                        <i className="material-icons">add</i>新增归档
                    </Button>
                </div>
            </div>
        );
    }
}

export default ArchiveManage;
