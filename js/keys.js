import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Key Utilities')
    }

    getHtml() {
        return `
            <h2>Key Utilities</h2>
            <p>Avalon cryptography helpers. Use at your own risk.</p><br>
            <div class="row">
                <div class="col-3"><div class="nav flex-column nav-pills" id="key-pills-tab" role="tablist" aria-orientation="vertical">
                    <a class="nav-link active" id="key-pills-keygen-tab" data-toggle="pill" href="#key-pills-keygen" role="tab" aria-controls="key-pills-keygen" aria-selected="true">BIP39 Keypair Generator</a>
                    <a class="nav-link" id="key-pills-pconvert-tab" data-toggle="pill" href="#key-pills-pconvert" role="tab" aria-controls="key-pills-pconvert" aria-selected="false">Private To Public Converter</a>
                    <a class="nav-link" id="key-pills-xconvert-tab" data-toggle="pill" href="#key-pills-xconvert" role="tab" aria-controls="key-pills-xconvert" aria-selected="false">Cross-Chain Key Converter</a>
                    <a class="nav-link" id="key-pills-authorities-tab" data-toggle="pill" href="#key-pills-authorities" role="tab" aria-controls="key-pills-authorities" aria-selected="false">Key Authorities</a>
                </div></div>
                <div class="col-9"><div class="tab-content" id="key-pills-tabContent" style="margin-bottom: 2rem;">
                    <div class="tab-pane fade show active" id="key-pills-keygen" role="tabpanel" aria-labelledby="key-pills-keygen-tab">
                        <h4>BIP39 Keygen Tool</h4>
                        <form>
                            <div class="form-group">
                                <label for="key-bip39-network">Network</label>
                                <select class="form-control" id="key-bip39-network">
                                    <option>Avalon</option>
                                    <option>Graphene</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="key-bip39-wordcount">Word Count</label>
                                <select class="form-control" id="key-bip39-wordcount">
                                    <option>12</option>
                                    <option>15</option>
                                    <option>18</option>
                                    <option>21</option>
                                    <option>24</option>
                                </select>
                            </div>
                            <p style="margin-bottom: 0.5rem;">Mnemonic</p>
                            <div class="input-group" style="margin-bottom: 1rem;">
                                <input class="form-control" id="key-bip39-mnemonic" aria-describedby="key-bip39-mnemonicgen">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" id="key-bip39-mnemonicgen">Generate</button>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="key-bip39-passphrase">Passphrase (optional)</label>
                                <input class="form-control" id="key-bip39-passphrase" type="password">
                            </div>
                            <!-- <div class="form-group">
                                <label for="key-bip39-path">Derivation Path (optional)</label>
                                <input class="form-control" id="key-bip39-path">
                            </div> -->
                            <button class="btn btn-success" id="key-bip39-generatebtn">Generate Keypair</button>
                            <button class="btn btn-success" id="key-bip39-savebtn" style="display: none;">Save Keypair</button>
                            <br><br><p id="key-bip39-result" style="display: none;">Public:<br>Private:</p>
                        </form>
                    </div>
                    <div class="tab-pane fade" id="key-pills-pconvert" role="tabpanel" aria-labelledby="key-pills-pconvert-tab">
                        <h4>Private to Public Key Converter</h4>
                        <p>In public key cryptography, the public key is derived from the private key. If you have the private key and do not know the corresponding public key, you may retrieve them here.</p>
                        <div class="form-group">
                            <label for="key-pconvert-network">Network</label>
                            <select class="form-control" id="key-pconvert-network">
                                <option>Avalon</option>
                                <option>Graphene</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="key-pconvert-key">Private Key</label>
                            <input class="form-control" id="key-pconvert-key" type="password">
                        </div>
                        <button class="btn btn-success" id="key-pconvert-btn">Compute Public</button>
                        <br><br><p id="key-pconvert-result" style="display: none;">Result:</p>
                    </div>
                    <div class="tab-pane fade" id="key-pills-xconvert" role="tabpanel" aria-labelledby="key-pills-xconvert-tab">
                        <h4>Avalon <--> Graphene Key Converter</h4>
                        <p>Most networks, including Avalon and Hive, uses the secp256k1 elliptic curve for its public key cryptography. This means that the same keypair are valid for use for these chains, just that they are represented in a different form.</p>
                        <div class="alert alert-warning" role="alert">Using the same keys across multiple accounts and/or networks is a security risk. If needed, create seperate accounts for the purpose of holding the public keys for your main account on another network (e.g. ability to sign Avalon transactions using Hive Keychain).</div>
                        <div class="form-group">
                            <label for="key-xconvert-direction">Direction</label>
                            <select class="form-control" id="key-xconvert-direction">
                                <option>Avalon to Graphene</option>
                                <option>Graphene to Avalon</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="key-xconvert-ktype">Key Type</label>
                            <select class="form-control" id="key-xconvert-ktype">
                                <option>Public Key</option>
                                <option>Private Key</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="key-xconvert-key">Key</label>
                            <input class="form-control" id="key-xconvert-key">
                        </div>
                        <button class="btn btn-success" id="key-xconvert-btn">Convert</button>
                        <br><br><p id="key-xconvert-result" style="display: none;">Result:</p>
                    </div>
                    <div class="tab-pane fade" id="key-pills-authorities" role="tabpanel" aria-labelledby="key-pills-authorities-tab">
                        <h4>Key Authorities</h4>
                        <p>Avalon transaction types are represented in integers which needs to be specified for every transaction. Find out the corresponding transaction names below.</p>
                        <table class="table table-sm table-striped dblocks-authority-names">
                            <thead><tr>
                                <th scope="col">Number</th>
                                <th scope="col">Transaction Name</th>
                            </tr></thead>
                            <tbody id="key-authority-tbody"></tbody>
                        </table>
                    </div>
                </div></div>
            </div>
        `
    }

    init() {
        // key authorities
        let authorityBodyHtml = ''
        for (let i in TransactionTypes)
            authorityBodyHtml += '<tr><th scope="row">'+i+'</th><td><span class="badge badge-pill badge-info">'+TransactionTypes[i]+'</span></td></tr>'
        $('#key-authority-tbody').html(authorityBodyHtml)

        // bip39 keypair generator
        $('#key-bip39-mnemonicgen').on('click',() => $('#key-bip39-mnemonic').val(cg.BIP32.generate(parseInt($('#key-bip39-wordcount').val())).toString()))
        $('#key-bip39-generatebtn').on('click', (evt) => {
            evt.preventDefault()
            let pub = ''
            let priv = ''
            try {
                let pk = new cg.BIP32($('#key-bip39-mnemonic').val(),$('#key-bip39-passphrase').val()).toPrivate()
                switch ($('#key-bip39-network').val()) {
                    case 'Avalon':
                        pub = pk.createPublic().toAvalonString()
                        priv = pk.toAvalonString()
                        break
                    case 'Graphene':
                        pub = pk.createPublic().toString()
                        priv = pk.toString()
                        break
                    default:
                        break
                }
            } catch (e) {
                $('#key-bip39-result').text(e.toString())
                $('#key-bip39-result').show()
                $('#key-bip39-savebtn').hide()
                return
            }
            $('#key-bip39-result').html('Public: ' + pub + '<br>Private: ' + priv)
            $('#key-bip39-result').show()
            $('#key-bip39-savebtn').show()
            $('#key-bip39-savebtn').on('click',(evt2) => {
                evt2.preventDefault()
                saveAs(new Blob([JSON.stringify({
                    mnemonic: $('#key-bip39-mnemonic').val(),
                    pub: pub,
                    priv: priv
                })],{type: 'application/json;charset=utf-8'}),'key.json')
            })
        })

        // private to public converter
        $('#key-pconvert-btn').on('click',(evt) => {
            evt.preventDefault()
            try {
                switch ($('#key-pconvert-network').val()) {
                    case 'Avalon':
                        $('#key-pconvert-result').text('Public Key: ' + cg.PrivateKey.fromAvalonString($('#key-pconvert-key').val()).createPublic().toAvalonString())
                        break
                    case 'Graphene':
                        $('#key-pconvert-result').text('Public Key: ' + cg.PrivateKey.fromString($('#key-pconvert-key').val()).createPublic().toString())
                        break
                    default:
                        break
                }
            } catch (e) {
                $('#key-pconvert-result').text(e.toString())
            }
            $('#key-pconvert-result').show()
        })

        // cross-chain key converter
        $('#key-xconvert-btn').on('click',(evt) => {
            evt.preventDefault()
            let m = $('#key-xconvert-ktype').val() === 'Public Key' ? cg.PublicKey : cg.PrivateKey
            try {
                switch($('#key-xconvert-direction').val()) {
                    case 'Avalon to Graphene':
                        $('#key-xconvert-result').text('Result: ' + m.fromAvalonString($('#key-xconvert-key').val()).toString())
                        break
                    case 'Graphene to Avalon':
                        $('#key-xconvert-result').text('Result: ' + m.fromString($('#key-xconvert-key').val()).toAvalonString())
                        break
                    default:
                        break
                }
            } catch (e) {
                $('#key-xconvert-result').text(e.toString())
            }
            $('#key-xconvert-result').show()
        })
    }
}