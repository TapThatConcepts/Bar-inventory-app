{\rtf1\ansi\ansicpg1252\cocoartf2818
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // IndexedDB setup\
let db;\
const request = indexedDB.open("BarInventory", 1);\
\
request.onupgradeneeded = (event) => \{\
  db = event.target.result;\
  const objectStore = db.createObjectStore("items", \{ keyPath: "id", autoIncrement: true \});\
  objectStore.createIndex("name", "name", \{ unique: false \});\
\};\
\
request.onsuccess = (event) => \{\
  db = event.target.result;\
  loadInventoryItems();\
\};\
\
request.onerror = (event) => \{\
  console.error("Database error:", event.target.errorCode);\
\};\
\
// Add Inventory Item\
document.getElementById("addItemForm").addEventListener("submit", (e) => \{\
  e.preventDefault();\
\
  const name = document.getElementById("name").value;\
  const type = document.getElementById("type").value;\
  const quantity = document.getElementById("quantity").value;\
\
  const transaction = db.transaction(["items"], "readwrite");\
  const objectStore = transaction.objectStore("items");\
\
  const newItem = \{\
    name,\
    type,\
    quantity: parseInt(quantity),\
  \};\
\
  const request = objectStore.add(newItem);\
\
  request.onsuccess = () => \{\
    document.getElementById("addItemForm").reset();\
    document.getElementById("addItemModal").style.display = "none";\
    loadInventoryItems();\
  \};\
\});\
\
// Load inventory items from IndexedDB\
function loadInventoryItems() \{\
  const transaction = db.transaction(["items"], "readonly");\
  const objectStore = transaction.objectStore("items");\
\
  const itemsList = document.getElementById("inventory-items");\
  itemsList.innerHTML = '';\
\
  objectStore.openCursor().onsuccess = (event) => \{\
    const cursor = event.target.result;\
    if (cursor) \{\
      const listItem = document.createElement("li");\
      listItem.innerHTML = `$\{cursor.value.name\} ($\{cursor.value.type\}): $\{cursor.value.quantity\}`;\
      itemsList.appendChild(listItem);\
      cursor.continue();\
    \}\
  \};\
\}\
\
// Modal Handling\
document.getElementById("add-item-btn").addEventListener("click", () => \{\
  document.getElementById("addItemModal").style.display = "flex";\
\});\
\
document.querySelector(".close-btn").addEventListener("click", () => \{\
  document.getElementById("addItemModal").style.display = "none";\
\});}