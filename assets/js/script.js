var buttonEl = document.querySelector("#save-task"); // This line selects the object that has the 'save-task' id, which is our 'Add Task' button
// Using the 'El' suffix marks this as a DOM element 
console.log(buttonEl); 

var tasksToDoEl = document.querySelector("#tasks-to-do"); // Selects the element in the DOM that represents the unordered task list 

// Handler function that creates a new task list-item

var createTaskHandler = function () {
    var taskItemEl = document.createElement("li"); // Dynamically creates a list item in the HTML 
    taskItemEl.className = "task-item"; // Dynamically adds style to list item
    taskItemEl.textContent = prompt("Enter your task:"); // Prompts user for task to add to list
    tasksToDoEl.appendChild(taskItemEl); // Adds newly created task item list element to unordered list in the HTML
}

// Event listener that will callback the createTaskHandler function, which creates a new task list item when the "add task" button is clicked
buttonEl.addEventListener("click", createTaskHandler); 


