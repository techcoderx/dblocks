$(() => {
    $('.dblocks-navbar').load('navbar.html')
})

// Commons
function thousandSeperator(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function isPuralArr(arr) {
    return arr.length > 1
}