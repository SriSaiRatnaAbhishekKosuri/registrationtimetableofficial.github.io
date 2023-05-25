document.getElementById('searchButton').addEventListener('click', function (event) {
  event.preventDefault(); // Prevent form submission

  var courseCode = document.getElementById('courseCode').value.trim().toUpperCase();
  var courseName = document.getElementById('courseName').value.trim().toLowerCase(); // Convert to lowercase
  var category = document.getElementById('category').value.trim().toUpperCase();
  var credits = document.getElementById('credits').value.trim();

  var table = document.querySelector('table');
  var tbody = table.querySelector('tbody');
  var rows = tbody.getElementsByTagName('tr');

  // Show all rows initially
  for (var i = 0; i < rows.length; i++) {
    rows[i].style.display = 'table-row';
  }

  // Filter rows based on entered inputs
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var code = row.cells[0].innerText.toUpperCase();
    var name = row.cells[1].innerText.toLowerCase(); // Convert to lowercase
    var credit = row.cells[2].innerText;
    var categoryText = row.cells[3].innerText.toUpperCase();

    var isCourseCodeMatch = courseCode && code.includes(courseCode);
    var isCourseNameMatch = courseName && name.includes(courseName);
    var isCreditsMatch = credits && credit.includes(credits);
    var isCategoryMatch = category && categoryText.includes(category);

    var count = 0;

    if (courseCode) count++;
    if (courseName) count++;
    if (credits) count++;
    if (category) count++;

    // Hide the row if it doesn't match any entered input
    if (
      (count === 1 && (isCourseCodeMatch || isCreditsMatch || isCategoryMatch || isCourseNameMatch)) ||
      (count === 2 && ((isCourseCodeMatch && isCourseNameMatch) || (isCourseCodeMatch && isCreditsMatch) || (isCourseCodeMatch && isCategoryMatch) || (isCourseNameMatch && isCreditsMatch) || (isCourseNameMatch && isCategoryMatch) || (isCreditsMatch && isCategoryMatch))) ||
      (count === 3 && ((isCourseCodeMatch && isCourseNameMatch && isCreditsMatch) || (isCourseCodeMatch && isCourseNameMatch && isCategoryMatch) || (isCourseNameMatch && isCreditsMatch && isCategoryMatch) || (isCourseCodeMatch && isCreditsMatch && isCategoryMatch))) ||
      (count === 4 && (isCourseCodeMatch && isCreditsMatch && isCategoryMatch && isCourseNameMatch))
    ) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  }

  // Show/hide the tbody based on matching rows
  if (tbody.querySelectorAll('tr[style="display: table-row;"]').length > 0) {
    tbody.classList.add('show');
  } else {
    tbody.classList.remove('show');
  }
});


// Autocomplete functionality
function filterRows(rows) {
  var courseCodeInput = document.getElementById('courseCode');
  var courseNameInput = document.getElementById('courseName');
  var categoryInput = document.getElementById('category');
  var creditsInput = document.getElementById('credits');

  var searchTextCode = courseCodeInput.value.trim().toUpperCase();
  var searchTextName = courseNameInput.value.trim().toLowerCase(); // Convert to lowercase
  var searchTextCategory = categoryInput.value.trim().toUpperCase();
  var searchTextCredits = creditsInput.value.trim();

  // Filter rows based on entered code
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var code = row.cells[0].innerText.toUpperCase();
    var name = row.cells[1].innerText.toLowerCase(); // Convert to lowercase
    var credit = row.cells[2].innerText;
    var categoryText = row.cells[3].innerText.toUpperCase();

    var displayRow =
      (searchTextCode && code.includes(searchTextCode)) ||
      (searchTextName && name.includes(searchTextName)) ||
      (searchTextCredits && credit.includes(searchTextCredits)) ||
      (searchTextCategory && categoryText.includes(searchTextCategory));

    row.style.display = displayRow ? 'table-row' : 'none';
  }
}

var table = document.querySelector('table');
var tbody = table.querySelector('tbody');
var rows = tbody.getElementsByTagName('tr');

var courseCodeInput = document.getElementById('courseCode');
var courseNameInput = document.getElementById('courseName');
var categoryInput = document.getElementById('category');
var creditsInput = document.getElementById('credits');

courseCodeInput.addEventListener('input', function () {
  filterRows(rows);
});

courseNameInput.addEventListener('input', function () {
  filterRows(rows);
});

categoryInput.addEventListener('input', function () {
  filterRows(rows);
});

creditsInput.addEventListener('input', function () {
  filterRows(rows);
});
