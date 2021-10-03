import * as React from 'react';
import {connect} from "react-redux";
import {IPageInfo} from "@/reducer/BasicReducer";
import {Input, Table} from "antd";
import './index.less';
import * as api from "@/api"

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
}


interface IProcessState {
    dataSource: Array<IProcessSource>;
    columns: Array<IProcessTableColumns>;
}

interface IProcessProps {
    pageInfo: IPageInfo
}


class Process extends React.Component<IProcessProps, IProcessState> {

    state = {
        dataSource: [],
        columns: []
    }


    constructor(props: IProcessProps) {
        super(props);
        api.getProcess()
            .then((res: Array<IProcessSource>) => {
                const columns = Object.keys(res[0]).map((item, index) => ({
                    title: item,
                    dataIndex: item,
                    key: item,
                }))

                const dataSource = res.map((item, index) => ({
                    ...item,
                    key: index
                }))


                this.setState({
                    columns,
                    dataSource
                })
            })
    }


    render() {
        const {dataSource, columns} = this.state;
        return (
            <div className="process-wrapper">
                <Table dataSource={dataSource} columns={columns}/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const pageInfo = state.pageInfo;
    return {pageInfo};
};

export default connect(mapStateToProps)(Process);
