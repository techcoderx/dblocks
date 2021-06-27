import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.url = new URL(window.location.href)
        this.account = window.location.hash.split('/')[1].substr(1)
        this.accountlastupdate = 0
        this.accountdata = null
        this.accountnotfound = false
        this.accountHistoryPage = parseInt(window.location.hash.split('/')[2]) || 1
        this.leaderLastUpdate = 0
        this.historyLoaded = false
        this.setTitle('@' + this.account)
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="acc-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading account...</span>
                </div>
            </div>
            <div id="acc-notfound">
                <h2>Account not found</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="acc-error">
                <h2>Something went wrong when retrieving account</h2><br>
                <a type="button" class="btn btn-primary" href="#">Home</a>
            </div>
            <div id="acc-container">
                <h2 id="acc-name"></h2><br>
                <!-- Left panel - Account details -->
                <div class="row">
                    <div class="col-12 col-lg-4">
                        <table class="table table-sm">
                            <tr><th scope="row">Balance</th><td id="acc-meta-bal"></td></tr>
                            <tr><th scope="row">Bandwidth</th><td id="acc-meta-bw"></td></tr>
                            <tr><th scope="row">Voting Power</th><td id="acc-meta-vp"></td></tr>
                            <tr><th scope="row">Subscribers</th><td id="acc-meta-subs"></td></tr>
                            <tr><th scope="row">Subscribed To</th><td id="acc-meta-subbed"></td></tr>
                            <tr><th scope="row">Pending Rewards</th><td id="acc-meta-pending"></td></tr>
                            <tr><th scope="row">Claimable Rewards</th><td id="acc-meta-claimable"></td></tr>
                            <tr><th scope="row">Claimed Rewards</th><td id="acc-meta-claimed"></td></tr>
                        </table>
                        <a type="button" target="_blank" class="btn btn-primary btn-block" id="acc-profile-dtube"><img src="icons/DTube_White.png">View channel on DTube</a>
                        <a type="button" target="_blank" class="btn btn-primary btn-block" id="acc-profile-hive"><img src="icons/Hive_White.png">View blog on Hive</a>
                        <h6><br></h6>
                        <div id="acc-profile-metadata">
                            <h4>Metadata</h4>
                            <div id="acc-profile-json"></div>
                        </div>
                        <h4>Public Keys</h4>
                        <div class="accordion" id="acc-customkey">
                            <div class="card">
                            <div class="card-header" id="acc-masterkey-card">
                                <h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-masterkey-collapse" aria-expanded="true" aria-controls="acc-masterkey-collapse"><strong>Master</strong></button></h5>
                            </div>
                            <div id="acc-masterkey-collapse" class="collapse" aria-labelledby="acc-masterkey-card" data-parent="#acc-customkey">
                                <div class="card-body" id="acc-masterkey-det"></div>
                            </div>
                            </div>
                        </div>
                        <br>
                        <h4>Signature Thresholds</h4>
                        <table class="table table-sm"><tbody id="acc-thresholds"></tbody></table><br>
                        <div id="acc-leader"><h4>Leader Details</h4>
                            <table class="table table-sm"><tbody>
                                <tr><th scope="row">Signing Key</th><td id="acc-leader-key"></td></tr>
                                <tr><th scope="row">Peer</th><td id="acc-leader-ws"></td></tr>
                                <tr><th scope="row">Last Block</th><td id="acc-leader-lastblock"></td></tr>
                                <tr><th scope="row">Approval</th><td id="acc-leader-appr"></td></tr>
                                <tr><th scope="row">Voters</th><td id="acc-leader-voters"></td></tr>
                                <tr><th scope="row">Produced</th><td id="acc-leader-produced"></td></tr>
                                <tr><th scope="row">Missed</th><td id="acc-leader-miss"></td></tr>
                            </tbody></table><br>
                        </div>
                        <h4>Leader Votes</h4>
                        <table class="table table-sm" id="acc-meta-approves"></table>
                        <p id="acc-meta-created"></p>
                    </div>
                    <!-- Right panel - Account history -->
                    <div class="col-12 col-lg" id="acc-history">
                        <div id="acc-history-itms"></div>
                        <nav><ul class="pagination">
                            <li class="page-item" id="acc-history-page-prev"><a class="page-link" tabindex="-1">Previous</a></li>
                            <li class="page-item" id="acc-history-page-1"><a class="page-link">1</a></li>
                            <li class="page-item" id="acc-history-page-2"><a class="page-link">2</a></li>
                            <li class="page-item" id="acc-history-page-3"><a class="page-link">3</a></li>
                            <li class="page-item" id="acc-history-page-4"><a class="page-link">4</a></li>
                            <li class="page-item" id="acc-history-page-5"><a class="page-link">5</a></li>
                            <li class="page-item" id="acc-history-page-next"><a class="page-link">Next</a></li>
                        </ul></nav>
                    </div>
                </div>
            </div>
        `
    }

    init() {
        axios.get(config.api + '/account/' + this.account).then((acc) => {
            this.accountdata = acc.data
            this.accountlastupdate = new Date().getTime()

            // Fill account details
            $('#acc-name').text('@' + acc.data.name)
            $('#acc-masterkey-det').html(this.formatPubKeys({
                pub: acc.data.pub,
                types: [],
                weight: acc.data.pub_weight
            }))
            $('#acc-customkey').append(this.customKeyHtml(acc.data.keys))
            $('#acc-profile-dtube').attr('href','https://d.tube/#!/c/' + acc.data.name)

            if (acc.data.json && acc.data.json.profile && acc.data.json.profile.hive) {
                $('#acc-profile-hive').show()
                $('#acc-profile-hive').attr('href','https://peakd.com/@' + acc.data.json.profile.hive)
            }

            let accCreatedStr = 'Created by '
            if (acc.data.created) {
                accCreatedStr += acc.data.created.by
                accCreatedStr += ' on '
                accCreatedStr += new Date(acc.data.created.ts).toLocaleString()
            } else {
                accCreatedStr += 'dtube on ' + new Date(1593350655283).toLocaleString() // timestamp of block #1 on testnet v2
            }
            $('#acc-meta-created').text(accCreatedStr)

            if (acc.data.json)
                $('#acc-profile-json').html(jsonToTableRecursive(acc.data.json))
            else
                $('#acc-profile-metadata').hide()

            axios.get(config.api+'/rewards/pending/' + this.account).then((pending) =>
                $('#acc-meta-pending').text(thousandSeperator(Math.floor(pending.data.total) / 100) + ' DTUBE'))
            .catch(()=>
                $('#acc-meta-pending').text('Error'))

            axios.get(config.api+'/rewards/claimable/' + this.account).then((claimable) =>
                $('#acc-meta-claimable').text(thousandSeperator(Math.floor(claimable.data.total) / 100) + ' DTUBE'))
            .catch(()=>
                $('#acc-meta-claimable').text('Error'))
    
            axios.get(config.api + '/rewards/claimed/' + this.account).then((claimed) =>
                $('#acc-meta-claimed').text(thousandSeperator(Math.floor(claimed.data.total) / 100) + ' DTUBE'))
            .catch(()=>
                $('#acc-meta-claimed').text('Error'))

            this.updateAccount(acc.data)
            this.display()
            intervals.push(setInterval(()=>this.reloadAccount((newacc)=>this.updateAccount(newacc)),10000))
        }).catch((e) => {
            $('#acc-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404') {
                this.accountnotfound = true
                $('#acc-notfound').show()
            } else
                $('#acc-error').show()
        })

        let accountHistoryUrl = config.api + '/history/' + this.account + '/0'
        if (isNaN(this.accountHistoryPage))
            this.accountHistoryPage = 1
        accountHistoryUrl += '/' + ((this.accountHistoryPage - 1) * 50)

        axios.get(accountHistoryUrl).then((history) => {
            // Render account history cards
            $('#acc-history-itms').html(txCardsHtml(history.data))

            // Render account history pagination
            $('#acc-history-page-next a').attr('href','#/@' + this.account + '/' + (this.accountHistoryPage+1))
            if (this.accountHistoryPage == 1)
                $('#acc-history-page-prev').addClass('disabled')
            else
                $('#acc-history-page-prev a').attr('href','#/@' + this.account + '/' + (this.accountHistoryPage-1))
            if (this.accountHistoryPage >= 3) {
                $('#acc-history-page-3').addClass('active')
                for (let i = 0; i < 5; i++) {
                    $('#acc-history-page-' + (i+1) + ' a').text(this.accountHistoryPage-2+i)
                    $('#acc-history-page-' + (i+1) + ' a').attr('href','#/@' + this.account + '/' + (this.accountHistoryPage-2+i))
                }
            } else {
                $('#acc-history-page-' + this.accountHistoryPage).addClass('active')
                for (let i = 0; i < 5; i++)
                    $('#acc-history-page-' + (i+1) + ' a').attr('href','#/@' + this.account + '/' + (i+1))
            }

            if (history.data.length < 50) {
                $('#acc-history-page-next').addClass('disabled')
                if (this.accountHistoryPage < 3) for (let i = this.accountHistoryPage; i < 5; i++) {
                    $('#acc-history-page-' + (i+1)).hide()
                } else {
                    $('#acc-history-page-4').hide()
                    $('#acc-history-page-5').hide()
                }
            }

            this.historyLoaded = true
            this.display()
        })
    }

    reloadAccount(cb) {
        if (new Date().getTime() - this.accountlastupdate < 60000) return cb(this.accountdata)
        axios.get(config.api + '/account/' + this.account).then((acc) => {
            this.accountdata = acc.data
            cb(acc.data)
        }).catch(() => cb(this.accountdata))
    }

    updateAccount(acc) {
        $('#acc-meta-bal').text(thousandSeperator(acc.balance / 100) + ' DTUBE')
        $('#acc-meta-bw').text(thousandSeperator(bandwidth(acc)) + ' bytes')
        $('#acc-meta-vp').text(thousandSeperator(votingPower(acc)) + ' VP')
        $('#acc-meta-subs').text(thousandSeperator(acc.followers.length))
        $('#acc-meta-subbed').text(thousandSeperator(acc.follows.length))
        $('#acc-meta-approves').html(this.leaderVotesHtml(acc.approves))
        $('#acc-thresholds').html(this.sigThresholdsTableHtml(acc.thresholds))
    
        if (acc.pub_leader) {
            this.updateLeaderStats()
            $('#acc-leader').show()
            $('#acc-leader-key').text(acc.pub_leader)
            $('#acc-leader-appr').text(thousandSeperator(acc.node_appr / 100) + ' DTUBE')
    
            if (acc.json && acc.json.node && acc.json.node.ws)
                $('#acc-leader-ws').text(DOMPurify.sanitize(acc.json.node.ws))
            else
                $('#acc-leader-ws').text('N/A')
        }
        addAnchorClickListener()
    }

    display() {
        if (this.account && this.historyLoaded && !this.accountnotfound) {
            $('#acc-loading').hide()
            $('.spinner-border').hide()
            $('#acc-container').show()
            addAnchorClickListener()
        }
    }

    customKeyHtml(keys) {
        let result = ''
        for (let i = 0; i < keys.length; i++) {
            let sanitizedId = DOMPurify.sanitize(keys[i].id)
            result += '<div class="card"><div class="card-header" id="acc-customkey-card-' + i + '">'
            result += '<h5 class="mb-0"><button class="btn btn-link" type="button" data-toggle="collapse" data-target="#acc-customkey-collapse-' + i + '" aria-expanded="true" aria-controls="acc-customkey-collapse-' + i + '">' + sanitizedId + '</button></h5></div>'
            result += '<div id="acc-customkey-collapse-' + i + '" class="collapse" aria-labelledby="acc-customkey-card-' + i + '" data-parent="#acc-customkey">'
            result += '<div class="card-body">' + this.formatPubKeys(keys[i]) + '</div></div></div>'
        }
        return result
    }

    formatPubKeys(key) {
        let result = '<strong>Public Key: </strong>' + key.pub + '<br><br><strong>Weight: </strong>' + (key.weight || 1) + '<br><br><strong>Permissions: </strong>'
        if (key.types.length == 0)
            result += 'ALL'
        else {
            let typesStringArr = []
            for (let i = 0; i < key.types.length; i++) {
                typesStringArr.push(TransactionTypes[key.types[i]])
            }
            result += typesStringArr.join(', ')
        }
        return result
    }

    sigThresholdsTableHtml(thresholds) {
        if (!thresholds)
            return '<tr><th scope="row">Default</th><td>1</td></tr>'

        let result = ''
        if (thresholds.default)
            result += '<tr><th scope="row">Default</th><td>' + thresholds.default + '</td></tr>'
        else
            result += '<tr><th scope="row">Default</th><td>1</td></tr>'
        
        for (let t in thresholds) if (t !== 'default')
            result += '<tr><th scope="row"><span class="badge badge-pill badge-info">' + TransactionTypes[t] + '</span></th><td>' + thresholds[t] + '</td></tr>'
        return result
    }

    leaderVotesHtml(approves) {
        let result = ''
        if (!approves) return 'Not voting for leaders'
        for (let i = 0; i < approves.length; i++)
            result += '<tr><td><a href="#/@' + approves[i] + '">' + approves[i] + '</a></td></tr>'
        return result
    }

    updateLeaderStats() {
        if (new Date().getTime() - this.leaderLastUpdate < 120000) return
        axios.get(config.api + '/leader/' + this.account).then((leader) => {
            this.leaderLastUpdate = new Date().getTime()
            $('#acc-leader-lastblock').text(thousandSeperator(leader.data.last))
            $('#acc-leader-voters').text(thousandSeperator(leader.data.voters))
            $('#acc-leader-produced').text(thousandSeperator(leader.data.produced))
            $('#acc-leader-miss').text(thousandSeperator(leader.data.missed))
        }).catch(()=>{})
    }
}
