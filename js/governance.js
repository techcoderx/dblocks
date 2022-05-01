import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('Governance')
        this.selectedType = 'all'
        this.selectedStatus = 'all'
        this.minVotingBarAmount = 100000000
        this.votingThreshold = 50000000
    }

    getHtml() {
        return `
            <div class="row">
                <div class="col-12 col-sm-7">
                    <h2>Governance</h2>
                    <p>Explore funding requests and chain update proposals in the Avalon DAO.</p>
                </div>
                <div class="col-12 col-sm-5">
                    <button type="button" class="btn btn-success float-right">+ New Proposal</button>
                </div>
            </div>
            <div class="dropdown" id="gov-type-dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="gov-type-dropdownbtn" data-toggle="dropdown" aria-expanded="false">
                    All Proposals
                </button>
                <div class="dropdown-menu" aria-labelledby="gov-type-dropdownbtn" id="gov-type-dropdownmenu">
                    <a class="dropdown-item" id="gov-type-dropdownbtn-all">All Proposals</a>
                    <a class="dropdown-item" id="gov-type-dropdownbtn-1">Fund Requests</a>
                    <a class="dropdown-item" id="gov-type-dropdownbtn-2">Chain Updates</a>
                </div>
            </div>
            <div id="gov-status-row">Status:
                <a class="badge badge-pill badge-success" id="gov-status-all">All</a>
                <a class="badge badge-pill badge-secondary" id="gov-status-0">Active</a>
                <a class="badge badge-pill badge-secondary" id="gov-status-1">Failed</a>
                <a class="badge badge-pill badge-secondary" id="gov-status-2">Successful</a>
            </div>
            <div class="row" id="gov-proposals"><i>Loading Proposals...</i></div>
        `
    }

    init() {
        let typeDropdownBtns = Array.from($('#gov-type-dropdownmenu').children())
        let statusBtns = Array.from($('#gov-status-row').children())
        for (let b in typeDropdownBtns)
            typeDropdownBtns[b].onclick = () => this.switchType(typeDropdownBtns[b].id.replace('gov-type-dropdownbtn-',''))
        for (let b in statusBtns)
            statusBtns[b].onclick = () => this.switchStatus(statusBtns[b].id.replace('gov-status-',''))
        this.fetchChainConfig(() => this.fetchProposals())
    }

    switchType(type = 0) {
        this.selectedType = type
        $('#gov-type-dropdownbtn').text($('#gov-type-dropdownbtn-'+type).text())
        this.fetchProposals()
    }

    switchStatus(status = 0) {
        this.selectedStatus = status
        let statusBtns = Array.from($('#gov-status-row').children())
        for (let b in statusBtns)
            if (!statusBtns[b].id.endsWith(status)) {
                $('#'+statusBtns[b].id).removeClass('badge-success')
                $('#'+statusBtns[b].id).addClass('badge-secondary')
            } else {
                $('#'+statusBtns[b].id).addClass('badge-success')
                $('#'+statusBtns[b].id).removeClass('badge-secondary')
            }
        this.fetchProposals()
    }

    fetchProposals() {
        axios.get(config.api+'/dao/'+this.selectedStatus+'/'+this.selectedType).then((p) => {
            this.proposals = p.data
            if (p.data.length === 0)
                return $('#gov-proposals').html('<i>There are no proposals to list here</i>')
            else
                this.renderProposals()
        }).catch((e) => {
            console.log(e)
            $('#gov-proposals').html('<i>Failed to fetch proposals</i>')
        })
    }

    fetchChainConfig(cb) {
        axios.get(config.api+'/config').then((p) => {
            this.votingThreshold = p.data.daoVotingThreshold
            cb()
        }).catch(() => cb()) // use defaults if it fails
    }

    renderProposals() {
        if (this.resizeObserver)
            this.resizeObserver.unobserve()
        let result = ''
        for (let i in this.proposals) {
            let totalWidthAmount = Math.max(this.minVotingBarAmount,this.proposals[i].approvals+this.proposals[i].disapprovals)
            result += `
            <div class="card gov-card"><div class="gov-card-content">
                <div class="row">
                    <div class="col-6">
                    <h5 class="gov-card-id text-muted">#${this.proposals[i]._id}</h5><div class="badge badge-pill badge-info gov-card-type">${ProposalTypes[this.proposals[i].type].name}</div>
                </div>
                <div class="col-6">
                    <h6 class="float-right gov-card-summary">${this.getBriefDesc(this.proposals[i])}</h6>
                </div>
            </div>
            <h3 class="gov-card-title">${this.proposals[i].title}</h3>
            <p>by ${aUser(this.proposals[i].creator)+(this.proposals[i].receiver?' with beneficiary '+aUser(this.proposals[i].receiver):'')}</p><br>
            <div class="progress" id="gov-progressbar-${this.proposals[i]._id}">
                <p class="gov-card-threshold-text" id="gov-threshold-text-${this.proposals[i]._id}">Threshold:<br>${thousandSeperator((this.proposals[i].threshold || this.votingThreshold)/100)} DTUBE</p>
                <div class="progress-bar-marker" role="progressbar" id="gov-threshold-marker-${this.proposals[i]._id}"></div>
                <div class="progress-bar bg-success" role="progressbar" style="width: ${this.proposals[i].approvals/totalWidthAmount*100}%"></div>
                <div class="progress-bar bg-danger" role="progressbar" style="width: ${this.proposals[i].disapprovals/totalWidthAmount*100}%"></div>
            </div><br>
            <p>${this.getTimeText(this.proposals[i])}</p>
            </div></div>
            `
        }
        if (this.proposals.length % 2 !== 0)
            result += '<div class="gov-card"></div>'
        $('#gov-proposals').html(DOMPurify.sanitize(result))
        this.markThresholds()
        this.resizeObserver = new ResizeObserver(() => this.markThresholds()).observe($('#gov-progressbar-'+this.proposals[0]._id)[0])
    }

    markThresholds() {
        for (let i in this.proposals) {
            let totalWidthAmount = Math.max(this.minVotingBarAmount,this.proposals[i].approvals+this.proposals[i].disapprovals)
            let width = $('#gov-progressbar-'+this.proposals[i]._id).width()
            let transform = (this.proposals[i].threshold || this.votingThreshold)*width/totalWidthAmount
            $('#gov-threshold-marker-'+this.proposals[i]._id).css('transform','translate('+transform+'px, 0px)')
            $('#gov-threshold-text-'+this.proposals[i]._id).css('transform','translate('+(transform-40)+'px, -30px)')
        }
    }

    getBriefDesc(proposal) {
        switch (proposal.type) {
            case 1:
                return 'Requested: '+thousandSeperator(proposal.requested/100)+' DTUBE'
            case 2:
                return 'Updating: '+proposal.changes.length+' parameters'
        }
    }

    getTimeText(proposal) {
        if (proposal.type === 1) {
            switch (proposal.status) {
                case 0:
                    return 'Voting Ends: '+new Date(proposal.votingEnds).toLocaleString()
                case 1:
                    return 'Voting Failed: '+new Date(proposal.votingEnds).toLocaleString()
                case 2:
                    return 'Funding Ends: '+new Date(proposal.fundingEnds).toLocaleString()
                case 3:
                case 8:
                    return 'Deadline: '+new Date(proposal.deadline).toLocaleString()
                case 4:
                    return 'Funding Failed: '+new Date(proposal.fundingEnds).toLocaleString()
                case 5:
                    return 'Review Ends: '+new Date(proposal.reviewDeadline).toLocaleString()
                case 6:
                    return 'Paid: '+new Date(proposal.paid).toLocaleString()
                case 7:
                    return 'Expired: '+new Date(proposal.paid).toLocaleString()
            }
        } else if (proposal.type === 2) {
            switch (proposal.status) {
                case 0:
                    return 'Voting Ends: '+new Date(proposal.votingEnds).toLocaleString()
                case 1:
                    return 'Voting Failed: '+new Date(proposal.votingEnds).toLocaleString()
                case 2:
                    return 'Execution Scheduled: '+new Date(proposal.executionTs).toLocaleString()
                case 3:
                    return 'Executed: '+new Date(proposal.executionTs).toLocaleString()
            }
        }
    }
}