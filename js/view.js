export default class {
    constructor() {}
    setTitle(title) { 
        if (title)
            title += ' - Avalon Block Explorer'
        else
            title = 'Avalon Block Explorer'
        document.title = title
    }
    setHtml() { return "" }
    init() {}
}