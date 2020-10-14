import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Leaders')
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="leader-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading leaders...</span>
                </div>
            </div>
            <div id="leader-error">
                <h2>Something went wrong when retrieving leaders</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="leader-container">
                <h2>Leaders</h2>
                <p>DTube is a self-governed platform, where a limited number of leaders (currently 10) are elected and are in charge of producing new blocks and securing the infrastructure. Here you may find the statistics of the top 100 leaders. Only leaders with their signing key activated are listed here.</p>
                <p>This list is refreshed every 5 minutes.</p>
                <table class="table table-sm table-striped" id="leader-table">
                    <thead><tr>
                        <th scope="col">Rank</th>
                        <th scope="col">Account</th>
                        <th scope="col">Balance</th>
                        <th scope="col">Approval</th>
                        <th scope="col">Voters</th>
                        <th scope="col">Produced</th>
                        <th scope="col">Missed</th>
                        <th scope="col">Subscribers</th>
                        <th scope="col">Subscribed</th>
                    </tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        `
    }

    init() {
        axios.get('https://avalon.oneloved.tube/rank/leaders').then((leaders) => {
            let htmlresult = ''
            for (let i = 0; i < leaders.data.length; i++) {
                htmlresult += '<tr><th scope="row">' + (i+1) + '</th>'
                htmlresult += '<td>' + leaders.data[i].name + '</td>'
                htmlresult += '<td>' + thousandSeperator((leaders.data[i].balance / 100).toFixed(2)) + ' DTC</td>'
                htmlresult += '<td>' + thousandSeperator((leaders.data[i].node_appr / 100).toFixed(2)) + ' DTC</td>'
                htmlresult += '<td>' + thousandSeperator(leaders.data[i].voters) + '</td>'
                htmlresult += '<td>' + thousandSeperator(leaders.data[i].produced) + '</td>'
                htmlresult += '<td>' + thousandSeperator(leaders.data[i].missed) + '</td>'
                htmlresult += '<td>' + thousandSeperator(leaders.data[i].subs) + '</td>'
                htmlresult += '<td>' + thousandSeperator(leaders.data[i].subbed) + '</td>'
                htmlresult += '</tr>'
            }
            $('#leader-table tbody').append(htmlresult)
            $('#leader-loading').hide()
            $('.spinner-border').hide()
            $('#leader-container').show()
        }).catch(() => {
            $('#leader-loading').hide()
            $('.spinner-border').hide()
            $('#leader-error').show()
        })
    }
}