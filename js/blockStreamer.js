export default class {
    constructor() {
        this.headBlock = 0
        this.unparsedBlocks = 0
        this.fetchingBlock = false
    }

    streamBlocks (cb) {
        // Stream blocks
        let blockCountInterval = setInterval(() => {
            axios.get(config.api + '/count').then((bHeight) => {
                if (bHeight.data.count > this.headBlock)
                    if (this.headBlock == 0) 
                        this.headBlock = bHeight.data.count
                    else
                        this.unparsedBlocks = bHeight.data.count - this.headBlock
            })
        },3000)
    
        let blockInterval = setInterval(() => {
            if (this.unparsedBlocks > 0 && !this.fetchingBlock) {
                this.fetchingBlock = true
                axios.get(config.api + '/block/' + (this.headBlock+1)).then((newBlock) => {
                    this.headBlock++
                    this.unparsedBlocks--
                    setTimeout(() => this.fetchingBlock = false,500)
                    cb(newBlock.data)
                }).catch(() => this.fetchingBlock = false)
            }
        },500)
    
        window.intervals.push(blockCountInterval,blockInterval)
    }
}