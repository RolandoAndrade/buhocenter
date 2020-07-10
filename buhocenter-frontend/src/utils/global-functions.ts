function getShortName(name: string, length: number) {
    return name!.length < length ? name : name!.substring(0, length)! + '...';
}

function trunc(num: number, positions: number): number {
    return Math.round(num * Math.pow(10, positions)) / Math.pow(10, positions);
}

export { getShortName, trunc };
