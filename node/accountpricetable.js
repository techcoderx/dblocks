const config = {
    accountPriceBase: 20000,
    accountPriceCharMult: 4,
    accountPriceChars: 5,
    accountPriceMin: 200,
    accountMaxLength: 50,
    accountMinLength: 1,
    vtPerBurn: 22,
    bwPerBurnHour: 0.05
}

const accountPrice = (length = 1) => {
    let price = config.accountPriceMin
    let extra = config.accountPriceBase - config.accountPriceMin
    let mult = Math.pow(config.accountPriceChars / length, config.accountPriceCharMult)
    price += Math.round(extra*mult)
    return price
}

const thousandSeperator = (num) => {
    let num_parts = num.toString().split(".")
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return num_parts.join(".")
}

let result = ''

for (let i = config.accountMinLength; i <= config.accountMaxLength; i++) {
    let price = accountPrice(i)
    result += '<tr><th scope="row">'+i+'</th><td>'+thousandSeperator((price/100).toFixed(2))+' DTUBE</td><td>'+thousandSeperator(price*config.vtPerBurn)+' VP</td><td>'+thousandSeperator(Math.floor(price*config.bwPerBurnHour))+' bytes/hour</td></tr>\n'
}

console.log(result)