'use strict';

let add = document.querySelector('#add'),
    headerInput = document.querySelector('.header-input'),
    toDoItem = document.querySelector('.todo-item'),
    toDo = document.querySelector('#todo'),
    completed = document.querySelector('#completed'),
    completeItem = document.querySelector('.todo-completed'),
    toDoComplete = toDo.querySelectorAll('.todo-complete'),
    completedUncheck = completed.querySelectorAll('.todo-complete'),
    toDoRemove = document.querySelectorAll('.todo-remove');

const secondParent = function (item) {
    return item.parentNode.parentNode;
};

const toDoList = {

    todo: [],
    completed: [],

    start: function () {

        // подчищаем верстку
        toDo.innerHTML = '';
        completed.innerHTML = '';

        // выводим задачи
        if (localStorage.hasOwnProperty('todo')) {
            this.todo = localStorage.getItem('todo').split(',');
            this.outputToDo();
        }

        // выводим выполненные задачи
        if (localStorage.hasOwnProperty('completed')) {
            this.completed = localStorage.getItem('completed').split(',');
            this.outputCompleted();
        }

        // вешаем слушателей на кнопки удаления
        toDoRemove = document.querySelectorAll('.todo-remove');
        toDoRemove.forEach(button => {
            button.addEventListener('click', toDoList.removeItem);
        });

        // вешаем слушателей на кнопку выполнено
        toDoComplete = toDo.querySelectorAll('.todo-complete');
        toDoComplete.forEach(button => {
            button.addEventListener('click', toDoList.completeItem);
        });

        // перемещение выполненных действий обратно в задачи
        completedUncheck = completed.querySelectorAll('.todo-complete');
        completedUncheck.forEach(button => {
            button.addEventListener('click', toDoList.uncheckedItem);
        });
    },

    // вывод задач из LocalStorage
    outputToDo: function () {
        this.todo.forEach(function (item) {
            let newItem = toDoItem.cloneNode(true);
            newItem.querySelector('p').textContent = item;
            toDo.insertBefore(newItem, null);
        });
    },

    //вывод выполненных задач из localStorage
    outputCompleted: function () {
        this.completed.forEach(function (item) {
            let newItem = toDoItem.cloneNode(true);
            newItem.querySelector('p').textContent = item;
            completed.insertBefore(newItem, null);
        });
    },

    addToDo: function () {
        // сохраняем значение в localStorage
        this.todo.push(headerInput.value);
        localStorage.setItem('todo', this.todo);

        // добавляем элемент на страницу
        let newItem = toDoItem.cloneNode(true);
        newItem.querySelector('p').textContent = this.todo[this.todo.length - 1];
        newItem.querySelector('.todo-complete').addEventListener('click', toDoList.completeItem);
        newItem.querySelector('.todo-remove').addEventListener('click', toDoList.removeItem);
        toDo.insertBefore(newItem, null);
    },

    completeItem: function () {

        let completeItem = secondParent(this),
            str = completeItem.querySelector('p').textContent;

        // переносим элемент
        completed.insertBefore(completeItem, null);
        // удаляем с кнопки слушателя
        this.removeEventListener('click', toDoList.completeItem);
        this.addEventListener('click', toDoList.uncheckedItem);

        //удаляет из массива todo выполненную задачу
        toDoList.todo.forEach(function (item, i) {
            if (item === str) {
                toDoList.todo.splice(i, 1);
            }
        });
        // добавляем выполненную задачу в массив completed
        toDoList.completed.push(str);

        // обновление localStorage, предварительно проверив наличие элементов в массиве
        if (toDoList.todo.length !== 0) {
            localStorage.setItem('todo', toDoList.todo);
        } else {
            localStorage.removeItem('todo');
        }

        localStorage.setItem('completed', toDoList.completed);

    },

    // отмена выполненного действия
    uncheckedItem: function () {

        let completeItem = secondParent(this),
            str = completeItem.querySelector('p').textContent;

        // переносим элемент
        toDo.insertBefore(completeItem, null);
        // удаляем с кнопки слушателя
        this.removeEventListener('click', toDoList.uncheckedItem);
        this.addEventListener('click', toDoList.completeItem);

        //удаляет из массива completed выполненную задачу
        toDoList.completed.forEach(function (item, i) {
            if (item === str) {
                toDoList.completed.splice(i, 1);
            }
        });
        // добавляем выполненную задачу в массив completed
        toDoList.todo.push(str);

        // обновление localStorage, предварительно проверив наличие элементов в массиве
        if (toDoList.completed.length !== 0) {
            localStorage.setItem('completed', toDoList.completed);
        } else {
            localStorage.removeItem('completed');
        }

        localStorage.setItem('todo', toDoList.todo);
    },

    // удаление элемента
    removeItem: function () {
        // удаление элемента
        let removeItem = secondParent(this),
            str = removeItem.querySelector('p').textContent;
        removeItem.remove();

        // ищем элемент 
        toDoList.todo.forEach(function (item, i) {
            if (item === str) {
                toDoList.todo.splice(i, 1);
            }
        });
        toDoList.completed.forEach(function (item, i) {
            if (item === str) {
                toDoList.completed.splice(i, 1);
            }
        });

        // обновление localStorage, предварительно проверив наличие элементов в массиве
        if (toDoList.todo.length !== 0) {
            localStorage.setItem('todo', toDoList.todo);
        } else {
            localStorage.removeItem('todo');
        }

        if (toDoList.completed.length !== 0) {
            localStorage.setItem('completed', toDoList.completed);
        } else {
            localStorage.removeItem('completed');
        }
    },
};

const addInput = function (event) {
    event.preventDefault();
    toDoList.addToDo();
    headerInput.value = '';
};


toDoList.start();

add.addEventListener('click', function (event) {
    if (headerInput.value !== '') {
        addInput(event);
    }
});

headerInput.addEventListener('keydown', function (event) {
    if (event.key === 13 && headerInput.value !== '') {
        addInput(event);
    }
});