const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const tasks = document.querySelectorAll(".task");
const columns = [todo, progress, done];
let taskData = {};
let dragElement = null;

function createNewTask(title, desc, column) {
  const div = document.createElement("div");
  div.classList.add("task");
  div.setAttribute("draggable", "true");

  const h2 = document.createElement("h2");
  h2.textContent = title;
  const p = document.createElement("p");
  p.textContent = desc;
  const btn = document.createElement("button");
  btn.classList.add("delete");
  btn.textContent = "Delete";

  div.appendChild(h2);
  div.appendChild(p);
  div.appendChild(btn);
  column.appendChild(div);

  div.addEventListener("drag",function(){
    dragElement = div;
  })

  const deleteButton = div.querySelector("button");
  deleteButton.addEventListener("click",function(){
     div.remove();
     updateTaskCount();
  })

  return div;
}

function updateTaskCount(){
  columns.forEach(element => {
      const tasks = element.querySelectorAll(".task");
      const count = element.querySelector(".right");

      taskData[element.id] = Array.from(tasks).map(function (t) { // array.from(tasks) ---> yeh tasks nodelist ko array main convert kar rah hai or phir map function chala rahe hain
        return {
          title: t.querySelector("h2").innerText,
          description: t.querySelector("p").innerText
        }
      })

      localStorage.setItem("tasks", JSON.stringify(taskData));
      count.textContent = tasks.length;
    });
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);
    data[col].forEach((task) => {
       createNewTask(task.title, task.description, column);
    })
  }
}

tasks.forEach(task => {
  task.addEventListener("drag", function (e) { // drag event tab fire hota hai jab ham element ko uthaa kr mouse move kar rahe hote hain, continuesly fire hota rehta hai
    dragElement = task;
  })
});

columns.forEach(element => {
  const tasks = element.querySelectorAll(".task");
  const count = element.querySelector(".right");
  count.innerText = tasks.length;
});

// Yahan pr ham ne function banaya hai jo teenon task column ke liye kaam karegaa.
function dragTasks(task) {
  task.addEventListener("dragenter", function () { // yeh event tab file hoga jab main drag kar ke element ko kisi element ke andar le kr aaunga
    this.classList.add("hover-over");
  })
  task.addEventListener("dragleave", function () { // yeh event tab fire hoga jab main drag kr ke element ko kisi element ke andar launga or drag ko chor dunga
    this.classList.remove("hover-over");
  })
  task.addEventListener("dragover", function (e) { // jab ham item ko drag kr ke drop area ke upper le aayen tab yeh event fire ho jata hai, yeh permission provide bhi karta hai element drop ke liye.
    e.preventDefault(); // element ko drop karne ke liye preventdefault karna zaroori hai kyn ke browser drop karna allow nahi karta hai
  })
  task.addEventListener("drop", function (e) { // jab ham apne element ko drag kr ke chor dain tab yeh event fire ho jata hai
    e.preventDefault();
    task.appendChild(dragElement);
    task.classList.remove("hover-over");

    updateTaskCount();
  })
}
dragTasks(todo);
dragTasks(progress);
dragTasks(done);

const taskButton = document.querySelector("#toggle-modal");
const modal = document.querySelector(".modal");
const bg = document.querySelector(".bg");
const deleteBtn = document.querySelector(".button");

taskButton.addEventListener("click", function () {
  modal.classList.toggle("active");
})
bg.addEventListener("click", function () {
  modal.classList.toggle("active");
})



const addNewTask = document.querySelector(".add-task-btn");
addNewTask.addEventListener("click", function () {
  let taskInput = document.querySelector(".new-task-input").value;
  let taskDescription = document.querySelector(".task-desc").value;

  document.querySelector(".new-task-input").value = "";
  document.querySelector(".task-desc").value = "";

  createNewTask(taskInput,taskDescription,todo);
  modal.classList.remove("active");
  updateTaskCount();
})


