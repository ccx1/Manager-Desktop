import * as React from 'react';
import {connect, DispatchProp} from "react-redux";
import {IPageInfo} from "@/reducer/BasicReducer";
import {RouteComponentProps} from "react-router-dom";
import * as api from '@/api';
import './index.less'
import {UploadFile} from "@/components/upload";
import {GLOBAL_CONFIG} from '@/conts/conf'
import {Checkbox, Input, message, Modal} from "antd";
import {FilesTree} from "@/components/filesTree";

interface FileInfo {
    id: string;
    name: string;
    extendImage: string;
    size: number;
    file: boolean;
}

interface IHomeState {
    fileList: Array<FileInfo>;
    currentPath: Array<string>;
    visible: boolean;
    deleteModalVisible: boolean;
    moveModalVisible: boolean;
    moveRecycleModalVisible: boolean;
    renameVisible: boolean;
    renameVal: string;
    checkIds: Array<string>;
}

type IHomeBaseProps = RouteComponentProps & DispatchProp;

interface IHomeProps extends IHomeBaseProps {
    pageInfo: IPageInfo,
}

class Home extends React.Component<IHomeProps, IHomeState> {

    state = {
        fileList: [],
        currentPath: [],
        visible: false,
        deleteModalVisible: false,
        moveModalVisible: false,
        moveRecycleModalVisible: false,
        renameVisible: false,
        renameVal: '',
        checkIds: []
    };

    constructor(props: IHomeProps) {
        super(props);
    }


    componentDidMount() {
        this.getFileList();
    }

    goBack = () => {
        const {currentPath} = this.state;
        currentPath.splice(currentPath.length - 1, 1);
        this.setState({
            currentPath,
            checkIds: []
        }, () => {
            const {currentPath} = this.state;
            this.getFileList(currentPath[currentPath.length - 1]);
        })
    }
    downloadFile = () => {
        const {checkIds} = this.state;
        let temp = '';
        for (let i = 0; i < checkIds.length; i++) {
            if (i === 0) {
                temp += checkIds[i];
            } else {
                temp += (',' + checkIds[i]);
            }
        }
        window.open(`${window.location.protocol}//${window.location.host}/manager/file/download?targetIds=${encodeURIComponent(temp)}`)
    }

    renameFile = () => {
        const {checkIds, renameVal} = this.state;
        if (checkIds.length > 1) {
            message.error("??????????????????????????????")
            return;
        }
        if (!renameVal) {
            message.error("?????????????????????")
            return;
        }
        api.renameFile({
            targetId: checkIds[0],
            newName: renameVal
        }).then(res => {
            message.success("??????")
            this.setState({
                renameVal: '',
                renameVisible: false
            });
            this.refresh();
        })


    }


    deleteFile = () => {
        const {checkIds} = this.state;
        api.deleteFile({
            targetIds: checkIds
        }).then(res => {
            message.success('????????????')
            this.refresh()
        })
    }

    refresh = () => {
        const {currentPath} = this.state;
        this.getFileList(currentPath[currentPath.length - 1])
    }

    getFileList = (id?) => {
        const {currentPath} = this.state;
        api.getFileList({
            targetId: encodeURIComponent(id || '')
        }).then((res: any) => {
            if (res.currentPath && !currentPath.find(n => n === res.currentPath)) {
                currentPath.push(res.currentPath)
            }
            this.setState({
                fileList: res.fileInfo,
                currentPath,
                checkIds: []
            })
        }).catch(e => {

        })
    }

    unZipFile = (id) => {
        api.unZipFile({
            targetId: id
        }).then((res: any) => {
            message.success('??????')
            this.refresh()
        }).catch(e => {
            message.error(e)
        })
    }


    moveFile = () => {
        const {checkIds} = this.state;
        if (checkIds.length > 1) {
            message.error("?????????????????????????????????")
            return;
        }
        let fileTree: any = this.refs.fileTree;
        api.moveFile({
            originId: checkIds[0],
            targetId: fileTree.getSelectId() || ''
        }).then((res: any) => {
            message.success('??????')
            this.setState({
                moveModalVisible: false
            }, () => {
                this.refresh()
            })
        }).catch(e => {
        })
    }


    recycle = () => {
        const {checkIds} = this.state;
        api.recycle({
            targetIds: checkIds
        }).then((res: any) => {
            message.success('??????')
            this.setState({
                moveRecycleModalVisible: false
            }, () => {
                this.refresh()
            })
        }).catch(e => {
        })
    }


    onItemCheckChange = (id, e) => {
        const {checkIds} = this.state;
        if (e.target.checked) {
            checkIds.push(id);
        } else {
            let index = checkIds.findIndex(n => n === id);
            if (index > -1) {
                checkIds.splice(index, 1)
            }
        }
        this.setState({
            checkIds
        })
    }


    render() {
        const {
            fileList,
            currentPath,
            visible,
            checkIds,
            deleteModalVisible,
            renameVisible,
            renameVal,
            moveModalVisible,
            moveRecycleModalVisible
        } = this.state;
        return (
            <React.Fragment>
                {currentPath.length > 0 && <a onClick={() => this.goBack()}>???????????????</a>}
                {currentPath.length > 0 && <a style={{marginLeft: 20}} onClick={() => this.setState({visible: true})}>
                    ????????????
                </a>}
                <a style={{marginLeft: 20}} onClick={() => {
                    this.refresh()
                }}>
                    ??????
                </a>
                {checkIds.length > 0 && <a style={{marginLeft: 20}} onClick={this.downloadFile}>
                    ??????
                </a>}
                {checkIds.length === 1 && <a style={{marginLeft: 20}} onClick={() => {
                    let {checkIds, fileList} = this.state;
                    this.setState({
                        renameVisible: true,
                        renameVal: fileList.find(n => n.id === checkIds[0]).name
                    })
                }}>
                    ?????????
                </a>}
                {checkIds.length === 1 && <a style={{marginLeft: 20}} onClick={() => {
                    this.setState({
                        moveModalVisible: true
                    })
                }}>
                    ?????????
                </a>}

                {checkIds.length >= 1 && <a style={{marginLeft: 20}} onClick={() => {
                    this.setState({
                        moveRecycleModalVisible: true
                    })
                }}>
                    ???????????????
                </a>}

                {checkIds.length > 0 && <a style={{marginLeft: 20}} onClick={() => {
                    this.setState({
                        deleteModalVisible: true
                    })
                }}>
                    ??????
                </a>}

                <div className="home-wrapper">
                    {
                        fileList.map((item: FileInfo, index: number) =>
                            <div key={index} className="home-file-wrapper">
                                <div className="home-file-info" onDoubleClick={() => {
                                    if (!item.file) {
                                        this.getFileList(item.id);
                                        return;
                                    }
                                    if (item.file && item.name.indexOf('.zip') > -1) {
                                        this.unZipFile(item.id);
                                        return;
                                    }
                                }}>
                                    <img src={item.extendImage}/>
                                    <div className="home-file-info-name">
                                        {item.name}
                                    </div>
                                </div>
                                {
                                    currentPath.length > 0 &&
                                    <Checkbox className="home-file-checked"
                                              checked={!!checkIds.find(n => n === item.id)}
                                              onChange={(e) => {
                                                  this.onItemCheckChange(item.id, e)
                                              }}/>
                                }

                            </div>
                        )
                    }
                </div>
                <Modal visible={deleteModalVisible}
                       onCancel={() => this.setState({deleteModalVisible: false})}
                       onOk={() => {
                           this.setState({deleteModalVisible: false});
                           this.deleteFile();
                       }}
                       title="??????"
                       getContainer={false}
                >
                    ???????????????????
                </Modal>

                <Modal visible={moveRecycleModalVisible}
                       onCancel={() => this.setState({moveRecycleModalVisible: false})}
                       onOk={() => {
                           this.recycle();
                       }}
                       title="???????????????"
                       getContainer={false}
                >
                    ????????????????????????????(????????????????????????30???)
                </Modal>
                <Modal visible={renameVisible}
                       onCancel={() => this.setState({renameVisible: false})}
                       onOk={() => {
                           this.renameFile()
                       }}
                       title="?????????"
                       getContainer={false}
                >
                    <Input value={renameVal} onChange={(e) => {
                        this.setState({
                            renameVal: e.target.value
                        })
                    }}/>
                </Modal>
                <Modal visible={visible}
                       onCancel={() => this.setState({visible: false})}
                       onOk={() => this.setState({visible: false})}
                       footer={null}
                       title="????????????"
                       getContainer={false}
                >
                    <UploadFile
                        accept={''}
                        onStatusListener={(index: number, total: number, status: string) => {
                            if (status === 'success') {
                                this.refresh()
                            }
                        }}
                        uploadOptions={{
                            data: {
                                targetId: currentPath[currentPath.length - 1]
                            },
                            filename: 'file',
                            action: GLOBAL_CONFIG.requestUrl.fileUrl.uploadFile
                        }}/>
                </Modal>
                <Modal visible={moveModalVisible}
                       onCancel={() => {
                           this.setState({moveModalVisible: false})
                       }}
                       onOk={() => {
                           this.moveFile();
                       }}
                >
                    <FilesTree ref={"fileTree"}/>
                </Modal>
            </React.Fragment>

        );
    }

}

const mapStateToProps = state => {
    const pageInfo = state.pageInfo;
    return {pageInfo};
};

export default connect(mapStateToProps)(Home);
