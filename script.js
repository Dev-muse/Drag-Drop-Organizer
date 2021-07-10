const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items

updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  arrayNames.forEach((name, index) => {
    return localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item

function createItemEl(columnEl, column, item, index) {
  // List Item

  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = "true";
  // to determine which item in column list to be targeted
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);

  // Append to Dom element
  columnEl.appendChild(listEl);
}

// ==========================================================================

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage

function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column

  backlogList.textContent = "";

  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });

  backlogListArray = filterArray(backlogListArray);

  // Progress Column

  progressList.textContent = "";

  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });

  progressListArray = filterArray(progressListArray);

  // Complete Column

  completeList.textContent = "";

  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });

  completeListArray = filterArray(completeListArray);

  // On Hold Column

  onHoldList.textContent = "";

  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });

  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns() only once, also Update Local Storage with updateSavedColumns() everytime
  updatedOnLoad = true;

  updateSavedColumns();
}

// ================================================================

// Update Item  - Delete if blank , or update if different from stored value

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    // only runs when item is not being dragged
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }

    updateDOM();
  }
}

// Add text input to column
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  //reset textbox
  addItems[column].textContent = "";
  //Update DOM
  updateDOM();
}

// Show input box when "add item" is clicked:

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// Hide input box when save is clicked and call addToColumn() to update list:
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// Allows Arrays to reflect drag & drop items on HTML

function rebuildArrays() {
  // Empty each array before pushing items on to avoid list duplication;

  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }

  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }

  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }

  // update DOM after to rebuild everything
  updateDOM();
}

// Drag function - when item is dragged

function drag(event) {
  draggedItem = event.target;
  dragging = true;
}

// Column enables item to drop

function allowDrop(event) {
  event.preventDefault();
}

// When item enters column drop area "over" class styling applied

function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

// Dropping item into column:

function drop(event) {
  event.preventDefault();

  // Remove .add class styling when dropped
  listColumns.forEach((column) => column.classList.remove("over"));

  // Add item from one column to next
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);

  //dragging item done
  dragging = false;

  rebuildArrays();
}

// On Load

updateDOM();
