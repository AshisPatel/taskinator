// Using the 'El' suffix marks this as a DOM element 
var formEl = document.querySelector("#task-form");
// Selects each onrdered list 
var tasksToDoEl = document.querySelector("#tasks-to-do"); 
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed"); 
var taskIdCounter = 0;  // Will create a unique ID for each task 
var pageContentEl = document.querySelector("#page-content");
// 'tasks' will be an array that holds all of our tasks objects for storage
var tasks = [];
// Handler function that creates a new task list-item

var taskFormHandler = function (event) {
    event.preventDefault(); // Prevents the page from refreshing when this function is called 
    var taskNameInput = document.querySelector("input[name='task-name']").value; // Selects the value (which gets user set) of input element that has the name 'task-name'
    var taskTypeInput = document.querySelector("select[name='task-type']").value; // Selects the value 'select' element that has the name 'task-type'

    // Validate if the input values have content
    // If either field is 'empty' it will be read as 'false' and thus break out of the function via a return. 
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form before submitting!");
        return;
    }

    // Will clear the task form inputs after a submit 
    // The .reset() method is for the form element as provided by the DOM element interface
    formEl.reset();

    // Check to see if the form has the data-task-id attribute, which will determine if the task is new or if an old task is being editted 
    var isEdit = formEl.hasAttribute("data-task-id"); // 

    // Has the attribute, so it is an existing task 
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
        console.log("This should only appear if a task is being EDITED"); 
    }
     // Does not have the attribute, so it is a new task 
     else {
         var taskDataObj = {
             name: taskNameInput,
             type: taskTypeInput,
             status: "to do"
         };
         createTaskEl(taskDataObj); 
         console.log("This should only appear if a NEW task is being added"); 
     }
    
       
}

// Function will edit the task HTML
var completeEditTask = function(taskName, taskType, taskId) {
    // Finds task with the same taskId
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // Updates task with the new name and task type in the form 
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType; 

   // Loop checks if the id of the object in the array is equal to the task currently being editted, so also update the status & name of the object in the array 
   for( var i = 0; i < tasks.length; i++) {
       if (tasks[i].id === parseInt(taskId)) {
           tasks[i].name = taskName;
           tasks[i].type = taskType;  
       }
   }

   // Save new tasks array in local storage 
   saveTasks(); 

    // Reset form by removing attribute and reverting submit button
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task"; 
}

// Function will create the task HTML and append it 
var createTaskEl = function (taskDataObj) {
    var taskItemEl = document.createElement("li"); // Dynamically creates a list item in the HTML 
    taskItemEl.className = "task-item"; // Dynamically adds style to list item
    taskItemEl.setAttribute("data-task-id", taskIdCounter); // Assigns data-type attribute to list item 
    var taskInfoEl = document.createElement("div"); // Dynamically creates a div item in the HTML
    taskInfoEl.className = "task-info"; // Sets the class of the DIV to be 'task-info'
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>"; // Allows us to add actual HTML code to the newly created div
    taskItemEl.appendChild(taskInfoEl); // Adds the newly created div into a list item in the HTML 
    // Call createTaskActions function to create the button/select that needs to be appended after the task text in the list item 
    var taskActionsEl = createTaskActions(taskIdCounter);
    taskItemEl.appendChild(taskActionsEl);
    
    // Adds newly created task item list element to unordered list in the HTML
    if (taskDataObj.status === "to do") {
        taskItemEl.querySelector("select[name='status-change']").selectedIndex = 0;  
        tasksToDoEl.appendChild(taskItemEl);
        
    }

    else if (taskDataObj.status === "in progress") {
        taskItemEl.querySelector("select[name='status-change']").selectedIndex = 1;  
        tasksInProgressEl.appendChild(taskItemEl);
    }

    else if (taskDataObj.status === "complete") {
        taskItemEl.querySelector("select[name='status-change']").selectedIndex = 2;  
        tasksCompletedEl.appendChild(taskItemEl); 
    }
    
    // Add taskId to the taskDataObj to store it 
    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj); 
    // Save new task in localStorage
    saveTasks(); 
    // Incremenets counter to assure unique data-task-id for each list item
    taskIdCounter++;

    
}

var createTaskActions = function (taskId) {
    // Create div element to act as a container for the actions
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // Create action buttons and dropdown and append to div container
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    // Create a for loop to implement the options in the select-menu
    var statusChoices = ["To Do", "In Progress", "Complete"];
    for (let index = 0; index < statusChoices.length; index++) {
        // Create option element  
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[index];
        statusOptionEl.setAttribute("value", statusChoices[index]);
        // Append option element to select 
        statusSelectEl.appendChild(statusOptionEl);
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}

var deleteTask = function (taskId) {
    // Selects the task that is associated with the clicked delete button, linked by the data-task-id attribute 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    console.log(taskSelected);
    // Removes entire list item 
    taskSelected.remove();

    // Create a new array to hold the tasks list after one is deleted
    var updatedTaskArr = [];

    // Loop through each element in the old tasks array
    for (var i = 0; i < tasks.length; i++) {
        // If the id of the object in the array is not equal to the id of the deleted task, add it to the updated task array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]); 
        }
    }

    // Update tasks array by setting it equal to the updatedTaskArr
    tasks = updatedTaskArr; 
    // Save new tasks array in local storage
    saveTasks();
}

var editTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Get task name and type from the selected task object 
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // Set the selected task name and type into the form box 
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    // Change submit button text to 'save' so user knows value is being editted
    document.querySelector("#save-task").textContent = "Save Task";
    // Assign taskId to the entire form group so we know which task is being editted
    formEl.setAttribute("data-task-id", taskId);
}

var taskButtonHandler = function (event) {
    // Log will display the target of the click 
    console.log(event.target);
    // If the target has the class 'delete-btn' a delete button was clicked
    if (event.target.matches(".delete-btn")) {
        // Grabs data-task-id of the button which relates to the entire task
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
    // If the target has the class 'edit-btn' a delete button was clicked
    if (event.target.matches(".edit-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        editTask(taskId);
    }
}

var taskStatusChangeHandler = function (event) {
    // Gets the id of task where the select was clicked
    var taskId = event.target.getAttribute("data-task-id"); 
    // Gets the currently selected option's value and makes it lower case
    var statusValue = event.target.value.toLowerCase(); 
    // Finds the parent task item element based on the id 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // Depending on the select value, the task (list item) is appened to the appropraite column 
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }

    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }

    else if (statusValue === "complete") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // Update object in tasks array to match changed status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue; 
        }
    }

    // Save new tasks array in local storage 
    saveTasks(); 
}

// Function to save task information everytime it changes
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from the localStorage upon openning the website
var loadTasks = function() {
    // Grab tasks from localStorage
    savedTasks = localStorage.getItem("tasks"); 
    // Check to see if tasks is an empty array (no previously stored data)
    if (!savedTasks) {
        return false; // Will exit us from the function if no previous localStorage
    }
    // Convert tasks from a string back into an array of objects
    savedTasks = JSON.parse(savedTasks); 
    // Loop through savedTasks array 
    for (var i = 0; i < savedTasks.length; i++) {
        // Pass each task object into 'createTaskEl()' function
        createTaskEl(savedTasks[i]); 
    }
}

// Event listener that will callback the createTaskHandler function on a 'submit' can also be called 'onsubmit'. This event looks for either clicking a button named 'submit' or if the user hits the enter-key 
formEl.addEventListener("submit", taskFormHandler);

// Listens for when an edit or delete button is clicked in one of the tasks columns
pageContentEl.addEventListener("click", taskButtonHandler);

// Listens for when there is a change 
pageContentEl.addEventListener("change", taskStatusChangeHandler);

// Run loadTasks(); on webpage start
loadTasks(); 

