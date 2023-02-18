export const groupBy = (list, id) => {
    return list.reduce(function(results, item) {
        (results[item[id]] = results[item[id]] || []).push(item);
        return results;
    }, {})
}