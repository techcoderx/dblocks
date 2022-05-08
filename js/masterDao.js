import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('MasterDAO')
        this.selectedStatus = 'queued'
        this.shown = 0
    }

    getHtml() {
        return `
            <div class="row">
                <div class="col-12 col-sm-8">
                    <h2>MasterDAO</h2>
                    <p>Transactions submitted by DAO members which are executed on behalf of the master account.</p>
                </div>
                <div class="col-12 col-sm-4">
                    <a href="#/signer/?type=38" class="btn btn-success float-right">+ New Operation</a>
                </div>
            </div>
            <div id="masterdao-status-row" class="mb-3">Status:
                <a class="badge badge-pill badge-success" id="masterdao-status-queued">Queued</a>
                <a class="badge badge-pill badge-secondary" id="masterdao-status-expired">Expired</a>
                <a class="badge badge-pill badge-secondary" id="masterdao-status-executed">Executed</a>
                <a class="badge badge-pill badge-secondary" id="masterdao-status-errored">Errored</a>
            </div>
            <div id="masterdao-itms"></div>
            <div class="mx-auto" style="width: 108px;">
                <button class="btn btn-outline-secondary d-none" id="masterdao-more-btn">Show More</button>
            </div>
        `
    }

    init() {
        let statusBtns = Array.from($('#masterdao-status-row').children())
        for (let b in statusBtns)
            statusBtns[b].onclick = () => this.switchStatus(statusBtns[b].id.replace('masterdao-status-',''))
        this.fetchOperations()
        $('#masterdao-more-btn').click(() => this.fetchOperations())
    }

    switchStatus(status = 'queued') {
        this.selectedStatus = status
        let statusBtns = Array.from($('#masterdao-status-row').children())
        for (let b in statusBtns)
            if (!statusBtns[b].id.endsWith(status)) {
                $('#'+statusBtns[b].id).removeClass('badge-success')
                $('#'+statusBtns[b].id).addClass('badge-secondary')
            } else {
                $('#'+statusBtns[b].id).addClass('badge-success')
                $('#'+statusBtns[b].id).removeClass('badge-secondary')
            }
        $('#masterdao-itms').html('')
        this.shown = 0
        this.fetchOperations()
    }

    fetchOperations() {
        axios.get(config.api+'/dao/master/ops/'+this.selectedStatus+'/'+this.shown).then((ops) => {
            $('#masterdao-itms').append(DOMPurify.sanitize(masterDaoCards(ops.data)))
            this.shown += ops.data.length
            if (ops.data.length === 50)
                $('#masterdao-more-btn').removeClass('d-none')
        })
    }
}