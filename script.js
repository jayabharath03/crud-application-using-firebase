import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
const appSetting = {
  databaseURL: "https://js-crud-df4c6-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const usersListInDB = ref(database, "users");

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#name");
const ageEl = document.querySelector("#age");
const cityEl = document.querySelector("#city");
const frm = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

frm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim()) {
    alert("Please Fill All Details");
    return;
  }
  if (idEl.value) {
    //update record
    set(ref(database, "users/" + idEl.value), {
      name: nameEl.value.trim(),
      age: ageEl.value.trim(),
      city: cityEl.value.trim(),
    });
    clearElements();
    return;
  }

  const newUser = {
    name: nameEl.value.trim(),
    age: ageEl.value.trim(),
    city: cityEl.value.trim(),
  };
  push(usersListInDB, newUser);
  clearElements();
});
function clearElements() {
  nameEl.value = "";
  ageEl.value = "";
  cityEl.value = "";
  idEl.value = "";
}

onValue(usersListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let userArray = Object.entries(snapshot.val());
    //console.log(userArray);
    tblBodyEl.innerHTML = "";
    for (let i = 0; i < userArray.length; i++) {
      let currentUser = userArray[i];
      // console.log(currentUser);
      let currentUserID = currentUser[0];
      let currentUserValue = currentUser[1];

      tblBodyEl.innerHTML += `
      <tr>
          <td>${i + 1}</td>
          <td>${currentUserValue.name}</td>
          <td>${currentUserValue.age}</td>
          <td>${currentUserValue.city}</td>
          <td>
            <button class="btn-edit"data-id="${currentUserID}">
              <ion-icon name="create-outline" ></ion-icon>
            </button>
          </td>
          <td>
            <button class="btn-delete"data-id="${currentUserID}">
              <ion-icon name="trash-outline" ></ion-icon>
            </button>
          </td>
        </tr>
        
        `;
    }
  } else {
    tblBodyEl.innerHTML = "<tr><td colspan='6'>No Record Found </td></tr>";
  }
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.dataset.id;
    const tdElements = e.target.closest("tr").children;
    idEl.value = id;
    nameEl.value = tdElements[1].textContent;
    ageEl.value = tdElements[2].textContent;
    cityEl.value = tdElements[3].textContent;
  } else if (e.target.classList.contains("btn-delete")) {
    if (confirm("Are you sure to delete")) {
      const id = e.target.dataset.id;
      let data = ref(database, `users/${id}`);
      remove(data);
    }
  }
});
