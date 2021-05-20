let comands = {};
let toFocusName = null;

export function setComands(comand){
    document.removeEventListener("keydown",navigation)
    document.addEventListener("keydown",  navigation)
    comands = comand;
    toFocusName = {parent:comand.parent, child:comand.child};
    comands.focus();
}


export function navigation(event, comands){
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.keyCode === 39) { //right
        comands.right && (comands.right());
    } else if(event.keyCode === 37){  //left
        comands.left && (comands.left());
    } else if(event.keyCode === 40){  //down
        comands.down && (comands.down());
    } else if(event.keyCode === 38){  //up
        comands.up && (comands.up());
    } else if(event.keyCode === 107 || event.keyCode === 109){  //volume
        comands.volume && (comands.volume(event.keyCode === 107 || event.keyCode === 109));
    } else if(event.keyCode === 27 || event.keyCode === 8){ //back
        comands.back && (comands.back());
    }
}

export function findParentBySelector(elm, selector) {
    var all = document.querySelectorAll(selector);
    var cur = elm.parentNode;
    while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
        cur = cur.parentNode; //go up
    }
    return cur; //will return null if not found
}


function collectionHas(a, b) { //helper function (see below)
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] === b) return true;
    }
    return false;
}

export function nextInput(currentInput, inputArray, inputClass, reverse) {
    inputArray = Array.from(inputArray)
    let i,j, array = reverse ? inputArray.reverse() : inputArray;
    for (i = 0; i < inputArray.length - 1; i++) {
        if(currentInput === array[i]) {
            for (j = 1; j < inputArray.length - i; j++) {
                //Check if the next element exists and if it has the desired class
                if(array[i + j] && (array[i + j].className === inputClass)) {
                    return array[i + j];
                    break;
                }
            }
        }
    }   
}