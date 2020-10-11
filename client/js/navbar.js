$(() => {
    $('.dblocks-navbar').load('navbar.html')
})

function searchEnter() {
    let keycode = window.event.keyCode
    if (keycode == 13)
        searchSubmit()
}

function searchSubmit()  {
    window.location.href = '/@' + $('.dblocks-search').val()
}

// Commons
function thousandSeperator(num) {
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function isPuralArr(arr) {
    return arr.length > 1
}