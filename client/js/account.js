const TransactionTypes = {
    0: 'NEW_ACCOUNT',
    1: 'APPROVE_NODE_OWNER',
    2: 'DISAPPROVE_NODE_OWNER',
    3: 'TRANSFER',
    4: 'COMMENT',
    5: 'VOTE',
    6: 'USER_JSON',
    7: 'FOLLOW',
    8: 'UNFOLLOW',
    10: 'NEW_KEY',
    11: 'REMOVE_KEY',
    12: 'CHANGE_PASSWORD',
    13: 'PROMOTED_COMMENT',
    14: 'TRANSFER_VT',
    15: 'TRANSFER_BW',
    16: 'LIMIT_VT',
    17: 'CLAIM_REWARD',
    18: 'ENABLE_NODE'
}

let url = new URL(window.location.href)
let account = window.location.pathname.substr(2)
let accountlastupdate = 0
let accountdata = null
let accountHistoryPage = parseInt(url.searchParams.get('page'))
let historyLoaded = false

$(() => {
    axios.get('https://avalon.oneloved.tube/account/' + account).then((acc) => {
        accountdata = acc.data
        accountlastupdate = new Date().getTime()

        // Fill account details
        $('#acc-name').text('@' + acc.data.name)
        $('#acc-masterkey-det').html(formatPubKeys({
            pub: acc.data.pub,
            types: []
        }))
        $('#acc-customkey').append(customKeyHtml(acc.data.keys))
        $('#acc-profile-dtube').attr('href','https://d.tube/#!/c/' + acc.data.name)

        if (acc.data.json && acc.data.json.profile && acc.data.json.profile.hive) {
            $('#acc-profile-hive').show()
            $('#acc-profile-hive').attr('href','https://peakd.com/@' + acc.data.json.profile.hive)
        }

        if (acc.data.json && acc.data.json.profile && acc.data.json.profile.steem) {
            $('#acc-profile-steem').show()
            $('#acc-profile-steem').attr('href','https://steempeak.com/@' + acc.data.json.profile.steem)
        }

        updateAccount(acc.data)
        display()
        setInterval(()=>reloadAccount((newacc)=>updateAccount(newacc)),10000)
    }).catch((e) => {
        $('#acc-loading').hide()
        $('.spinner-border').hide()
        if (e == 'Error: Request failed with status code 404')
            $('#acc-notfound').show()
        else
            $('#acc-error').show()
    })

    let accountHistoryUrl = 'https://avalon.oneloved.tube/history/' + account + '/0'
    if (accountHistoryPage != NaN)
        accountHistoryUrl += '/' + (accountHistoryPage * 50)

    axios.get(accountHistoryUrl).then((history) => {
        $('#acc-history').html(accountHistoryHtml(history.data))
        historyLoaded = true
        display()
    })
})

function reloadAccount(cb) {
    if (new Date().getTime() - accountlastupdate < 60000) return cb(accountdata)
    axios.get('https://avalon.oneloved.tube/account/' + account).then((acc) => {
        accountdata = acc.data
        cb(acc.data)
    }).catch(() => cb(accountdata))
}

function updateAccount(acc) {
    $('#acc-meta-bal').text(thousandSeperator(acc.balance / 100) + ' DTC')
    $('#acc-meta-bw').text(thousandSeperator(bandwidth(acc)) + ' bytes')
    $('#acc-meta-vp').text(thousandSeperator(votingPower(acc)) + ' VP')
    $('#acc-meta-subs').text(thousandSeperator(acc.followers.length))
    $('#acc-meta-subbed').text(thousandSeperator(acc.follows.length))
    $('#acc-meta-approves').html(leaderVotesHtml(acc.approves))

    if (acc.pub_leader) {
        $('#acc-leader').show()
        $('#acc-leader-key').text(acc.pub_leader)
        $('#acc-leader-appr').text(thousandSeperator(acc.node_appr / 100) + ' DTC')

        if (acc.json && acc.json.node && acc.json.node.ws)
            $('#acc-leader-ws').text(HtmlSanitizer.SanitizeHtml(acc.json.node.ws))
        else
            $('#acc-leader-ws').text('N/A')
    }
}

function display() {
    if (account && historyLoaded) {
        $('#acc-loading').hide()
        $('.spinner-border').hide()
        $('#acc-container').show()
    }
}

function customKeyHtml(keys) {
    let result = ''
    for (let i = 0; i < keys.length; i++) {
        let sanitizedId = HtmlSanitizer.SanitizeHtml(keys[i].id)
        result += '<div class="card"><div class="card-header" id="acc-customkey-card-' + i + '">'
        result += '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-customkey-collapse-' + i + '" aria-expanded="true" aria-controls="acc-customkey-collapse-' + i + '">' + sanitizedId + '</button></h5></div>'
        result += '<div id="acc-customkey-collapse-' + i + '" class="collapse" aria-labelledby="acc-customkey-card-' + i + '" data-parent="#acc-customkey">'
        result += '<div class="card-body">' + formatPubKeys(keys[i]) + '</div></div></div>'
    }
    return result
}

function formatPubKeys(key) {
    let result = '<strong>Public Key: </strong>' + key.pub + '<br><br><strong>Permissions: </strong>'
    if (key.types.length == 0)
        result += 'ALL'
    else {
        let typesStringArr = []
        for (let i = 0; i < key.types.length; i++) {
            typesStringArr.push(TransactionTypes[key.types[i]])
        }
        result += typesStringArr.join(', ')
    }
    return result
}

function leaderVotesHtml(approves) {
    let result = ''
    for (let i = 0; i < approves.length; i++)
        result += '<tr><td><a href="https://d.tube/#!/c/' + approves[i] + '">' + approves[i] + '</a></td></tr>'
    return result
}

function accountHistoryHtml(history) {
    let result = ''
    for (let i = 0; i < history.length; i++)
        for (let j = 0; j < history[i].txs.length; j++) {
            result += '<div class="card dblocks-card">' + txToString(history[i].txs[j]) + '</div>'
        }
    return result
}

function txToString(tx) {
    let result = ''
    switch (tx.type) {
        case 0:
            return tx.sender + ' created new account ' + tx.data.name
        case 1:
            return tx.sender + ' approved leader ' + tx.data.target
        case 2:
            return tx.sender + ' disapproved leader ' + tx.data.target
        case 3:
            result = tx.sender + ' transferred ' + (tx.data.amount / 100) + ' DTC to ' + tx.data.receiver
            if (tx.data.memo)
                result += ', memo: ' + HtmlSanitizer.SanitizeHtml(tx.data.memo)
            return result
        case 4:
            result = tx.sender
            if (tx.data.pa && tx.data.pp)
                result += ' commented on @' + tx.data.pa + '/' + tx.data.pp
            else
                result += ' posted a new video @' + tx.sender + '/' + tx.data.link
            return result
        case 5:
            result = tx.sender
            if (tx.data.vt > 0)
                result += ' upvoted '
            else
                result += ' downvoted '
            result += '@' + tx.data.author + '/' + tx.data.link + ' with ' + thousandSeperator(tx.data.vt) + ' VP'
            if (tx.data.tag)
                result += ' and tagged it with ' + HtmlSanitizer.SanitizeHtml(tx.data.tag)
            return result
        case 6:
            return tx.sender + ' update profile'
        case 7:
            return tx.sender + ' subscribed to ' + tx.data.target
        case 8:
            return tx.sender + ' unsubscribed to ' + tx.data.target
        case 10:
            return tx.sender + ' created a custom key with id ' + HtmlSanitizer.SanitizeHtml(tx.data.id)
        case 11:
            return tx.sender + ' removed a custom key with id ' + HtmlSanitizer.SanitizeHtml(tx.data.id)
        case 12:
            return tx.sender + ' changed the master key'
        case 13:
            result = tx.sender
            if (tx.data.pa && tx.data.pp)
                result += ' commented on @' + tx.data.pa + '/' + tx.data.pp
            else
                result += ' posted a new video @' + tx.sender + '/' + tx.data.link
            result += ' and burnt ' + (tx.data.burn / 100) + ' DTC '
            return result
        case 14:
            return tx.sender + ' transferred ' + thousandSeperator(tx.data.amount) + ' VP to ' + tx.data.receiver
        case 15:
            return tx.sender + ' transferred ' + thousandSeperator(tx.data.amount) + ' bytes to ' + tx.data.receiver
        case 16:
            return tx.sender + ' set a limit on account voting power to ' + tx.data.amount + ' VP'
        case 17:
            return tx.sender + ' claimed curation rewards on @' + tx.data.author + '/' + tx.data.link
        case 18:
            return tx.sender + ' updated leader key for block production'
        default:
            return 'Unknown transaction type ' + tx.type
    }
}