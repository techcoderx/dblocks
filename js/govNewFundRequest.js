import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('New Fund Request')
    }

    getHtml() {
        return `
            <h2>New Fund Request</h2>
            <p>Propose a new idea for Avalon DAO and have them funded by the community.</p>
            <div class="card newgov-card">
                <div class="card-body">
                    <p>Before proceeding, it is important to understand an overview of how this works.</p>
                    <h4><span class="badge badge-pill badge-success">1</span> Create Proposal</h4>
                    <p>Submit your new idea to the Avalon DAO that requires funding. Prior discussion is recommended in a DTube video before submitting one.</p>
                    <h4><span class="badge badge-pill badge-success">2</span> Voting Period</h4>
                    <p>All proposals undergo a 7-day voting period for initial review by Avalon leaders and stakeholders. Proposals that are voted in successfully must have approvals greater than the DAO voting threshold and disapprovals. The voting period and threshold may be changed through a chain update proposal or a hardfork.</p>
                    <h4><span class="badge badge-pill badge-success">3</span> Funding Period</h4>
                    <p>The community proceeds to fund proposals that have passed the initial review, up to the requested amount specified by the proposal creator in step 1. This period lasts up to 7 days or until full funding has been received, whichever is sooner. Contributors will be refunded if the full funding is not received at the end of the funding period.</p>
                    <h4><span class="badge badge-pill badge-success">4</span> Complete Work</h4>
                    <p>Once the proposal has received full funding successfully, the proposal creator completes the work required and submits them to the Avalon DAO for review. All fund requests have a standard deadline of 1 year to complete, which can be extended by follow-up reviewers and may be changed through a chain update proposal or a hardfork.</p>
                    <h4><span class="badge badge-pill badge-success">5</span> Review</h4>
                    <p>Avalon leaders review any work being submitted to the DAO. Responses may include full approval upon satisfactory work completion or a disapproval requiring revision to the work being submitted. Successful review requires >2/3 approvals from Avalon leaders in the snapshot. This period lasts for 3 days. In the event where insufficient reviews are received, the work submitted will be considered as satisfactory and the proposal will proceed to payout.</p>
                    <h4><span class="badge badge-pill badge-success">6</span> Receive Payout</h4>
                    <p class="mb-1">If everything goes well, the funds will be released to the proposal beneficiary's account including any fees paid during proposal creation.</p>
                </div>
            </div><br>
            <div class="form-group">
                <label for="newgov-title">Proposal Title</label>
                <input class="form-control" id="newgov-title">
            </div>
            <div class="form-group">
                <label for="newgov-description">Proposal Description</label>
                <textarea class="form-control" id="newgov-description" row="3"></textarea>
            </div>
            <div class="form-group">
                <label for="newgov-url">Proposal URL</label>
                <input class="form-control" id="newgov-url">
            </div>
            <div class="form-group">
                <label for="newgov-receiver">Proposal Beneficiary</label>
                <input class="form-control" id="newgov-receiver">
            </div>
            <div class="form-group">
                <label for="newgov-requested">Requested Amount</label>
                <div class="input-group">
                    <input type="number" class="form-control" min="0" id="newgov-requested" style="max-width: 250px;">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" id="newgov-requested-asset">DTUBE</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" id="newgov-requested-asset-DTUBE">DTUBE</a>
                            <a class="dropdown-item" id="newgov-requested-asset-centiDTUBE">centiDTUBE</a>
                        </div>
                    </div>
                </div>
            </div>
            <p id="newgov-fee">Fee: 100 DTUBE (refunded upon successful proposal completion)</p>
            <button class="btn btn-success" id="newgov-proceed">Proceed to Signer</button><br><br>
            ${toastArea('newgov-toast-area')}
        `
    }

    init() {
        $('#newgov-proceed').click(() => {
            $('#newgov-toast-area').html('')
            if (!$('#newgov-title').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Proposal title is required',5000))
                return $('#newgov-toast').toast('show')
            } else if (!$('#newgov-description').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Proposal description is required',5000))
                return $('#newgov-toast').toast('show')
            } else if (!$('#newgov-url').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Proposal URL is required',5000))
                return $('#newgov-toast').toast('show')
            } else if (!$('#newgov-receiver').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Proposal beneficiary username is required',5000))
                return $('#newgov-toast').toast('show')
            } else if (!$('#newgov-requested').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Requested amount is required',5000))
                return $('#newgov-toast').toast('show')
            } else if (isNaN(parseFloat($('#newgov-requested').val())) || parseFloat($('#newgov-requested').val()) <= 0) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Requested amount must be a valid non-zero positive number',5000))
                return $('#newgov-toast').toast('show')
            }
            navigateTo(`#/signer/?type=31&title=${encodeURIComponent($('#newgov-title').val())}&description=${encodeURIComponent($('#newgov-description').val())}&url=${encodeURIComponent($('#newgov-url').val())}&receiver=${encodeURIComponent($('#newgov-receiver').val())}&requested=${encodeURIComponent($('#newgov-requested').val()+' '+$('#newgov-requested-asset').text())}&broadcast=1`)
        })
        $('#newgov-requested-asset-DTUBE').on('click',() => $('#newgov-requested-asset').text('DTUBE'))
        $('#newgov-requested-asset-centiDTUBE').on('click',() => $('#newgov-requested-asset').text('centiDTUBE'))
        $('#newgov-requested').on('change',() => {
            let newValue = parseFloat($('#newgov-requested').val())
            if (isNaN(newValue) || newValue <= 0)
                return
            if ($('#newgov-requested-asset').text() === 'DTUBE')
                newValue = Math.round(newValue*100)
            $('#newgov-fee').text('Fee: '+(this.creationFee(newValue)/100)+' DTUBE (refunded upon successful proposal completion)')
        })
    }

    creationFee (requestedFund = 1) {
        let baseFee = 10000
        let subseqAmounts = requestedFund-100000
        if (subseqAmounts <= 0)
            return baseFee
        let subseqFee = Math.ceil((subseqAmounts*1)/100)
        return baseFee+subseqFee
    }
}