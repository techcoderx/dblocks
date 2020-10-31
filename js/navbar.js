function searchEnter() {
    let keycode = window.event.keyCode
    if (keycode == 13)
        searchSubmit()
}

function searchSubmit()  {
    let searchStr = $('.dblocks-search').val()
    if (searchStr.length == 64) {
        // Tx hash lookup
        navigateTo('#/tx/' + searchStr)
    } else if (searchStr.split('/').length > 1) {
        // Content lookup
        navigateTo('#/content/' + searchStr)
    } else if (isNaN(parseInt(searchStr))) {
        // Account lookup
        navigateTo('#/@' + searchStr)
    } else if (searchStr.length < 64) {
        // Block lookup
        navigateTo('#/b/' + searchStr)
    } else {
        // What are you looking for???
        navigateTo('#/404')
    }
}

// Commons
function jsonToTableRecursive(json,isInner) {
    let result = '<table class="table table-sm table-bordered'
    if (isInner) result += ' dblocks-table-inner'
    result += '">'
    for (field in json) {
        let cleanField = DOMPurify.sanitize(field)
        let val = json[field]
        if (typeof val == 'object')
            val = jsonToTableRecursive(val,true)
        else if (typeof val != 'string')
            val = val.toString()
        else
            val = JSON.stringify(val)
        val = DOMPurify.sanitize(val)
        result += '<tr><th scope="row">' + cleanField + '</th><td>' + val + '</td></tr>'
    }
    result += '</table>'
    return result
}

function thousandSeperator(num) {
    let num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function isPuralArr(arr) {
    return arr.length > 1
}