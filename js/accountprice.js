import view from './view.js'

export default class extends view {
    constructor() {
        super()
        this.setTitle('Account Pricing')
    }

    getHtml() {
        return `
            <h2>Account pricing</h2>
            <p>Here you can find the burn fee required to create a new account on Avalon. Longer names cost less to create. You will need an existing Avalon account to create a new account. Newly created accounts will start with nothing and will need some DTUBE to start transacting.</p>
            <p>Usernames must be between 1 and 50 characters long, and only contain alphanumeric lowercase characters. It may also contain hyphens (-) or full-stops (.) in between. Usernames may not be changed once created.</p>
            <p>The DTube team offers a free signup service whereby the new accounts are created from the <a href="#/@dtube">@dtube</a> account which contains special privileges that allows creating accounts without paying the burn fee. This service requires verification and has other limitations such as requiring at least 9 characters and 2 numbers. You can create these accounts on <a href="https://signup.d.tube" target="__blank">signup.d.tube</a>.</p>
            <p>The button below will open a form to create new accounts from an existing account with a burn fee as listed below.</p>
            <a href="https://d.tube/#!/newaccount" type="button" target="_blank" class="btn btn-primary dblocks-accprice-createaccbtn"><img src="icons/DTube_White.png">Create a new account on DTube</a><br><br>
            <table class="table table-sm table-striped dblocks-accprice">
                <thead><tr>
                    <th scope="col">No. of characters</th>
                    <th scope="col">Price</th>
                </tr></thead>
                <tbody>
                    <tr><th scope="row">1</th><td>123,752.00 DTUBE</td></tr>
                    <tr><th scope="row">2</th><td>7,736.38 DTUBE</td></tr>
                    <tr><th scope="row">3</th><td>1,529.78 DTUBE</td></tr>
                    <tr><th scope="row">4</th><td>485.40 DTUBE</td></tr>
                    <tr><th scope="row">5</th><td>200.00 DTUBE</td></tr>
                    <tr><th scope="row">6</th><td>97.49 DTUBE</td></tr>
                    <tr><th scope="row">7</th><td>53.54 DTUBE</td></tr>
                    <tr><th scope="row">8</th><td>32.21 DTUBE</td></tr>
                    <tr><th scope="row">9</th><td>20.86 DTUBE</td></tr>
                    <tr><th scope="row">10</th><td>14.38 DTUBE</td></tr>
                    <tr><th scope="row">11</th><td>10.45 DTUBE</td></tr>
                    <tr><th scope="row">12</th><td>7.97 DTUBE</td></tr>
                    <tr><th scope="row">13</th><td>6.33 DTUBE</td></tr>
                    <tr><th scope="row">14</th><td>5.22 DTUBE</td></tr>
                    <tr><th scope="row">15</th><td>4.44 DTUBE</td></tr>
                    <tr><th scope="row">16</th><td>3.89 DTUBE</td></tr>
                    <tr><th scope="row">17</th><td>3.48 DTUBE</td></tr>
                    <tr><th scope="row">18</th><td>3.18 DTUBE</td></tr>
                    <tr><th scope="row">19</th><td>2.95 DTUBE</td></tr>
                    <tr><th scope="row">20</th><td>2.77 DTUBE</td></tr>
                    <tr><th scope="row">21</th><td>2.64 DTUBE</td></tr>
                    <tr><th scope="row">22</th><td>2.53 DTUBE</td></tr>
                    <tr><th scope="row">23</th><td>2.44 DTUBE</td></tr>
                    <tr><th scope="row">24</th><td>2.37 DTUBE</td></tr>
                    <tr><th scope="row">25</th><td>2.32 DTUBE</td></tr>
                    <tr><th scope="row">26</th><td>2.27 DTUBE</td></tr>
                    <tr><th scope="row">27</th><td>2.23 DTUBE</td></tr>
                    <tr><th scope="row">28</th><td>2.20 DTUBE</td></tr>
                    <tr><th scope="row">29</th><td>2.17 DTUBE</td></tr>
                    <tr><th scope="row">30</th><td>2.15 DTUBE</td></tr>
                    <tr><th scope="row">31</th><td>2.13 DTUBE</td></tr>
                    <tr><th scope="row">32</th><td>2.12 DTUBE</td></tr>
                    <tr><th scope="row">33</th><td>2.10 DTUBE</td></tr>
                    <tr><th scope="row">34</th><td>2.09 DTUBE</td></tr>
                    <tr><th scope="row">35</th><td>2.08 DTUBE</td></tr>
                    <tr><th scope="row">36</th><td>2.07 DTUBE</td></tr>
                    <tr><th scope="row">37</th><td>2.07 DTUBE</td></tr>
                    <tr><th scope="row">38</th><td>2.06 DTUBE</td></tr>
                    <tr><th scope="row">39</th><td>2.05 DTUBE</td></tr>
                    <tr><th scope="row">40</th><td>2.05 DTUBE</td></tr>
                    <tr><th scope="row">41</th><td>2.04 DTUBE</td></tr>
                    <tr><th scope="row">42</th><td>2.04 DTUBE</td></tr>
                    <tr><th scope="row">43</th><td>2.04 DTUBE</td></tr>
                    <tr><th scope="row">44</th><td>2.03 DTUBE</td></tr>
                    <tr><th scope="row">45</th><td>2.03 DTUBE</td></tr>
                    <tr><th scope="row">46</th><td>2.03 DTUBE</td></tr>
                    <tr><th scope="row">47</th><td>2.03 DTUBE</td></tr>
                    <tr><th scope="row">48</th><td>2.02 DTUBE</td></tr>
                    <tr><th scope="row">49</th><td>2.02 DTUBE</td></tr>
                    <tr><th scope="row">50</th><td>2.02 DTUBE</td></tr>
                </tbody>
            </table>
        `
    }

    init() {
        addAnchorClickListener()
    }
}