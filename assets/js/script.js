// Using the 'El' suffix marks this as a DOM element 
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do"); // Selects the element in the DOM that represents the unordered task list 

// Handler function that creates a new task list-item

var createTaskHandler = function () {
    event.preventDefault(); // Prevents the page from refreshing when this function is called 
    var taskNameInput = document.querySelector("input[name='task-name']").value; // Selects the value (which gets user set) of input element that has the name 'task-name'
    var taskTypeInput = document.querySelector("select[name='task-type']").value; // Selects the value 'select' element that has the name 'task-type'
    var taskItemEl = document.createElement("li"); // Dynamically creates a list item in the HTML 
    taskItemEl.className = "task-item"; // Dynamically adds style to list item
    var taskInfoEl = document.createElement("div"); // Dynamically creates a div item in the HTML
    taskInfoEl.className = "task-info"; // Sets the class of the DIV to be 'task-info'
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3><span class='task-type'>" + taskTypeInput + "</span>"; // Allows us to add actual HTML code to the newly created div
    taskItemEl.appendChild(taskInfoEl); // Adds the newly created div into a list item in the HTML 
    tasksToDoEl.appendChild(taskItemEl); // Adds newly created task item list element to unordered list in the HTML
}

// Event listener that will callback the createTaskHandler function on a 'submit' can also be called 'onsubmit'. This event looks for either clicking a button named 'submit' or if the user hits the enter-key 
formEl.addEventListener("submit", createTaskHandler); 


