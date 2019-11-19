async function getUserInfo()
    {
      var storedInfo = JSON.parse(localStorage.getItem('userInfo'));
      if(storedInfo)
      {
        userInfo = storedInfo;
        if (userInfo.name == "")
          $('#hellomsg').html("Enter name here");
        else
          $('#hellomsg').html(userInfo.name);
        $('#name').val(userInfo.name);
        $('#address').val(userInfo.address);
        $('#postcode').val(userInfo.postalCode);
        $('#deliverynotes').val(userInfo.delnotes);
      
      }
      else
      {
        $('#hellomsg').html("Enter name here");
        $('#name').val("");
        $('#address').val("");
        $('#postcode').val("");
        $('#deliverynotes').val("");
      }
    }

async function getCartContentsFromLocalStorage()
{
  var storedAsString =  localStorage.getItem('savedCart');
  //console.log(products);
  var storedCart = JSON.parse(storedAsString);
  if(storedCart)
  {
    cartContents = storedCart;
    setProductQuantities();
  }
  //console.log(cartContents);
}

function setProductQuantities()
{
  for(var productID in cartContents)
    {
      for(var i = 0; i < products.length; i++)
      {
        if(products[i].id == productID)
        {
          $('#quantity'+i).val(cartContents[productID]);
          break;
        }
      } 
    }
}

function clearCart(productIndex)
{
  //console.log(products[productIndex]);
  var id = products[productIndex].id;
  delete cartContents[id];
  $('#quantity'+productIndex).val("");
  //console.log(cartContents);
  updateCart();
}

function updateCart()
{
  var cartCount = 0;
  for(var productID in cartContents)
  {
    cartCount += Number(cartContents[productID]);
  }
  //console.log(cartCount);
  $('#cartbadge').html(cartCount);
  if(cartContents)
    localStorage.setItem('savedCart', JSON.stringify(cartContents));
}


function updateName()
{
  var changedName = $("#hellomsg").html();
  changedName = changedName.replace(/(?:&nbsp;|<br>)/g,'');
  changedName = changedName.trim();
  
  console.log(changedName);
  $("#name").val(changedName);
  userInfo.name = changedName;
  userInfo.address = $('#address').val();
  userInfo.postalCode = $('#postcode').val();
  userInfo.delnotes = $('#deliverynotes').val();
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}

document.getElementById("hellomsg").contentEditable = true;
document.getElementById('hellomsg').addEventListener("input", function() {
  updateName();
}, false);

$('#hellomsg').keypress(function (evt) {

  var keycode = evt.charCode || evt.keyCode;
  if (keycode  == 13) { //Enter key's keycode
    return false;
  }
});