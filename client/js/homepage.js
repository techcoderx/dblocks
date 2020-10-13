$(() => {
    // Load supply and reward pool, and update every 10 seconds
    updateChainInfo()
    streamBlocks((newBlock) => $('#newblockslst').prepend(newBlockCardHtml(newBlock)))
    setInterval(updateChainInfo,10000)
})

function updateChainInfo() {
    axios.get('https://avalon.oneloved.tube/supply').then((supplyRes) => {
        $('#supply-circulating').text(thousandSeperator(supplyRes.data.circulating / 100) + ' DTC')
        $('#supply-unclaimed').text(thousandSeperator(Math.ceil(supplyRes.data.unclaimed) / 100) + ' DTC')
        $('#supply-total').text(thousandSeperator(Math.ceil(supplyRes.data.total) / 100) + ' DTC')
    })

    axios.get('https://avalon.oneloved.tube/rewardPool').then((rpRes) => {
        $('#rp-theo').text(thousandSeperator(rpRes.data.theo / 100) + ' DTC')
        $('#rp-dist').text(thousandSeperator(Math.ceil(rpRes.data.dist) / 100) + ' DTC')
        $('#rp-avail').text(thousandSeperator(Math.ceil(rpRes.data.avail) / 100) + ' DTC')
        $('#rp-burn').text(thousandSeperator(Math.ceil(rpRes.data.burn) / 100) + ' DTC')
        $('#rp-votes').text(thousandSeperator(Math.ceil(rpRes.data.votes)) + ' VP')
    })
}

function newBlockCardHtml(block) {
    let blockCardHtml = '<div class="card dblocks-card">#'
    blockCardHtml += block._id
    blockCardHtml += ' by '
    blockCardHtml += block.miner
    blockCardHtml += ' - '
    blockCardHtml += block.txs.length

    if (isPuralArr(block.txs))
        blockCardHtml += ' tx(s), '
    else
        blockCardHtml += ' tx, dist: '
    
    blockCardHtml += (Math.ceil(block.dist) / 100)
    blockCardHtml += ' DTC'

    if (block.burn) {
        blockCardHtml += ', burned: '
        blockCardHtml += (Math.ceil(block.burn) / 100)
        blockCardHtml += ' DTC'
    }
    blockCardHtml += '</div>'
    return blockCardHtml
}