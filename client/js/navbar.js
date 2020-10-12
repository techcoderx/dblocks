$(() => {
    $('.dblocks-navbar').load('/navbar.html')
})

function searchEnter() {
    let keycode = window.event.keyCode
    if (keycode == 13)
        searchSubmit()
}

function searchSubmit()  {
    let searchStr = $('.dblocks-search').val()
    if (searchStr.length == 64) {
        // Tx hash lookup
        window.location.href = '/tx/' + searchStr
    } else if (isNaN(parseInt(searchStr))) {
        // Account lookup
        window.location.href = '/@' + searchStr
    } else if (searchStr < 64) {
        // Block lookup
        window.location.href = '/b/' + searchStr
    } else {
        // What are you looking for???
        window.location.href = '/404'
    }
}

// Commons
function jsonToTableRecursive(json) {
    let result = '<table class="table table-sm table-bordered">'
    for (field in json) {
        let cleanField = HtmlSanitizer.SanitizeHtml(field)
        let val = json[field]
        if (typeof val == 'object')
            val = jsonToTableRecursive(val)
        val = val.toString()
        val = HtmlSanitizer.SanitizeHtml(val)
        result += '<tr><th scope="row">' + cleanField + '</th><td>' + val + '</td></tr>'
    }
    result += '</table>'
    return result
}

function thousandSeperator(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function isPuralArr(arr) {
    return arr.length > 1
}