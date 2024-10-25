<?php
    class StudentAPI {
        private $conn;

        public function __construct($dbhost, $dbname, $dbuser, $dbpass) {
            try {
                $this->conn = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } 
            catch (PDOException $e) {
                die("Connection failed: " . $e->getMessage());
            }
        }

        public function getStudent($index_no) {
            $stmt = $this->conn->prepare("SELECT * FROM horizonstudents WHERE `Index No.` = :IndexNo");
            $stmt->bindParam(':IndexNo', $index_no);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                echo json_encode(array("student" => $result));
            } 
            else {
                http_response_code(404);
                echo json_encode(array("message" => "Student not found"));
            }
        }

        public function getAllStudents() {
            $stmt = $this->conn->query("SELECT * FROM horizonstudents");
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode(array("students" => $students));
        }

        public function createStudent($data) {
            if (
                !empty($data['First Name']) && !empty($data['Last Name']) &&
                !empty($data['City']) && !empty($data['District']) &&
                !empty($data['Province']) && !empty($data['Email Address']) &&
                !empty($data['Mobile Number'])) {
                
                $emailExists = $this->isEmailExists($data['Email Address']);
                $mobileExists = $this->isMobileExists($data['Mobile Number']);
    
                if ($emailExists) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Email address already exists"));
                } 
                elseif ($mobileExists) {
                    http_response_code(400);
                    echo json_encode(array("message" => "Mobile number already exists"));
                } 
                else {
                    $stmt = $this->conn->prepare("INSERT INTO horizonstudents (`First Name`, `Last Name`, `City`, `District`, `Province`, `Email Address`, `Mobile Number`) 
                                                  VALUES (:FirstName, :LastName, :City, :District, :Province, :EmailAddress, :MobileNumber)");
    
                    $stmt->bindParam(':FirstName', $data['First Name']);
                    $stmt->bindParam(':LastName', $data['Last Name']);
                    $stmt->bindParam(':City', $data['City']);
                    $stmt->bindParam(':District', $data['District']);
                    $stmt->bindParam(':Province', $data['Province']);
                    $stmt->bindParam(':EmailAddress', $data['Email Address']);
                    $stmt->bindParam(':MobileNumber', $data['Mobile Number']);
    
                    if ($stmt->execute()) {
                        http_response_code(201);
                        echo json_encode(array("message" => "Student created successfully"));
                    } 
                    else {
                        http_response_code(500);
                        echo json_encode(array("message" => "Failed to create student"));
                    }
                }
            } 
            else {
                http_response_code(400);
                echo json_encode(array("message" => "Missing required fields"));
            }
        }

        private function isEmailExists($email) {
            $stmt = $this->conn->prepare("SELECT 1 FROM horizonstudents WHERE `Email Address` = :EmailAddress");
            $stmt->bindParam(':EmailAddress', $email);
            $stmt->execute();

            return $stmt->fetchColumn() > 0;
        }
    
        private function isMobileExists($mobile) {
            $stmt = $this->conn->prepare("SELECT 1 FROM horizonstudents WHERE `Mobile Number` = :MobileNumber");
            $stmt->bindParam(':MobileNumber', $mobile);
            $stmt->execute();
            
            return $stmt->fetchColumn() > 0;
        }

        public function updateStudent($index_no, $data) {
            $stmt = $this->conn->prepare("UPDATE horizonstudents 
                                          SET `First Name` = :FirstName, `Last Name` = :LastName, `City` = :City, `District` = :District, `Province` = :Province, `Email Address` = :EmailAddress, `Mobile Number` = :MobileNumber 
                                          WHERE `Index No.` = :IndexNo");

            $stmt->bindParam(':FirstName', $data['First Name']);
            $stmt->bindParam(':LastName', $data['Last Name']);
            $stmt->bindParam(':City', $data['City']);
            $stmt->bindParam(':District', $data['District']);
            $stmt->bindParam(':Province', $data['Province']);
            $stmt->bindParam(':EmailAddress', $data['Email Address']);
            $stmt->bindParam(':MobileNumber', $data['Mobile Number']);
            $stmt->bindParam(':IndexNo', $index_no);

            if ($stmt->execute()) {
                echo json_encode(array("message" => "Student updated successfully"));
            } 
            else {
                http_response_code(500);
                echo json_encode(array("message" => "Failed to update student"));
            }
        }

        public function deleteStudent($index_no) {
            $stmt = $this->conn->prepare("DELETE FROM horizonstudents WHERE `Index No.` = :IndexNo");
            $stmt->bindParam(':IndexNo', $index_no);

            if ($stmt->execute()) {
                echo json_encode(array("message" => "Student deleted successfully"));
            } 
            else {
                http_response_code(500);
                echo json_encode(array("message" => "Failed to delete student"));
            }
        }

        public function closeConnection() {
            $this->conn = null;
        }
    }

    $dbhost = 'localhost';
    $dbname = 'restful';
    $dbuser = 'root';
    $dbpass = 'V225489111*#*45229v';

    $api = new StudentAPI($dbhost, $dbname, $dbuser, $dbpass);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $api->createStudent($data);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['index_no'])) {
        $index_no = $_GET['index_no'];
        $api->getStudent($index_no);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $api->getAllStudents();
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'PUT' && isset($_GET['index_no'])) {
        $index_no = $_GET['index_no'];
        $data = json_decode(file_get_contents("php://input"), true);
        $api->updateStudent($index_no, $data);
    } 
    elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE' && isset($_GET['index_no'])) {
        $index_no = $_GET['index_no'];
        $api->deleteStudent($index_no);
    }

    $api->closeConnection();
?>