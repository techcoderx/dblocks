// Adopted from https://github.com/skzap/GrowInt/blob/master/index.js
class GrowInt {
    constructor(raw, config) {
        if (!config.min)
            config.min = Number.MIN_SAFE_INTEGER
        if (!config.max)
            config.max = Number.MAX_SAFE_INTEGER
        this.v = raw.v
        this.t = raw.t
        this.config = config
    }

    grow(time) {
        if (time < this.t) return
        if (this.config.growth === 0) return {
            v: this.v,
            t: time
        }

        let tmpValue = this.v
        tmpValue += (time-this.t)*this.config.growth
        
        let newValue = 0
        let newTime = 0
        if (this.config.growth > 0) {
            newValue = Math.floor(tmpValue)
            newTime = Math.ceil(this.t + ((newValue-this.v)/this.config.growth))
        } else {
            newValue = Math.ceil(tmpValue)
            newTime = Math.floor(this.t + ((newValue-this.v)/this.config.growth))
        }

        if (newValue > this.config.max)
            newValue = this.config.max

        if (newValue < this.config.min)
            newValue = this.config.min

        return {
            v: newValue,
            t: newTime
        }
    }
}

// From javalon
function votingPower(account) {
    return new GrowInt(account.vt, {growth:account.balance/360000000, max: account.maxVt}).grow(new Date().getTime()).v
}

function bandwidth(account) {
    return new GrowInt(account.bw, {growth:account.balance/36000000, max:64000}).grow(new Date().getTime()).v
}