export const getdiscountedPricePercentage=(orginalprice, discountedprice)=>{
    const discount = orginalprice-discountedprice

    const discountPercentage = (discount/orginalprice)*100;
    
    return discountPercentage.toFixed(2)
}