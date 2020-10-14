import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Live Subscriber Count')
        this.url = new URL(window.location.href)
        this.counter = 0
        this.username = this.url.searchParams.get('username') || 'techcoderx'
    }

    getHtml() {
        return `
            <div class="alert alert-danger" role="alert"></div>
            <h2>DTube Live Subscriber Count</h2>
            <p>Updates every 6 seconds</p>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="addon-wrapping">@</span>
                </div>
                <input type="text" id="dblocks-live-username" class="form-control" placeholder="Username">
                <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" id="dblocks-live-submit">Submit</button>
                </div>
            </div><br>
            <div class="dblocks-counter"><div id="odometer" class="odometer">0</div></div>
        `
    }

    init() {
        this.od = new Odometer({
            el: $('.odometer')[0],
            value: 0,
            theme: 'car'
        })
        $('#dblocks-live-username').val(this.username)
        axios.get('https://avalon.oneloved.tube/account/' + this.username).then((acc) => {
            this.counter = acc.data.followers.length
            $('#odometer').text(this.counter)
            streamBlocks((newBlock) => {
                for (let i = 0; i < newBlock.txs.length; i++)
                    if (newBlock.txs[i].type == 7 && newBlock.txs[i].data.target == this.username)
                        this.counter++
                    else if (newBlock.txs[i].type == 8 && newBlock.txs[i].data.target == this.username)
                        this.counter--
            })
        })
        intervals.push(setInterval(()=>$('#odometer').text(this.counter),6000))

        $('#dblocks-live-submit').on('click',() => this.changeUsername())
        $('#dblocks-live-username').on('keypress',() => {
            let keycode = window.event.keyCode
            if (keycode == 13)
                this.changeUsername()
        })
    }

    changeUsername() {
        axios.get('https://avalon.oneloved.tube/account/' + $('#dblocks-live-username').val()).then((acc) => {
            $('.alert').hide()
            this.username = acc.data.name
            this.counter = acc.data.followers.length
            $('#odometer').text(this.counter)
        }).catch((e) => {
            if (e == 'Error: Request failed with status code 404') {
                $('.alert').text('Account not found')
                $('.alert').show()
            } else {
                $('.alert').text('Something went wrong when fetching account')
                $('.alert').show()
            }
        })
    }
}