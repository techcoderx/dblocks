import view from "./view.js";

export default class extends view {
    constructor() {
        super()
        this.id = parseInt(window.location.hash.slice(11))
        this.setTitle('Proposal #'+this.id)
    }

    getHtml() {
        return `
            ${this.loadingHtml('prop','proposal')}
            ${this.errorHtml('prop','proposal')}
            ${this.notFoundHtml('prop','Proposal')}
            <div id="prop-container">
                <div class="row">
                    <div class="col-12 col-lg-9">
                        <h5 class="text-muted">Proposal #${this.id}</h5>
                        <h2 id="prop-title"></h2>
                        <p id="prop-by"></p><hr>
                        <p id="prop-desc"></p>
                    </div>
                    <div class="col-12 col-lg-3">
                        <table class="table table-sm">
                            <tr><th scope="row">ID</th><td>${this.id}</td></tr>
                            <tr><th scope="row">Type</th><td><div class="badge badge-pill badge-info" id="prop-type"></div></td></tr>
                            <tr><th scope="row">Status</th><td><div class="badge badge-pill" id="prop-status"></div></td></tr>
                            <tr><th scope="row">Fee</th><td id="prop-fee"></td></tr>
                            <tr><th scope="row">Approvals</th><td id="prop-appr"></td></tr>
                            <tr><th scope="row">Disapprovals</th><td id="prop-disappr"></td></tr>
                        </table>
                    </div>
                </div>
            </div>
        `
    }

    init() {
        if (isNaN(this.id) || this.id < 0) {
            $('#prop-loading').hide()
            $('.spinner-border').hide()
            $('#prop-notfound').show()
            return
        }

        axios.get(config.api+'/proposal/'+this.id).then((prop) => {
            $('#prop-title').text(prop.data.title)
            $('#prop-by').html(DOMPurify.sanitize('by '+aUser(prop.data.creator)+(prop.data.receiver?' with beneficiary '+aUser(prop.data.receiver):'')+' • '+new Date(prop.data.ts).toLocaleString()))
            $('#prop-desc').text(prop.data.description)
            $('#prop-type').text(ProposalTypes[prop.data.type].name)
            $('#prop-status').text(ProposalTypes[prop.data.type].statuses[prop.data.status])
            $('#prop-fee').text(thousandSeperator(prop.data.fee/100)+' DTUBE')
            $('#prop-appr').text(thousandSeperator(prop.data.approvals/100)+' DTUBE')
            $('#prop-disappr').text(thousandSeperator(prop.data.disapprovals/100)+' DTUBE')

            switch (prop.data.state) {
                case 0:
                    $('#prop-status').addClass('badge-info')
                    break
                case 1:
                    $('#prop-status').addClass('badge-danger')
                    break
                case 2:
                    $('#prop-status').addClass('badge-success')
                    break
            }
            
            // $('#')

            $('#prop-loading').hide()
            $('.spinner-border').hide()
            $('#prop-container').show()
        }).catch((e) => {
            $('#prop-loading').hide()
            $('.spinner-border').hide()
            if (e.response && e.response.status === 404)
                $('#prop-notfound').show()
            else
                $('#prop-error').show()
        })
    }
}