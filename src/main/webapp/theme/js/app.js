const apiKey = "7a5fff0c-7beb-43b9-a075-beb3484ff5af";
const apiHost = 'https://todo-api.coderslab.pl';

document.addEventListener('DOMContentLoaded', function () {
    apiListTasks()
        .then(function (data) {
        data.data.forEach(function (task) {
            renderTask(task.id, task.title, task.description, task.status);
        });
    });

});


function apiListTasks() {
    return fetch(apiHost + "/api/tasks", {
        headers: {
            "Authorization": apiKey
        }
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można wczytać danych.");
            console.log(err);
        });
}

function renderTask(taskId, title, description, status) {
    const main = document.querySelector("main");
    const section = document.createElement("section");
    section.className = 'card mt-5 shadow-sm';
    main.appendChild(section);

    const headerDiv = document.createElement("div");
    headerDiv.className = 'card-header d-flex justify-content-between align-items-center';
    section.appendChild(headerDiv);

    const headerLeftDiv = document.createElement("div");
    headerDiv.appendChild(headerLeftDiv);

    const h5 = document.createElement("h5");
    h5.innerText = title;
    headerLeftDiv.appendChild(h5);

    const h6 = document.createElement("h6");
    h6.className = "card-subtitle text-muted";
    h6.innerText = description;
    headerLeftDiv.appendChild(h6);

    const headerRightDiv = document.createElement('div');
    headerDiv.appendChild(headerRightDiv);

    if (status === "open") {
        const finishButton = document.createElement("button");
        finishButton.className = 'btn btn-dark btn-sm js-task-open-only';
        finishButton.innerText = 'Finish';
        headerRightDiv.appendChild(finishButton);
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-outline-danger btn-sm ml-2';
    deleteButton.innerText = 'Delete';
    headerRightDiv.appendChild(deleteButton);

    const ul = document.createElement('ul');
    section.appendChild(ul);

    apiListOperationsForTask(taskId).then(
        function(response) {
            response.data.forEach(function(operation) {
                renderOperation(ul, operation.id, status, operation.description, operation.timeSpent); }
            );
        }
    )
}

function apiListOperationsForTask(taskId) {
    return fetch(apiHost + `/api/tasks/${taskId}/operations`, {
        headers: {
            "Authorization": apiKey
        }
    })
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
            throw new Error("Fetching failed.");
        })
        .catch(function (err) {
            alert("Nie można wczytać danych.");
            console.log(err);
        });
}

function renderOperation(operationsList, status, operationId, operationDescription, timeSpent) {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    operationsList.appendChild(li);

    const descriptionDiv = document.createElement("div");
    descriptionDiv.innerText = operationDescription;
    li.appendChild(descriptionDiv);

    const time = document.createElement("span");
    time.className = "badge badge-success badge-pill ml-2"
    time.innerText = timeRefactor(timeSpent);
    descriptionDiv.appendChild(time);

    if(status === "open") {
    }
}

function timeRefactor(timeInMinutes) {
    if(timeInMinutes === 0) {
        return "0m";
    }
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    if(hours === 0) {
        return `${minutes}m`;
    }
    if(minutes === 0) {
        return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
}