function isFavorite(favoriteProducts, productId){
  console.log("accessed isFavorite function")

    console.log("array of products:",favoriteProducts);

    function checkIfIsFavorite(result){
      return result == productId;
     }
    
    if (favoriteProducts.find(checkIfIsFavorite)){
      console.log("returned true")
      return true
    } else { 
      console.log("returned false")
      return false
    }
    }

export default isFavorite;