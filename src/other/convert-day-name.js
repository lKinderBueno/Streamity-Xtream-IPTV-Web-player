const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

exports.dateToName = (date) =>{
    let d = new Date(date);
    return days[d.getDay()];
} 

exports.dateToReadable = (date) =>{
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`
} 