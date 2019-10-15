var products;
var cartContents;
var userInfo;

$(document).ready(function () {
  cartContents = {};
  products = {};
  userInfo = {};

  $.ajaxSetup({
    async: false
  });

  getProducts().then(getCartContentsFromLocalStorage()).then(updateCart()).then(getUserInfo()).then(generateBill());

  $.ajaxSetup({
    async: true
  });
});




async function getProducts() {
  $.getJSON("products.json", function (json) {
    // console.log(json); // show the JSON file content into console
    products = json.products;
  });
}


function clearCart(productIndex) {
  //console.log(products[productIndex]);
  var id = products[productIndex].id;
  delete cartContents[id];
  $('#quantity' + productIndex).val(0);
  //   console.log(cartContents);
  updateCart();
}

function updateCart() {
  var cartCount = 0;
  for (var productID in cartContents) {
    cartCount += Number(cartContents[productID]);
  }
  //   console.log(cartCount);
  $('#cartbadge').html(cartCount);
  localStorage.setItem('savedCart', JSON.stringify(cartContents));
}

function saveUserInfo() {
  if ($('#name').val() == "" || $('#address').val() == "" || $('#postcode').val() == "")
    alert("The first three fields are required.")
  else {
    userInfo.name = $('#name').val();
    userInfo.address = $('#address').val();
    userInfo.postalCode = $('#postcode').val();
    userInfo.delnotes = $('#deliverynotes').val();
    // console.log(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    getUserInfo();
  }
}


async function clearUserInfo() {
  localStorage.removeItem('userInfo');
  getUserInfo();
}

function getProductIndexByID(productID) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id == productID)
      return i;
  }
  return -1;
}

async function generateBill() {
  var total = 0;
  for (var productID in cartContents) {
    var index = getProductIndexByID(productID);
    var product = products[index];
    var quantity = cartContents[productID];
    total += product.price * quantity;

    $('#cartlist').append('<li style="color:gray; font-family:fantasy">' + '<h6 style="color:crimson">' + product.name + '</h6>' + product.price + ' x $' + quantity + '= $' + (product.price * quantity) + '</li>');
  }
  $('#cartlist').append('</ol>'
    + '<hr>'
    + '<h1 style="font-family:fantasy">$' + total + '</h1>');
  // console.log(total);
}