const mysql = require('mysql2');
const inquirer = require('inquirer');
// const cTable = require('console.table');

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

    // var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";
    var query = "SELECT * FROM department"
    connection.promise().query(query).then(([response]) => {
        console.table(response)
        promptQuit();
    })
};

function showAllRoles() {
    var query = "SELECT employee_role.title AS Title, employee_role.salary AS Salary, department.department_name AS Department FROM employee_role LEFT JOIN department ON employee_role.id = department.id"
    connection.promise().query(query).then(([response]) => {
        console.table(response)
        promptQuit();
    })
}

function showAllEmployees() {
    var query = "SELECT CONCAT(employee.first_name + ' ' + employee.last_name) AS Employee, employee_role.title AS Title, employee_role.salary AS Salary FROM employee LEFT JOIN employee_role ON employee.role_id = employee_role.id"
    connection.promise().query(query).then(([response]) => {
        console.table(response)
        promptQuit();
    })
};
// adds department to database
function addDepartment() {

    inquirer.prompt([
        {
            name: "deptName",
            type: "input",
            message: "Enter the department name:"
        },
    ]).then(function (answer) {

        connection.query("INSERT INTO department SET ?", { department_name: answer.deptName }, function (err, result) {
            if (err) throw err;
            console.log("\n Department added to database... \n");
        })

        promptQuit();
    })
};

// adds role to database
async function addRole() {
    const [departments] = await connection.promise().query("SELECT * FROM department")
    const departmentArray = departments.map(department => (
        { name: department.department_name, value: department.id }
    ))
    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "Enter the title of the new role:"
        },
        {
            name: "salary",
            type: "input",
            message: "Enter the salary for the role:"
        },
        {
            name: "department",
            type: "list",
            choices: departmentArray,
            message: "Select the department for the role:"
        }
    ]).then(function (answer) {
        console.log(answer)
        connection.promise().query("INSERT INTO employee_role SET ?", { title: answer.title, salary: answer.salary, department_id: answer.department })
            .then(([response]) => {
                if (response.affectedRows > 0) {
                    showAllRoles()
                } else {
                    console.error("Error: Failed to create role")
                    promptQuit();
                }
            })
        // connection.query("SELECT * FROM employee WHERE ?", { title: answer.role_id
        //  }, function (err, result) {
        //     if (err) throw err;

        //     connection.query("INSERT INTO employee SET ?", {
        //         first_name: answer.firstName,
        //         last_name: answer.lastName,
        //         role_id: result[0].id
        //     });

        //     console.log("\n Role added to database... \n");
        // })
    })
}
// )};

// adds employee to database
async function addEmployee() {
    const [roles] = await connection.promise().query('SELECT * FROM employee_role')
    const roleArray = roles.map(({ id, title }) => ({ name:title, value:id }))
    console.log(roles)
        inquirer.prompt([
            {
                name: "first_name",
                type: "input",
                message: "Enter the employee's First Name:"
            },
            {
                name: "last_name",
                type: "input",
                message: "Enter the employee's Last Name:"
            },
            {
                name: "role_id",
                type: "list",
                message: "Enter the employee's role:",
                choices: roleArray
            }
        ]).then(function ({ first_name, last_name, role_id }) {
            connection.promise().query('INSERT INTO employee SET ?', { first_name, last_name, role_id })
            .then(([response]) => {
                if (response.affectedRows > 0) {
                    showAllEmployees()
                } else {
                    console.error("Error: Failed to create employee")
                    promptQuit();
                }
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