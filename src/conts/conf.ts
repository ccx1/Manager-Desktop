export const GLOBAL_CONFIG = {
    requestUrl: {
        fileUrl: {
            list: '/manager/file/list',
            deleteFile: '/manager/file/delete',
            uploadFile: '/manager/file/upload',
            unZip: '/manager/file/unZip',
            move: '/manager/file/move',
            recycle: '/manager/file/recycle',
            rename: '/manager/file/rename'
        },
        processUrl: {
            runCommand: '/manager/process/cmd',
            list: '/manager/process/list',
            kill: '/manager/process/kill'
        }
    }
};
