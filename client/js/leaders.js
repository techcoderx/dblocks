$(() => {
    axios.get('https://avalon.oneloved.tube/rank/leaders').then((leaders) => {
        let htmlresult = ''
        for (let i = 0; i < leaders.data.length; i++) {
            htmlresult += '<tr><th scope="row">' + (i+1) + '</th>'
            htmlresult += '<td>' + leaders.data[i].name + '</td>'
            htmlresult += '<td>' + thousandSeperator((leaders.data[i].balance / 100).toFixed(2)) + ' DTC</td>'
            htmlresult += '<td>' + thousandSeperator((leaders.data[i].node_appr / 100).toFixed(2)) + ' DTC</td>'
            htmlresult += '<td>' + thousandSeperator(leaders.data[i].voters) + '</td>'
            htmlresult += '<td>' + thousandSeperator(leaders.data[i].produced) + '</td>'
            htmlresult += '<td>' + thousandSeperator(leaders.data[i].missed) + '</td>'
            htmlresult += '<td>' + thousandSeperator(leaders.data[i].subs) + '</td>'
            htmlresult += '<td>' + thousandSeperator(leaders.data[i].subbed) + '</td>'
            htmlresult += '</tr>'
        }
        $('#leader-table tbody').append(htmlresult)
        $('#leader-loading').hide()
        $('.spinner-border').hide()
        $('#leader-container').show()
    }).catch(() => {
        $('#leader-loading').hide()
        $('.spinner-border').hide()
        $('#leader-error').show()
    })
})