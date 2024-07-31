import { getLoggedUser } from "./local_storage.js";

const DB_NAME = "mytunesDB";
const DB_VERSION = 2;
const STORE_NAME_USERS = "users";
const STORE_NAME_CART = "cartItems";

let db;

/**
 * Opens the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves with the database instance.
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME_USERS)) {
        db.createObjectStore(STORE_NAME_USERS, { keyPath: "email" });
      }
      if (!db.objectStoreNames.contains(STORE_NAME_CART)) {
        const cartStore = db.createObjectStore(STORE_NAME_CART, {
          keyPath: "id",
          autoIncrement: true,
        });
        cartStore.createIndex("email", "email", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

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
      reject(new Error(`Registration error: ${event.target.error}`));
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
      reject(new Error("User is not logged in"));
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
  getMyCartItems,
};
