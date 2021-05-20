export const GroupKeyboard = {
    down: (focus) =>{
        if(!focus.nextElementSibling){
            let list = Array.from(document.querySelectorAll(".group"));
            return list[list.length-1]
        }else return focus.nextElementSibling
    },
    up: (focus) =>{
        return focus.previousElementSibling || document.querySelector(".group") || focus;
    },
    searchFocus: (focus) =>{
        return document.getElementById("selectedGp") || document.querySelector(".group")
    },
    left: () => 1,
    enabled: true
}
