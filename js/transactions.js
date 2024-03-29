const TransactionTypes = {
    0: {
        name: 'NEW_ACCOUNT',
        fields: {
            name: 'accountName',
            pub: 'publicKey'
        }
    },
    1: {
        name: 'APPROVE_NODE_OWNER',
        fields: {
            target: 'accountName'
        }
    },
    2: {
        name: 'DISAPPROVE_NODE_OWNER',
        fields: {
            target: 'accountName'
        }
    },
    3: {
        name: 'TRANSFER',
        fields: {
            receiver: 'accountName',
            amount: 'asset',
            memo: 'string'
        }
    },
    4: {
        name: 'COMMENT',
        fields: {
            link: 'string',
            pa: 'accountName',
            pp: 'string',
            json: 'json',
            vt: 'integer',
            tag: 'string'
        }
    },
    5: {
        name: 'VOTE',
        fields: {
            link: 'string',
            author: 'accountName',
            vt: 'integer',
            tag: 'string'
        }
    },
    6: {
        name: 'USER_JSON',
        fields: {
            json: 'json'
        }
    },
    7: {
        name: 'FOLLOW',
        fields: {
            target: 'accountName'
        }
    },
    8: {
        name: 'UNFOLLOW',
        fields: {
            target: 'accountName'
        }
    },
    10: {
        name: 'NEW_KEY',
        fields: {
            id: 'string',
            pub: 'publicKey',
            types: 'array'
        }
    },
    11: {
        name: 'REMOVE_KEY',
        fields: {
            id: 'string'
        }
    },
    12: {
        name: 'CHANGE_PASSWORD',
        fields: {
            pub: 'publicKey'
        }
    },
    13: {
        name: 'PROMOTED_COMMENT',
        fields: {
            link: 'string', 
            pa: 'accountName', 
            pp: 'string', 
            json: 'json', 
            vt: 'integer', 
            tag: 'string', 
            burn: 'asset'
        }
    },
    14: {
        name: 'TRANSFER_VT',
        fields: {
            receiver: 'accountName',
            amount: 'integer'
        }
    },
    15: {
        name: 'TRANSFER_BW',
        fields: {
            receiver: 'accountName',
            amount: 'integer'
        }
    },
    16: {
        name: 'LIMIT_VT',
        fields: {
            amount: 'integer'
        }
    },
    17: {
        name: 'CLAIM_REWARD',
        fields: {
            link: 'string',
            author: 'accountName'
        }
    },
    18: {
        name: 'ENABLE_NODE',
        fields: {
            pub: 'publicKey'
        }
    },
    19: {
        name: 'TIPPED_VOTE',
        fields: {
            link: 'string',
            author: 'accountName',
            vt: 'integer',
            tag: 'string',
            tip: 'integer'
        }
    },
    20: {
        name: 'NEW_WEIGHTED_KEY',
        fields: {
            id: 'string',
            pub: 'publicKey',
            types: 'array',
            weight: 'integer'
        }
    },
    21: {
        name: 'SET_SIG_THRESHOLD',
        fields: {
            thresholds: 'json'
        }
    },
    22: {
        name: 'SET_PASSWORD_WEIGHT',
        fields: {
            weight: 'integer'
        }
    },
    23: {
        name: 'UNSET_SIG_THRESHOLD',
        fields: {
            types: 'array'
        }
    },
    24: {
        name: 'NEW_ACCOUNT_WITH_BW',
        fields: {
            name: 'accountName',
            pub: 'publicKey',
            bw: 'integer'
        }
    },
    25: {
        name: 'PLAYLIST_JSON',
        fields: {
            link: 'string',
            json: 'json'
        }
    },
    26: {
        name: 'PLAYLIST_PUSH',
        fields: {
            link: 'string',
            seq: 'array'
        }
    },
    27: {
        name: 'PLAYLIST_POP',
        fields: {
            link: 'string',
            seq: 'array'
        }
    },
    28: {
        name: 'COMMENT_EDIT',
        fields: {
            link: 'string',
            json: 'json'
        }
    },
    29: {
        name: 'ACCOUNT_AUTHORIZE',
        fields: {
            user: 'accountName',
            id: 'string',
            types: 'array',
            weight: 'integer'
        }
    },
    30: {
        name: 'ACCOUNT_REVOKE',
        fields: {
            user: 'accountName',
            id: 'string'
        }
    },
    31: {
        name: 'FUND_REQUEST_CREATE',
        fields: {
            title: 'string',
            description: 'long string',
            url: 'string',
            requested: 'asset',
            receiver: 'accountName'
        }
    },
    32: {
        name: 'FUND_REQUEST_CONTRIB',
        fields: {
            id: 'integer',
            amount: 'asset'
        }
    },
    33: {
        name: 'FUND_REQUEST_WORK',
        fields: {
            id: 'integer',
            work: 'json'
        }
    },
    34: {
        name: 'FUND_REQUEST_WORK_REVIEW',
        fields: {
            id: 'integer',
            approve: 'boolean',
            memo: 'string'
        }
    },
    35: {
        name: 'PROPOSAL_VOTE',
        fields: {
            id: 'integer',
            amount: 'asset'
        }
    },
    36: {
        name: 'PROPOSAL_EDIT',
        fields: {
            id: 'integer',
            title: 'string',
            description: 'long string',
            url: 'string'
        }
    },
    37: {
        name: 'CHAIN_UPDATE_CREATE',
        fields: {
            title: 'string',
            description: 'long string',
            url: 'string',
            changes: 'array'
        }
    },
    38: {
        name: 'MD_QUEUE',
        fields: {
            txtype: 'integer',
            payload: 'json'
        }
    },
    39: {
        name: 'MD_SIGN',
        fields: {
            id: 'integer',
        }
    }
}

function txCardsHtml(txs = []) {
    let result = ''
    for (let j = 0; j < txs.length; j++) {
        result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + DOMPurify.sanitize(txToHtml(txs[j]))
        result += ' <a href="#/tx/' + txs[j].hash + '" class="badge badge-pill badge-secondary">'
        result += txs[j].hash.substr(0,6)
        result += '</a></p></div>'
    }
    return result
}

function txToHtml(tx) {
    let result = aUser(tx.sender)
    switch (tx.type) {
        case 0:
            return result + ' created new account ' + aUser(tx.data.name)
        case 1:
            return result + ' approved leader ' + aUser(tx.data.target)
        case 2:
            return result + ' disapproved leader ' + aUser(tx.data.target)
        case 3:
            result = result + ' transferred ' + thousandSeperator(tx.data.amount / 100) + ' DTUBE to ' + aUser(tx.data.receiver)
            if (tx.data.memo)
                result += ', memo: ' + tx.data.memo
            return result
        case 4:
            if (tx.data.pa && tx.data.pp)
                result += ' commented on ' + aContent(tx.data.pa + '/' + tx.data.pp)
            else
                result += ' posted a new video ' + aContent(tx.sender + '/' + tx.data.link)
            return result
        case 5:
            if (tx.data.vt > 0)
                result += ' upvoted '
            else
                result += ' downvoted '
            result += aContent(tx.data.author + '/' + tx.data.link) + ' with ' + thousandSeperator(tx.data.vt) + ' VP'
            if (tx.data.tag)
                result += ' and tagged it with ' + tx.data.tag
            return result
        case 6:
            return result + ' update profile'
        case 7:
            return result + ' subscribed to ' + aUser(tx.data.target)
        case 8:
            return result + ' unsubscribed to ' + aUser(tx.data.target)
        case 10:
            return result + ' created a custom key with id ' + tx.data.id
        case 11:
            return result + ' removed a custom key with id ' + tx.data.id
        case 12:
            return result + ' changed the master key'
        case 13:
            if (tx.data.pa && tx.data.pp)
                result += ' commented on ' + aContent(tx.data.pa + '/' + tx.data.pp)
            else
                result += ' posted a new video ' + aContent(tx.sender + '/' + tx.data.link)
            result += ' and burnt ' + (tx.data.burn / 100) + ' DTUBE '
            return result
        case 14:
            return result + ' transferred ' + thousandSeperator(tx.data.amount) + ' VP to ' + aUser(tx.data.receiver)
        case 15:
            return result + ' transferred ' + thousandSeperator(tx.data.amount) + ' bytes to ' + aUser(tx.data.receiver)
        case 16:
            return result + ' set a limit on account voting power to ' + tx.data.amount + ' VP'
        case 17:
            return result + ' claimed curation rewards on ' + aContent(tx.data.author + '/' + tx.data.link)
        case 18:
            return result + ' updated leader key for block production'
        case 19:
            if (tx.data.vt > 0)
                result += ' upvoted '
            else
                result += ' downvoted '
            result += aContent(tx.data.author + '/' + tx.data.link) + ' with ' + thousandSeperator(tx.data.vt) + ' VP'
            if (tx.data.tag)
                result += ' and tagged it with ' + tx.data.tag
            result += ' (' + tx.data.tip + '% author tip)'
            return result
        case 20:
            return result + ' created a custom key with id ' + tx.data.id + ' and weight ' + tx.data.weight
        case 21:
            return result + ' set signature thresholds'
        case 22:
            return result + ' set master key weight to ' + tx.data.weight
        case 23:
            return result + ' unset signature thresholds'
        case 24:
            return result + ' created new account ' + aUser(tx.data.name) + ' with ' + thousandSeperator(tx.data.bw) + ' bytes'
        case 25:
            return result + ' set playlist metadata for ' + aPlaylist(tx.sender + '/' + tx.data.link)
        case 26:
            return result + ' pushed '+Object.keys(tx.data.seq).length+' contents to playlist ' + aPlaylist(tx.sender + '/' + tx.data.link)
        case 27:
            return result + ' popped '+tx.data.seq.length+' contents from playlist ' + aPlaylist(tx.sender + '/' + tx.data.link)
        case 28:
            return result + ' edited '+aContent(tx.sender+'/'+tx.data.link)
        case 29:
            return result + ' authorized '+aUser(tx.data.user)+' for '+tx.data.types.length+' tx types with id '+tx.data.id+' and weight '+tx.data.weight
        case 30:
            return result + ' revoked '+aUser(tx.data.user)+' with id '+tx.data.id
        case 31:
            return result + ' created a fund request of ' + thousandSeperator(tx.data.requested/100) + ' DTUBE with receiver ' + aUser(tx.data.receiver)
        case 32:
            return result + ' contributed ' + thousandSeperator(tx.data.amount/100) + ' DTUBE to fund request ID #' + tx.data.id
        case 33:
            return result + ' submitted work for fund request ID #' + tx.data.id
        case 34:
            return result + (tx.data.approve ? ' approved' : ' disapproved') + ' work for fund request ID #' + tx.data.id + ' with memo ' + tx.data.memo
        case 35:
            return result + (tx.data.amount > 0 ? ' approved' : ' disapproved') + ' proposal ID #' + tx.data.id + ' with vote weight of ' + thousandSeperator(Math.abs(tx.data.amount/100)) + ' DTUBE'
        case 36:
            return result + ' edited proposal ID #' + tx.data.id
        case 37:
            return result + ' created a chain update proposal with ' + tx.data.changes.length + ' changes'
        case 38:
            return result + ' queued transaction type ' + tx.data.txtype + ' in master DAO'
        case 39:
            return result + ' approved master DAO transaction #' + tx.data.id
        default:
            return 'Unknown transaction type ' + tx.type
    }
}

function masterDaoCards(ops = []) {
    let result = ''
    for (let j = 0; j < ops.length; j++) {
        result += '<div class="card dblocks-card"><p class="dblocks-card-content">' + DOMPurify.sanitize(txToHtml({
            type: ops[j].type,
            data: ops[j].data,
            sender: config.masterDao,
            ts: ops[j].executed || ops[j].ts
        }))
        result += ' <a href="#/masterop/' + ops[j]._id + '" class="badge badge-pill badge-secondary">'
        result += '#'+ops[j]._id
        result += '</a></p></div>'
    }
    return result
}

function aUser(user) {
    return '<a href="#/@'+user+'">'+user+'</a>'
}

function aContent(content) {
    return '<a href="#/content/'+content+'">@'+content+'</a>'
}

function aPlaylist(playlist) {
    return '<a href="#/playlist/'+playlist+'">@'+playlist+'</a>'
}