

//ensure resources are loaded
window.onload = () => {

  //mouse over/hover event
  $(".prod-container").on("mouseover", (event) =>{
    event.preventDefault();

    //grab data attribute that has the product id stored
    let productID = $(this).data("productID");
    console.log(productID);

    //append that id to our url to get back the json object properties attributed to that prod id
    $.get(`http://localhost:3000/product/${productID}`, (res) => {

      //grab the keys from the json object and set them equal to our res param
      const { productId, marketingBullets, description, imageUrls: { lg }, pricing: { price: { selling } }  } = res;

      //assign data from response obj to our hero classes
      $(".hero-description-title").html(description);
      $(".hero-image").attr("src", lg);
      $(".hero-image").attr("alt", description);
      $(".hero-price").html(selling);

      //empty array to hold the list items for the marketing bullets
      let list = [];

      $.each(marketingBullets, (i, item) => {
            list.push("<li>" + item + "</li>");
     });

      $(".hero-list-marketing ul").html(list);

    }); //end inner get request


  }); //end mouseover event

  $(".add-to-cart").on("click", (event) => {
    event.preventDefault();

    //declare and inititalize constants
    //set equal to the data attributes of the hero/selected product
    const prod = $("#sel-prod");
    const price = prod.data("prodPrice");
    const desc = prod.data("prodDesc");

    alert(`You selected: ${desc} at the price of $${price}`);
  }); //end on click event for adding the item to your cart


} //end window on load
