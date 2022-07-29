import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.id = parseInt(window.location.hash.slice(16))
        this.setTitle('Vote Proposal #'+this.id)
        this.availWeight = 0
        this.leaderVotingBonus = 10000
    }

    getHtml() {
        return `
            <h2>Vote Proposal #${this.id}</h2>
            <div class="card newgov-card mb-4">
                <div class="card-body pt-3 pb-2">
                    <h4>How It Works:</h4>
                    <ol>
                        <li>Proposal voting is weighted by stake.</li>
                        <li>DTUBE used for voting will be locked to your account and will be unspendable until the voting period ends.</li>
                        <li>DTUBE used for voting will be unlocked at the end of the voting period of the proposals regardless of the outcome.</li>
                        <li>DTUBE used for voting will continue to generate resources such as VP and bandwidth.</li>
                        <li>The same coins may be used to vote for as many proposals as possible.</li>
                    </ol>
                </div>
            </div>
            <p class="mb-1">Please pick your approval for this proposal. Votes may not be changed once casted.</p>
            <div class="row">
                <div class="col-md-6">
                    <a class="card newgov-card text-decoration-none" id="propvote-yes">
                        <div class="card-body newgov-card-body d-flex row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="currentColor" class="bi bi-hand-thumbs-up mx-auto" viewBox="0 0 16 16">
                                <path d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z"/>
                            </svg>
                            <h1 class="text-center w-100" style="padding-top: inherit;">YES</h1>
                        </div>
                    </a>
                </div>
                <div class="col-md-6">
                    <a class="card newgov-card text-decoration-none" id="propvote-no">
                        <div class="card-body newgov-card-body d-flex row">
                            <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="currentColor" class="bi bi-hand-thumbs-down mx-auto" viewBox="0 0 16 16">
                                <path d="M8.864 15.674c-.956.24-1.843-.484-1.908-1.42-.072-1.05-.23-2.015-.428-2.59-.125-.36-.479-1.012-1.04-1.638-.557-.624-1.282-1.179-2.131-1.41C2.685 8.432 2 7.85 2 7V3c0-.845.682-1.464 1.448-1.546 1.07-.113 1.564-.415 2.068-.723l.048-.029c.272-.166.578-.349.97-.484C6.931.08 7.395 0 8 0h3.5c.937 0 1.599.478 1.934 1.064.164.287.254.607.254.913 0 .152-.023.312-.077.464.201.262.38.577.488.9.11.33.172.762.004 1.15.069.13.12.268.159.403.077.27.113.567.113.856 0 .289-.036.586-.113.856-.035.12-.08.244-.138.363.394.571.418 1.2.234 1.733-.206.592-.682 1.1-1.2 1.272-.847.283-1.803.276-2.516.211a9.877 9.877 0 0 1-.443-.05 9.364 9.364 0 0 1-.062 4.51c-.138.508-.55.848-1.012.964l-.261.065zM11.5 1H8c-.51 0-.863.068-1.14.163-.281.097-.506.229-.776.393l-.04.025c-.555.338-1.198.73-2.49.868-.333.035-.554.29-.554.55V7c0 .255.226.543.62.65 1.095.3 1.977.997 2.614 1.709.635.71 1.064 1.475 1.238 1.977.243.7.407 1.768.482 2.85.025.362.36.595.667.518l.262-.065c.16-.04.258-.144.288-.255a8.34 8.34 0 0 0-.145-4.726.5.5 0 0 1 .595-.643h.003l.014.004.058.013a8.912 8.912 0 0 0 1.036.157c.663.06 1.457.054 2.11-.163.175-.059.45-.301.57-.651.107-.308.087-.67-.266-1.021L12.793 7l.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315l-.353-.354.353-.354c.047-.047.109-.176.005-.488a2.224 2.224 0 0 0-.505-.804l-.353-.354.353-.354c.006-.005.041-.05.041-.17a.866.866 0 0 0-.121-.415C12.4 1.272 12.063 1 11.5 1z"/>
                            </svg>
                            <h1 class="text-center w-100" style="padding-top: inherit;">NO</h1>
                        </div>
                    </a>
                </div>
            </div><br>
            <div class="form-group">
                <label for="propvote-user">Voter Username</label>
                <input class="form-control" id="propvote-user">
            </div>
            <div class="form-group">
                <label for="propvote-weight">Vote Weight</label><span> (Available: <a class="propvote-avail text-decoration-none text-success" id="propvote-avail">0 DTUBE</a>)</span>
                <div class="input-group">
                    <input type="number" class="form-control" min="0" id="propvote-weight" style="max-width: 250px;">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" id="propvote-weight-asset">DTUBE</button>
                        <div class="dropdown-menu">
                            <a class="dropdown-item" id="propvote-weight-asset-DTUBE">DTUBE</a>
                            <a class="dropdown-item" id="propvote-weight-asset-centiDTUBE">centiDTUBE</a>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn btn-success" id="propvote-proceed">Proceed to Signer</button><br><br>
            ${toastArea('propvote-toast-area')}
        `
    }

    init() {
        $('#propvote-yes').on('click',() => {
            $('#propvote-yes').addClass('border-success')
            $('#propvote-no').removeClass('border-success')
        })

        $('#propvote-no').on('click',() => {
            $('#propvote-no').addClass('border-success')
            $('#propvote-yes').removeClass('border-success')
        })

        $('#propvote-user').on('change',() => {
            this.loadAvailable($('#propvote-user').val())
        })

        if (window.auth && window.auth.username) {
            $('#propvote-user').val(window.auth.username)
            this.loadAvailable(window.auth.username)
        }

        $('#propvote-avail').on('click',() => {
            $('#propvote-weight').val(this.availWeight/100)
            $('#propvote-weight-asset').text('DTUBE')
        })

        $('#propvote-weight-asset-DTUBE').on('click',() => $('#propvote-weight-asset').text('DTUBE'))
        $('#propvote-weight-asset-centiDTUBE').on('click',() => $('#propvote-weight-asset').text('centiDTUBE'))

        $('#propvote-proceed').on('click',() => {
            $('#propvote-toast-area').html('')
            let direction = null
            if ($('#propvote-yes').hasClass('border-success'))
                direction = true
            else if ($('#propvote-no').hasClass('border-success'))
                direction = false
            if (typeof direction !== 'boolean') {
                $('#propvote-toast-area').html(toast('propvote-toast','dblocks-toaster-error','Error','Please pick your approval for the proposal',5000))
                return $('#propvote-toast').toast('show')
            }
            let amt = parseFloat($('#propvote-weight').val())
            if (isNaN(amt) || amt <= 0) {
                $('#propvote-toast-area').html(toast('propvote-toast','dblocks-toaster-error','Error','Vote amount must be greater than 0',5000))
                return $('#propvote-toast').toast('show')
            }
            navigateTo('#/signer/?type=35&id='+this.id+'&amount='+(!direction ? '-' : '')+$('#propvote-weight').val()+'%20'+$('#propvote-weight-asset').text()+'&sender='+$('#propvote-user').val()+'&broadcast=1')
        })
    }

    async loadAvailable(username = '') {
        let acc, prop
        try {
            acc = await axios.get(config.api+'/account/'+username)
            prop = await axios.get(config.api+'/proposal/'+this.id)
        } catch {
            $('#propvote-proceed').prop('disabled',true)
            $('#propvote-proceed').text('Could not fetch voter account or proposal')
            return
        }
        this.availWeight = acc.data.balance
        if (prop.data.leaderSnapshot.includes(username))
            this.availWeight += this.leaderVotingBonus
        $('#propvote-avail').text(thousandSeperator(this.availWeight/100)+' DTUBE')
        for (let v in acc.data.proposalVotes)
            if (acc.data.proposalVotes[v].id === this.id) {
                $('#propvote-proceed').prop('disabled',true)
                $('#propvote-proceed').text('Voted Already')
                return
            }
        $('#propvote-proceed').prop('disabled',false)
        $('#propvote-proceed').text('Proceed to Signer')
    }
}