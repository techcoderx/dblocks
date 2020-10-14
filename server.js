const Express = require('express')
const App = Express()
const http = require('http').Server(App)
const port = process.env.DBLOCKS_DEVSERVER || 3009
App.use(Express.static(__dirname + '/client', { dotfiles: 'deny' }))
App.get('/*',(rq,rp) => rp.sendFile(__dirname + '/client/index.html'))
http.listen(port, ()=>console.log('Dev server listening on port '+port))