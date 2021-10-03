import * as React from "react";
import {getFileType, getHolderType} from "@/components/upload/utils";
import {Icon, Progress} from "antd";
import {FileInfo} from "@/components/upload/index";


export default class UploadList extends React.Component<any, any> {
    render() {
        let {fileList, removeFile,accept} = this.props;
        return (
            <React.Fragment>
                {fileList && fileList.length > 0 ?
                    <ul>
                        {
                            fileList && fileList.length > 0 && fileList.map((item: FileInfo, index) => {
                                return <li key={index}>
                                    <div
                                        className={`upload-item-placeholder upload-item-placeholder-${getHolderType(getFileType(item))}`}>
                                        {getFileType(item)}
                                        {
                                            item.status === 'pending' &&
                                            <Icon
                                                theme="twoTone"
                                                twoToneColor="#FF0000"
                                                onClick={() => {
                                                    removeFile(index)
                                                }}
                                                className={"upload-icon-delete"}
                                                type="close-circle"
                                            />
                                        }
                                        {
                                            item.status === 'success' &&
                                            <Icon
                                                theme="twoTone"
                                                twoToneColor="#52c41a"
                                                type="check-circle"
                                            />
                                        }
                                        {
                                            item.status === 'fail' &&
                                            <Icon
                                                theme="twoTone"
                                                twoToneColor="#FF0000"
                                                type="exclamation-circle"
                                            />
                                        }
                                        {item.status === 'uploading' &&
                                        <div className="progress-wrapper">
                                            <Progress
                                                percent={item.progress}
                                                showInfo={false}
                                            />
                                        </div>
                                        }
                                    </div>
                                    <p className={"upload-item-name"}>{item.name}</p>
                                </li>
                            })
                        }
                    </ul>
                    :
                    <div className={"upload-tips"}>
                        <i/>
                        <p>请将文件拖入这里</p>
                        <p>或点击下方上传文件按钮</p>
                        <p>选择文件完成点击上传按钮</p>
                        <p>仅支持{accept}格式文件</p>
                    </div>
                }
            </React.Fragment>
        );
    }
}