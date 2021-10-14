import * as React from 'react';
import {Tree} from "antd";
import * as api from "@/api";

interface IFileList {
    name: string;
    id: string;
    file: string;
    children: Array<IFileList>;
}

interface IFileState {
    selectId: string;
    fileList: Array<IFileList>;
}


const loop = (fileList: Array<IFileList>) => {
    return fileList.map((item, index) => {
        if (item.file) {
            return <React.Fragment key={index}/>
        }
        if (item.children) {
            return <Tree.TreeNode key={item.id} title={item.name}>
                {loop(item.children)}
            </Tree.TreeNode>
        }
        return <Tree.TreeNode key={`${item.id}`} title={item.name}/>
    })
}

export class FilesTree extends React.Component<any, IFileState> {

    state = {
        fileList: [],
        selectId: ''
    }


    constructor(props: any) {
        super(props);
        this.getFileList();
    }


    getFileList = (id?) => {
        let {fileList} = this.state;
        api.getFileList({
            targetId: encodeURIComponent(id || '')
        }).then((res: any) => {
            if (id) {
                let extend = $.extend(fileList, []);
                const find = this.findItem(id, extend);
                if (find) {
                    find.children = res.fileInfo;
                    this.setState({
                        fileList: extend,
                        selectId: id || ''
                    })
                    return;
                }
            }
            this.setState({
                fileList: res.fileInfo,
                selectId: id || ''
            })
        }).catch(e => {

        })
    }

    // 递归查找
    findItem = (id, fileList: Array<IFileList>) => {
        for (let i = 0; i < fileList.length; i++) {
            let item = fileList[i];
            if (item.id === id) {
                return item;
            }
            if (item.children) {
                const find = this.findItem(id, item.children);
                if (find) {
                    return find;
                }
            }
        }
        return undefined;
    }


    onSelect = (selectedKeys, info) => {
        if (selectedKeys.length === 0) {
            return;
        }
        this.getFileList(selectedKeys[0]);
    };

    getSelectId = () =>{
        const {selectId} = this.state;
        return selectId;
    }

    render() {
        let {fileList} = this.state;
        return <div>
            <Tree
                onSelect={this.onSelect}
                blockNode
            >
                {
                    loop(fileList)
                }
            </Tree>
        </div>
    }

}