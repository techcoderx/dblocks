import view from "./view.js";

export default class extends view {
    constructor() {
        super()
        this.id = parseInt(window.location.hash.slice(11))
        this.setTitle('Proposal #'+this.id)
        this.minVotingBarAmount = 100000000
        this.votingThreshold = 50000000
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
                        <p id="prop-by"></p>
                        <p id="prop-url-text">Proposal URL: <a id="prop-url"></a></p><hr>
                        <div class="card prop-card" id="prop-card"><div class="prop-card-content">
                            <h4 class="d-inline-block">Voting Results</h4>
                            <button type="button" class="btn btn-success float-right" id="prop-list-voters-btn">List Voters</button>
                            <div class="progress" id="prop-progressbar">
                                <p class="gov-card-threshold-text" id="prop-threshold-text">Threshold:<br>${thousandSeperator(this.votingThreshold)} DTUBE</p>
                                <div class="progress-bar-marker" role="progressbar" id="prop-threshold-marker"></div>
                                <div class="progress-bar bg-success" role="progressbar" id="prop-bar-approves"></div>
                                <div class="progress-bar bg-danger" role="progressbar" id="prop-bar-disapproves"></div>
                            </div><br>
                            <p class="prop-timetext" id="prop-timetext"></p>
                        </div></div><hr>
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
                            <tr class="d-none" id="prop-requested-row"><th scope="row">Requested</th><td id="prop-requested"></td></tr>
                            <tr class="d-none" id="prop-raised-row"><th scope="row">Raised</th><td id="prop-raised"></td></tr>
                        </table>
                        <div class="d-none" id="prop-chain-update">
                            <h5>Params</h5>
                        </div>
                        <button type="button" class="btn btn-success d-none" id="prop-action"></button>
                    </div>
                </div>
                <div class="modal fade" id="prop-list-voters-modal" tabindex="-1" role="dialog" aria-labelledby="prop-list-voters-modal-title" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="prop-list-voters-modal-title">Voters</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <table class="table table-sm table-striped">
                                    <thead><tr>
                                        <th scope="col">Voter</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Approves?</th>
                                    </tr></thead>
                                    <tbody id="prop-voters-tbody"></tbody>
                                </table>
                            </div>
                            <div class="modal-footer"><button type="button" class="btn btn-success" data-dismiss="modal">Close</button></div>
                        </div>
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

        axios.get(config.api+'/proposal/'+this.id).then(async (prop) => {
            $('#prop-title').text(prop.data.title)
            $('#prop-by').html(DOMPurify.sanitize('by '+aUser(prop.data.creator)+(prop.data.receiver?' with beneficiary '+aUser(prop.data.receiver):'')+' • '+new Date(prop.data.ts).toLocaleString()))
            $('#prop-desc').text(prop.data.description)
            $('#prop-url').text(prop.data.url)
            $('#prop-url').attr('href',prop.data.url)
            $('#prop-type').text(ProposalTypes[prop.data.type].name)
            $('#prop-status').text(ProposalTypes[prop.data.type].statuses[prop.data.status])
            $('#prop-fee').text(thousandSeperator(prop.data.fee/100)+' DTUBE')
            $('#prop-appr').text(thousandSeperator(prop.data.approvals/100)+' DTUBE')
            $('#prop-disappr').text(thousandSeperator(prop.data.disapprovals/100)+' DTUBE')
            $('#prop-timetext').text(getTimeText(prop.data))

            switch (prop.data.type) {
                case 1:
                    $('#prop-requested-row').removeClass('d-none')
                    $('#prop-raised-row').removeClass('d-none')
                    $('#prop-requested').text(thousandSeperator(prop.data.requested/100)+' DTUBE')
                    $('#prop-raised').text(thousandSeperator(prop.data.raised/100)+' DTUBE')
                    switch (prop.data.status) {
                        case 0:
                            $('#prop-action').text('Vote')
                            $('#prop-action').removeClass('d-none')
                            break
                        case 2:
                            $('#prop-action').text('Fund')
                            $('#prop-action').removeClass('d-none')
                            break
                        case 3:
                        case 8:
                            $('#prop-action').text('Submit Work')
                            $('#prop-action').removeClass('d-none')
                            break
                        case 4:
                            $('#prop-action').text('Review Work')
                            $('#prop-action').removeClass('d-none')
                            break
                    }
                    break
                case 2:
                    $('#prop-chain-update').removeClass('d-none')
                    $('#prop-chain-update').append(jsonToTableRecursive(this.changesJson(prop.data.changes)))
                    if (prop.data.status === 0) {
                        $('#prop-action').text('Vote')
                        $('#prop-action').removeClass('d-none')
                    }
                    break
            }

            if (!prop.data.title)
                $('#prop-title').html('<i>Untitled Proposal</i>')
            if (!prop.data.description)
                $('#prop-desc').html('<i>This proposal does not contain a description.</i>')
            if (!prop.data.url)
                $('#prop-url-text').addClass('d-none')

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

            try {
                this.votingThreshold = (await axios.get(config.api+'/config')).data.daoVotingThreshold
                $('#prop-threshold-text').html('Threshold:<br>'+thousandSeperator(this.votingThreshold/100)+' DTUBE')
            } catch {}

            this.drawVotingProgress(prop.data)
            this.resizeObserver = new ResizeObserver(() => this.drawVotingProgress(prop.data)).observe($('#prop-progressbar')[0])

            $('#prop-list-voters-btn').on('click',() => {
                if ($('#prop-list-voters-btn').text() === 'Loading...') return
                $('#prop-list-voters-btn').text('Loading...')
                axios.get(config.api+'/proposal/votes/'+this.id).then((votes) => {
                    votes.data = votes.data.sort((a,b) => b.amount - a.amount)
                    let votersTbody = ''
                    for (let i in votes.data) {
                        votersTbody += '<tr>'
                        votersTbody += '<td>'+DOMPurify.sanitize(votes.data[i].voter)+'</td>'
                        votersTbody += '<td>'+thousandSeperator(votes.data[i].amount/100)+' DTUBE</td>'
                        votersTbody += '<td>'+(!votes.data[i].veto).toString()+'</td>'
                        votersTbody += '</tr>'
                    }
                    $('#prop-voters-tbody').html(votersTbody)
                    $('#prop-list-voters-modal').modal()
                    $('#prop-list-voters-btn').text('List Voters')
                }).catch(() => {
                    $('#prop-list-voters-btn').text('Errored')
                    setTimeout(() => $('#prop-list-voters-btn').text('List Voters'),5000)
                })
            })

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

    drawVotingProgress(proposal) {
        let totalWidthAmount = Math.max(this.minVotingBarAmount,proposal.approvals+proposal.disapprovals)
        let width = $('#prop-progressbar').width()
        let transform = (proposal.threshold || this.votingThreshold)*width/totalWidthAmount
        $('#prop-threshold-marker').css('transform','translate('+transform+'px, 0px)')
        $('#prop-threshold-text').css('transform','translate('+(transform-40)+'px, -30px)')
        $('#prop-bar-approves').css('width',(100*proposal.approvals/totalWidthAmount)+'%')
        $('#prop-bar-disapproves').css('width',(100*proposal.disapprovals/totalWidthAmount)+'%')
    }

    changesJson(changesArray) {
        let result = {}
        for (let c in changesArray)
            result[changesArray[c][0]] = changesArray[c][1]
        return result
    }
}