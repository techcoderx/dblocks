import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('404 Not Found')
    }

    getHtml() {
        return `
            <h1>You got hit by a 404 error</h1><br>
            <a type="button" class="btn btn-primary" href="#">Home</a>
        `
    }

    init() {
        addAnchorClickListener()
    }
}