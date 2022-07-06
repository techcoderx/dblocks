import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('New Chain Update')
        this.changes = []
        this.changesMax = 20
    }

    getHtml() {
        return `
            <h2>New Chain Update</h2>
            <p>Propose updates and improvements to the parameters of the Avalon blockchain.</p>
            <div class="card newgov-card">
                <div class="card-body">
                    <p>Before proceeding, it is important to understand an overview of how this works.</p>
                    <h4><span class="badge badge-pill badge-success">1</span> Create Proposal</h4>
                    <p>Submit your chain parameter update suggestion to the Avalon DAO. Prior discussion is recommended in a DTube video before submitting one.</p>
                    <h4><span class="badge badge-pill badge-success">2</span> Voting Period</h4>
                    <p>All proposals undergo a 7-day voting period for initial review by Avalon leaders and stakeholders. Proposals that are voted in successfully must have approvals greater than the DAO voting threshold and disapprovals. The voting period and threshold may be changed through a chain update proposal or a hardfork.</p>
                    <h4><span class="badge badge-pill badge-success">3</span> Grace Period</h4>
                    <p>Upon successful voting, a 24-hour grace period begins before the new parameters take effect.</p>
                    <h4><span class="badge badge-pill badge-success">4</span> Execution</h4>
                    <p class="mb-1">After the grace period, the chain parameter update executes and any fees paid during proposal creation are refunded.</p>
                    ${Object.keys(ChainParamsGroups).length > 0 ? `
                        <div id="newgov-paramgroup-notice"><hr>
                            <h4>Note:</h4>
                            <p>The following parameters are part of a group and hence all of them that are in the group must be specified in order to update any of them:</p>
                            <div id="newgov-paramgroup-notice-groups">
                                ${(() => {
                                    let result = ''
                                    for (let g in ChainParamsGroups)
                                        result += 'Group '+g+': '+listWords(ChainParamsGroups[g])
                                    return result
                                })()}
                            </div>
                        </div>
                    ` : ``
                    }
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
                <label>Proposed Changes</label>
                <div class="input-group" style="max-width: 600px;">
                    <select class="form-control" id="newgov-change-newparam">
                        <option value="">New Parameter...</option>
                        ${ChainParams.reduce((previous,current) => {
                            let next = previous
                            if (!next.startsWith('<option'))
                                next = '<option>'+previous+'</option>'
                            next += '<option>'+current+'</option>'
                            return next
                        })}
                    </select>
                    <input type="text" class="form-control" placeholder="New Parameter Value" id="newgov-change-newvalue">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" id="newgov-change-newadd">+ Add</button>
                    </div>
                </div>
            </div>
            <table class="table table-sm table-striped d-none" style="max-width: 600px;" id="newgov-changes-table">
                <thead><tr>
                    <th scope="col">Parameter</th>
                    <th scope="col">Value</th>
                    <th scope="col" style="max-width: 30px;">Delete?</th>
                </tr></thead>
                <tbody id="newgov-changes"></tbody>
            </table>
            <p id="newgov-fee">Fee: 300 DTUBE (refunded upon successful execution)</p>
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
            }
            navigateTo(`#/signer/?type=37&title=${encodeURIComponent($('#newgov-title').val())}&description=${encodeURIComponent($('#newgov-description').val())}&url=${encodeURIComponent($('#newgov-url').val())}&changes=${encodeURIComponent(JSON.stringify(this.changes))}&broadcast=1`)
        })
        $('#newgov-change-newadd').click(() => {
            $('#newgov-toast-area').html('')
            if (!$('#newgov-change-newparam').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Please select a parameter',5000))
                return $('#newgov-toast').toast('show')
            } else if (!$('#newgov-change-newvalue').val()) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Please enter a new value for the selected parameter',5000))
                return $('#newgov-toast').toast('show')
            } else if (this.changes.length > 20) {
                $('#newgov-toast-area').html(toast('newgov-toast','dblocks-toaster-error','Error','Only up to '+this.changesMax+' parameters can be updated at a time',5000))
                return $('#newgov-toast').toast('show')
            }
            let isUpdate = false
            for (let c in this.changes)
                if (this.changes[c][0] === $('#newgov-change-newparam').val()) {
                    this.changes[c][1] = parseFloat($('#newgov-change-newvalue').val())
                    isUpdate = true
                    break
                }
            if (!isUpdate)
                this.changes.push([$('#newgov-change-newparam').val(),parseFloat($('#newgov-change-newvalue').val())])
            this.renderChanges()
            $('#newgov-change-newparam').val('')
            $('#newgov-change-newvalue').val('')
        })
    }

    renderChanges() {
        if (this.changes.length === 0)
            return $('#newgov-changes-table').addClass('d-none')
        $('#newgov-changes-table').removeClass('d-none')
        let changesTbody = ''
        for (let c in this.changes)
            changesTbody += '<tr><td>'+this.changes[c][0]+'</td><td>'+DOMPurify.sanitize(this.changes[c][1])+'</td><td><buttom class="badge badge-danger" style="cursor: pointer;" id="newgov-changes-delete-'+c+'">Delete</button></td></tr>'
        $('#newgov-changes').html(changesTbody)
        for (let c in this.changes) {
            let idx = c
            $('#newgov-changes-delete-'+idx).click(() => {
                this.changes.splice(idx,1)
                this.renderChanges()
            })
        }
    }
}
