
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// Save tasks in browser
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    tasks.push({
        id: Date.now(),
        text: text,
        completed: false
    });

    taskInput.value = "";
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

// Mark task completed or pending
function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }
        return task;
    });

    saveTasks();
    renderTasks();
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = task.completed
            ? "task completed"
            : "task";

        const left = document.createElement("div");
        left.className = "task-left";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        left.append(checkbox, span);
        li.append(left, deleteBtn);

        taskList.appendChild(li);
    });

    updateDashboard();
}

// Update statistics and progress
function updateDashboard() {
    const total = tasks.length;
    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    const progress = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("completedTasks").textContent =
        completed;

    document.getElementById("pendingTasks").textContent =
        pending;

    document.getElementById("progressText").textContent =
        progress + "%";

    document.getElementById("progressFill").style.width =
        progress + "%";
}

// Filter buttons
document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".filter.active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

// Add button
addBtn.addEventListener("click", addTask);

// Press Enter to add task
taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        addTask();
    }
});

// Load saved tasks
renderTasks();
