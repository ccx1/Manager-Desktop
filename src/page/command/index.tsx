import * as React from 'react';
import {connect} from "react-redux";
import {IPageInfo} from "@/reducer/BasicReducer";
import {Input} from "antd";
import './index.less';
import * as api from "@/api"

interface ICommandState {
    content: string;
    command: string;
}

interface ICommandProps {
    pageInfo: IPageInfo
}

const defKey = '> ';

class Commands extends React.Component<ICommandProps, ICommandState> {


    state = {
        content: defKey,
        command: ''
    }

    constructor(props: ICommandProps) {
        super(props);
    }


    onPressEnter = (e) => {
        const {content, command} = this.state;
        if (!command) {
            return
        }
        api.runCommand({cmd: command})
            .then((res: string) => {
                this.setState({
                    content: content + command + '\r\n' + res + '\r\n' + defKey,
                    command: ''
                })
            })
            .catch(e => {

            })

    }

    render() {
        const {command, content} = this.state;
        return (
            <div className="commands-wrapper">
                <div className="commands-content">
                    {content}
                </div>
                <div className="commands-input">
                    <Input value={command} onChange={(e) => {
                        this.setState({command: e.target.value})
                    }} onPressEnter={this.onPressEnter}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const pageInfo = state.pageInfo;
    return {pageInfo};
};

export default connect(mapStateToProps)(Commands);
