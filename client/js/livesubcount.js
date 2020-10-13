let counter = 0
let username = 'techcoderx'

$(() => {
    axios.get('https://avalon.oneloved.tube/account/' + username).then((acc) => {
        counter = acc.data.followers.length
        $('#odometer').text(counter)
        streamBlocks((newBlock) => {
            for (let i = 0; i < newBlock.txs.length; i++)
                if (newBlock.txs[i].type == 7 && newBlock.txs[i].data.target == username)
                    counter++
                else if (newBlock.txs[i].type == 8 && newBlock.txs[i].data.target == username)
                    counter--
        })
    })
    setInterval(()=>$('#odometer').text(counter),6000)
})

function changeUsername() {
    axios.get('https://avalon.oneloved.tube/account/' + $('#dblocks-live-username').val()).then((acc) => {
        $('.alert').hide()
        username = acc.data.name
        counter = acc.data.followers.length
        $('#odometer').text(counter)
    }).catch((e) => {
        if (e == 'Error: Request failed with status code 404') {
            $('.alert').text('Account not found')
            $('.alert').show()
        } else {
            $('.alert').text('Something went wrong when fetching account')
            $('.alert').show()
        }
    })
}

function usernameEnter() {
    let keycode = window.event.keyCode
    if (keycode == 13)
        changeUsername()
}