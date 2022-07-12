import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('MasterDAO Operation')
        this.id = parseInt(window.location.hash.slice(11))
    }

    getHtml() {
        return `
            ${this.loadingHtml('mdop','operation')}
            ${this.errorHtml('mdop','operation')}
            ${this.notFoundHtml('mdop','Operation')}
            <div id="mdop-container">
                <h2 class="text-truncate">MasterDAO Operation #${this.id}</h2>
                <p class="lead" id="mdop-queued-by"></p>
                <div class="card dblocks-card" id="mdop-card"></div><br>
                <table class="table table-sm">
                    <tr><th scope="row">status</th><td><span class="badge badge-pill" id="mdop-det-status"></span></td></tr>
                    <tr><th scope="row">type</th><td id="mdop-det-type"></td></tr>
                    <tr><th scope="row">ts</th><td id="mdop-det-ts"></td></tr>
                    <tr><th scope="row">expiration</th><td id="mdop-det-exp"></td></tr>
                    <tr class="d-none" id="mdop-row-exec"><th scope="row">executed</th><td id="mdop-det-exec"></td></tr>
                    <tr class="d-none" id="mdop-row-adj"><th scope="row">adjustments</th><td id="mdop-det-exec"></td></tr>
                    <tr class="d-none" id="mdop-row-error"><th scope="row">error</th><td id="mdop-det-error"></td></tr>
                    <tr><th scope="row">snapshot</th><td id="mdop-det-snapshot"></td></tr>
                    <tr><th scope="row">signers</th><td id="mdop-det-signers"></td></tr>
                </table><br>
                <h5>Operation Payload Data</h5>
                <div id="mdop-det-data"></div>
                <a class="btn btn-success d-none" id="mdop-signop">Sign Operation</a>
            </div><br>
        `
    }

    init() {
        if (isNaN(this.id) || this.id < 0) {
            $('#mdop-loading').hide()
            $('.spinner-border').hide()
            $('#mdop-notfound').show()
            return
        }

        axios.get(config.api+'/dao/master/op/'+this.id).then((op) => {
            $('#mdop-queued-by').text('Queued by '+op.data.signers[0])
            $('#mdop-det-type').text(op.data.type)
            $('#mdop-det-type').append(' <span class="badge badge-pill badge-info">'+TransactionTypes[op.data.type].name+'</span>')
            $('#mdop-det-ts').text(op.data.ts)
            $('#mdop-det-ts').append(' <span class="badge badge-pill badge-info">' + new Date(op.data.ts).toLocaleString() + '</span>')
            $('#mdop-det-exp').text(op.data.expiration)
            $('#mdop-det-exp').append(' <span class="badge badge-pill badge-info">' + new Date(op.data.expiration).toLocaleString() + '</span>')
            if (op.data.executed) {
                $('#mdop-row-exec').removeClass('d-none')
                $('#mdop-det-exec').text(op.data.executed)
                $('#mdop-det-exec').append(' <span class="badge badge-pill badge-info">' + new Date(op.data.executed).toLocaleString() + '</span>')
            }
            if (op.data.adjustments && Object.keys(op.data.adjustments).length > 0) {
                $('#mdop-row-adj').removeClass('d-none')
                $('#mdop-det-adj').html(jsonToTableRecursive(op.data.adjustments))
            }
            if (op.data.error) {
                $('#mdop-row-error').removeClass('d-none')
                $('#mdop-det-error').text(op.data.error)
            }
            $('#mdop-card').html('<p class="dblocks-card-content">'+DOMPurify.sanitize(txToHtml({
                type: op.data.type,
                data: op.data.data,
                sender: config.masterDao,
                ts: op.data.executed || op.data.ts
            }))+'</p>')
            $('#mdop-det-data').html(jsonToTableRecursive(op.data.data))
            $('#mdop-det-snapshot').text(listWords(op.data.snapshot))
            $('#mdop-det-signers').text(listWords(op.data.signers))
            
            let status = this.getStatus(op.data)
            $('#mdop-det-status').addClass(status.class)
            $('#mdop-det-status').text(status.text)

            if (status.text === 'QUEUED') {
                $('#mdop-signop').removeClass('d-none')
                $('#mdop-signop').attr('href','#/signer/?type=39&id='+this.id+'&broadcast=1')
            }

            $('#mdop-loading').hide()
            $('.spinner-border').hide()
            $('#mdop-container').show()
        }).catch((e) => {
            $('#mdop-loading').hide()
            $('.spinner-border').hide()
            if (e.response && e.response.status === 404)
                $('#mdop-notfound').show()
            else
                $('#mdop-error').show()
        })
    }

    getStatus(op) {
        if (op.error)
            return { class: 'badge-danger', text: 'ERRORED' }
        else if (!op.error && op.executed)
            return { class: 'badge-success', text: 'SUCCESS' }
        else if (!op.executed && new Date().getTime() > op.expiration)
            return { class: 'badge-warning', text: 'EXPIRED' }
        else
            return { class: 'badge-info', text: 'QUEUED' }
    }
}