export function getTotalSize(list: Array<File>) {
    let totalSize = 0;
    list && list.length && list.map((item: File) => {
        totalSize += item.size || (item && item.size) || 0;
    });
    return totalSize;
}


export function getFileType(file) {
    if (file && file.name) {
        const arr = file.name.split('.');
        const type = arr[arr.length - 1];
        if (type === 'doc' || type === 'docx' || type === 'dot') {
            return 'W';
        } else if (type === '.xls' || type === '.xlsx') {
            return 'X';
        }
        return type.substr(0, 1).toUpperCase();
    }
}

export function getHolderType(type) {
    if (type === 'W') {
        return 'W';
    } else if (type === 'X') {
        return 'X';
    } else {
        return 'unknown'
    }
}
