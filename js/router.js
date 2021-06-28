import homepage from './homepage.js'
import block from './block.js'
import transaction from './transaction.js'
import account from './account.js'
import content from './content.js'
import leaders from './leaders.js'
import accountprice from './accountprice.js'
import richlist from './richlist.js'
import livesubcount from './livesubcount.js'
import keys from './keys.js'
import signer from './signer.js'
import notfound from './404.js'

// Live update intervals (e.g. block streams)
window.intervals = []

// Store current route to prevent double loading and streaming bug
window.currentRoute = ''

window.router = () => {
    const routes = [
        { path: '/', view: homepage },
        { path: '/b/:block', view: block, params: 1 },
        { path: '/tx/:txhash', view: transaction, params: 1 },
        { path: '/@:account', view: account, params: 1 },
        { path: '/@:account/:page', view: account, params: 2 },
        { path: '/content/:author/:link', view: content, params: 2 },
        { path: '/leaders', view: leaders },
        { path: '/accountprice', view: accountprice },
        { path: '/richlist', view: richlist },
        { path: '/livesubcount', view: livesubcount },
        { path: '/livesubcount/:account', view: livesubcount, params: 1 },
        { path: '/keys', view: keys },
        { path: '/signer', view: signer },
        { path: '/404', view: notfound }
    ]

    let requested = window.location.hash
    if (!requested && (IsIpfs.path(window.location.pathname) || window.isValidSkynetPath(window.location.pathname)))
        window.location.hash = '#/'
    else if (!requested)
        window.location.hash = '#' + window.location.pathname
    if (!requested) return

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

    if (requested !== currentRoute) {
        // Clear any intervals (e.g. block streams)
        for (let i in window.intervals)
            clearInterval(window.intervals[i])
        intervals = []

        let currentView = new matchingRoute.view()
        currentRoute = requested
        $('.container').html(currentView.getHtml())
        currentView.init()
    }
}

window.navigateTo = (url) => {
    if (url !== location.hash) {
        window.history.pushState(null,null,url)
        router()
    }
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

window.themeConfig = new ThemeConfig()

window.loadDisplayMode = () => {
    themeConfig.initTheme()
    if (themeConfig.getTheme() === 'dark') {
        $('#toggle-lightmode').addClass('d-none')
        $('#toggle-darkmode').removeClass('d-none')
    } else {
        $('#toggle-lightmode').removeClass('d-none')
        $('#toggle-darkmode').addClass('d-none')
    }
}

window.isValidSkynetPath = (skypath) => {
    // ex1: /_ATcIAto1BT1_lmSwQQINqkRDu6_gp5dUFpMr-5DFHr7Ow
    // 46 chars
    if (skypath.length === 48 && skypath.endsWith('/'))
        skypath = skypath.substr(0,skypath.length - 1)
    if (skypath.length !== 47 || !skypath.startsWith('/')) return false
    // base64
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    for (let i = 1; i < 47; i++)
        if (alphabet.indexOf(skypath[i]) == -1)
            return false
    return true
}

$(() => {
    addAnchorClickListener()
    testnetBadge()
    router()
    loadDisplayMode()
})
