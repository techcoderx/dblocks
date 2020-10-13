$(() => {
    axios.get('https://avalon.oneloved.tube/rank/balance').then((richlist) => {
        let htmlresult = ''
        for (let i = 0; i < richlist.data.length; i++) {
            htmlresult += '<tr><th scope="row">' + (i+1) + '</th>'
            htmlresult += '<td>' + richlist.data[i].name + '</td>'
            htmlresult += '<td>' + thousandSeperator((richlist.data[i].balance / 100).toFixed(2)) + ' DTC</td></tr>'
        }
        $('#richlist-table tbody').append(htmlresult)
        $('#richlist-loading').hide()
        $('.spinner-border').hide()
        $('#richlist-container').show()
    }).catch(() => {
        $('#richlist-loading').hide()
        $('.spinner-border').hide()
        $('#richlist-error').show()
    })
})