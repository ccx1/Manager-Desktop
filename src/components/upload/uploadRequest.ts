function parseError(option, xhr) {
    let err: Error = new Error('上传失败');

    err.message = JSON.stringify({
        option,
        xhr
    });

    return err;
}

function parseResponse(xhr) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

// export interface UploadProps {
//     /** 默认class前缀 - {miyun} */
//     classPrefix?: string;
//     /** classname */
//     className?: string;
//     disabled?: boolean;
//     list: Array<Object>;
//     /** 请求地址 */
//     action: String;
//     /* 除file外的附加信息 */
//     data: Object;
//     /** 请求头*/
//     headers: any;
//     /** 接收类型 */
//     accept: String;
//     /** 一次上传多个文件 */
//     multiple: boolean;
//     /** 跨域是否携带cookie */
//     withCredentials: boolean;
//     /**上传的文件名称 */
//     name: String;
// }

export interface UploadRequestOptions {
    // 除file外的附加信息 别的字段
    data: any,
    // 文件上传的字段名
    filename: string,
    // 文件
    file: File,
    // 进度回调
    onProgress?: (progress: number) => void,
    // 报错回调
    onError: (err: Error, res?: any) => void,
    // 成功回调
    onSuccess: (res: any, xhr: XMLHttpRequest) => void,
    action: string,
    // 请求头
    headers?: any,
    // 跨域是否携带cookie
    withCredentials?: boolean;
}

export function fileRequest(option: UploadRequestOptions) {
    const xhr = new XMLHttpRequest();

    const formData = new FormData();
    if (option.data) {
        Object.keys(option.data).forEach(key => {
            formData.append(key, option.data[key]);
        });
    }

    formData.append(option.filename, option.file, option.file.name);

    if (option.onProgress && xhr.upload) {
        xhr.upload.onprogress = function progress(e) {
            let percent;
            if (e.total > 0) {
                percent = parseFloat(`${e.loaded / e.total * 100}`).toFixed(2);
            }
            option.onProgress(parseFloat(percent));
        };
    }

    xhr.onerror = function error(e) {
        return option.onError(parseError(option, xhr));
    };

    xhr.onload = function onload() {
        const res = parseResponse(xhr);
        if (xhr.status < 200 || xhr.status >= 300 || (res.code !== 200)) {
            return option.onError(parseError(option, xhr), res);
        }

        try {
            option.onSuccess(res, xhr);
        } catch (err) {
            option.onError(err)
        }
    };

    xhr.open('post', option.action, true);

    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    const headers = option.headers || {};

    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    for (const header in headers) {
        if (headers.hasOwnProperty(header)) {
            xhr.setRequestHeader(header, headers[header]);
        }
    }

    xhr.send(formData);

    return {
        abort() {
            xhr.abort();
        }
    };
}
