let headBlock = 0
let unparsedBlocks = 0
let fetchingBlock = false

$(() => {
    // Load supply and reward pool, and update every 10 seconds
    updateChainInfo()

    // Stream blocks
    setInterval(() => {
        axios.get('https://avalon.oneloved.tube/count').then((bHeight) => {
            if (bHeight.data.count > headBlock)
                if (headBlock == 0) 
                    headBlock = bHeight.data.count
                else
                    unparsedBlocks = bHeight.data.count - headBlock
        })
    },3000)

    setInterval(() => {
        if (unparsedBlocks > 0 && !fetchingBlock) {
            fetchingBlock = true
            axios.get('https://avalon.oneloved.tube/block/' + (headBlock+1)).then((newBlock) => {
                headBlock++
                unparsedBlocks--
                setTimeout(() => fetchingBlock = false,500)
                $('#newblockslst').prepend(newBlockCardHtml(newBlock.data))
            }).catch((e) => {
                console.log('Error fetching block',e)
                fetchingBlock = false
            })
        }
    },500)

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