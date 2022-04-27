import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('Governance')
        this.selectedType = '0'
        this.selectedStatus = '0'
    }

    getHtml() {
        return `
            <div class="row">
                <div class="col-12 col-sm-9">
                    <h2>Governance</h2>
                    <p>Explore funding requests and chain update proposals in the Avalon DAO.</p>
                </div>
                <div class="col-12 col-sm-3">
                    <button type="button" class="btn btn-success float-right">+ New Proposal</button>
                </div>
            </div>
            <div class="dropdown" id="gov-type-dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="gov-type-dropdownbtn" data-toggle="dropdown" aria-expanded="false">
                    All Proposals
                </button>
                <div class="dropdown-menu" aria-labelledby="gov-type-dropdownbtn" id="gov-type-dropdownmenu">
                    <a class="dropdown-item" id="gov-type-dropdownbtn-0">All Proposals</a>
                    <a class="dropdown-item" id="gov-type-dropdownbtn-1">Fund Requests</a>
                    <a class="dropdown-item" id="gov-type-dropdownbtn-2">Chain Updates</a>
                </div>
            </div>
            <div id="gov-status-row">Status:
                <a class="badge badge-pill badge-success" id="gov-status-0">Active</a>
                <a class="badge badge-pill badge-secondary" id="gov-status-1">Failed</a>
                <a class="badge badge-pill badge-secondary" id="gov-status-2">Successful</a>
            </div>
        `
    }

    init() {
        let typeDropdownBtns = Array.from($('#gov-type-dropdownmenu').children())
        let statusBtns = Array.from($('#gov-status-row').children())
        for (let b in typeDropdownBtns)
            typeDropdownBtns[b].onclick = () => this.switchType(typeDropdownBtns[b].id.replace('gov-type-dropdownbtn-',''))
        for (let b in statusBtns)
            statusBtns[b].onclick = () => this.switchStatus(statusBtns[b].id.replace('gov-status-',''))
        this.fetchProposals()
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
        let type = this.selectedType === '0' ? 'all' : this.selectedType
        axios.get(config.api+'/dao/'+this.selectedStatus+'/'+type).then((p) => {
            console.log(p.data)
        }).catch((e) => console.log(e))
    }
}