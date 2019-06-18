import rp from 'request-promise';
import configData from '../config'
const API_BASE_URL = "https://api.commercetools.co/ctatg";

let serializeObject = function (obj) {
  var str = [];
  for (var key in obj) {
    if (obj[key] instanceof Array) {
      for (var idx in obj[key]) {
        var subObj = obj[key][idx];
        for (var subKey in subObj) {
          str.push(encodeURIComponent(key) + "[" + idx
            + "][" + encodeURIComponent(subKey)
            + "]="
            + encodeURIComponent(subObj[subKey]));
        }
      }
    } else {
      str.push(encodeURIComponent(key) + "="
        + encodeURIComponent(obj[key]));
    }
  }
  return str.join("&");
};

let getAuthToken = function () {
  return localStorage.getItem("currToken");
}

let setAuthToken = function (authToken) {
  localStorage.setItem("currToken", authToken);
}

let getCurrListId = function () {
  return localStorage.getItem("currListId");
}

let setCurrListId = function (listId) {
  localStorage.setItem("currListId", listId);
}

let getCurrListVersion = function () {
  return parseInt(localStorage.getItem("currListVersion"));
}

let setCurrListVersion = function (listVersion) {
  localStorage.setItem("currListVersion", listVersion);
}

let getCurrCartId = function () {
  return localStorage.getItem("currCartId");
}

let setCurrCartId = function (cartId) {
  localStorage.setItem("currCartId", cartId);
}

let getCurrCartCustomer = function () {
  return localStorage.getItem("currCartCustomer");
}

let setCurrCartCustomer = function (customerId) {
  localStorage.setItem("currCartCustomer", customerId);
}

let removeCurrCartId = function () {
  localStorage.removeItem("currCartId");
}

let getCurrCartVersion = function () {
  return parseInt(localStorage.getItem("currCartVersion"));
}

let setCurrCartVersion = function (cartVersion) {
  localStorage.setItem("currCartVersion", cartVersion);
}

let removeCurrCartVersion = function () {
  localStorage.removeItem("currCartVersion");
}

let getCurrCustomerId = function () {
  return localStorage.getItem("currCustomerId");
}

let setCurrCustomerId = function (customerId) {
  localStorage.setItem("currCustomerId", customerId);
}

let removeCurrCustomerId = function () {
  localStorage.removeItem("currCustomerId");
}

let getOrderNumber = function () {
  return localStorage.getItem("lastOrderNumber");
}

let setOrderNumber = function (orderId) {
  localStorage.setItem("lastOrderNumber", orderId);
}

let invokeAuthAPI = function () {
  let options = {
    method: "POST",
    url: "https://auth.commercetools.co/oauth/token",
    headers: {
      'Authorization': configData().ctAuthToken,
      'Content-type': 'application/x-www-form-urlencoded'
    },
    json: true,
    form: {
      'grant_type': 'client_credentials'
    }
  }
  rp(options)
    .then(function (body) {
      setAuthToken(body['access_token']);
    })
    .catch(function (err) {
      console.log("Auth Error Response", err);
    });
}

let signIn = function (credentials) {
  let currCartId = getCurrCartId();
  let currCustomerId = getCurrCustomerId();
  let cartCustomer = getCurrCartCustomer();
  if(!cartCustomer && currCartId) {
    credentials.anonymousCartId = currCartId;
  }
  let options = {
    method: 'POST',
    url: `${API_BASE_URL}/login`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true,
    body: credentials
  }
  return rp(options)
    .then(function (body) {
      console.log("Login Success Response", body);
      setCurrCustomerId(body.customer.id);
      if (body.cart) {
        setCurrCartId(body.cart.id);
        setCurrCartVersion(body.cart.version);
        setCurrCartCustomer(body.cart.customerId);
      }
      return { body }
    })
    .catch(function (err) {
      console.log("Login Error Response", err);
      return { err }
    });
}

let signUp = function (credentials) {
  let currCartId = getCurrCartId();
  let currCustomerId = getCurrCustomerId();
  let cartCustomer = getCurrCartCustomer();
  if(!cartCustomer && currCartId) {
    credentials.anonymousCartId = currCartId;
  }
  console.log("signUp", credentials);
  let options = {
    method: 'POST',
    url: `${API_BASE_URL}/customers`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true,
    body: credentials
  }
  return rp(options)
    .then(function (body) {
      console.log("CreateCustomer Success Response", body);
      setCurrCustomerId(body.customer.id);
      if (body.cart) {
        setCurrCartId(body.cart.id);
        setCurrCartVersion(body.cart.version);
        setCurrCartCustomer(body.cart.customerId);
      }
      return { body }
    })
    .catch(function (err) {
      console.log("CreateCustomer Error Response", err);
      return { err }
    });
}

let fetchCustomer = function (customerId) {
  let options = {
    method: "GET",
    url: `${API_BASE_URL}/customers/${customerId}`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log("fetchCustomer Success Response", body);
      return { body };
    })
    .catch(function (err) {
      console.log("fetchCustomer Error Response", err);
      return { err }
    });
}

let updateCustomer = function (requestBody) {
  let customerId = getCurrCustomerId();
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/customers/${customerId}`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    body: requestBody,
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log(`updateCustomer Success Response`, requestBody, body);
      return { body };
    })
    .catch(function (err) {
      console.log(`updateCustomer Error Response`, requestBody, err);
      return { err }
    });
}

let fetchCustomerOrders = function (customerId, queryParams) {
  let customerParam = ["where", encodeURIComponent(`customerId="${customerId}"`)].join("=");
  let queryParam = "";
  if(queryParams){
    let limitParam = ["limit", queryParams.limit].join("=");
    let offsetParam = ["offset", queryParams.offset].join("=");
    let sortParam = ["sort", encodeURIComponent(queryParams.sort)].join("=");
    queryParam = [customerParam, limitParam, offsetParam, sortParam].join("&");
  } else{
    queryParam = customerParam
  }
  let apiUrl = `${API_BASE_URL}/orders?${queryParam}`;
  let options = {
    method: "GET",
    url: apiUrl,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log("fetchCustomerOrders Success Response", body);
      return { body };
    })
    .catch(function (err) {
      console.log("fetchCustomerOrders Error Response", err);
      return { err }
    });
}

let fetchCustomerShoppingLists = function (customerId, queryParams) {
  let customerParam = ["where", encodeURIComponent(`customer(id="${customerId}")`)].join("=");
  let queryParam = "";
  if(queryParams){
    let limitParam = ["limit", queryParams.limit].join("=");
    let offsetParam = ["offset", queryParams.offset].join("=");
    let sortParam = ["sort", encodeURIComponent(queryParams.sort)].join("=");
    queryParam = [customerParam, limitParam, offsetParam, sortParam].join("&");
  } else{
    queryParam = customerParam
  }
  let apiUrl = `${API_BASE_URL}/shopping-lists?${queryParam}`;
  let options = {
    method: "GET",
    url: apiUrl,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log("fetchCustomerShoppingLists Success Response", body);
      return { body };
    })
    .catch(function (err) {
      console.log("fetchCustomerShoppingLists Error Response", err);
      return { err }
    });
}

let fetchProducts = function () {
  let options = {
    method: "GET",
    url: `${API_BASE_URL}/products`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      return { body }
    })
    .catch(function (err) {
      console.log("fetchProducts Error Response", err);
      return { err }
    });
}

let fetchProductProjections = function (filterQuery) {
  let apiUrl = `${API_BASE_URL}/product-projections/search?facet=variants.attributes.color&facet=variants.attributes.size&facet=categories.id`;
  if(filterQuery){    
    apiUrl = [apiUrl, filterQuery].join("");
  }
  let options = {
    method: "GET",
    url: apiUrl,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      return { body }
    })
    .catch(function (err) {
      console.log("fetchProductProjections Error Response", err);
      return { err }
    });
}

let fetchProductById = function (productId) {
  let options = {
    method: "GET",
    url: `${API_BASE_URL}/products/${productId}`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      return { body }
    })
    .catch(function (err) {
      console.log("fetchCategories Error Response", err);
      return { err }
    });
}

let fetchCategories = function () {
  let options = {
    method: "GET",
    url: `${API_BASE_URL}/categories?sort=parent.id%20asc`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      return { body }
    })
    .catch(function (err) {
      console.log("fetchCategories Error Response", err);
      return { err }
    });
}

let fetchList = function (listId) {
  let options = {
    method: "GET",
    url: `${API_BASE_URL}/shopping-lists/${listId}`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log("ListFetch Success Response", body);
      return { body };
    })
    .catch(function (err) {
      console.log("ListFetch Error Response", err);
      return { err }
    });
}

let createList = function (listName) {
  let currCustomerId = getCurrCustomerId();
  let requestBody = {
    name: {
      en: listName
    }
  }
  if (currCustomerId) {
    requestBody.customer = {
      typeId: "customer",
      id: currCustomerId
    };
  }
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/shopping-lists`,
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: requestBody
  }
  return rp(options)
    .then(function (body) {
      console.log("CreateList Success Response", body);
      setCurrListId(body.id);
      setCurrListVersion(body.version);
      return { body };
    })
    .catch(function (err) {
      console.log("CreateList Error Response", err);
      return { err };
    });
}

let removeList = function (listId, listVersion) {
  let options = {
    method: "DELETE",
    url: `${API_BASE_URL}/shopping-lists/${listId}?version=${listVersion}`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log("RemoveList Success Response", body);
      return { body };
    })
    .catch(function (err) {
      console.log("RemoveList Error Response", err);
      return { err }
    });
}

let addItemToList = function (currSku) {
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/shopping-lists/` + getCurrListId(),
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: {
      "version": getCurrListVersion(),
      "actions": [{
        "action": "addLineItem",
        "sku": currSku.sku,
        "quantity": 1
      }]
    }
  }
  return rp(options)
    .then(function (body) {
      console.log("AddItemToList Success Response", body);
      setCurrListVersion(body.version);
      return { body };
    })
    .catch(function (err) {
      console.log("AddItemToList Error Response", err);
      return { err };
    });
}

let removeItemFromList = function (shoppinglistId, shoppingLitVersion, lineItemId) {
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/shopping-lists/${shoppinglistId}`,
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: {
      "version": shoppingLitVersion,
      "actions": [{
        "action": "removeLineItem",
        lineItemId
      }]
    }
  }
  return rp(options)
    .then(function (body) {
      console.log("RemoveItemFromList Success Response", body);
      setCurrCartVersion(body.version);
      setCurrCartCustomer(body.customerId);
      return { body };
    })
    .catch(function (err) {
      console.log("RemoveItemFromList Error Response", err);
      return { err };
    });
}

let fetchCart = function (cartId) {
  let options = {
    method: "GET",
    url: `${API_BASE_URL}/carts/${cartId}`,
    headers: {
      'Authorization': 'Bearer ' + getAuthToken(),
      'Content-type': 'application/json'
    },
    json: true
  }
  return rp(options)
    .then(function (body) {
      console.log("CartFetch Success Response", body);
      setCurrCartVersion(body.version);
      setCurrCartCustomer(body.customerId);
      return { body };
    })
    .catch(function (err) {
      console.log("CartFetch Error Response", err);
      return { err }
    });
}

let createCart = function () {
  let currCustomerId = getCurrCustomerId();
  let createCartBody = {
    currency: "USD"
  }
  if (currCustomerId) {
    createCartBody.customerId = currCustomerId;
  }
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/carts`,
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: createCartBody
  }
  return rp(options)
    .then(function (body) {
      console.log("createCart Success Response", body);
      setCurrCartId(body.id);
      setCurrCartVersion(body.version);
      setCurrCartCustomer(body.customerId);
      return { body };
    })
    .catch(function (err) {
      console.log("createCart Error Response", err);
      return { err };
    });
}

let addItemToCart = function (currSku) {
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/carts/` + getCurrCartId(),
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: {
      "version": getCurrCartVersion(),
      "actions": [{
        "action": "addLineItem",
        "sku": currSku.sku,
        "quantity": 1
      }]
    }
  }
  return rp(options)
    .then(function (body) {
      console.log("AddToCart Success Response", body);
      setCurrCartVersion(body.version);
      setCurrCartCustomer(body.customerId);
      return { body };
    })
    .catch(function (err) {
      console.log("AddToCart Error Response", err);
      return { err };
    });
}

let removeItemFromCart = function (lineItemId) {
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/carts/` + getCurrCartId(),
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: {
      "version": getCurrCartVersion(),
      "actions": [{
        "action": "removeLineItem",
        lineItemId
      }]
    }
  }
  return rp(options)
    .then(function (body) {
      console.log("RemoveItemFromCart Success Response", body);
      setCurrCartVersion(body.version);
      setCurrCartCustomer(body.customerId);
      return { body };
    })
    .catch(function (err) {
      console.log("RemoveItemFromCart Error Response", err);
      return { err };
    });
}


let addShippingToCart = function (shippingAddress) {
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/carts/` + getCurrCartId(),
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: {
      "version": getCurrCartVersion(),
      "actions": [{
        "action": "setShippingAddress",
        "address": shippingAddress
      }]
    }
  }
  return rp(options)
    .then(function (body) {
      console.log("addShippingToCart Success Response", body);
      setCurrCartVersion(body.version);
      setCurrCartCustomer(body.customerId);
      return { body };
    })
    .catch(function (err) {
      console.log("addShippingToCart Error Response", err);
      return { err };
    });
}

let submitOrder = function () {
  let options = {
    method: "POST",
    url: `${API_BASE_URL}/orders/`,
    headers: {
      "Authorization": "Bearer " + getAuthToken(),
      "Content-Type": "application/json"
    },
    json: true,
    body: {
      "id": getCurrCartId(),
      "version": getCurrCartVersion()
    }
  }
  return rp(options)
    .then(function (body) {
      console.log("submitOrder Success Response", body);
      setOrderNumber(body.id);
      removeCurrCartId();
      removeCurrCartVersion();
      return { body };
    })
    .catch(function (err) {
      console.log("submitOrder Error Response", err);
      return { err };
    });
}

let getModalStyle = function(){
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export {
  serializeObject,
  invokeAuthAPI,
  signIn,
  signUp,
  getAuthToken,
  fetchProducts,
  fetchProductProjections,
  fetchProductById,
  fetchCategories,
  fetchCart,
  createCart,
  addItemToCart,
  removeItemFromCart,
  addShippingToCart,
  getCurrCartId,
  fetchCustomer,
  getCurrCustomerId,
  setCurrCartId,
  setCurrCustomerId,
  getCurrCartVersion,
  setCurrCartVersion,
  submitOrder,
  getOrderNumber,
  setOrderNumber,
  removeCurrCartId,
  removeCurrCartVersion,
  fetchCustomerOrders,
  fetchCustomerShoppingLists,
  updateCustomer,
  getModalStyle,
  getCurrListId,
  setCurrListId, 
  createList,
  addItemToList,
  getCurrListVersion,
  setCurrListVersion,
  removeCurrCustomerId,
  getCurrCartCustomer,
  setCurrCartCustomer,
  removeItemFromList,
  fetchList,
  removeList
};
