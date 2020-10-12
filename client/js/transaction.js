const txhashChars = /^[a-f0-9]*$/
let txhash = window.location.pathname.substr(4)

$(() => {
    if (txhash.length !== 64 || !txhashChars.test(txhash)) {
        $('#txn-loading').hide()
        $('.spinner-border').hide()
        $('#txn-notfound').show()
        return
    }

    axios.get('https://avalon.oneloved.tube/tx/' + txhash).then((txn) => {
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
})