let url = new URL(window.location.href)
let account = window.location.pathname.substr(2)
let accountlastupdate = 0
let accountdata = null
let accountnotfound = false
let accountHistoryPage = parseInt(url.searchParams.get('page'))
let leaderLastUpdate = 0
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

        let accCreatedStr = 'Created by '
        if (acc.data.created) {
            accCreatedStr += acc.data.created.by
            accCreatedStr += ' on '
            accCreatedStr += new Date(acc.data.created.ts).toLocaleString()
        } else {
            accCreatedStr += 'dtube on ' + new Date(1593350655283).toLocaleString() // timestamp of block #1 on testnet v2
        }
        $('#acc-meta-created').text(accCreatedStr)

        if (acc.data.json)
            $('#acc-profile-json').html(jsonToTableRecursive(acc.data.json))
        else
            $('#acc-profile-metadata').hide()

        updateAccount(acc.data)
        display()
        setInterval(()=>reloadAccount((newacc)=>updateAccount(newacc)),10000)
    }).catch((e) => {
        $('#acc-loading').hide()
        $('.spinner-border').hide()
        if (e == 'Error: Request failed with status code 404') {
            accountnotfound = true
            $('#acc-notfound').show()
        } else
            $('#acc-error').show()
    })

    axios.get('https://avalon.oneloved.tube/rewards/pending/' + account).then((pending) =>
        $('#acc-meta-pending').text(thousandSeperator(Math.floor(pending.data.total) / 100) + ' DTC'))
    .catch(()=>
        $('#acc-meta-pending').text('Error'))

    axios.get('https://avalon.oneloved.tube/rewards/claimed/' + account).then((claimed) =>
        $('#acc-meta-claimed').text(thousandSeperator(Math.floor(claimed.data.total) / 100) + ' DTC'))
    .catch(()=>
        $('#acc-meta-claimed').text('Error'))

    let accountHistoryUrl = 'https://avalon.oneloved.tube/history/' + account + '/0'
    if (isNaN(accountHistoryPage))
        accountHistoryPage = 1
    accountHistoryUrl += '/' + ((accountHistoryPage - 1) * 50)

    axios.get(accountHistoryUrl).then((history) => {    
        // Render account history cards
        $('#acc-history-itms').html(txCardsHtml(history.data))

        // Render account history pagination
        $('.acc-history-page-next a').attr('href',window.location.pathname + '?page=' + (accountHistoryPage+1))
        if (accountHistoryPage == 1)
            $('.acc-history-page-prev').addClass('disabled')
        else
            $('.acc-history-page-prev a').attr('href',window.location.pathname + '?page=' + (accountHistoryPage-1))
        if (accountHistoryPage >= 3) {
            $('.acc-history-page-3').addClass('active')
            for (let i = 0; i < 5; i++) {
                $('.acc-history-page-' + (i+1) + ' a').text(accountHistoryPage-2+i)
                $('.acc-history-page-' + (i+1) + ' a').attr('href',window.location.pathname + '?page=' + (accountHistoryPage-2+i))
            }
        } else {
            $('.acc-history-page-' + accountHistoryPage).addClass('active')
            for (let i = 0; i < 5; i++)
                $('.acc-history-page-' + (i+1) + ' a').attr('href',window.location.pathname + '?page=' + (i+1))
        }

        if (history.data.length < 50) {
            $('.acc-history-page-next').addClass('disabled')
            if (accountHistoryPage < 3) for (let i = accountHistoryPage; i < 5; i++) {
                $('.acc-history-page-' + (i+1)).hide()
            } else {
                $('.acc-history-page-4').hide()
                $('.acc-history-page-5').hide()
            }
        }

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
        updateLeaderStats()
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
    if (account && historyLoaded && !accountnotfound) {
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
    if (!approves) return 'Not voting for leaders'
    for (let i = 0; i < approves.length; i++)
        result += '<tr><td><a href="/@' + approves[i] + '">' + approves[i] + '</a></td></tr>'
    return result
}

function updateLeaderStats() {
    if (new Date().getTime() - leaderLastUpdate < 120000) return
    axios.get('https://avalon.oneloved.tube/leader/' + account).then((leader) => {
        leaderLastUpdate = new Date().getTime()
        $('#acc-leader-voters').text(thousandSeperator(leader.data.voters))
        $('#acc-leader-produced').text(thousandSeperator(leader.data.produced))
        $('#acc-leader-miss').text(thousandSeperator(leader.data.missed))
    }).catch(()=>{})
}