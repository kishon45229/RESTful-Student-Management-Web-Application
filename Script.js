window.onload = function () {
    showAll();
};

function showAll() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            displayAllData(jsonData);
        }
    };
    xmlhttp.open("GET", "horizonstudents.php", true);
    xmlhttp.send();
}     

function displayAllData(data) {
    var showAllStudents = document.getElementById("All-students-table");
    var students = data.students;
    var html = '<table class="table table-bordered table-hover">';

        html += '<thead class="table-dark">';
            html += '<tr>';
                html += '<th>Index No.</th>';
                html += '<th>First Name</th>';
                html += '<th>Last Name</th>';
                html += '<th>City</th>';
                html += '<th>District</th>';
                html += '<th>Province</th>';
                html += '<th>Email Address</th>';
                html += '<th>Mobile Number</th>';
            html += '</tr>';
        html += '</thead>';

        html += '<tbody>';
            for (var i = 0; i < students.length; i++) {
                var student = students[i];
                html += '<tr>';
                    html += '<td>' + student["Index No."] + '</td>';
                    html += '<td>' + student["First Name"] + '</td>';
                    html += '<td>' + student["Last Name"] + '</td>';
                    html += '<td>' + student["City"] + '</td>';
                    html += '<td>' + student["District"] + '</td>';
                    html += '<td>' + student["Province"] + '</td>';
                    html += '<td>' + student["Email Address"] + '</td>';
                    html += '<td>' + student["Mobile Number"] + '</td>';
                html += '</tr>';
            }
        html += '</tbody>';
    html += '</table>';

    showAllStudents.innerHTML = html;
}

function searchStudent() {
    var searchInput = document.getElementById("searchInput").value; 

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            displaySearchData(jsonData);
        }
    };
    xmlhttp.open("GET", "horizonstudents.php?index_no=" + searchInput, true);
    xmlhttp.send();
}

function displaySearchData(data) {
    var showSearchedStudents = document.getElementById("Searched-student-data");

    if (data && data.student) {
        var student = data.student;

        var html = '<ul class="list-group">';
        html += '<li class="list-group-item"><strong>Index No:</strong> ' + student["Index No."] + '</li>';
        html += '<li class="list-group-item"><strong>First Name:</strong> ' + student["First Name"] + '</li>';
        html += '<li class="list-group-item"><strong>Last Name:</strong> ' + student["Last Name"] + '</li>';
        html += '<li class="list-group-item"><strong>City:</strong> ' + student["City"] + '</li>';
        html += '<li class="list-group-item"><strong>District:</strong> ' + student["District"] + '</li>';
        html += '<li class="list-group-item"><strong>Province:</strong> ' + student["Province"] + '</li>';
        html += '<li class="list-group-item"><strong>Email Address:</strong> ' + student["Email Address"] + '</li>';
        html += '<li class="list-group-item"><strong>Mobile Number:</strong> ' + student["Mobile Number"] + '</li>';
        html += '</ul>';

        showSearchedStudents.innerHTML = html;
    } 
    else {
        showSearchedStudents.innerHTML = '<p>No student found with the provided Index No.</p>';
    }
}

function insertStudent() {
    function validateForm() {
        var firstName = document.getElementById("nFirst Name").value;
        var lastName = document.getElementById("nLast Name").value;
        var city = document.getElementById("nCity").value;
        var district = document.getElementById("nDistrict").value;
        var province = document.getElementById("nProvince").value;
        var email = document.getElementById("nEmail Address").value;
        var mobileNumber = document.getElementById("nMobile Number").value;

        if (firstName === "" || lastName === "" || city === "" || district === "" || province === "") {
            alert("All fields must be filled out");
            return false;
        }

        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            alert("Invalid email address");
            return false;
        }

        var mobilePattern = /^\d{10}$/;
        if (!mobileNumber.match(mobilePattern)) {
            alert("Invalid mobile number (10 digits expected)");
            return false;
        }

        return true;
    }

    if (validateForm()) {
        var formData = {
            "First Name": document.getElementById("nFirst Name").value,
            "Last Name": document.getElementById("nLast Name").value,
            "City": document.getElementById("nCity").value,
            "District": document.getElementById("nDistrict").value,
            "Province": document.getElementById("nProvince").value,
            "Email Address": document.getElementById("nEmail Address").value,
            "Mobile Number": document.getElementById("nMobile Number").value
        };

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 201) {
                    alert("New student added successfully");
                    showAll();
                } 
                else {
                    alert("Failed to add new student");
                }
            }
        };

        xmlhttp.open("POST", "horizonstudents.php", true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(formData));
    }
}

function searchSelectedStudent() {
    var selectedInput = document.getElementById("select-student-input").value; 

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var jsonData = JSON.parse(this.responseText);
            fillSelectedStudentData(jsonData);
        }
    };
    xmlhttp.open("GET", "horizonstudents.php?index_no=" + selectedInput, true);
    xmlhttp.send();
}

function fillSelectedStudentData(data) {
    var form = document.getElementById("updateStudentForm");
    var student = data.student;

    if (form) {
        form["uFirst Name"].value = student["First Name"];
        form["uLast Name"].value = student["Last Name"];
        form["uCity"].value = student["City"];
        form["uDistrict"].value = student["District"];
        form["uProvince"].value = student["Province"];
        form["uEmail Address"].value = student["Email Address"];
        form["uMobile Number"].value = student["Mobile Number"];
    } 
    else {
        console.log("Form not found.");
    }
}

function updateStudent() {
    function validateForm() {
        var firstName = document.getElementById("uFirst Name").value;
        var lastName = document.getElementById("uLast Name").value;
        var city = document.getElementById("uCity").value;
        var district = document.getElementById("uDistrict").value;
        var province = document.getElementById("uProvince").value;
        var email = document.getElementById("uEmail Address").value;
        var mobileNumber = document.getElementById("uMobile Number").value;

        if (firstName === "" || lastName === "" || city === "" || district === "" || province === "") {
            alert("All fields must be filled out");
            return false;
        }

        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!email.match(emailPattern)) {
            alert("Invalid email address");
            return false;
        }

        var mobilePattern = /^\d{10}$/;
        if (!mobileNumber.match(mobilePattern)) {
            alert("Invalid mobile number (10 digits expected)");
            return false;
        }

        return true;
    }

    if (validateForm()) {
        var formData = {
            "First Name": document.getElementById("uFirst Name").value,
            "Last Name": document.getElementById("uLast Name").value,
            "City": document.getElementById("uCity").value,
            "District": document.getElementById("uDistrict").value,
            "Province": document.getElementById("uProvince").value,
            "Email Address": document.getElementById("uEmail Address").value,
            "Mobile Number": document.getElementById("uMobile Number").value
        };
        
        var selectedInput = document.getElementById("select-student-input").value; 
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    alert("Student with index no " + selectedInput + " has been updated.");
                    showAll();
                } 
                else {
                    alert("Error: Unable to update the student details");
                }
            }
        };

        xmlhttp.open("PUT", "horizonstudents.php?index_no=" + selectedInput, true);
        xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xmlhttp.send(JSON.stringify(formData));
    }
}

function deleteStudent() {
    var deleteIndexNo = document.getElementById("deleteInput").value;

    if (deleteIndexNo === "") {
        alert("Please enter an Index No.");
        return;
    }

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                alert("Student with index no " + deleteIndexNo + " has been removed.");
                showAll();
            } 
            else {
                alert("Error: Unable to detele the student.");
            }
        }
    };

    xmlhttp.open("DELETE", "horizonstudents.php?index_no=" + deleteIndexNo, true);
    xmlhttp.send();
}  

function toggleAddStudentForm() {
    var formContainer = document.getElementById("AddStudentFormContainer");
    var addButton = document.getElementById("addStudentButton");

    if (formContainer.innerHTML === "") {
        loadAddStudentForm();
        addButton.textContent = "Hide Form";
    } 
    else {
        formContainer.innerHTML = "";
        addButton.textContent = "Add New Student";
    }
}

function loadAddStudentForm() {
    var formContainer = document.getElementById("AddStudentFormContainer");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            formContainer.innerHTML = xhr.responseText;
        }
    };

    xhr.open("GET", "AddStudentForm.html", true);
    xhr.send();
}

function toggleEditStudentForm() {
    var formContainer = document.getElementById("EditStudentFormContainer");
    var editButton = document.getElementById("editStudentButton");

    if (formContainer.innerHTML === "") {
        loadEditStudentForm();
        editButton.textContent = "Hide Form";
    } 
    else {
        formContainer.innerHTML = "";
        editButton.textContent = "Edit Student Details";
    }
}

function loadEditStudentForm() {
    var formContainer = document.getElementById("EditStudentFormContainer");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            formContainer.innerHTML = xhr.responseText;
        }
    };

    xhr.open("GET", "EditStudentForm.html", true);
    xhr.send();
}

function toggleDeleteStudentForm() {
    var deleteContainer = document.getElementById("DeleteStudentContainer");
    var deleteButton = document.getElementById("deleteStudentButton");

    if (deleteContainer.innerHTML === "") {
        loadDeleteStudentSection();
        deleteButton.textContent = "Hide";
    } 
    else {
        deleteContainer.innerHTML = "";
        deleteButton.textContent = "Delete Student";
    }
}

function loadDeleteStudentSection() {
    var deleteContainer = document.getElementById("DeleteStudentContainer");
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            deleteContainer.innerHTML = xhr.responseText;
        }
    };

    xhr.open("GET", "DeleteStudent.html", true);
    xhr.send();
}