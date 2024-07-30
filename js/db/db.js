const DB_NAME = "mytunesDB";
const DB_VERSION = 1;
const STORE_NAME = "users";

let db;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "email" });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function addUser(user) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(user);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
function updateUserProfile(email, user) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    let getUserRequest = store.get(email);

    getUserRequest.onsuccess = function (event) {
      let userData = event.target.result;
      if (!userData) {
        reject("User not found");
        return;
      }
      userData.firstName = user.firstName || userData.firstName;
      userData.lastName = user.lastName || userData.lastName;
      userData.dob = user.dob || userData.dob;
      userData.profileImage = user.profileImage || userData.profileImage;
      userData.bio = user.bio || userData.bio;

      let updateUserRequest = store.put(userData);

      updateUserRequest.onsuccess = function (event) {
        resolve(event.target.result);
      };

      updateUserRequest.onerror = (event) => {
        reject(event.target.error);
      };
    };

    getUserRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function getUser(email) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(email);

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export { openDB, addUser, updateUserProfile, getUser };
