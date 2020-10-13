const Express = require('express')
const App = Express()
const http = require('http').Server(App)
const port = process.env.DBLOCKS_DEVSERVER || 3009
App.use(Express.static(__dirname + '/client', { dotfiles: 'deny' }))
App.get('/',(rq,rp) => rp.sendFile(__dirname + '/client/index.html'))
App.get('/b/:block',(rq,rp) => rp.sendFile(__dirname + '/client/block.html'))
App.get('/tx/:txhash',(rq,rp) => rp.sendFile(__dirname + '/client/transaction.html'))
App.get('/@:account',(rq,rp) => rp.sendFile(__dirname + '/client/account.html'))
App.get('/content/:autr/:lnk',(rq,rp) => rp.sendFile(__dirname + '/client/content.html'))
App.get('/leaders',(rq,rp) => rp.sendFile(__dirname + '/client/leaders.html'))
App.get('/accountprice',(rq,rp) => rp.sendFile(__dirname + '/client/accountprice.html'))
App.get('/richlist',(rq,rp) => rp.sendFile(__dirname + '/client/richlist.html'))
App.get('/livesubcount',(rq,rp) => rp.sendFile(__dirname + '/client/livesubcount.html'))
App.get('/404',(rq,rp) => rp.sendFile(__dirname + '/client/404.html'))
App.use((rq,rp) => rp.status(404).redirect('/404'))
http.listen(port, ()=>console.log('Dev server listening on port '+port))