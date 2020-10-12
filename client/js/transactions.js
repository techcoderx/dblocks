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

function txCardsHtml(blocks) {
    let result = ''
    for (let i = 0; i < blocks.length; i++)
        for (let j = 0; j < blocks[i].txs.length; j++) {
            result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + txToString(blocks[i].txs[j])
            result += ' <a href="/tx/' + blocks[i].txs[j].hash + '" class="badge badge-pill badge-secondary">'
            result += blocks[i].txs[j].hash.substr(0,6)
            result += '</a></p></div>'
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
            result = tx.sender + ' transferred ' + thousandSeperator(tx.data.amount / 100) + ' DTC to ' + tx.data.receiver
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