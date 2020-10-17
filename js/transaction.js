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
            <div class="d-flex justify-content-center" id="txn-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading transaction...</span>
                </div>
            </div>
            <div id="txn-notfound">
                <h2>Transaction not found</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="txn-error">
                <h2>Something went wrong when retrieving transaction</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
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
    
        axios.get(node_address + '/tx/' + this.txhash).then((txn) => {
            $('#txn-id').text(txn.data.hash)
            $('#includedInBlock').text('Included in block #' + thousandSeperator(txn.data.includedInBlock))
            $('#txn-card').html(txToString(txn.data))
            $('#txn-det-type').text(txn.data.type)
            $('#txn-det-type').append(' <span class="badge badge-pill badge-info">' + TransactionTypes[txn.data.type] + '</span>')
            $('#txn-det-sender').text(txn.data.sender)
            $('#txn-det-ts').text(txn.data.ts)
            $('#txn-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(txn.data.ts).toLocaleString() + '</span>')
            $('#txn-det-hash').text(txn.data.hash)
            $('#txn-det-sig').text(txn.data.signature)
    
            $('#txn-det-data').append(jsonToTableRecursive(txn.data.data))
    
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            $('#txn-container').show()
        }).catch((e) => {
            console.log(e)
            $('#txn-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404')
                $('#txn-notfound').show()
            else
                $('#txn-error').show()
        })
    }
}
