const Config = require('./config.json')
const Express = require('express')
const CORS = require('cors')
const App = Express()
const http = require('http').Server(App)

App.use(Express.static(__dirname + '/client', { dotfiles: 'deny' }))
App.use(CORS())

App.get('/',(rq,rp) => loadWebpageFromDisk('client/index.html',rp))
App.get('/b/:block',(rq,rp) => loadWebpageFromDisk('client/block.html',rp))
App.get('/tx/:txhash',(rq,rp) => loadWebpageFromDisk('client/transaction.html',rp))
App.get('/@:account',(rq,rp) => loadWebpageFromDisk('client/account.html',rp))
App.get('/leaders',(rq,rp) => loadWebpageFromDisk('client/leaders.html',rp))
App.get('/accountprice',(rq,rp) => loadWebpageFromDisk('client/accountprice.html',rp))
App.get('/richlist',(rq,rp) => loadWebpageFromDisk('client/richlist.html',rp))
App.get('/livesubcount',(rq,rp) => loadWebpageFromDisk('client/wip.html',rp))
App.get('/wip',(rq,rp) => loadWebpageFromDisk('client/wip.html',rp))
App.get('/404',(rq,rp) => loadWebpageFromDisk('client/404.html',rp))

App.use((req,res) => { return res.status(404).redirect('/404') })

function loadWebpageFromDisk(file,response) {
    response.sendFile(__dirname + '/' + file)
}

http.listen(Config.HTTP_PORT)