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
                        <p>????????????????????????</p>
                        <p>?????????????????????????????????</p>
                        <p>????????????????????????????????????</p>
                        <p>?????????{accept}????????????</p>
                    </div>
                }
            </React.Fragment>
        );
    }
}