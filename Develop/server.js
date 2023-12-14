const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_db"
});

connection.connect(function (err) { 
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // runs the app
    runApp();
});

function runApp() {
    // Prompts the starting questions
    inquirer.prompt({
        name: 'startQuestions',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Quit'
        ]
    
    }).then(function (answer) {

        switch (answer.startQuestions) {
            case "View all departments":
                showAllDepartments();
                break;
            case "View all roles":
                showAllRoles();
                break;
            case "View all employees":
                showAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Quit":
                connection.end();
                break;
        }
    })
};

function showAllDepartments() {

    var allDepartmentArray = [];

    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query(query, function(err, result) {
        if (err) throw err;

        var departmentArray = [];

        for(var i = 0; i < result.length; ++i) {

            departmentArray = [];

            departmentArray.push(result[i].id);
            departmentArray.push(result[i].first_name);
            departmentArray.push(result[i].last_name);
            departmentArray.push(result[i].title);
            departmentArray.push(result[i].salary);
            departmentArray.push(result[i].department_name);

            console.log(departmentArray);
            allDepartmentArray.push(departmentArray);
        }
    }
)};

function showAllRoles() {

    var allRolesArray = [];

    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query(query, function(err, result) {
        if (err) throw err;

        var roleArray = [];

        for(var i = 0; i < result.length; ++i) {

            roleArray = [];

            roleArray.push(result[i].id);
            roleArray.push(result[i].first_name);
            roleArray.push(result[i].last_name);
            roleArray.push(result[i].title);
            roleArray.push(result[i].salary);
            roleArray.push(result[i].department_name);

            // console.log(roleArray);
            allRolesArray.push(roleArray);

        }
    }
)};

function showAllEmployees() {

    var allEmployeeArray = [];

    var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

    connection.query(query, function(err, result) {
        if (err) throw err;

        var employeeArray = [];

        for(var i = 0; i < result.length; ++i) {

            employeeArray = [];

            employeeArray.push(result[i].id);
            employeeArray.push(result[i].first_name);
            employeeArray.push(result[i].last_name);
            employeeArray.push(result[i].title);
            employeeArray.push(result[i].salary);
            employeeArray.push(result[i].department_name);

            // console.log(employeeArray);
            allEmployeeArray.push(employeeArray);
        }

        console.log(allEmployeeArray);

        console.log("\n\n\n");
        console.table(["ID", "First Name", "Last Name", "Role", "Salary", "Department"], allEmployeeArray);
        console.log("\n\n\n");

        promptQuit();
    })
};
// adds department to database
function addDepartment() {

    connection.query("SELECT * FROM employee_role", function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter the employee's First Name:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the employee's Last Name:"
            },
            {
                name: "roleChoice",
                type: "rawlist",
                message: "Enter the employee's role:",
                choices: function () {
                    var arrChoices = [];

                    for (var i = 0; i < result.length; ++i) {
                        arrChoices.push(result[i].title);
                    }

                    return arrChoices;
                }
            }
        ]).then(function (answer) {

            connection.query("SELECT * FROM employee_role WHERE ?", { title: answer.roleChoice }, function (err, result) {
                if (err) throw err;

                connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: result[0].id
                });

                console.log("\n Department added to database... \n");
            })

            promptQuit();
        })
    })
};

// adds role to database
function addRole() {

    connection.query("SELECT * FROM employee_role", function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter the employee's First Name:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the employee's Last Name:"
            },
            {
                name: "salary",
                type: "input",
                message: "Enter the salary for the role:"
            },
            {
                name: "department",
                type: "input",
                message: "Enter the department for the role:"
            }
            ]).then(function (answer) {

                connection.query("SELECT * FROM employee WHERE ?", { title: answer.employee_id }, function (err, result) {
                    if (err) throw err;
    
                    connection.query("INSERT INTO employee SET ?", {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        employee_id: result[0].id
                    });
    
                    console.log("\n Role added to database... \n");
                })
    
                promptQuit();
            })
    }
    )};

// adds employee to database
function addEmployee() {

    connection.query("SELECT * FROM employee_role", function (err, result) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Enter the employee's First Name:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Enter the employee's Last Name:"
            },
            {
                name: "roleChoice",
                type: "rawlist",
                message: "Enter the employee's role:",
                choices: function () {
                    var arrChoices = [];

                    for (var i = 0; i < result.length; ++i) {
                        arrChoices.push(result[i].title);
                    }

                    return arrChoices;
                }
            }
        ]).then(function (answer) {

            connection.query("SELECT * FROM employee_role WHERE ?", { title: answer.roleChoice }, function (err, result) {
                if (err) throw err;

                connection.query("INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    role_id: result[0].id
                });

                console.log("\n Employee added to database... \n");
            })

            promptQuit();
        })
    })
};

// asks user if they want to quit or keep using the application
function promptQuit() {
    inquirer.prompt({
        type: "list",
        name: "promptQuit",
        message: "Would you like to quit this application or run again?",
        choices: ["Run Again", "Quit"]
    }).then(function (answer) {

        if (answer.promptQuit === "Run Again") {
            runApp();
        } else {
            connection.end();
        }
    })
};