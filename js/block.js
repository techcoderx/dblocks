import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.blockNum = parseInt(window.location.hash.substr(4))
        this.setTitle('Block #' + this.blockNum)
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="blk-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading block...</span>
                </div>
            </div>
            <div id="blk-notfound">
                <h2>Block not found</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="blk-error">
                <h2>Something went wrong when retrieving block</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="blk-container">
                <div class="row blk-head">
                    <h2 class="col-12 col-sm-9" id="blk-num"></h2>
                    <div class="col-12 col-sm-3"><div class="btn-group blk-btn-prevnext" role="group">
                        <a type="button" class="btn btn-outline-secondary" id="blk-btn-prev">Previous</a>
                        <a type="button" class="btn btn-outline-secondary" id="blk-btn-next">Next</a>
                    </div></div>
                </div><br>
                <table class="table table-sm">
                    <tr><th scope="row">phash</th><td id="blk-det-phash"></td></tr>
                    <tr><th scope="row">timestamp</th><td id="blk-det-ts"></td></tr>
                    <tr><th scope="row">miner</th><td id="blk-det-miner"></td></tr>
                    <tr id="blk-fld-miss"><th scope="row">missedBy</th><td id="blk-det-miss"></td></tr>
                    <tr><th scope="row">dist</th><td id="blk-det-dist"></td></tr>
                    <tr><th scope="row">burn</th><td id="blk-det-burn"></td></tr>
                    <tr><th scope="row">hash</th><td id="blk-det-hash"></td></tr>
                    <tr><th scope="row">signature</th><td id="blk-det-sig"></td></tr>
                </table><br>
                <div id="blk-txs">
                    <h5 id="blk-txs-heading">0 transactions in this block</h5>
                </div>
            </div>
        `
    }

    init() {
        if (isNaN(this.blockNum)) {
            $('#blk-loading').hide()
            $('.spinner-border').hide()
            $('#blk-notfound').show()
            return
        }
        axios.get('https://avalon.oneloved.tube/block/' + this.blockNum).then((blk) => {
            console.log(blk.data)
            $('#blk-num').text('Block #'+thousandSeperator(this.blockNum))
            $('#blk-det-phash').text(blk.data.phash)
            $('#blk-det-ts').text(blk.data.timestamp)
            $('#blk-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(blk.data.timestamp).toLocaleString() + '</span>')
            $('#blk-det-miner').text(blk.data.miner)
    
            if (blk.data.missedBy)
                $('#blk-det-miss').text(blk.data.missedBy)
            else
                $('#blk-fld-miss').hide()
    
            $('#blk-det-dist').text(blk.data.dist || '0')
            $('#blk-det-burn').text(blk.data.burn || '0')
            $('#blk-det-hash').text(blk.data.hash)
            $('#blk-det-sig').text(blk.data.signature)
    
            // Prepare previous and next buttons
            $('#blk-btn-prev').attr('href','/b/' + (this.blockNum-1))
            $('#blk-btn-next').attr('href','/b/' + (this.blockNum+1))
    
            // Genesis and hardfork badge
            if (this.blockNum == 0) {
                $('#blk-btn-prev').hide()
                $('#blk-btn-next').css('border-top-left-radius','0.25rem')
                $('#blk-btn-next').css('border-bottom-left-radius','0.25rem')
                $('#blk-num').append(' <span class="badge badge-secondary">Genesis</span>')
            }
    
            // List transactions
            if (blk.data.txs.length > 0) {
                if (isPuralArr(blk.data.txs))
                    $('#blk-txs-heading').text(blk.data.txs.length + ' transactions in this block')
                else
                    $('#blk-txs-heading').text('1 transaction in this block')
                $('#blk-txs').append(txCardsHtml([blk.data]))
            }
    
            addAnchorClickListener()
            $('#blk-loading').hide()
            $('.spinner-border').hide()
            $('#blk-container').show()
        }).catch((e) => {
            console.log(e)
            $('#blk-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404') {
                $('#blk-notfound').show()
            } else $('#blk-error').show()
        })
    }
}