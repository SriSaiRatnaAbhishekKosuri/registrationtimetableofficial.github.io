//Array to store the data for local storage
var saveData = [];

saveData = JSON.parse(localStorage.getItem('saveData'));

// Get the submit button element
const submitBtn = document.querySelector('#submit-btn');
submitBtn.addEventListener('click', handleSubmit);

// Array to store lab unblocked slots
var unBlockedLabSlots = [];

// Array to store blocked colors
const blockedColors = [];

// Array to store lab blocked slots
var blockedLabSlots = [];

// Add event listener to the delete button
const deleteBtn = document.querySelector('#delete-btn');
deleteBtn.addEventListener('click', handleDelete);

// Get the values from the form
const theorySlotInput = document.getElementById('theory');
const labSlotInput = document.getElementById('lab');
const courseNameInput = document.getElementById('course-name');
const courseCodeInput = document.getElementById('course-code');

var deleteCount = 0;

//Deleting the selected slot cell
function handleDelete() {
  // Remove the event listener from the delete button
  deleteBtn.removeEventListener('click', handleDelete);
  
  // Get the values from the form inputs
  const courseName = courseNameInput.value.toUpperCase();
  const courseCode = courseCodeInput.value.toUpperCase();
  
  deleteCount ++;

  if(!courseName || !courseCode) {
    alert("Please select both course name and course code");
    return;
  }
  // Remove the event listener from the submit button
  submitBtn.removeEventListener('click', handleSubmit);

  // Clear the form inputs
  theorySlotInput.value = '';
  courseNameInput.value = '';
  courseCodeInput.value = '';
  labSlotInput.value = '';
  var ts;
  var ls;
  
  // Remove the corresponding row from myTable
  var myTable = document.getElementById("myTable");
  var tbody = myTable.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");
  var count = 0;
  
  for (var j = 0; j < rows.length; j++) {
    var cells = rows[j].getElementsByTagName('td');
    if ((courseCode && cells[0].textContent == courseCode) || (courseName && cells[1].textContent == courseName)) {
      ts = cells[2].innerHTML;
      ls = cells[3].innerHTML;
      tbody.deleteRow(j);
      count++;
      break;
    }
  }
  
  if (count === 0) {
    alert("Please check your entries.");
    return;
  }

  var nts = ts.split('+');
  var nls = ls.split("+");


  // Remove the blocked class and reset the background color of matching cells in mySlotTable
  var mySlotTable = document.getElementById("mySlotTable");
  var mySlotRows = mySlotTable.getElementsByTagName('tr');
  for (var j = 0; j < mySlotRows.length; j++) {
    var cells = mySlotRows[j].getElementsByTagName('td');
    for (var k = 0; k < cells.length; k++) {
      if (cells[k].className.includes(nts[0])) {
        cells[k].style.backgroundColor = '#fff';
        cells[k].classList.remove('blocked');
      }
    }
  }

  // Reset the content and background color of matching cells in the tableContainer
  var mainTable = document.getElementById('tableContainer');
  var mainRows = mainTable.getElementsByTagName('tr');
  for (var i = 0; i < nts.length; i++) {
    var theorySlot = ` ${nts[i]}`;

    for (var j = 0; j < mainRows.length; j++) {
      var cells = mainRows[j].getElementsByTagName('td');
      for (var k = 0; k < cells.length; k++) {
        if (cells[k].className.includes(`${nts[i]}`)) {
          cells[k].style.backgroundColor = '#fff';
          cells[k].classList.remove('blocked');
          cells[k].textContent = "";
          if (j + 1 < mainRows.length) {
            var nextRowCells = mainRows[j + 1].getElementsByTagName("td");
            nextRowCells[k].classList.remove("blocked");
            if (k % 2 == 0) {
              nextRowCells[k + 1].classList.remove("blocked");
              textContent = parseInt(nextRowCells[k + 1].textContent.slice(1, 3));
              textContent -= 1;
              if (textContent < 10) {
                unBlockedLabSlots.push(`L0${textContent}`);
              } else {
                unBlockedLabSlots.push(`L${textContent}`);
              }
            } else {
              nextRowCells[k - 1].classList.remove("blocked");
              textContent = nextRowCells[k - 1].textContent.slice(0, 3);
              unBlockedLabSlots.push(textContent);
            }
          }
        }
        if (j % 2 == 1 && cells[k].classList.contains(nls[0])) {
            cells[k].textContent = "";
            unBlockedLabSlots.push(nls[0]);
          cells[k].style.backgroundColor = '#fff';
          cells[k].classList.remove("blocked");
        } 
        else if (j % 2 == 0 && cells[k].classList.contains(nls[0])) {
          cells[k].classList.remove("blocked");
        }
      }
    }
  }


  // Iterate through lab selector options and hide matching blocked lab slots
  var labSelector = document.getElementById("lab");
  var labOptions = labSelector.querySelectorAll("option");

  for (var i = 0; i < labOptions.length; i++) {
    var optionValue = labOptions[i].value.slice(0, 3);
    if (unBlockedLabSlots.includes(optionValue)) {
      labOptions[i].disabled= false;
    }
  }

  let ns = nts[0].slice(-2);

  var select = document.getElementById("theory");
  var options = select.querySelectorAll("option");

  for (var i = 0; i < options.length; i++) {
    var optionValue = options[i].value.slice(-2);
    if (optionValue === ns) {
      options[i].disabled= false;
    }
  }

  // Remove the object from saveData array
  saveData = saveData.filter(obj => !(obj.courseCode === courseCode || obj.courseName === courseName));
  saveToLocalStorage();


  // Enable the submit button again
  submitBtn.addEventListener('click', handleSubmit);

  // Reloads the current page
  location.reload();

}

// Function to validate the form inputs
function validateForm(courseCode, courseName, ts, labSlot) {
  var nts = ts.split('+');

  if (!labSlot || !ts) {
    alert("Please fill out theory and lab field.");
    return false;
  }

  var nls = labSlot.slice(0,3);
  // Get myTable body
  var myTable = document.getElementById("myTable");
  var tbody = myTable.getElementsByTagName("tbody")[0];

  // Check if the course code already exists in the table
  var rows = tbody.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    if (rows[i].getElementsByTagName("td")[0].innerHTML == courseCode || rows[i].getElementsByTagName("td")[2].innerHTML == ts) {
      // Course code already exists in the table, activate the reset button and return
      alert("This Slot or Course is already blocked. Please check your entries");
      return false;
    }
  }

  // Get main TimeTable body
  var mainTable = document.getElementById("tableContainer");
  if (!mainTable) {
    console.error("Table container not found.");
    return false;
  }

  var mainBody = mainTable.getElementsByTagName("tbody")[0];
  if (!mainBody) {
    console.error("Table body not found.");
    return false;
  }
  
  // Get all the table cells that correspond to the selected slot
  var labCells = mainBody.querySelectorAll(`td[class*=" ${nls}"]`);
  
  // Check if any of the matching cells are already blocked
  let isBlocked = false;
  var counting = 0;
  Array.from(labCells).forEach(labCell => {
    if (labCell.classList.contains("blocked")) {
      isBlocked = true;
      counting ++;
    }
  });
  
  if(!(counting == 0)){
    alert("This lab slot is Crashing.");
    return false;
  }

  // Return if any of the cells are blocked
  if (isBlocked) {
    return false;
  }
  
  for (var l = 0; l < nts.length; l++) {
    var theorySlot = nts[l];
    var theoryCells = mainBody.querySelectorAll(`td[class*=" ${theorySlot}"]`);
    
    // Reset the "isBlocked" variable
    isBlocked = false;
    
    // Check if any of the matching cells are already blocked
    Array.from(theoryCells).forEach(theoryCell => {
      if (theoryCell.classList.contains("blocked")) {
        isBlocked = true;
        alert("This theory slot is Crashing.");
        return false;
      }
    });

    // Return if any of the cells are blocked
    if (isBlocked) {
      return false;
    }
  }
  return true;
}

// Function to handle form submission
function handleSubmit(event) {
  event.preventDefault(); // Prevent the form from submitting

  // Add event listener to the delete button
  const deleteBtn = document.querySelector('#delete-btn');
  deleteBtn.addEventListener('click', handleDelete);

  if(deleteCount !== 0) {
    deleteCount = 0;
    return;
  }
  // Get the values from the form inputs
  const ts = theorySlotInput.value.toUpperCase();
  const courseName = courseNameInput.value.toUpperCase();
  const courseCode = courseCodeInput.value.toUpperCase();
  const labSlot = labSlotInput.value.toUpperCase();

  // Validate the form inputs
  if (!validateForm(courseCode, courseName, ts, labSlot)) {
    alert("Please check your entries!");
    return;
  }


  var localSaveData = JSON.stringify(saveData);
  localStorage.setItem('saveData', localSaveData);
  
  addSaveDataObject(courseCode, courseName, ts, labSlot);
  saveToLocalStorage();

  var color = getUniqueColor();

  insertMainTables(courseCode, courseName, ts, labSlot, color);

  insertMyTables(courseCode, courseName, ts, labSlot);

  insertMySlots(courseCode, courseName, ts, labSlot, color);

  // Clear the form inputs
  theorySlotInput.value = '';
  courseNameInput.value = '';
  courseCodeInput.value = '';
  labSlotInput.value = '';
}

// Function to check if a name for obj to store saveData array in is already used
function isNameUsed(name) {
  return saveData !== null && saveData.some(obj => obj.name === name);
}

// Function to add a new saveData object
function addSaveDataObject(courseCode, courseName, theorySlots, labSlots) {
  if (saveData === null) {
    saveData = []; // Initialize saveData as an empty array if it is null
  }

  var obj = {
    courseCode: courseCode,
    courseName: courseName,
    theorySlots: theorySlots,
    labSlots: labSlots
  };

  var name = '';
  var index = 1; 
  
  // Generate a unique name for the object
  do {
    name = index.toString();
    index++;
  } while (isNameUsed(name));

  obj.name = name;

  // Add the object to the saveData array
  saveData.push(obj);
}


function saveToLocalStorage() {
  localStorage.setItem('saveData', JSON.stringify(saveData));
}

// Function to load data from local storage
function loadDataFromLocalStorage() {
  if (saveData) {
    console.log(typeof(saveData));
    // Code to populate the tables with the loaded data
    for (var i = 0; i < saveData.length; i++) {
      var color = getUniqueColor();
      var entry = saveData[i];
      insertMainTables(entry.courseCode, entry.courseName, entry.theorySlots, entry.labSlots, color);
      insertMyTables(entry.courseCode, entry.courseName, entry.theorySlots, entry.labSlots);
      insertMySlots(entry.courseCode, entry.courseName, entry.theorySlots, entry.labSlots, color);
    }
  }
}

function hideLabSlots() {
  // Iterate through lab selector options and hide matching blocked lab slots
  var labSelector = document.getElementById("lab");
  var labOptions = labSelector.querySelectorAll("option");

  for (var i = 0; i < labOptions.length; i++) {
    var optionValue = labOptions[i].value.slice(0, 3);
    if (blockedLabSlots.includes(optionValue)) {
      labOptions[i].disabled= true;
    }
  }
}

function hideTheorySlots(ts) {
  var ns = ts.slice(-2);

  var select = document.getElementById("theory");
  var options = select.querySelectorAll("option");

  for (var i = 0; i < options.length; i++) {
    var optionValue = options[i].value.slice(-2);
    if (optionValue === ns) {
      options[i].disabled= true;
    }
  }

}

function insertMainTables(courseCode, courseName, ts, labSlot, color) {
  var nls = labSlot.split("+");
  var nts = ts.split("+");

  // Get main TimeTable body
  var mainTable = document.getElementById("tableContainer");
  var mainBody = mainTable.getElementsByTagName("tbody")[0];

  // Get all the table cells that correspond to the selected slot
  var labCells = mainBody.querySelectorAll(`td[class*=" ${nls[0]}"]`);
  // Set the text content and background color for all matching lab cells
  var tableRows = mainBody.getElementsByTagName("tr");

  for (var i = 0; i < tableRows.length; i++) {
    var LabCells = tableRows[i].getElementsByTagName("td");
    for (var j = 0; j < LabCells.length; j++) {
      if (i % 2 == 1 && LabCells[j].classList.contains(nls[0])) {
        LabCells[j].textContent = `LAB <br> ${courseName}\n${courseCode}`
        LabCells[j].style.backgroundColor = color;
      }
    }
  }

  Array.from(labCells).forEach(labCell => {
    labCell.classList.add("blocked");
  });

  for (var l = 0; l < nts.length; l++) {
    var theorySlot = nts[l];

    var textContent;
    // Set the text content and background color for all matching theory cells
    for (var i = 0; i < tableRows.length; i++) {
      var Cells = tableRows[i].getElementsByTagName("td");
      for (var j = 0; j < Cells.length; j++) {
        if (Cells[j].classList.contains(theorySlot)) {
          Cells[j].textContent = `${courseName}\n${courseCode}`;
          Cells[j].style.backgroundColor = color;
          Cells[j].classList.add("blocked");

          if (i + 1 < tableRows.length) {
            var nextRowCells = tableRows[i + 1].getElementsByTagName("td");
            nextRowCells[j].classList.add("blocked");
            textContent = nextRowCells[j].textContent.slice(0, 3);
            blockedLabSlots.push(textContent);
            if (j % 2 == 0) {
              nextRowCells[j + 1].classList.add("blocked");
              textContent = nextRowCells[j + 1].textContent.slice(0, 3);
              blockedLabSlots.push(textContent);
            } else {
              nextRowCells[j - 1].classList.add("blocked");
              textContent = nextRowCells[j - 1].textContent.slice(0, 3);
              blockedLabSlots.push(textContent);
            }
          }
        }
      }
    }
  }
  
  blockedLabSlots.push(nls[0]);
  
  hideLabSlots();
  
  hideTheorySlots(ts);
}

function insertMyTables(courseCode, courseName, ts, labSlot) {
  // Get myTable body
  var myTable = document.getElementById("myTable");
  var tbody = myTable.getElementsByTagName("tbody")[0];

  //Get credits-container table
  var creditsContainer = document.getElementById("credits-container");
  var cBody = creditsContainer.getElementsByTagName("tbody")[0];
  var cRows =cBody.getElementsByTagName("tr");

   // Create new row and cells
   var row = tbody.insertRow();
   var cell1 = row.insertCell(0);
   var cell2 = row.insertCell(1);
   var cell3 = row.insertCell(2);
   var cell4 = row.insertCell(3);
   var cell5 = row.insertCell(4);
   cell5.classList.add("cell5");
   
   // Set cell values
   cell1.innerHTML = courseCode;
   cell2.innerHTML = courseName;
   cell3.innerHTML = ts;
   cell4.innerHTML = labSlot;
   
   for(var i=0; i<cRows.length; i++) {
     var cCells = cRows[i].getElementsByTagName("td");
     for(var j=0; j<cCells.length; j++) {
       if(j == 0 && cCells[j].textContent === courseCode) cell5.innerHTML = "0";
       else if(j ==1 && cCells[j].textContent === courseCode) cell5.innerHTML = "1";
       else if(j ==2 && cCells[j].textContent === courseCode) cell5.innerHTML = "2";
       else if(j ==3 && cCells[j].textContent === courseCode) cell5.innerHTML = "3";
       else if(j ==4 && cCells[j].textContent === courseCode) cell5.innerHTML = "4";
       else if(j ==6 && cCells[j].textContent === courseCode) cell5.innerHTML = "6";
       else if(j ==10 && cCells[j].textContent === courseCode) cell5.innerHTML = "10";
       else if(courseCode.slice(0,3) == "STS") cell5.innerHTML = "1";
     }
   }
 
   cell5.addEventListener('click', function() {
     var newText = prompt("Enter new credit:");
     if (newText !== null) {
       this.textContent = newText;
       totalCredit();
     }
   });
 
   // Calculate and display total
   totalCredit();
}

function insertMySlots(courseCode, courseName, ts, labSlot, color) {
  var ns = ts.slice(-2);

  // Get mySlotTable body
  var mySlotTable = document.getElementById("mySlotTable");
  var slotBody = mySlotTable.getElementsByTagName("tbody")[0];

  // Get all the cells that correspond to the selected slot
  const slotCells = slotBody.querySelectorAll(`td[class="${ns}"]`);

  // Change the background color for all matching cells that are not blocked
  slotCells.forEach(slotCell => {
    if (!slotCell.classList.contains("blocked")) {
      slotCell.style.backgroundColor = color;
      slotCell.classList.add("blocked");
    }
  });

  hideTheorySlots(ts);
}

function totalCredit() {
  // Get myTable body
  var myTable = document.getElementById("myTable");
  var tbody = myTable.getElementsByTagName("tbody")[0];
  var rows = tbody.getElementsByTagName("tr");

  // Calculate and display total
  var total = 0;
  for (var i = 0; i < rows.length; i++) {
    var rowCells = rows[i].cells;
    total += parseInt(rowCells[rowCells.length - 1].textContent);
  }
  document.getElementById("total").textContent = total;
}

// Add an event listener to the submit button
submitBtn.addEventListener("click", handleSubmit);

// Function to generate a unique color (bright and attractive)
function getUniqueColor() {
  const saturation = '80%'; // Set the desired saturation
  const lightness = '50%'; // Set the desired lightness

  let hue = Math.floor(Math.random() * 360); // Generate a random hue between 0 and 360

  // Convert the HSL color to RGB format
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s = parseFloat(s) / 100;
    l = parseFloat(l) / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // Achromatic
    } else {
      const hueToRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hueToRgb(p, q, h + 1 / 3);
      g = hueToRgb(p, q, h);
      b = hueToRgb(p, q, h - 1 / 3);
    }

    const toHex = (c) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  let color;
  do {
    color = hslToRgb(hue, saturation, lightness);
    hue = (hue + 72) % 360; // Increase the hue by 72 degrees for the next iteration
  } while (colorExists(color)); // Check if the color already exists in blockedColors

  // Store the generated color in blockedColors
  blockedColors.push(color);

  return color;
}

// Function to check if the color already exists in blockedColors
function colorExists(color) {
  return blockedColors.includes(color);
}

// Add event listener to the form
document.getElementById("course-form").addEventListener("submit", handleSubmit);

// Populate timetable with saved data on page load
window.onload = function() {
  // Check if timetable data exists in local storage
  if (localStorage.getItem('saveData')) {
    // Call the function to load data from local storage
    loadDataFromLocalStorage();
  }
};
