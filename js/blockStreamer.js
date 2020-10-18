let headBlock = 0
let unparsedBlocks = 0
let fetchingBlock = false

const streamBlocks = (cb) => {
    // Stream blocks
    let blockCountInterval = setInterval(() => {
        axios.get(config.api + '/count').then((bHeight) => {
            if (bHeight.data.count > headBlock)
                if (headBlock == 0) 
                    headBlock = bHeight.data.count
                else
                    unparsedBlocks = bHeight.data.count - headBlock
        })
    },3000)

    let blockInterval = setInterval(() => {
        if (unparsedBlocks > 0 && !fetchingBlock) {
            fetchingBlock = true
            axios.get(config.api + '/block/' + (headBlock+1)).then((newBlock) => {
                headBlock++
                unparsedBlocks--
                setTimeout(() => fetchingBlock = false,500)
                cb(newBlock.data)
            }).catch((e) => {
                console.log('Error fetching block',e)
                fetchingBlock = false
            })
        }
    },500)

    window.intervals.push(blockCountInterval,blockInterval)
}
