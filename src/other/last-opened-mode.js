let oldMode = "";
let previousGroup = -1;

exports.resetMemory = (mode) =>{
    if(mode !== oldMode){
        oldMode = mode;
        previousGroup = -1;
        return true;
    }return false;
}

exports.setGroup = (group) =>{
    previousGroup = group;
}

exports.getGroup = () => {
    return previousGroup;
}