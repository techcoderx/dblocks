import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Playlist')
        this.playlistId = window.location.hash.substring(11)
    }

    getHtml() {
        return `
            ${this.loadingHtml('playlist','playlist')}
            ${this.errorHtml('playlist','playlist')}
            ${this.notFoundHtml('playlist','Playlist')}
            <div id="playlist-container">
                <h2 class="text-truncate playlist-heading"><small class="col-12 col-sm-9 text-muted" id="playlist-id"></small></h2>
                <p class="lead" id="playlist-ts"></p><br>
                <h5>Playlist Metadata</h5>
                <div id="playlist-json"></div><br>
                <h5>Playlist Sequence<div id="playlist-seq-count" style="display: inline;"></div></h5>
                <div id="playlist-seq"></div>
            </div>
        `
    }

    init() {
        axios.get(config.api+'/playlist/'+this.playlistId).then((playlist) => {
            console.log(playlist.data)
            let len = Object.keys(playlist.data.playlist).length
            $('.playlist-heading').prepend('Playlist')
            $('#playlist-id').text(playlist.data._id)
            $('#playlist-ts').text('Created on '+new Date(playlist.data.ts).toLocaleString())
            $('#playlist-json').html(jsonToTableRecursive(playlist.data.json))
            $('#playlist-seq').html(jsonToTableRecursive(playlist.data.playlist))
            $('#playlist-seq-count').text(' ('+len+' item'+(len !== 1 ? 's' : '')+')')
            $('#playlist-loading').hide()
            $('.spinner-border').hide()
            $('#playlist-container').show()
        }).catch((e) => {
            $('#playlist-loading').hide()
            $('.spinner-border').hide()
            if (e == 'Error: Request failed with status code 404')
                $('#playlist-notfound').show()
            else
                $('#playlist-error').show()
        })
    }
}