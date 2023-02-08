const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
document.getElementById('orderId').innerHTML = orderId;
// et ca aussi
// je recupere l orderid et je l áffiche