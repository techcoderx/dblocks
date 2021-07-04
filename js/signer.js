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
            <div class="modal fade" id="signer-modal" tabindex="-1" aria-hidden="true"><div class="modal-dialog"><div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Sign Transaction</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <select class="form-control" id="signer-method" style="margin-bottom: 1rem;">
                        <option value="-1">Select a signer...</option>
                        <option value="0">Hive Keychain</option>
                        <option value="1">Plaintext Private Key</option>
                    </select>
                    <div id="signer-method-fields"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" id="signer-modal-proceed-btn" disabled>Sign</button>
                </div>
            </div></div></div>
            ${toastArea('signer-toast-area')}
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
            $('#signer-broadcast-checkbox').on('change',() => {
                let txt = 'Sign' + ($('#signer-broadcast-checkbox').prop('checked') ? ' and Broadcast' : '')
                $('#signer-signbtn').text(txt)
                $('#signer-modal-proceed-btn').text(txt)
            })
            $('#signer-signbtn').on('click',(evt) => {
                evt.preventDefault()
                $('#signer-toast-area').html('')
                if (!$('#signer-sender').val()) {
                    $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-error','Error','Transaction sender is required.',5000))
                    return $('#signer-alert').toast('show')
                }
                if (!$('#signer-ts-checkbox').prop('checked') && !$('#signer-ts').val()) {
                    $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-error','Error','Transaction timestamp is required.',5000))
                    return $('#signer-alert').toast('show')
                }
                $('#signer-method').val('-1')
                $('#signer-method-fields').html('')
                $('#signer-method').off('change')
                $('#signer-modal').modal()
                $('#signer-method').on('change',() => {
                    switch ($('#signer-method').val()) {
                        case '-1':
                            $('#signer-method-fields').html('')
                            $('#signer-modal-proceed-btn').prop('disabled',true)
                            break
                        case '0':
                            $('#signer-modal-proceed-btn').prop('disabled',false)
                            $('#signer-method-fields').html(`
                                <div class="form-group"><label for="signer-hk-sa">Signer Account</label><input class="form-control" id="signer-hk-sa"></div>
                                <select class="form-control" id="signer-hk-role">
                                    <option value="-1">Select a role to be used...</option>
                                    <option value="0">Posting</option>
                                    <option value="1">Active</option>
                                    <option value="2">Memo</option>
                                </select>
                            `)
                            break
                        case '1':
                            $('#signer-modal-proceed-btn').prop('disabled',false)
                            $('#signer-method-fields').html('<div class="form-group"><label for="signer-pk">Key</label><input class="form-control" id="signer-pk"></div>')
                            break
                        default:
                            break
                    }
                })
            })
        })
    }
}