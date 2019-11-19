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

function changeQuantity(productID){
  var quantity = $('#cartprodqty'+productID).val();
  cartContents[productID] = quantity;
  var index = getProductIndexByID(productID);
  var product = products[index];
  $('#cartprodprice'+productID).html((product.price*quantity).toFixed(2));
  generateTotal();
  updateCart();
}

function removeFromCart(productID){
  delete cartContents[productID];
  $('#cartprod'+productID).remove();
  generateTotal();
  updateCart();    
}

function generateTotal()
{
  var total = 0;
  for (var productID in cartContents) {
    var index = getProductIndexByID(productID);
    var product = products[index];
    var quantity = cartContents[productID];
    total += product.price * quantity;
  }
  $('#carttotal').html('$'+total.toFixed(2));
}



async function generateBill() {
  var total = 0;
  for (var productID in cartContents) {
    var index = getProductIndexByID(productID);
    var product = products[index];
    var quantity = cartContents[productID];
    total += product.price * quantity;

    $('#carttable').append('<tr id="cartprod'+productID+'">'+
                                    '<td>'+ product.name + '</td>' +
                                    '<td><input class="form-control" min="1" id="cartprodqty'+productID+'" type="number" onchange="changeQuantity('+productID+')" value="' + quantity + '"</td>' + 
                                    '<td id="cartprodprice'+productID+'" class="text-right">$' + (product.price*quantity).toFixed(2) + '</td>' +
                                    '<td onclick="removeFromCart('+productID+')"  class="text-right"><button class="btn btn-sm btn-danger"><i class="fa fa-trash"></i> </button> </td>'+
                                '</tr>');
    //$('#cartlist').append('<li style="color:gray; font-family:fantasy">' + '<h6 style="color:crimson">' + product.name + '</h6>' + product.price + ' x $' + quantity + '= $' + (product.price * quantity) + '</li>');
  }
  var totalString = `           <tr>
                                    <td></td>
                                    <td><strong>Total</strong></td>
                                    <td class="text-right"><strong id="carttotal">$`+total+`</strong></td>
                                    <td></td>
                                </tr>`;
  $('#carttable').append(totalString);                              
  // $('#cartlist').append('</ol>'
  //   + '<hr>'
  //   + '<h1 style="font-family:fantasy">$' + total + '</h1>');
  // console.log(total);
}