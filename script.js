'use strict';

let add = document.querySelector('#add'),
    headerInput = document.querySelector('.header-input'),
    toDoItem = document.querySelector('.todo-item'),
    toDo = document.querySelector('#todo'),
    completed = document.querySelector('#completed'),
    completeItem = document.querySelector('.todo-completed'),
    toDoComplete = document.querySelectorAll('.todo-complete'),
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
        toDoComplete = document.querySelectorAll('.todo-complete');
        toDoComplete.forEach(button => {
            button.addEventListener('click', toDoList.completeItem);
        });
    },

    outputToDo: function () {
        this.todo.forEach(function (item) {
            let newItem = toDoItem.cloneNode(true);
            newItem.querySelector('p').textContent = item;
            toDo.insertBefore(newItem, null);
        });
    },

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
        toDo.insertBefore(newItem, null);
    },

    completeItem: function () {
        let completeItem = secondParent(this),
            str = completeItem.querySelector('p').textContent;
        console.log(str);
        completed.insertBefore(completeItem, null);
        console.log(this);
        this.addEventListener('click', function (event) {
            event.preventDefault();
        });

        toDoList.todo.forEach(function (item, i) {
            if (item === str) {
                toDoList.todo.splice(i, 1);
            }
        });
        toDoList.completed.push(str);

        localStorage.setItem('todo', toDoList.todo);
        localStorage.setItem('completed', toDoList.completed);

        console.log(this);

    },

    removeItem: function () {
        let removeItem = secondParent(this),
            str = removeItem.querySelector('p').textContent;
        removeItem.remove();


        localStorage.setItem('todo', toDoList.todo);
        localStorage.setItem('completed', toDoList.completed);
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