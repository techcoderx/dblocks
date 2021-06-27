import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Transaction')
        this.txhashChars = /^[a-f0-9]*$/
        this.txhash = window.location.hash.substr(5)
    }

    getHtml() {
        return `
            ${this.loadingHtml('txn','transaction')}
            ${this.errorHtml('txn','transaction')}
            ${this.notFoundHtml('txn','Transaction')}
            <div id="txn-container">
                <h2 class="text-truncate">Transaction<small class="col-12 col-sm-9 text-muted" id="txn-id"></small></h2>
                <p class="lead" id="includedInBlock"></p>
                <div class="card dblocks-card" id="txn-card"></div><br>
                <table class="table table-sm">
                    <tr><th scope="row">type</th><td id="txn-det-type"></td></tr>
                    <tr><th scope="row">sender</th><td id="txn-det-sender"></td></tr>
                    <tr><th scope="row">ts</th><td id="txn-det-ts"></td></tr>
                    <tr><th scope="row">hash</th><td id="txn-det-hash"></td></tr>
                    <tr><th scope="row">signature</th><td id="txn-det-sig"></td></tr>
                </table><br>
                <h5>Transaction data</h5>
                <div id="txn-det-data"></div>
            </div><br>
        `
    }

    init() {
        if (this.txhash.length !== 64 || !this.txhashChars.test(this.txhash)) {
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            $('#txn-notfound').show()
            return
        }
    
        axios.get(config.api + '/tx/' + this.txhash).then((txn) => {
            $('#txn-id').text(txn.data.hash)
            $('#includedInBlock').text('Included in block #' + thousandSeperator(txn.data.includedInBlock))
            $('#txn-card').html('<p class="dblocks-card-content">'+txToHtml(txn.data)+'</p>')
            $('#txn-det-type').text(txn.data.type)
            $('#txn-det-type').append(' <span class="badge badge-pill badge-info">' + TransactionTypes[txn.data.type] + '</span>')
            $('#txn-det-sender').text(txn.data.sender)
            $('#txn-det-ts').text(txn.data.ts)
            $('#txn-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(txn.data.ts).toLocaleString() + '</span>')
            $('#txn-det-hash').text(txn.data.hash)
            if (typeof txn.data.signature === 'string')
                $('#txn-det-sig').text(txn.data.signature)
            else
                $('#txn-det-sig').html(jsonToTableRecursive(this.parseMultisig(txn.data.signature)))
    
            $('#txn-det-data').append(jsonToTableRecursive(txn.data.data))
    
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            $('#txn-container').show()
        }).catch((e) => {
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404')
                $('#txn-notfound').show()
            else
                $('#txn-error').show()
        })
    }

    parseMultisig(signatures) {
        let parsed = []
        for (let s in signatures)
            parsed.push({
                sign: signatures[s][0],
                recid: signatures[s][1]
            })
        return parsed
    }
}
