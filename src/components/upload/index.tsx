import * as React from 'react';
import {Button, Icon, message, Modal, Progress} from "antd";
import './index.less';
import {getFileType, getHolderType, getTotalSize} from "@/components/upload/utils";
import {fileRequest} from './uploadRequest'
import * as PropTypes from "prop-types";
import UploadList from "@/components/upload/uploadList";


interface UploadOptions {
    // 除file外的附加信息 别的字段
    data: any,
    // 文件上传的字段名
    filename: string,
    // 文件
    action: string,
    // 请求头
    headers?: any,
    // 跨域是否携带cookie
    withCredentials?: boolean;
}


interface UploadProps {
    // 最大的大小 -1 为不限制
    totalSize?: number;
    // 单个文件的最大大小
    singleMaxSize?: number,
    accept: string,
    uploadOptions: UploadOptions;
    onStatusListener?: (index: number, total: number, status: string) => void;
    uploadBefore?: () => boolean;
}


export interface FileInfo {
    name: string,
    file: File,
    progress: number,
    // pending : 准备 , success ： 成功， fail：失败， uploading：上传中
    status: string
}

interface UploadState {
    fileList: Array<FileInfo>
}

export class UploadFile extends React.PureComponent<UploadProps, UploadState> {


    uploadInput: any = React.createRef();

    fileRequestList: Array<any> = [];

    state = {
        fileList: []
    };

    upFiles = () => {
        this.uploadInput.current.click();
    };


    pushFile = (files: Array<File>) => {
        const {totalSize, singleMaxSize} = this.props;
        let filterList = this.checkList(files);

        if (totalSize !== -1 && singleMaxSize !== -1 && (getTotalSize(filterList) + getTotalSize(this.state.fileList) > singleMaxSize * totalSize)) {
            message.error(`总文件大小不能超过${totalSize}`)
            return;
        }

        if (totalSize !== -1 && (filterList.length + this.state.fileList.length) > totalSize) {
            message.error(`总文件数量不能超过${totalSize}个`)
            return;
        }

        const fileList: Array<FileInfo> = filterList.map((item: File, index) => {
            return {
                name: item.name,
                file: item,
                progress: 0,
                status: 'pending'
            }
        });

        this.setState({
            fileList: this.state.fileList.concat(fileList)
        });
    };


    checkList = fileList => {
        // 过滤添加的文件，不能重复添加，不能添加超过最大大小的文件
        const list = this.state.fileList;
        const singleMaxSize = this.props.singleMaxSize;

        return fileList.filter(file => {
            const isRepeat = list.find(item => item.file.name === file.name);
            const isTolarge = singleMaxSize !== -1 && file.size > singleMaxSize;
            if (isTolarge) {
                message.error(`${file.name}文件超过${singleMaxSize}，不能添加`);
            }
            return !isRepeat && !isTolarge;
        });
    };

    uploadFile = () => {
        const {fileList} = this.state;
        let {uploadBefore} = this.props;
        if (uploadBefore) {
            const isConsumption = uploadBefore();
            if (isConsumption) {
                return;
            }
        }
        fileList.forEach((item: FileInfo, index) => {
            // 对上次上传成功和失败的文件不再尝试上传
            if (item.status !== "success"/* && item.status !== "fail"*/) {
                this.uploadFileToRemote(item, index);
            }
        });
    };

    uploadFileToRemote = (info: FileInfo, index: number) => {
        const {uploadOptions, onStatusListener} = this.props;

        const {fileList} = this.state;
        const fileInfo: FileInfo = fileList[index];
        this.fileRequestList[index] = fileRequest({
            ...uploadOptions,
            file: info.file,
            onProgress: (progress) => {
                fileInfo.progress = progress;
                fileInfo.status = "uploading";
                this.setState({fileList: [...fileList]})
                onStatusListener && onStatusListener(index, fileList.length, 'uploading');
            },
            onError: (e) => {
                // 回收
                delete this.fileRequestList[index];
                fileInfo.status = "fail";
                this.setState({fileList: [...fileList]})
                onStatusListener && onStatusListener(index, fileList.length, 'fail');
            },
            onSuccess: () => {
                // 回收
                delete this.fileRequestList[index];
                fileInfo.status = "success";
                this.setState({fileList: [...fileList]})
                onStatusListener && onStatusListener(index, fileList.length, 'success');
            }
        });
    };

    handleDrop = e => {
        e.preventDefault();
        let fileList = [...e.dataTransfer.files];
        // 判断拖拽文件类型
        let accept = this.props.accept;
        const fileTypeArr = fileList[0] && fileList[0].name.split('.') || [];
        const type = '.' + fileTypeArr[fileTypeArr.length - 1];
        let acceptList = accept.split(',');
        if (!fileList.length || !acceptList.includes(type.toLowerCase())) {
            return;
        }
        this.pushFile(fileList);
    };

    removeFile = index => {
        let fileList = [...this.state.fileList];
        fileList.splice(index, 1);
        this.setState({
            fileList
        });
    };
    clear = () => {
        this.setState({fileList: []})
    };

    render() {
        const {accept} = this.props;
        const {fileList} = this.state;
        const dropAreaProps = {
            onDragOver: e => e.preventDefault(),
            onDragEnter: e => e.preventDefault(),
            onDragLeave: e => e.preventDefault(),
            onDrop: this.handleDrop
        };

        return (
            <div className={"upload-file-wrapper"}>
                <input
                    type="file"
                    multiple={true}
                    ref={this.uploadInput}
                    accept={accept}
                    onChange={e => {
                        this.pushFile(Array.from(e.currentTarget.files));
                        // 防止文件删除后立即添加不成功
                        e.target.value = '';
                    }}
                />
                <div className={"upload-file-container"} {...dropAreaProps}>
                    <UploadList
                        accept={accept}
                        fileList={fileList}
                        removeFile={this.removeFile}
                    />
                </div>
                <div className={"upload-button-container"}>
                    <Button onClick={this.clear}>清空</Button>
                    <Button className={"upload-file-select"} onClick={this.upFiles}>点击选择文件</Button>
                    <Button className={"upload-file-button"} type="primary" onClick={this.uploadFile}>上传</Button>
                </div>
            </div>
        );
    }

}
