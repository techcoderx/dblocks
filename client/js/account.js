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

let account = window.location.pathname.substr(2)
let accountlastupdate = 0
let accountdata = {}

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

        $('#acc-loading').hide()
        $('.spinner-border').hide()
        $('#acc-container').show()

        setInterval(()=>reloadAccount((newacc)=>updateAccount(newacc)),10000)
    }).catch((e) => {
        $('#acc-loading').hide()
        $('.spinner-border').hide()
        if (e == 'Error: Request failed with status code 404')
            $('#acc-notfound').show()
        else
            $('#acc-error').show()
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

/*
<div class="card">
    <div class="card-header" id="acc-customkey-card-master">
        <h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-customkey-collapse-master" aria-expanded="true" aria-controls="acc-customkey-collapse-master">Master</button></h5>
    </div>
    <div id="acc-customkey-collapse-master" class="collapse" aria-labelledby="acc-customkey-card-master" data-parent="#acc-customkey">
        <div class="card-body" id="acc-customkey-det-master"></div>
    </div>
</div>
*/

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