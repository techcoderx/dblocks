import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Curation Reward Estimator')
        this.ecoConfig = {
            ecoBaseRent: 0.50,
            ecoClaimPrecision: 3,
            ecoClaimTime: 604800000,
            ecoPunishAuthor: true,
            ecoPunishPercent: 0.5,
            ecoRentStartTime: 86400000,
            ecoRentEndTime: 302400000,
            ecoRentPrecision: 6,
            ecoStartRent: 0.75,
            rewardPoolMaxShare: 0.1,
            tippedVotePrecision: 2,
            masterFee: 9
        }
    }

    getHtml() {
        return `
            <h2>Curation Rewards Estimator</h2>
            <p>Estimate curation rewards of a potential vote. Your results may vary.</p>
            <div class="form-group">
                <label for="reward-est-content">Content Identifier (in form of author/permlink)</label>
                <input class="form-control" id="reward-est-content" placeholder="Leave blank for new content">
            </div>
            <div class="form-group">
                <label for="reward-est-vp">Voting Power</label>
                <div class="input-group">
                    <input class="form-control" id="reward-est-vp" type="number">
                    <div class="input-group-append">
                        <span class="input-group-text" id="reward-est-vp-suffix">VP</span>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="reward-est-tip">Author Tip</label>
                <div class="input-group">
                    <input class="form-control" id="reward-est-tip" type="number" min="0" max="100" placeholder="0">
                    <div class="input-group-append">
                        <span class="input-group-text" id="reward-est-tip-suffix">%</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-success" id="reward-est-estimate">Estimate</button>
            <br>
            <p id="reward-est-result" style="display: none;">
                <div id="reward-est-result-reward"></div>
                <div id="reward-est-result-fee"></div>
                <div id="reward-est-result-apr"></div>
            </p>
            ${toastArea('reward-est-toast')}
        `
    }

    init() {
        $('#reward-est-estimate').on('click', async () => {
            let contentId = $('#reward-est-content').val()
            let contentIdSplit = contentId.split('/')
            let vp = parseInt($('#reward-est-vp').val())
            let tip = parseInt($('#reward-est-tip').val())
            if (isNaN(tip) || contentId === '')
                tip = 0
            $('#reward-est-toast').html('')
            if (contentId && contentIdSplit.length !== 2) {
                $('#reward-est-toast').html(toast('reward-est-alert','dblocks-toaster-error','Error','Invalid content identifier format',5000))
                $('#reward-est-alert').toast('show')
                return
            } else if (isNaN(vp) || vp === 0) {
                $('#reward-est-toast').html(toast('reward-est-alert','dblocks-toaster-error','Error','VP must be a non-negative integer',5000))
                $('#reward-est-alert').toast('show')
                return
            } else if (tip && (isNaN(tip) || tip < 0 || tip > 100)) {
                $('#reward-est-toast').html(toast('reward-est-alert','dblocks-toaster-error','Error','Author tip must be between 0 and 100',5000))
                $('#reward-est-alert').toast('show')
                return
            }

            let rp
            try {
                rp = (await axios.get(window.config.api+'/rewardPool')).data
            } catch (e) {
                $('#reward-est-toast').html(toast('reward-est-alert','dblocks-toaster-error','Error','Could not fetch reward pool data',5000))
                $('#reward-est-alert').toast('show')
                return
            }

            let currentVote = {
                u: '',
                ts: new Date().getTime(),
                vt: vp,
                tip: tip/Math.pow(10,this.ecoConfig.tippedVotePrecision)
            }
            let distBefore = 0
            let votes = []

            if (contentId)
                try {
                    let content = (await axios.get(window.config.api+'/content/'+contentId)).data
                    distBefore = content.dist
                    votes = content.votes
                } catch (e) {
                    $('#reward-est-toast').html(toast('reward-est-alert','dblocks-toaster-error','Error','Could not fetch content',5000))
                    $('#reward-est-alert').toast('show')
                    return
                }

            votes.push(currentVote)
            let result = this.curation(rp,contentIdSplit[0],votes,distBefore)
            $('#reward-est-result-reward').text(`Reward: ${this.floor(result.newVotes[result.newVotes.length-1].claimable/100)} DTUBE`)
            $('#reward-est-result-fee').text(`Master Fee: ${this.floor(result.fee/100)} DTUBE`)
            $('#reward-est-result-apr').text(`APR: ${Math.abs(result.newVotes[result.newVotes.length-1].claimable*365*24/vp).toFixed(2)}%`)
            $('#reward-est-result').show()
            console.log(result)
        })
    }

    // from avalon
    curation(rp, author = '', votes = [], distBefore = 0) {
        let currentVote = votes[votes.length-1]
        let sumVtWinners = 0
        for (let i = 0; i < votes.length; i++)
            if (!votes[i].claimed)
                if (currentVote.vt*votes[i].vt > 0)
                    sumVtWinners += votes[i].vt
        let winners = []
        for (let i = 0; i < votes.length; i++)
            if (!votes[i].claimed)
                if (currentVote.vt*votes[i].vt > 0) {
                    let winner = votes[i]
                    winner.share = winner.vt / sumVtWinners
                    winners.push(winner)
                }
        let thNewCoins = this.print(rp,currentVote.vt)
        let newCoins = 0
        for (let i = 0; i < winners.length; i++) {
            if (!winners[i].gross)
                winners[i].gross = 0
            
            let won = thNewCoins * winners[i].share
            let rentabilityWinner = this.rentability(winners[i].ts, currentVote.ts)
            won *= rentabilityWinner
            won = this.floor(won)
            winners[i].gross += won
            newCoins += won
            delete winners[i].share
        }
        newCoins = this.round(newCoins)
        let newVotes = []
        for (let i = 0; i < votes.length; i++)
            if (!votes[i].claimed && currentVote.vt*votes[i].vt > 0) {
                for (let y = 0; y < winners.length; y++)
                    if (winners[y].u === votes[i].u)
                        newVotes.push(winners[y])
            } else newVotes.push(votes[i])
        let newBurn = 0
        let takeAwayAmount = thNewCoins*this.ecoConfig.ecoPunishPercent
        let i = votes.length - 1
        while (takeAwayAmount !== 0 && i>=0) {
            if (i === 0 && !this.ecoConfig.ecoPunishAuthor)
                break
            if (!votes[i].claimed && votes[i].vt*currentVote.vt < 0)
                if (votes[i].gross >= takeAwayAmount) {
                    votes[i].gross -= takeAwayAmount
                    newBurn += takeAwayAmount
                    takeAwayAmount = 0
                } else {
                    takeAwayAmount -= votes[i].gross
                    newBurn += votes[i].gross
                    votes[i].gross = 0
                }
            i--
        }
        newBurn = this.round(newBurn)

        // author tip
        let authorVote = -1
        let authorVoteClaimed = false
        let totalAuthorTip = 0
        let precisionMulti = Math.pow(10,this.ecoConfig.ecoClaimPrecision+this.ecoConfig.tippedVotePrecision)
        for (let v = 0; v < newVotes.length; v++)
            if (newVotes[v].u === author) {
                authorVote = v
                if (newVotes[v].claimed) authorVoteClaimed = true
                break
            }
        for (let v = 0; v < newVotes.length; v++) {
            if (authorVote >= 0 && newVotes[v].u !== author && newVotes[v].tip)
                if (!authorVoteClaimed) {
                    let tipAmt = (newVotes[v].gross * Math.pow(10,this.ecoConfig.ecoClaimPrecision)) * (newVotes[v].tip * Math.pow(10,this.ecoConfig.tippedVotePrecision))
                    totalAuthorTip += tipAmt
                    newVotes[v].totalTip = tipAmt / precisionMulti
                    newVotes[v].claimable = ((newVotes[v].gross * precisionMulti) - tipAmt) / precisionMulti
                } else
                    newVotes[v].claimable = ((newVotes[v].gross * precisionMulti) - (newVotes[v].totalTip * precisionMulti)) / precisionMulti
            else if (newVotes[v].u !== author)
                newVotes[v].claimable = newVotes[v].gross
            if (newVotes[v].claimable < 0)
                newVotes[v].claimable = 0
        }
        if (authorVote >= 0 && !authorVoteClaimed)
            newVotes[authorVote].claimable = ((newVotes[authorVote].gross * precisionMulti) + totalAuthorTip) / precisionMulti

        let fee = 0
        if (this.ecoConfig.masterFee > 0 && newCoins > 0)
            fee = Math.floor((distBefore+newCoins)/this.ecoConfig.masterFee) - Math.floor(distBefore/this.ecoConfig.masterFee)

        return {
            dist: newCoins,
            newVotes: newVotes,
            fee: fee
        }
    }

    rentability(ts1 = 0, ts2 = 0) {
        let ts = ts2 - ts1
        if (ts < 0) throw 'Invalid timestamp in rentability calculation'

        let startRentability = this.ecoConfig.ecoStartRent
        let baseRentability = this.ecoConfig.ecoBaseRent
        let rentabilityStartTime = this.ecoConfig.ecoRentStartTime
        let rentabilityEndTime = this.ecoConfig.ecoRentEndTime
        let claimRewardTime = this.ecoConfig.ecoClaimTime
        let rentability = 1
        if (ts === 0)
            rentability = startRentability
        else if (ts < rentabilityStartTime)
            rentability = startRentability + (1-startRentability) * ts / rentabilityStartTime
        else if (ts >= claimRewardTime)
            rentability = baseRentability
        else if (ts > rentabilityEndTime)
            rentability = baseRentability + (1-baseRentability) * (claimRewardTime-ts) / (claimRewardTime-rentabilityEndTime)
        rentability = Math.floor(rentability*Math.pow(10, this.ecoConfig.ecoRentPrecision))/Math.pow(10, this.ecoConfig.ecoRentPrecision)
        return rentability
    }

    print(rp = { dist: 0, burn: 0, votes: 0, avail: 0 }, vp = 1) {
        if (rp.avail === 0)
            return 0
        let thNewCoins = 0
        if (rp.votes === 0)
            thNewCoins = 1
        else
            thNewCoins = this.floor(rp.avail * Math.abs(vp/rp.votes))
        if (thNewCoins > Math.floor(rp.avail*this.ecoConfig.rewardPoolMaxShare))
            thNewCoins = Math.floor(rp.avail*this.ecoConfig.rewardPoolMaxShare)
        return thNewCoins
    }

    round(val = 0) {
        return Math.round(val*Math.pow(10,this.ecoConfig.ecoClaimPrecision))/Math.pow(10,this.ecoConfig.ecoClaimPrecision)
    }

    floor(val = 0) {
        return Math.floor(val*Math.pow(10,this.ecoConfig.ecoClaimPrecision))/Math.pow(10,this.ecoConfig.ecoClaimPrecision)
    }
}