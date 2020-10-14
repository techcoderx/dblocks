import homepage from './homepage.js'
import block from './block.js'
import transaction from './transaction.js'
import account from './account.js'
import content from './content.js'
import leaders from './leaders.js'
import accountprice from './accoutprice.js'
import richlist from './richlist.js'
import livesubcount from './livesubcount.js'
import notfound from './404.js'

// Live update intervals (e.g. block streams)
window.intervals = []

// Store current route to prevent double loading bug
window.currentRoute = ''

window.router = () => {
    const routes = [
        { path: '/', view: homepage },
        { path: '/b/:block', view: block, params: 1 },
        { path: '/tx/:txhash', view: transaction, params: 1 },
        { path: '/@:account', view: account, params: 1 },
        { path: '/content/:author/:link', view: content, params: 2 },
        { path: '/leaders', view: leaders },
        { path: '/accountprice', view: accountprice },
        { path: '/richlist', view: richlist },
        { path: '/livesubcount', view: livesubcount },
        { path: '/404', view: notfound }
    ]

    let requested = window.location.hash
    if (!requested)
        window.location.hash = '#' + window.location.pathname

    // Match route with pathname
    let matchingRoute
    for (let route in routes) {
        if (!routes[route].params && requested === '#' + routes[route].path)
            matchingRoute = routes[route]
        else if (routes[route].params) {
            let params = routes[route].path.split(':')
            let lengthMatches = routes[route].path.split('/').length === ('#' + window.location.hash).split('/').length
            if (window.location.hash.startsWith('#' + params[0]) && lengthMatches)
                matchingRoute = routes[route]
        }
    }

    // 404 page not found
    if (!matchingRoute)
        matchingRoute = routes[routes.length - 1]

    console.log(matchingRoute)

    // Clear any intervals (e.g. block streams)
    for (let i in window.intervals)
        clearInterval(window.intervals[i])
    intervals = []

    let currentView = new matchingRoute.view()
    if (requested !== currentRoute) {
        currentRoute = requested
        $('.container').html(currentView.getHtml())
        currentView.init()
    }
}

window.navigateTo = (url) => {
    window.history.pushState(null,null,url)
    router()
}

window.addEventListener('popstate',router)

window.addAnchorClickListener = () => {
    $('a').on('click',(evt) => {
        if (evt.target.href.startsWith(window.location.origin)) {
            evt.preventDefault()
            let toPath = evt.target.hash
            if (!toPath)
                toPath = '#' + evt.target.pathname
            navigateTo(toPath)
        }
    })
}

$(() => {
    addAnchorClickListener()
    router()
})