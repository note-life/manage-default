import React from 'react';
import { Link } from 'react-router-dom';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@components/list';
import Pagination from '@components/pagination';
import message from '@components/message';
import confirm from '@components/confirm';

import { getData, putJSON } from '@helper/fetch';
import { getSiginedUserInfo } from '@helper/utils';

import './index.pcss';

class NotesPage extends React.Component {
    state = {
        loading: false,
        filterType: localStorage.getItem('filterType') || 'publish',
        notes: [],
        pageNo: localStorage.getItem('notes_pageNo') || 1,
        total: 0,
        pageSize: 10,
        allwaysMine: localStorage.getItem('notes_allwaysMine') === 'true' || true
    }

    componentDidMount() {
        document.title = 'NOTE.LIFE.文章';

        this.fetchNotes();
    }

    filterSearchData = () => {
        const data = {};
        const { filterType, pageNo, pageSize, allwaysMine } = this.state;

        if (filterType === 'all') {
            data.deleted = false;
        }

        if (filterType === 'publish') {
            data.draft = false;
            data.private = false;
            data.deleted = false;
        }

        if (filterType === 'draft') {
            data.draft = true;
        }

        if (filterType === 'deleted') {
            data.deleted = true;
        }

        if (filterType === 'private') {
            data.private = true;
        }

        if (allwaysMine) {
            data.author = getSiginedUserInfo()._id;
        }

        data.offset = pageSize * (pageNo - 1);
        data.limit = pageSize;
        data.deleted = false;

        localStorage.setItem('notes_allwaysMine', allwaysMine);
        localStorage.setItem('notes_pageNo', pageNo);
        localStorage.setItem('filterType', filterType);

        return data;
    }

    filterType = (e) => {
        const filterType = e.target.value;

        this.setState({ filterType, pageNo: 1, pageSize: 10 });

        setTimeout(() => {
            this.fetchNotes();
        }, 0);
    }

    fetchNotes = async () => {
        this.setState({ loading: true });
        const res = await getData('/notes', this.filterSearchData(), { ut: localStorage.getItem('ut') });

        if (res.error) {
            message.error(res.error.message);
        } else {
            this.setState({
                notes: res.notes,
                total: res.total
            });
        }

        this.setState({ loading: false });
    }

    handleDel = async (id) => {
        const doDel = async () => {
            const headers = { ut: localStorage.getItem('ut') };
            const res = await putJSON(`/notes/${id}`, { deleted: true }, headers);

            if (res.error) {
                message.error(res.error.message);
            } else {
                message.info('文章已经删除', async () => {
                    const res = await putJSON(`/notes/${id}`, { deleted: false }, headers);

                    if (res.error) {
                        message.error(res.error.message);
                    } else {
                        message.info('已撤销');
                        this.fetchNotes();
                    }
                });
                this.fetchNotes();
            }
        };

        confirm({
            title: '提示',
            content: '确认删除该文章',
            onOk: () => {
                doDel();
            }
        });
    }

    handlePager = (pageNo, pageSize) => {
        this.setState({ pageNo, pageSize });
        setTimeout(() => {
            this.fetchNotes();
        }, 0);
    }

    handleAllwaysMine = () => {
        this.setState((state) => ({ allwaysMine: !state.allwaysMine }));
        setTimeout(() => {
            this.fetchNotes();
        }, 0);
    }

    render () {
        const { notes, loading, filterType, pageNo, total, allwaysMine } = this.state;
        const columns = [
            {
                title: '标题',
                dataIndex: 'title'
            },
            {
                title: '状态',
                dataIndex: 'status',
                render: (value, note, i) => {
                    if (note.private) return (<div className="status"><i className="material-icons private-icon">lock</i>私密</div>);

                    if (note.draft) return (<div className="status"><i className="material-icons draft-icon">schedule</i>草稿</div>);

                    return (<div className="status"><i className="material-icons public-icon">public</i>已发布</div>);
                }
            },
            {
                title: '作者',
                dataIndex: 'author',
                render: ({ nickname, avator }) => (
                    <div className="user-info">
                        <img className="avator" src={avator} />
                        {nickname}
                    </div>
                )
            },
            {
                title: '归档',
                dataIndex: 'archive'
            },
            {
                title: '分类',
                dataIndex: 'tags',
                render: (tags) => (
                    <div className="tags">
                        {tags.length ? tags.map(tag => <em key={tag}>{tag}</em>) : '-/-'}
                    </div>
                )
            },
            {
                title: '操作',
                dataIndex: 'operate',
                render: (value, note, i) => {

                    return (
                        <>
                            <Link to={`/notes/${note._id}`}>编辑</Link>
                            <span onClick={this.handleDel.bind(null, note._id)}>删除</span>
                        </>
                    );
                }
            }
        ];

        return (
            <div className="notes-page">
                <div className="header">
                   <div>
                        <Select value={filterType} onChange={this.filterType} className="filter-selector">
                            <MenuItem value="all">全部</MenuItem>
                            <MenuItem value="publish">已发布</MenuItem>
                            <MenuItem value="draft">草稿</MenuItem>
                            <MenuItem value="private">私密</MenuItem>
                        </Select>
                        <Checkbox value="checkedC" checked={allwaysMine} onChange={this.handleAllwaysMine} />仅查询自己的
                   </div>
                    <Link to="/notes/-1" className="create-button">
                        <Button variant="outlined">
                            <i className="material-icons">create</i>New
                        </Button>
                    </Link>
                </div>
                <div className="content">
                    <Pagination pageNo={pageNo} total={total} onChange={this.handlePager} />
                    <List
                        columns={columns}
                        loading={loading}
                        data={notes}
                    />
                </div>
            </div>
        );
    }
}

export default NotesPage;