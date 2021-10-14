/**
 * @file 接口请求
 */
import {GLOBAL_CONFIG} from '@/conts/conf';
import common from '@/utils/common';


/**
 * 生成jobCode
 *
 * @return {string} jobCode '0-时间戳-随机数'
 */
function generateJobCode() {
    return `t0_${new Date().valueOf()}`;
}

/**
 * 生产program的jobCode
 *
 * @param {string} programId programId
 * @return {string} jobCode '0-programId-随机数'
 */
function generateProgramJobCode(programId) {
    return `p${programId}_${new Date().valueOf()}`;
}

export const getFileList = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.fileUrl.list,
        data: params
    })
);

export const unZipFile = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.fileUrl.unZip,
        data: params,
        type: 'POST'
    })
);


export const moveFile = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.fileUrl.move,
        data: params,
        type: 'POST'
    })
);


export const deleteFile = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.fileUrl.deleteFile,
        data: params,
        type: 'POST'
    })
);


export const renameFile = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.fileUrl.rename,
        data: params,
        type: 'POST'
    })
);


export const runCommand = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.processUrl.runCommand,
        data: params,
        type: 'POST'
    })
);


export const kProcess = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.processUrl.kill,
        data: params
    })
);



export const getProcess = (params) => (
    common.requestInPromise({
        url: GLOBAL_CONFIG.requestUrl.processUrl.list,
        data: params
    })
);

