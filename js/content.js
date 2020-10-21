import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Content')
        this.contentId = window.location.hash.substr(10)
    }

    getHtml() {
        return `
            <div class="d-flex justify-content-center" id="content-loading">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading content...</span>
                </div>
            </div>
            <div id="content-notfound">
                <h2>Content not found</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="content-error">
                <h2>Something went wrong when retrieving content</h2><br>
                <a type="button" class="btn btn-primary" href="/">Home</a>
            </div>
            <div id="content-container">
                <h2 class="text-truncate content-heading"><small class="col-12 col-sm-9 text-muted" id="content-id"></small></h2><br>
                <a type="button" class="btn btn-outline-secondary d-inline" id="content-parent-btn">View parent content</a>
                <a type="button" target="_blank" class="btn btn-primary d-inline" id="content-dtube"><img src="icons/DTube_White.png"></a><br><br>
                <table class="table table-sm" id="content-fields">
                    <tr><th scope="row">author</th><td id="content-author"></td></tr>
                    <tr><th scope="row">link</th><td id="content-link"></td></tr>
                    <tr><th scope="row">ts</th><td id="content-ts"></td></tr>
                    <tr><th scope="row">dist</th><td id="content-dist"></td></tr>
                    <tr class="content-parent"><th scope="row">pa</th><td id="content-pa"></td></tr>
                    <tr class="content-parent"><th scope="row">pp</th><td id="content-pp"></td></tr>
                    <tr><th scope="row">tags</th><td id="content-tags"></td></tr>
                </table><br>
                <h5>Content data</h5>
                <div id="content-json"></div><br>
                <h5>Votes</h5>
                <table class="table table-sm table-striped table-bordered" id="content-votes">
                    <thead><tr>
                        <th scope="col">Voter</th>
                        <th scope="col">Vote Time</th>
                        <th scope="col">VP</th>
                        <th scope="col">Payout</th>
                        <th scope="col">Tag</th>
                    </tr></thead><tbody></tbody>
                </table><br>
                <div id="content-comments">
                    <h5>Comments</h5>
                    <table class="table table-sm table-striped table-bordered">
                        <thead><tr>
                            <th scope="col">Author</th>
                            <th scope="col">Link</th>
                            <th scope="col">View Comment</th>
                        </tr></thead><tbody></tbody>
                    </table><br>
                </div>
            </div>
        `
    }

    init() {
        axios.get(config.api + '/content/' + this.contentId).then((content) => {
            $('#content-id').text(content.data._id)
            $('#content-author').text(content.data.author)
            $('#content-link').text(DOMPurify.sanitize(content.data.link))
            $('#content-ts').text(content.data.ts)
            $('#content-ts').append(' <span class="badge badge-pill badge-info">' + new Date(content.data.ts).toLocaleString() + '</span>')
            $('#content-dist').text(thousandSeperator(Math.floor(content.data.dist) / 100) + ' DTC')

            let tagsHtml = ''
            for (let tag in content.data.tags) {
                if (tagsHtml.length > 0)
                    tagsHtml += ' '
                tagsHtml += DOMPurify.sanitize(tag)
                tagsHtml += ' <span class="badge badge-info">' + thousandSeperator(content.data.tags[tag]) + '</span>'
            }
            $('#content-tags').html(tagsHtml)
            $('#content-json').html(jsonToTableRecursive(content.data.json))
            $('#content-dtube').attr('href','https://d.tube/#!/v/' + this.contentId)

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
                    votesHtml += '<td>' + DOMPurify.sanitize(content.data.votes[i].tag) + '</td>'
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
            addAnchorClickListener()
        }).catch((e) => {
            console.log(e)
            $('#content-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404')
                $('#content-notfound').show()
            else
                $('#content-error').show()
        })
    }
}
