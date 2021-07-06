import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('Signer')
        this.jsonFields = {}
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
                    <button type="button" class="btn btn-success" id="signer-modal-proceed" disabled>Sign</button>
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
        $('#signer-txtype').on('change',this.renderFields)

        // Handle parameters if any
        let routeSplit = window.location.hash.split('/')
        if (routeSplit.length === 3 && routeSplit[2]) {
            let params = new URL('https://example.com/'+routeSplit[2]).searchParams
            let txtype = parseInt(params.get('type'))
            if (!TransactionFields[txtype]) return
            $('#signer-txtype').val(params.get('type'))
            this.renderFields()
            for (let f in TransactionFields[txtype]) if (params.get(f)) {
                switch (TransactionFields[txtype][f]) {
                    case 'accountName':
                    case 'publicKey':
                    case 'string':
                    case 'array':
                    case 'integer':
                        $('#signer-field-'+f).val(params.get(f))
                        break
                    case 'json':
                        let json = {}
                        try {
                            json = JSON.parse(decodeURI(params.get(f)))
                        } catch {}
                        this.jsonFields[f].set(json)
                    default:
                        break
                }
            }
            if (params.get('sender'))
                $('#signer-sender').val(params.get('sender'))
            if (params.get('broadcast') === '1' || params.get('broadcast') === 'true') {
                $('#signer-broadcast-checkbox').prop('checked',true)
                $('#signer-signbtn').text('Sign and Broadcast')
            }
        }
    }

    renderFields() {
        this.jsonFields = {}
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
                    // JSON builder
                    htmlFields += `<div id="signer-field-${f}"></div>`
                    this.jsonFields[f] = 1
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
                <input class="form-check-input" type="checkbox" id="signer-legacysig-checkbox">
                <label class="form-check-label" for="signer-legacysig-checkbox">Use legacy signature format (pre-HF4)</label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="signer-broadcast-checkbox">
                <label class="form-check-label" for="signer-broadcast-checkbox">Broadcast Transaction</label>
            </div><br>
            <button class="btn btn-success" id="signer-signbtn">Sign</button><br><br>
            <div id="signer-result-area" style="display: none;">
                <h5>Signature result</h5>
                <div id="signer-result-json"></div><br>
                <button class="btn btn-success" id="signer-result-broadcast">Broadcast this transaction</button><br><br>
            </div><br>`
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
            $('#signer-modal-proceed').text(txt)
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
                        $('#signer-modal-proceed').prop('disabled',true)
                        break
                    case '0':
                        $('#signer-modal-proceed').prop('disabled',false)
                        $('#signer-method-fields').html(`
                            <div class="form-group"><label for="signer-hk-sa">Signer Account</label><input class="form-control" id="signer-hk-sa"></div>
                            <select class="form-control" id="signer-hk-role">
                                <option>Select a role to be used...</option>
                                <option>Posting</option>
                                <option>Active</option>
                                <option>Memo</option>
                            </select>
                        `)
                        break
                    case '1':
                        $('#signer-modal-proceed').prop('disabled',false)
                        $('#signer-method-fields').html('<div class="form-group"><label for="signer-pk">Key</label><input class="form-control" id="signer-pk" type="password"></div>')
                        break
                    default:
                        break
                }
            })
        })
        $('#signer-modal-proceed').off('click')
        $('#signer-modal-proceed').on('click',(evt) => {
            evt.preventDefault()
            let txtype = parseInt($('#signer-txtype').val())
            let tx = {
                type: txtype,
                data: {},
                sender: $('#signer-sender').val(),
                ts: $('#signer-ts-checkbox').prop('checked') ? new Date().getTime() : parseInt($('#signer-ts').val())
            }
            for (let f in TransactionFields[txtype]) {
                switch (TransactionFields[txtype][f]) {
                    case 'accountName':
                    case 'publicKey':
                    case 'string':
                        tx.data[f] = $('#signer-field-'+f).val()
                        break
                    case 'integer':
                        tx.data[f] = parseInt($('#signer-field-'+f).val())
                        break
                    case 'array':
                    case 'json':
                        tx.data[f] = this.jsonFields[f].get()
                        break
                    default:
                        break
                }
            }
            let stringified = JSON.stringify(tx)
            switch ($('#signer-method').val()) {
                case '0':
                    // hive keychain
                    // error if not installed
                    if (!window.hive_keychain) {
                        $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-error','Error','Hive Keychain is not installed',5000))
                        return $('#signer-alert').toast('show')
                    }
                    tx.hash = cg.sha256(stringified).toString('hex')
                    hive_keychain.requestSignBuffer($('#signer-hk-sa').val(),stringified,$('#signer-hk-role').val(),(result) => {
                        console.log('keychain signature result',result)
                        if (result.error) {
                            $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-error','Error',result.message,5000))
                            return $('#signer-alert').toast('show')
                        }
                        let sig = cg.Signature.fromString(result.result).toAvalonSignature()
                        tx.signature = $('#signer-legacysig-checkbox').prop('checked') ? sig[0] : [sig]
                        if ($('#signer-broadcast-checkbox').prop('checked'))
                            this.broadcastTransaction(tx)
                        else
                            this.displayResult(tx)
                    })
                    break
                case '1':
                    // plaintext key
                    let hash = cg.sha256(stringified)
                    tx.hash = hash.toString('hex')
                    let sig = cg.Signature.avalonCreate(hash,$('#signer-pk').val()).toAvalonSignature()
                    tx.signature = $('#signer-legacysig-checkbox').prop('checked') ? sig[0] : [sig]
                    if ($('#signer-broadcast-checkbox').prop('checked'))
                        this.broadcastTransaction(tx)
                    else
                        this.displayResult(tx)
                    break
                default:
                    break
            }
        })

        // Create JSON editors
        for (let f in this.jsonFields) {
            this.jsonFields[f] = new JSONEditor(document.getElementById('signer-field-'+f),{
                mode: 'code',
                modes: ['code', 'text', 'tree', 'view'],
                ace: ace
            })
        }
    }

    displayResult(tx) {
        $('#signer-result-json').html('')
        let editor = new JSONEditor(document.getElementById('signer-result-json'),{
            mode: 'code',
            modes: ['code', 'text', 'tree', 'view'],
            ace: ace
        })
        editor.set(tx)
        $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-success','Success','Transaction signed successfully without broadcasting',5000))
        $('#signer-alert').toast('show')
        $('#signer-modal').modal('hide')
        $('#signer-result-area').show()
        $('#signer-result-broadcast').off('click')
        $('#signer-result-broadcast').on('click',() => this.broadcastTransaction(tx))
    }

    broadcastTransaction(tx) {
        let suceed = false
        axios.post('https://testnet-api.oneloved.tube/transactWaitConfirm',tx,{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        }).then((r) => {
            suceed = true
            console.log('result',r)
            $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-success','Success','Transaction broadcasted successfully',5000))
            $('#signer-alert').toast('show')
            $('#signer-modal').modal('hide')
        }).catch((e) => {
            console.log('error',e)
            if (suceed) return
            $('#signer-toast-area').html(toast('signer-alert','dblocks-toaster-error','Error','An error occured while broadcasting transaction',5000))
            $('#signer-alert').toast('show')
        })
    }
}