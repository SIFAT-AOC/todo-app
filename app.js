document.getElementById("taskaddbtn").addEventListener("click", () => {
  const taskContent = document.getElementById("taskfield");
  const taskfieldValue = taskContent.value.trim();
  addTask(taskfieldValue);
  taskContent.value = "";
});
// 1st step add event in the add task btn
// 2nd collect the value from the task field
// 3rd then pass it to the add task function

function addTask(taskContent) {
  if (taskContent) {
    const taskItem = document.createElement("li");
    const taskItemContent = document.createElement("span");
    taskItemContent.textContent = taskContent;
    taskItem.append(taskItemContent);

    // editing task step
    const editfield = document.createElement("input");
    editfield.style.display = "none";
    editfield.type = Text;
    editfield.value = taskContent;
    taskItem.appendChild(editfield);
    // edit button
    const editbtn = document.createElement("button");
    editbtn.textContent = "edit";
    editbtn.addEventListener("click", () => {
      if (editfield.style.display === "none") {
        editfield.style.display = "block";
        taskItemContent.style.display = "none";
        editfield.focus();
        editbtn.textContent = "done";
      } else {
        const newtaskContent = editfield.value.trim();
        if (newtaskContent !== "") {
          editfield.style.display = "none";
          taskItemContent.style.display = "block";
          taskItemContent.textContent = newtaskContent;
        }
        editbtn.textContent = "edit";
      }
    });

    document.getElementById("tasklist").appendChild(taskItem);
    taskItem.appendChild(editbtn);

    const deletBtn = document.createElement("button");
    deletBtn.textContent = "delet task";
    deletBtn.addEventListener("click", () => {
      taskItem.remove();
    });

    taskItem.appendChild(deletBtn);
  }
}
