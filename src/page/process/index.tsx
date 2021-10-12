import * as React from 'react';
import {connect} from "react-redux";
import {IPageInfo} from "@/reducer/BasicReducer";
import {Input, message, Table} from "antd";
import './index.less';
import * as api from "@/api"
import {kProcess} from "@/api";

interface IProcessSource {
    cmd: string;
    uid: string;
    pid: number;
    ppid: number;
    stime: string;
    time: string;
    tty: string;

}

interface IProcessTableColumns {
    title: string;
    dataIndex: string;
    key: string;
    ellipsis?: boolean;
    render?: Function
}


interface IProcessState {
    dataSource: Array<IProcessSource>;
    columns: Array<IProcessTableColumns>;
    searchSource: Array<IProcessSource>;
}

interface IProcessProps {
    pageInfo: IPageInfo
}


class Process extends React.Component<IProcessProps, IProcessState> {

    state = {
        dataSource: [],
        columns: [],
        searchSource: []
    }


    constructor(props: IProcessProps) {
        super(props);
        this.getProcess();
    }


    getProcess = (params?) => {
        const {columns} = this.state;
        api.getProcess(params)
            .then((res: Array<IProcessSource>) => {
                if (columns.length === 0) {
                    const temp: Array<IProcessTableColumns> = Object.keys(res[0]).map((item, index) => ({
                        title: item,
                        dataIndex: item,
                        key: item,
                        ellipsis: true
                    }))
                    temp.push({
                        title: 'option',
                        dataIndex: 'option',
                        key: 'option',
                        ellipsis: false,
                        render: (text, record, index) => {
                            return <div className="process-wrapper-table-option">
                                <a onClick={() => {
                                    api.kProcess({
                                        pid: record.ppid
                                    }).then(() => {
                                        message.success("关闭成功")
                                    })
                                }}>kill</a>
                            </div>
                        }
                    })
                    this.setState({
                        columns: temp
                    })
                }

                const dataSource = res.map((item, index) => ({
                    ...item,
                    key: index
                }))


                this.setState({
                    dataSource,
                    searchSource: dataSource
                })
            })
    }

    render() {
        const {columns, searchSource, dataSource} = this.state;
        return (
            <div className="process-wrapper">
                搜索：<Input.Search
                placeholder="input search text"
                enterButton="Search"
                onSearch={value => {
                    // this.getProcess({key: value})
                    const {dataSource} = this.state;
                    const searchDataSource = dataSource.filter((item, index) => JSON.stringify(item).indexOf(value) != -1)
                    this.setState({
                        searchSource: searchDataSource
                    })
                }}
                style={{width: 400}}
            />
                <a onClick={() => {
                    this.getProcess()
                }}>刷新</a>
                <div>
                    <span>目前进程数：{dataSource.length}</span>
                </div>
                <Table dataSource={searchSource} columns={columns}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const pageInfo = state.pageInfo;
    return {pageInfo};
};

export default connect(mapStateToProps)(Process);
