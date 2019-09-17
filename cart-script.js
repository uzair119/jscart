var products;
var cartContents;
var productCategories; 


$(document).ready(function()
  {
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




async function getProducts()
{  
  var category=$('#search').val();
  $('#products').html("");
  $.getJSON("products.json", function(json) {
    //console.log(json); // show the JSON file content into console
    products=json;

    var sortByPrice = $('#priceSort').val();
    if(sortByPrice === "ascending")
      products.sort(function(a,b){return a.price-b.price});
    else if(sortByPrice === "descending")
      products.sort(function(a,b){return b.price-a.price});

     
    $.each(json,function(index)
    {
      if(category === "none" || category === json[index].category)
        $('#products').append(
          '<div class="col-2 card card-hover"  style="list-style: none; margin: 10px 0px">' + 
            '<img class="card-img-top"  src="https://via.placeholder.com/150" alt="Card image cap">' +
            '<div class="card-body">' +
              '<a href="">' +
                  '<h5 class="card-title">' + json[index].name + '</h5>' +
              '</a>' +
              '<p class="card-text"> $'+ json[index].price + '</p>' +
            '</div>' + 
            '<input type="number" class="form-control" id="quantity' + index + '" min = "0" placeholder="Select quantity.."  name="quantity" style="text-align: right;margin-bottom: 5px;">' +
            '<div style="margin-bottom:5px;">' +
              '<button type="button" class="btn btn-success" id="' + index + '" onclick="addToCart(' +index+ ')">Add to cart </button>' +
              '<button type="button" style="float:right;" class="btn btn-danger" onclick="clearCart(' +index+ ')">Clear</button>' +
            '</div>' +
          '</div>'
        );
      });
    $('#products').show();
    setProductQuantities();
  });
}

function addToCart(productIndex)
{
  //console.log(products[productIndex]);
  if($('#quantity' + productIndex).val() == "" || $('#quantity' + productIndex).val() == 0)
    alert('You must select a quantity to add.');
  else  
  {
    var quantity = $('#quantity' + productIndex).val();
    //console.log(quantity);
    var id = products[productIndex].id;
    cartContents[id]=quantity;
    //console.log(cartContents);
    updateCart();
  }
}



async function populateCategories()
{
  //console.log(products);
  for(var product of products)
  {
    //console.log(product);
    if(product.category)
    {
      productCategories.add(product.category);      
    }
  }
  productCategories.forEach(function(value){
    $('#search').append('<option id=ctg"' + value + '">' + value + '</option>');
  });
  //console.log(productCategories);
}