let contentId = window.location.pathname.substr(9)

$(() => {
    axios.get('https://avalon.oneloved.tube/content/' + contentId).then((content) => {
        $('#content-id').text(content.data._id)
        $('#content-author').text(content.data.author)
        $('#content-link').text(content.data.link)
        $('#content-ts').text(content.data.ts)
        $('#content-ts').append(' <span class="badge badge-pill badge-info">' + new Date(content.data.ts).toLocaleString() + '</span>')
        $('#content-dist').text(thousandSeperator(Math.floor(content.data.dist) / 100) + ' DTC')

        let tagsHtml = ''
        for (tag in content.data.tags) {
            if (tagsHtml.length > 0)
                tagsHtml += ' '
            tagsHtml += HtmlSanitizer.SanitizeHtml(tag)
            tagsHtml += ' <span class="badge badge-info">' + thousandSeperator(content.data.tags[tag]) + '</span>'
        }
        $('#content-tags').html(tagsHtml)
        $('#content-json').html(jsonToTableRecursive(content.data.json))
        $('#content-dtube').attr('href','https://d.tube/#!/v/' + contentId)

        if (content.data.pa && content.data.pp) {
            $('#content-parent-btn').show()
            $('#content-parent-btn').attr('href','/content/' + content.data.pa + '/' + content.data.pp)
            $('#content-pa').text(content.data.pa)
            $('#content-pp').text(content.data.pp)
            $('.content-parent').show()
            $('.content-heading').prepend('Comment')
            $('#content-dtube').append('View comment on DTube')
        } else {
            $('#content-parent-btn').removeClass('d-inline')
            $('#content-parent-btn').hide()
            $('.content-heading').prepend('Video')
            $('#content-dtube').append('Watch video on DTube')
        }
        
        // Votes
        let hasClaims = false
        let contentBurn = 0
        let votesHtml = ''
        // Check for any claims
        for (let i = 0; i < content.data.votes.length; i++)
            if (content.data.votes[i].claimed) {
                $('#content-votes thead tr').append('<th scope="col">Claimed</th>')
                hasClaims = true
                break
            }
        // Append to table
        for (let i = 0; i < content.data.votes.length; i++) {
            votesHtml += '<tr><td>' + content.data.votes[i].u + '</td>'
            votesHtml += '<td>' + new Date(content.data.votes[i].ts).toLocaleString() + '</td>'
            votesHtml += '<td>' + thousandSeperator(content.data.votes[i].vt) + '</td>'
            if (content.data.votes[i].burn)
                contentBurn += content.data.votes[i].burn
            votesHtml += '<td>' + thousandSeperator(Math.floor(content.data.votes[i].claimable)/100) + ' DTC</td>'
            if (content.data.votes[i].tag)
                votesHtml += '<td>' + HtmlSanitizer.SanitizeHtml(content.data.votes[i].tag) + '</td>'
            else
                votesHtml += '<td></td>'
            if (content.data.votes[i].claimed)
                votesHtml += '<td>' + new Date(content.data.votes[i].claimed).toLocaleString() + '</td>'
            else if (hasClaims)
                votesHtml += '<td></td>'
            votesHtml += '</tr>'
        }
        $('#content-votes tbody').append(votesHtml)

        // Comments
        if (content.data.child.length > 0) {
            $('#content-comments').show()
            let commentsHtml = ''
            for (let i = 0; i < content.data.child.length; i++) {
                commentsHtml += '<tr><td>' + content.data.child[i][0] + '</td><td>' + content.data.child[i][1] + '</td>'
                commentsHtml += '<td><a href="/content/' + content.data.child[i][0] + '/' + content.data.child[i][1] + '">View Comment</a></td></tr>'
            }
            $('#content-comments table tbody').append(commentsHtml)
        }

        if (contentBurn > 0)
            $('#content-fields').append('<tr><th scope="row">burn</th><td>' + thousandSeperator(contentBurn/100) + ' DTC</td></tr>')

        $('#content-loading').hide()
        $('.spinner-border').hide()
        $('#content-container').show()
    }).catch((e) => {
        console.log(e)
        $('#content-loading').hide()
        $('.spinner-border').hide()
        if (e == 'Error: Request failed with status code 404')
            $('#content-notfound').show()
        else
            $('#content-error').show()
    })
})