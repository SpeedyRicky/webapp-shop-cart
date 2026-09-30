import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shoppingcart-c38dc-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)

const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    const inputValue = inputFieldEl.value.trim()

    if (inputValue) {
        push(shoppingListInDB, inputValue)
        inputFieldEl.value = ""
    }
})

onValue(shoppingListInDB, function(snapshot) {
    shoppingListEl.innerHTML = ""

    const items = snapshot.val()

    if (!items) {
        return
    }

    Object.entries(items).forEach(function([itemId, item]) {

        const itemButton = document.createElement("button")
        itemButton.textContent = item

        let holdTimer
        let holdStart

        function startHold(event) {
            event.preventDefault()

            holdStart = Date.now()

            itemButton.style.transition = "background-color 1.9s linear"
            itemButton.style.backgroundColor = "#AC485A"

            holdTimer = setTimeout(function() {

                const itemRef = ref(
                    database,
                    "shoppingList/" + itemId
                )

                remove(itemRef)
                    .then(function() {
                        console.log(item + " deleted")
                    })
                    .catch(function(error) {
                        console.error("Delete failed:", error)
                    })

            }, 1500)
        }

        function cancelHold() {
            clearTimeout(holdTimer)

            itemButton.style.transition = "background-color 0.2s"
            itemButton.style.backgroundColor = "#DCE1EB"
        }

        itemButton.addEventListener("mousedown", startHold)
        itemButton.addEventListener("mouseup", cancelHold)
        itemButton.addEventListener("mouseleave", cancelHold)

        itemButton.addEventListener("touchstart", startHold, { passive: false })
        itemButton.addEventListener("touchend", cancelHold)
        itemButton.addEventListener("touchcancel", cancelHold)

        shoppingListEl.appendChild(itemButton)
    })
})