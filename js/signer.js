import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('Signer')
    }

    getHtml() {
        return `
            <h2>Signer</h2>
            <p>Sign an Avalon transaction and broadcast to the blockchain.</p>
            <select class="form-control" id="signer-txtype">
                <option value="-1">Select a transaction type...</option>
            </select><br>
            <div id="signer-fields"></div>
        `
    }

    init() {
        for (let i in TransactionTypes)
            $('#signer-txtype').append($('<option>', {
                value: i,
                text: TransactionTypes[i]
            }))
        
        // Render appropriate fields
        $('#signer-txtype').on('change',() => {
            let htmlFields = ''
            let txtype = parseInt($('#signer-txtype').val())
            if (txtype === -1) {
                return $('#signer-fields').html('')
            }
            for (let f in TransactionFields[txtype]) {
                htmlFields += `<div class="form-group"><label for="signer-field-${f}">${f} (${TransactionFields[txtype][f]})</label>`
                switch (TransactionFields[txtype][f]) {
                    case 'accountName':
                    case 'publicKey':
                    case 'string':
                    case 'array':
                        // Text field
                        htmlFields += `<input class="form-control" id="signer-field-${f}">`
                        break
                    case 'integer':
                        // Number field
                        htmlFields += `<input class="form-control" id="signer-field-${f}" type="number">`
                        break
                    case 'json':
                        // Text area (perhaps use a json builder?)
                        htmlFields += `<textarea class="form-control" id="signer-field-${f}" type="number"></textarea>`
                        break
                    default:
                        break
                }
                htmlFields += '</div>'
            }
            htmlFields += `
                <div class="form-group"><label for="signer-sender">sender (accountName)</label><input class="form-control" id="signer-sender"></div>
                <div class="form-group" style="display: none;" id="signer-ts-fg"><label for="signer-ts">timestamp (integer)</label><input class="form-control" id="signer-ts"></div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="signer-ts-checkbox" checked>
                    <label class="form-check-label" for="signer-ts-checkbox">Use current timestamp</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="signer-broadcast-checkbox">
                    <label class="form-check-label" for="signer-broadcast-checkbox">Broadcast Transaction</label>
                </div><br>
                <button class="btn btn-success" id="signer-signbtn">Sign</button><br><br><br>`
            $('#signer-fields').html(htmlFields)
            $('#signer-ts-checkbox').on('change',() => {
                if ($('#signer-ts-checkbox').prop('checked'))
                    $('#signer-ts-fg').hide()
                else
                    $('#signer-ts-fg').show()
            })
            $('#signer-broadcast-checkbox').on('change',() => $('#signer-signbtn').text('Sign' + ($('#signer-broadcast-checkbox').prop('checked') ? ' and Broadcast' : '')))
            $('#signer-signbtn').on('click',(evt) => {
                evt.preventDefault()
            })
        })
    }
}