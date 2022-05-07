import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('New Proposal')
    }

    getHtml() {
        return `
            <h2>New Proposal</h2>
            <p>Select a proposal type to begin.</p>
            <div class="row">
                <div class="col-md-6">
                    <div class="card newgov-card">
                        <div class="card-body newgov-card-body d-flex row">
                            <h5 class="card-title">Fund request</h5>
                            <p class="card-text">Propose a new idea for Avalon DAO and have them funded by the community.</p>
                            <a href="#/governance/new/1" class="btn btn-success newgov-card-btn stretched-link">Get Started</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card newgov-card">
                        <div class="card-body newgov-card-body d-flex row">
                            <h5 class="card-title">Chain Update</h5>
                            <p class="card-text">Propose updates and improvements to the parameters of the Avalon blockchain.</p>
                            <a href="#/governance/new/2" class="btn btn-success newgov-card-btn stretched-link">Get Started</a>
                        </div>
                    </div>
                </div>
            </div>
        `
    }

    init() {
        let cards = Array.from($('.newgov-card'))
        for (let c in cards) {
            let elem = cards[c]
            $(elem).hover(() => $(elem).addClass('border-success'), () => $(elem).removeClass('border-success'))
        }
    }
}