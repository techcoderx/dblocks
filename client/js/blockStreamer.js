let headBlock = 0
let unparsedBlocks = 0
let fetchingBlock = false

function streamBlocks(cb) {
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
                cb(newBlock.data)
            }).catch((e) => {
                console.log('Error fetching block',e)
                fetchingBlock = false
            })
        }
    },500)
}