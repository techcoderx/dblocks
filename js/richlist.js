import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Richlist')
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="richlist-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading richlist...</span>
                </div>
            </div>
            <div id="richlist-error">
                <h2>Something went wrong when retrieving richlist</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="richlist-container">
                <h2>Richlist</h2>
                <p>Top 100 accounts sorted by balance</p>
                <table class="table table-sm table-striped" id="richlist-table">
                    <thead><tr>
                        <th scope="col">Position</th>
                        <th scope="col">Account</th>
                        <th scope="col">Balance</th>
                    </tr></thead><tbody></tbody>
                </table>
            </div>
        `
    }

    init() {
        axios.get('https://avalon.oneloved.tube/rank/balance').then((richlist) => {
            let htmlresult = ''
            for (let i = 0; i < richlist.data.length; i++) {
                htmlresult += '<tr><th scope="row">' + (i+1) + '</th>'
                htmlresult += '<td>' + richlist.data[i].name + '</td>'
                htmlresult += '<td>' + thousandSeperator((richlist.data[i].balance / 100).toFixed(2)) + ' DTC</td></tr>'
            }
            $('#richlist-table tbody').append(htmlresult)
            $('#richlist-loading').hide()
            $('.spinner-border').hide()
            $('#richlist-container').show()
        }).catch(() => {
            $('#richlist-loading').hide()
            $('.spinner-border').hide()
            $('#richlist-error').show()
        })
    }
}