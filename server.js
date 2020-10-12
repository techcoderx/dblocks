const fs = require('fs')
const Config = require('./config.json')
const Express = require('express')
const CORS = require('cors')
const App = Express()
const http = require('http').Server(App)

//const homepage = fs.readFileSync('client/index.html','utf8')

App.use(Express.static(__dirname + '/client', { dotfiles: 'deny' }))
App.use(CORS())

App.get('/',(rq,rp) => loadWebpageFromDisk('client/index.html',rp))
App.get('/b/:block',(rq,rp) => loadWebpageFromDisk('client/block.html',rp))
App.get('/@:account',(rq,rp) => loadWebpageFromDisk('client/account.html',rp))
App.get('/leaders',(rq,rp) => loadWebpageFromDisk('client/wip.html',rp))
App.get('/accountprice',(rq,rp) => loadWebpageFromDisk('client/wip.html',rp))
App.get('/livesubcount',(rq,rp) => loadWebpageFromDisk('client/wip.html',rp))
App.get('/wip',(rq,rp) => loadWebpageFromDisk('client/wip.html',rp))
App.get('/404',(rq,rp) => loadWebpageFromDisk('client/404.html',rp))

App.use((req,res) => { return res.status(404).redirect('/404') })

function loadWebpage(html,response) {
    response.writeHead(200, {'Content-Type': 'text/html'})
    response.write(html)
    response.end()
}

function loadWebpageFromDisk(HTMLFile,response) {
    fs.readFile(HTMLFile,function(error, data) {
        if (error) {
            response.status(404).send()
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'})
            response.write(data)
            response.end()
        }
    })
}

http.listen(Config.HTTP_PORT)