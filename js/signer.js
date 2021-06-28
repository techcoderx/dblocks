import view from "./view.js"

export default class extends view {
    constructor() {
        super()
        this.setTitle('Signer')
    }

    getHtml() {
        return `
            <h2>Signer</h2>
            <p>Sign an Avalon transaction and broadcast to the blockchain.</p>
        `
    }
}