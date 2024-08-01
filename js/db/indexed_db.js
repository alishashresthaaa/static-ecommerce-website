import { UNAUTHORIZED } from "../constants.js";
import { getLoggedUser } from "./local_storage.js";

// Constants for the database name and version
const DB_NAME = "mytunesDB";
const DB_VERSION = 4;

// Constants for the object store names
const STORE_NAME_USERS = "users";
const STORE_NAME_CART = "cartItems";
const STORE_NAME_ORDER = "orderItems";

// Variable to hold the database instance
let db;

/**
 * Opens the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    // Request to open the database with the specified name and version
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Event handler for when the database needs to be upgraded (e.g., new version)
    request.onupgradeneeded = (event) => {
      db = event.target.result; // Get the database instance from the event

      // Create the 'users' object store if it doesn't already exist
      if (!db.objectStoreNames.contains(STORE_NAME_USERS)) {
        db.createObjectStore(STORE_NAME_USERS, { keyPath: "email" });
      }
      // Create the 'cartItems' object store if it doesn't already exist
      if (!db.objectStoreNames.contains(STORE_NAME_CART)) {
        const cartStore = db.createObjectStore(STORE_NAME_CART, {
          keyPath: "id",
          autoIncrement: true,
        });
        cartStore.createIndex("email", "email", { unique: false });
      }

      // Create the 'orderItems' object store if it doesn't already exist
      if (!db.objectStoreNames.contains(STORE_NAME_ORDER)) {
        const orderStore = db.createObjectStore(STORE_NAME_ORDER, {
          keyPath: "id",
          autoIncrement: true,
        });
        // Creates an index on the 'email' field in the 'orderItems' object store.
        // This allows for efficient querying of the 'orderItems' store by 'email'.
        // The index is not unique, meaning multiple records can have the same 'email' value.
        orderStore.createIndex("email", "email", { unique: false });
      }
    };

    // Event handler for when the database is successfully opened
    request.onsuccess = (event) => {
      // Get the database instance from the event
      db = event.target.result;
      resolve(db);
    };

    // Event handler for when there is an error opening the database
    request.onerror = (event) => {
      reject(new Error(`Database error: ${event.target.error}`));
    };
  });
}

// User Transactions

/**
 * Registers a new user in the database.
 * @param {Object} user - The user object to register.
 * @returns {Promise<void>} A promise that resolves when the user is registered.
 */
function registerUser(user) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME_USERS], "readwrite");
    const store = transaction.objectStore(STORE_NAME_USERS);
    const request = store.add(user);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

/**
 * Updates the profile of an existing user.
 * @param {string} email - The email of the user to update.
 * @param {Object} user - The updated user object.
 * @returns {Promise<void>} A promise that resolves when the user profile is updated.
 */
function updateUserProfile(email, user) {
  return new Promise((resolve, reject) => {
    console.log(email);
    console.log(user);
    const transaction = db.transaction([STORE_NAME_USERS], "readwrite");
    const store = transaction.objectStore(STORE_NAME_USERS);
    const getUserRequest = store.get(email);

    getUserRequest.onsuccess = (event) => {
      const userData = event.target.result;
      if (!userData) {
        reject(new Error("User not found"));
        return;
      }
      // Update user data
      userData.firstName = user.firstName || userData.firstName;
      userData.lastName = user.lastName || userData.lastName;
      userData.dob = user.dob || userData.dob;
      userData.profileImage = user.profileImage || userData.profileImage;
      userData.bio = user.bio || userData.bio;

      const updateUserRequest = store.put(userData);

      updateUserRequest.onsuccess = () => {
        resolve();
      };

      updateUserRequest.onerror = (event) => {
        reject(new Error(`Update error: ${event.target.error}`));
      };
    };

    getUserRequest.onerror = (event) => {
      reject(new Error(`Get user error: ${event.target.error}`));
    };
  });
}

/**
 * Retrieves the current user by email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object>} A promise that resolves with the user object.
 */
function getUser(email) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME_USERS], "readonly");
    const store = transaction.objectStore(STORE_NAME_USERS);
    const request = store.get(email);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(new Error(`Get user error: ${event.target.error}`));
    };
  });
}

// Cart Transactions

/**
 * Adds an item to the cart.
 * @param {Object} cartItem - The cart item to add.
 * @returns {Promise<string>} A promise that resolves when the item is added.
 */
function addCartItem(cartItem) {
  return new Promise((resolve, reject) => {
    const loggedInUser = getLoggedUser();
    if (!loggedInUser) {
      reject(new Error(UNAUTHORIZED));
      return;
    }

    const transaction = db.transaction([STORE_NAME_CART], "readwrite");
    const store = transaction.objectStore(STORE_NAME_CART);
    cartItem.email = loggedInUser.email;
    store.add(cartItem);

    transaction.oncomplete = () => {
      resolve("Item added to cart");
    };

    transaction.onerror = (event) => {
      reject(new Error(`Add cart item error: ${event.target.error}`));
    };
  });
}

/**
 * Adds an item to the order.
 * @param {Object} orderItem - The order item to add.
 * @returns {Promise<string>} A promise that resolves when the item is added.
 */
function placeOrderItem(order) {
  return new Promise((resolve, reject) => {
    const loggedInUser = getLoggedUser();
    if (!loggedInUser) {
      reject(new Error("User is not logged in"));
      return;
    }

    const transaction = db.transaction([STORE_NAME_ORDER], "readwrite");
    const store = transaction.objectStore(STORE_NAME_ORDER);
    order.email = loggedInUser.email;
    order.orderDate = new Date();
    store.add(order);

    transaction.oncomplete = () => {
      resolve("Order is placed successfully");
    };

    transaction.onerror = (event) => {
      reject(new Error(`Order placing error: ${event.target.error}`));
    };
  });
}

/**
 * Removes an item from the cart.
 * @param {number} cartItemId - The ID of the cart item to remove.
 * @returns {Promise<string>} A promise that resolves when the item is removed.
 */
function removeCartItem(cartItemId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME_CART], "readwrite");
    const store = transaction.objectStore(STORE_NAME_CART);
    const request = store.delete(cartItemId);

    request.onsuccess = () => {
      resolve("Item removed from cart");
    };

    request.onerror = (event) => {
      reject(new Error(`Remove cart item error: ${event.target.error}`));
    };
  });
}

/**
 * Clears all items from the cart in the IndexedDB.
 * @returns {Promise<void>} A promise that resolves when the cart is cleared.
 */
function clearCartItems() {
  return new Promise((resolve, reject) => {
    // Start a new transaction with readwrite access on the cartItems store
    const transaction = db.transaction([STORE_NAME_CART], "readwrite");
    // Get the object store for cartItems
    const objectStore = transaction.objectStore(STORE_NAME_CART);
    // Request to clear all items in the object store
    const request = objectStore.clear();

    request.onsuccess = () => {
      console.log(`All data from cart has been cleared.`);
      resolve();
    };

    request.onerror = (event) => {
      console.error(`Failed to clear data from cart:`, event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Retrieves the cart items for the logged-in user.
 * @returns {Promise<Array<Object>>} A promise that resolves with the cart items.
 */
function getMyOrders() {
  return new Promise((resolve, reject) => {
    const loggedInUser = getLoggedUser();
    if (!loggedInUser) {
      reject(new Error("User is not logged in"));
      return;
    }
    const email = loggedInUser.email;
    const transaction = db.transaction([STORE_NAME_ORDER], "readonly");
    const store = transaction.objectStore(STORE_NAME_ORDER);
    const index = store.index("email");
    const request = index.getAll(email);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(new Error(`Get cart items error: ${event.target.error}`));
    };
  });
}

/**
 * Retrieves the cart items for the logged-in user.
 * @returns {Promise<Array<Object>>} A promise that resolves with the cart items.
 */
function getMyCartItems() {
  return new Promise((resolve, reject) => {
    const loggedInUser = getLoggedUser();
    if (!loggedInUser) {
      reject(new Error("User is not logged in"));
      return;
    }
    const email = loggedInUser.email;
    const transaction = db.transaction([STORE_NAME_CART], "readonly");
    const store = transaction.objectStore(STORE_NAME_CART);
    const index = store.index("email");
    const request = index.getAll(email);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(new Error(`Get cart items error: ${event.target.error}`));
    };
  });
}

export {
  openDB,
  registerUser,
  updateUserProfile,
  getUser,
  addCartItem,
  removeCartItem,
  clearCartItems,
  getMyCartItems,
  placeOrderItem,
  getMyOrders,
};
