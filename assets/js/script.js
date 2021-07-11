// Using the 'El' suffix marks this as a DOM element 
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do"); // Selects the element in the DOM that represents the unordered task list 
var taskIdCounter = 0;  // Will create a unique ID for each task 
var pageContentEl = document.querySelector("#page-content");
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
             type: taskTypeInput
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

    alert("Task Updated!");

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
    tasksToDoEl.appendChild(taskItemEl); // Adds newly created task item list element to unordered list in the HTML
    taskIdCounter++; // Incremenets counter to assure unique data-task-id for each list item
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


// Event listener that will callback the createTaskHandler function on a 'submit' can also be called 'onsubmit'. This event looks for either clicking a button named 'submit' or if the user hits the enter-key 
formEl.addEventListener("submit", taskFormHandler);

var deleteTask = function (taskId) {
    // Selects the task that is associated with the clicked delete button, linked by the data-task-id attribute 
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    console.log(taskSelected);
    // Removes entire list item 
    taskSelected.remove();
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

pageContentEl.addEventListener("click", taskButtonHandler);


