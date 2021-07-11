// Using the 'El' suffix marks this as a DOM element 
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do"); // Selects the element in the DOM that represents the unordered task list 

// Handler function that creates a new task list-item

var createTaskHandler = function () {
    event.preventDefault(); // Prevents the page from refreshing when this function is called 
    var taskItemEl = document.createElement("li"); // Dynamically creates a list item in the HTML 
    taskItemEl.className = "task-item"; // Dynamically adds style to list item
    taskItemEl.textContent = "This is a new task!"; // Prompts user for task to add to list
    tasksToDoEl.appendChild(taskItemEl); // Adds newly created task item list element to unordered list in the HTML
}

// Event listener that will callback the createTaskHandler function on a 'submit' can also be called 'onsubmit'. This event looks for either clicking a button named 'submit' or if the user hits the enter-key 
formEl.addEventListener("submit", createTaskHandler); 


