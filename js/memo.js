import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('Memo Cryptography')
    }

    getHtml() {
        return `
            <h2>Memo Cryptography</h2>
            <p>Encrypt or decrypt an Avalon memo here.</p>
            <select class="form-control" id="memo-direction">
                <option value="0">Select a direction...</option>
                <option value="1">Encrypt</option>
                <option value="2">Decrypt</option>
            </select><br>
            <div id="memo-fields"></div>
            <button class="btn btn-success" id="memo-proceed"></button><br><br>
            <p id="memo-result"></p>
            ${toastArea('memo-toast-area')}
        `
    }

    init() {
        $('#memo-direction').on('change',() => {
            switch ($('#memo-direction').val()) {
                case '0':
                    $('#memo-fields').html('')
                    $('#memo-proceed').hide()
                    break
                case '1':
                    $('#memo-fields').html(`
                        <div class="form-group">
                            <label for="memo-field-message">Plaintext Message</label>
                            <input class="form-control" id="memo-field-message">
                        </div>
                        <div class="form-group">
                            <label for="memo-field-pub">Receipient Public Key</label>
                            <input class="form-control" id="memo-field-pub">
                        </div>
                        <div class="form-group">
                            <label for="memo-field-prv">Ephemeral Private Key (optional)</label>
                            <input class="form-control" id="memo-field-prv" type="password">
                        </div>
                    `)
                    $('#memo-proceed').text('Encrypt')
                    $('#memo-proceed').show()
                    break
                case '2':
                    $('#memo-fields').html(`
                        <div class="form-group">
                            <label for="memo-field-message">Encrypted Message</label>
                            <input class="form-control" id="memo-field-message">
                        </div>
                        <div class="form-group">
                            <label for="memo-field-prv">Private Key</label>
                            <input class="form-control" id="memo-field-prv" type="password">
                        </div>
                    `)
                    $('#memo-proceed').text('Decrypt')
                    $('#memo-proceed').show()
                    break
                default:
                    break
            }
        })
        $('#memo-proceed').on('click', (evt) => {
            evt.preventDefault()
            switch ($('#memo-direction').val()) {
                case '1':
                    cg.Memo.encrypt($('#memo-field-pub').val(),$('#memo-field-message').val(),$('#memo-field-prv').val())
                        .then(r => $('#memo-result').text('Result: '+r))
                        .catch(e => this.memoError(e))
                    break
                case '2':
                    cg.Memo.decrypt($('#memo-field-prv').val(),$('#memo-field-message').val())
                        .then(r => $('#memo-result').text('Result: '+r))
                        .catch(e => this.memoError(e))
                    break
                default:
                    break
            }
        })
    }

    memoError(e) {
        $('#memo-toast-area').html(toast('memo-alert','dblocks-toaster-error','Error','Failed to '+$('#memo-direction option:selected').text().toLowerCase()+' memo: '+e.toString(),5000))
        $('#memo-alert').toast('show')
    }
}