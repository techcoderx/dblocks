let blockNum = parseInt(window.location.pathname.substr(3))

$(() => {
    if (isNaN(blockNum)) {
        $('#blk-loading').hide()
        $('.spinner-border').hide()
        $('#blk-notfound').show()
        return
    }
    axios.get('https://avalon.oneloved.tube/block/' + blockNum).then((blk) => {
        console.log(blk.data)
        $('#blk-num').text('Block #'+thousandSeperator(blockNum))
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
        $('#blk-btn-prev').attr('href','/b/' + (blockNum-1))
        $('#blk-btn-next').attr('href','/b/' + (blockNum+1))

        // Genesis and hardfork badge
        if (blockNum == 0) {
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
})