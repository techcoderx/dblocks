function searchEnter() {
    let keycode = window.event.keyCode
    if (keycode == 13 || keycode == 10)
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
    } else if (!/^\d+$/.test(searchStr)) {
        // Account lookup
        navigateTo('#/@' + searchStr)
    } else if (/^\d+$/.test(searchStr)) {
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

function availableBalance(account,ts) {
    if (!account.voteLock)
        return account.balance
    let newLock = 0
    for (let v in account.proposalVotes)
        if (account.proposalVotes[v].end > ts && account.proposalVotes[v].amount - account.proposalVotes[v].bonus > newLock)
            newLock = account.proposalVotes[v].amount - account.proposalVotes[v].bonus
    return account.balance - newLock
}

function thousandSeperator(num) {
    let num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function isPuralArr(arr) {
    return arr.length > 1
}

function roundDec(value = 0, decimals = 0) {
    return Math.round(value*Math.pow(10,decimals))/Math.pow(10,decimals)
}

function secondsToWords(value = 0) {
    let d = Math.floor(value / 86400)
    let h = Math.floor((value / 3600) - (d * 24))
    let m = Math.floor((value / 60) - (d * 1440) - (h * 60))
    let s = Math.floor(value - (d * 86400) - (h * 3600) - (m * 60))
    let r = false
    let result = ''
    if (d) {
        r = true
        result += d+'d '
    }
    if (r || h) {
        r = true
        result += h+'h '
    }
    if (r || m) {
        r = true
        result += m+'m '
    }
    if (s >= 0)
        result += s+'s'
    else
        result = '0s'
    return result
}

function sinceDays(ts = 0) {
    return (new Date().getTime() - ts) / 86400000
}

function listWords(arr = []) {
    if (arr.length === 0)
        return ''
    else if (arr.length === 1)
        return arr[0]
    return arr.slice(0,-1).join(', ')+' and '+arr[arr.length-1]
}

function testnetBadge() {
    if (window.config.isTestnet)
        $('#testnet-heading-badge').show()
}

function toast(id,type,title,body,duration) {
    return `
        <div id="${id}" class="toast hide ${type}" role="alert" aria-live="assertive" aria-atomic="true" data-delay="${duration}">
            <div class="toast-header">
                <strong class="mr-auto">${title}</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </div>
            <div class="toast-body">${body}</div>
        </div>
    `
}

function toastArea(id) {
    return `<div class="position-fixed bottom-0 right-0 p-3" style="z-index: 2000; right: 0; bottom: 0;" id="${id}"></div>`
}