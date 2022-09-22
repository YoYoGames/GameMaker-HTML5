// #############################################################################################


// #############################################################################################
// Deprecated functions
function iap_store_status()     { return iap_status(); }
function iap_event_queue()      { ErrorFunction("iap_event_queue()"); }
function iap_product_status()   { ErrorFunction("iap_product_status()"); }
//function iap_is_purchased()     { ErrorFunction("iap_is_purchased()"); }
function iap_is_downloaded()    { ErrorFunction("iap_is_downloaded()"); }
function iap_product_files()    { ErrorFunction("iap_product_files()"); }
function iap_files_purchased()  { ErrorFunction("iap_files_purchased()"); }



// #############################################################################################
/// Function:<summary>
///             Enable in app purchase
///          </summary>
// #############################################################################################
function iap_activate(_val) {

}

// #############################################################################################
/// Function:<summary>
///             Return the current status of the store
///          </summary>
// #############################################################################################
function iap_status() {
    return -1;
}

// #############################################################################################
/// Function:<summary>
///             Acquire a product
///          </summary>
// #############################################################################################
function iap_acquire(_product, _payload) {
    
  
    return -1;
}

// #############################################################################################
/// Function:<summary>
///             Consume an acquired product
///          </summary>
// #############################################################################################
function iap_consume(_product) {

  
}


// #############################################################################################
/// Function:<summary>
///             Check to see if the product has been purchased as far as we're concerned
///          </summary>
// #############################################################################################
function iap_restore_all() {

   
}

// #############################################################################################
/// Function:<summary>
///             Return the full set of iap products known about
///          </summary>
// #############################################################################################
function iap_enumerate_products(_list) {
    
   
}

// #############################################################################################
/// Function:<summary>
///             Fill out the provided ds_map with the product information
///          </summary>
// #############################################################################################
function iap_product_details(_product, _map) {

    return 0;  //return 0 if product was not found, to be consistent with native
}

// #############################################################################################
/// Function:<summary>
///             Fill out the provided ds_map with the purchase information
///          </summary>
// #############################################################################################
function iap_purchase_details(_purchase, _map) {

    return 0;  //return 0 if purchase was not found, to be consistent with native
}

    
