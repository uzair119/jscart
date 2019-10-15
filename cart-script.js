var products;
var cartContents;
var productCategories;


$(document).ready(function () {
  cartContents = {};
  products = {};
  productCategories = new Set();

  $.ajaxSetup({
    async: false
  });

  getProducts().then(getCartContentsFromLocalStorage()).then(updateCart()).then(populateCategories()).then(getUserInfo());

  $.ajaxSetup({
    async: true
  });
});




async function getProducts() {
  var category = $('#search').val();
  $('#products').html("");
  $.getJSON("products.json", function (json) {
    //console.log(json); // show the JSON file content into console
    products = json.products;

    var sortByPrice = $('#priceSort').val();
    if (sortByPrice === "ascending")
      products.sort(function (a, b) { return a.price - b.price });
    else if (sortByPrice === "descending")
      products.sort(function (a, b) { return b.price - a.price });

    var innerHTML = "";
    $.each(products, function (index) {

      if (category === "none" || category === products[index].category) {
        innerHTML +=
          '<div class="col-2 card card-hover" style="list-style: none; margin: 10px 0px; min-width:25%">' +
          '<div id="imgbox" style="min-height:300px">' +
          '<a href="'+products[index].images[0].src+'"><img class="card-img-top" style="position: relative; left: 20%;width: 55%;" src="' + products[index].images[0].src + '"></a>' +
          '<div style="display: flex;" class="imgrow">';
        for (var img of products[index].images) {
          innerHTML +=
            '<div style="flex: 33.33%;" class="imgcolumn">' +
            '<a href="'+img.src+'"><img src="' + img.src + '" style="width:100%"></a>' +
            '</div>';
        }
        innerHTML +=
          '</div>' +
          '</div>' +
          '<div class="card-body">' +
          '<a href="">' +
          '<h5 class="card-title" style="min-height:100px">' + products[index].name + '</h5>' +
          '</a>' +
          '<p class="card-text" style ="font-family:fantasy"> $' + products[index].price + '</p>' +
          '</div>' +
          '<input type="number" class="form-control" id="quantity' + index + '" min = "0" placeholder="Select quantity.."  name="quantity" style="text-align: right;margin-bottom: 5px;">' +
          '<div style="margin-bottom:5px;">' +
          '<button type="button" class="btn btn-success" id="' + index + '" onclick="addToCart(' + index + ')">Add to cart </button>' +
          '<button type="button" style="float:right;" class="btn btn-danger" onclick="clearCart(' + index + ')">Clear</button>' +
          '</div>' +
          '</div>'
          ;
      }
    });
    $('#products').append(innerHTML);
    $('#products').show();
    setProductQuantities();
  });
}

function addToCart(productIndex) {
  //console.log(products[productIndex]);
  if ($('#quantity' + productIndex).val() == "" || $('#quantity' + productIndex).val() == 0)
    alert('You must select a quantity to add.');
  else {
    var quantity = $('#quantity' + productIndex).val();
    //console.log(quantity);
    var id = products[productIndex].id;
    cartContents[id] = quantity;
    //console.log(cartContents);
    updateCart();
  }
}



async function populateCategories() {

  $.getJSON("products2.json", function (json) {
    console.log(json);
    var categories = json.categories;

    //console.log(products);
    for (var category of categories) {
      $('#search').append('<option value="' + category.id + '" id=ctg"' + category.id + '">' + category.name + '</option>');
    }
  });
  //console.log(productCategories);
}