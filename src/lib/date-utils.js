const timestampRegex = /(.*) __(.*)__.*/;

function getTimestampString(commitLine){
    const match = timestampRegex.exec(commitLine);
    return match ? parseInt(match[2]) : Number.MAX_SAFE_INTEGER;
}

module.exports.stripComparatorTimestamp = function (commitLine){
    const match = timestampRegex.exec(commitLine);
    return match ? match[1] : commitLine;
};

module.exports.compare = function (commitLine1, commitLine2){
    const  date1 = getTimestampString(commitLine1);
    const  date2 = getTimestampString(commitLine2);
    if(date1 < date2){
        return 1;
    }else if(date1 == date2){
        return 0;
    }else {
        return -1;
    }
};
