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
            amount: 'integer',
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
            burn: 'integer'
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
            seq: 'json'
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
        default:
            return 'Unknown transaction type ' + tx.type
    }
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