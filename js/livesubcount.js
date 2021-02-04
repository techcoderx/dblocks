import view from './view.js'
import BlockStreamer from './blockStreamer.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Live Subscriber Count')
        this.counter = 0
        this.username = window.location.hash.split('/')[2] || 'techcoderx'
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
        axios.get(config.api + '/account/' + this.username).then((acc) => {
            $('.alert').hide()
            this.counter = acc.data.followers.length
            $('#odometer').text(this.counter)
            let blkStreamer = new BlockStreamer()
            blkStreamer.streamBlocks((newBlock) => {
                for (let i = 0; i < newBlock.txs.length; i++)
                    if (newBlock.txs[i].type == 7 && newBlock.txs[i].data.target == this.username)
                        this.counter++
                    else if (newBlock.txs[i].type == 8 && newBlock.txs[i].data.target == this.username)
                        this.counter--
            })
        }).catch((e) => this.handleAccError(e))
        intervals.push(setInterval(()=>$('#odometer').text(this.counter),6000))

        $('#dblocks-live-submit').on('click',() => this.changeUsername())
        $('#dblocks-live-username').on('keypress',() => {
            let keycode = window.event.keyCode
            if (keycode == 13)
                this.changeUsername()
        })
    }

    changeUsername() {
        axios.get(config.api + '/account/' + $('#dblocks-live-username').val()).then((acc) => {
            $('.alert').hide()
            this.username = acc.data.name
            this.counter = acc.data.followers.length
            $('#odometer').text(this.counter)
            window.history.pushState(null,null,'#/livesubcount/' + this.username)
        }).catch((e) => this.handleAccError(e))
    }

    handleAccError(e) {
        if (e == 'Error: Request failed with status code 404')
            $('.alert').text('Account not found')
        else
            $('.alert').text('Something went wrong when fetching account')
        $('.alert').show()
    }
}
