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
            val = JSON.stringify(val).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
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

function initAuth() {
    let storedLogin = localStorage.getItem('login')
    try {
        storedLogin = JSON.parse(storedLogin)
        if (storedLogin.username)
            return loadLogin(storedLogin)
    } catch {}
    $('#login-method').on('change',() => {
        switch ($('#login-method').val()) {
            case '-1':
                $('#login-method-fields').html('')
                $('#login-modal-proceed').prop('disabled',true)
                break
            case '0':
                if (!window.hive_keychain) {
                    $('#login-modal-proceed').prop('disabled',true)
                    $('#login-method-fields').html('<div class="alert alert-warning" role="alert">Hive Keychain is not installed. Please install the <a href="https://hive-keychain.com" target="_blank">extension</a> and reload, or select another login method.</div>')
                } else {
                    $('#login-modal-proceed').prop('disabled',false)
                    $('#login-method-fields').html(`
                        <div class="form-group"><label for="login-username">Username</label><input class="form-control" id="login-username"></div>
                        <div class="form-group"><label for="login-hk-sa">Signer Account</label><input class="form-control" id="login-hk-sa"></div>
                        <select class="form-control" id="login-hk-role">
                            <option>Select a role to be used...</option>
                            <option>Posting</option>
                            <option>Active</option>
                            <option>Memo</option>
                        </select>
                        <div class="form-check" style="margin-top: 0.75em;">
                            <input class="form-check-input" type="checkbox" id="login-rememberme" checked>
                            <label class="form-check-label" for="login-rememberme">Remember Me</label>
                        </div>
                    `)
                }
                break
            case '1':
                $('#login-modal-proceed').prop('disabled',false)
                $('#login-method-fields').html(`
                    <div class="form-group"><label for="login-username">Username</label><input class="form-control" id="login-username"></div>
                    <div class="form-group"><label for="login-pk">Key</label><input class="form-control" id="login-pk" type="password"></div>
                    <div class="form-check" style="margin-top: 0.75em;">
                        <input class="form-check-input" type="checkbox" id="login-rememberme" checked>
                        <label class="form-check-label" for="login-rememberme">Remember Me</label>
                    </div>
                `)
                break
            default:
                break
        }
    })
    $('#login-modal-proceed').on('click',(evt) => {
        evt.preventDefault()
        switch ($('#login-method').val()) {
            case '0':
                hive_keychain.requestSignBuffer($('#login-hk-sa').val(),'Avalon Blocks Login',$('#login-hk-role').val(),(result) => {
                    if (result.error) {
                        $('#login-alert').text(result.message)
                        return $('#login-alert').removeClass('d-none')
                    }
                    let pub = new cg.PublicKey(cg.Signature.fromString(result.result).recover(cg.sha256('Avalon Blocks Login'))).toAvalonString()
                    axios.get(config.api+'/account/'+$('#login-username').val()).then((user) => {
                        let found = false
                        if (user.data.pub === pub)
                            found = true
                        else for (let k in user.data.keys) if (user.data.keys[k].pub === pub)
                            found = true
                        if (!found) {
                            $('#login-alert').text('Invalid key')
                            return $('#login-alert').removeClass('d-none')
                        }
                        let auth = {
                            username: $('#login-username').val(),
                            method: 'keychain',
                            signer: $('#login-hk-sa').val(),
                            role: $('#login-hk-role').val()
                        }
                        if ($('#login-rememberme').prop('checked'))
                            localStorage.setItem('login', JSON.stringify(auth))
                        $('#login-modal').modal('toggle')
                        loadLogin(auth)
                    }).catch((e) => {
                        if (e.response && e.response.status === 404)
                            $('#login-alert').text('Account does not exist')
                        else
                            $('#login-alert').text('Failed to fetch account info')
                        return $('#login-alert').removeClass('d-none')
                    })
                })
                break
            case '1':
                let pub = ''
                try {
                    pub = cg.PrivateKey.fromAvalonString($('#login-pk').val()).createPublic('STM').toAvalonString()
                } catch {
                    $('#login-alert').text('Invalid key')
                    return $('#login-alert').removeClass('d-none')
                }
                axios.get(config.api+'/account/'+$('#login-username').val()).then((user) => {
                    let found = false
                    if (user.data.pub === pub)
                        found = true
                    else for (let k in user.data.keys) if (user.data.keys[k].pub === pub)
                        found = true
                    if (!found) {
                        $('#login-alert').text('Invalid key')
                        return $('#login-alert').removeClass('d-none')
                    }
                    let auth = {
                        username: $('#login-username').val(),
                        method: 'plaintext',
                        key: $('#login-pk').val()
                    }
                    if ($('#login-rememberme').prop('checked'))
                        localStorage.setItem('login', JSON.stringify(auth))
                    $('#login-modal').modal('toggle')
                    loadLogin(auth)
                }).catch((e) => {
                    if (e.response && e.response.status === 404)
                        $('#login-alert').text('Account does not exist')
                    else
                        $('#login-alert').text('Failed to fetch account info')
                    return $('#login-alert').removeClass('d-none')
                })
                break
        }
    })
}

function loadLogin(auth) {
    window.auth = auth
    $('#login-form').hide()
    $('#login-alert').hide()
    $('#login-modal-proceed').hide()
    $('#login-modal-logout').removeClass('d-none')
    $('#login-modal-logout').on('click',(evt) => {
        evt.preventDefault()
        localStorage.removeItem('login')
        window.auth = {}
        $('#login-form').show()
        $('#login-modal-proceed').show()
        $('#auth-btn').text('Login')
        $('#login-modal').modal('toggle')
        initAuth()
    })
    $('#auth-btn').text(auth.username)
}