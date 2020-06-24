'use strict';

const list = document.querySelector('.list');
const reg = document.querySelector('.reg');
const signIn = document.querySelector('.signIn');
const monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сунтября', 'октября', 'ноября', 'декабря'];

let user = [];
let firstName = '';
let lastName = '';
let login = '';
let password = '';
let bool = false;
let nameTitle = document.querySelector('.name');

function numberTime(date) {
  if (date < 10) return date = '0' + date;
  return date;
}

function checkPrompt(name, func) {
  if (name === null) {
    if (confirm('Не хотите регистрироваться? Может, все-таки, зарегистрироваться?')) {
      func();
    }
    return false;
  }

  if (name === '') {
    alert('Поле не должно быть пустым! Попробуйте еще раз');
    func();
  } else if (name.trim() === '') {
    alert('Тут ничего нет, кроме пробелов! Попробуйте еще раз');
    func();
  } else if (name.split(' ').length - 1 > 1) {
    alert('Слишком много пробелов! Попробуйте еще раз');
    func();
  } else {
    if (func === registration) {
      if (name.split(' ').length - 1 < 1) {
        alert('Нужно ввести имя и фамилию! Попробуйте еще раз');
        func();
      } else if (name.split(' ')[0] === '') {
        alert('Вы пропустили имя! Попробуйте еще раз');
        func();
      } else if (name.split(' ')[1] === '') {
        alert('Вы пропустили фамилию! Попробуйте еще раз');
        func();
      } else {
        bool = true;
        func(name);
      }
    }

    if (func === loginFuncReg) {
      if (name.split(' ').length - 1 === 1) {
        alert('Пробелов быть не должно! Попробуйте еще раз');
        func();
      } else {
        bool = true;
        func(name);
      }
    }

    if (func === passFuncReg) {
      if (name.split(' ').length - 1 === 1) {
        alert('Пробелов быть не должно! Попробуйте еще раз');
        func();
      } else {
        bool = true;
        func(name);
      }
    }
  }
}

function registration(name) {
  if (bool === false) {
    name = prompt('Введите через пробел имя и фамилию пользователя');
    checkPrompt(name, registration);
  } else {
    name = name.split(' ');

    for (let i = 0; i < name.length; i++) {
      firstName = name[0].slice(0, 1).toUpperCase() + name[0].slice(1);
      lastName = name[1].slice(0, 1).toUpperCase() + name[1].slice(1);
    }

    bool = false;
    loginFuncReg();
  }
}

function loginFuncReg(logon) {
  if (bool === false) {
    logon = prompt('Введите логин');
    checkPrompt(logon, loginFuncReg);
  } else {
    bool = false;
    login = logon;
    passFuncReg();
  }
}

function passFuncReg(pass) {
  if (bool === false) {
    pass = prompt('Введите пароль');
    checkPrompt(pass, passFuncReg);
  } else {
    bool = false;
    password = pass;

    let date = new Date;
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    date = day + ' '
      + monthArray[month] + ' '
      + year + 'г., '
      + numberTime(hours) + ':'
      + numberTime(minutes) + ':'
      + numberTime(seconds);

    const newUser = {
      firstName: firstName,
      lastName: lastName,
      login: login,
      password: password,
      date: date,
      auth: false,
    };

    user.push(newUser);
    localStorage.setItem('user', JSON.stringify(user));
    render();
  }
}

const render = function () {
  list.textContent = '';
  nameTitle.textContent = 'Привет Аноним';

  if (localStorage.getItem('user')) {
    user = JSON.parse(localStorage.getItem('user'))
  }

  user.forEach(function (item) {

    if (item.auth) {
      nameTitle.textContent = `Привет ${item.login}`;
    }

    const li = document.createElement('li');

    li.innerHTML = 'Имя: ' + item.firstName
      + ', фамилия: ' + item.lastName
      + ', зарегистрирован: ' + item.date
      + '<span class="remove-list">удалить</span>';
    list.append(li);

    const removeList = li.querySelector('.remove-list');

    removeList.addEventListener('click', function () {
      user.splice(user.indexOf(item), 1);
      localStorage.setItem('user', JSON.stringify(user));

      render();
    });
  });
};

render();

function signin() {
  let userLogin = prompt('Введите логин');

  if (userLogin !== null) {
    let logCheck = '';

    user.forEach(function (item) {
      if (userLogin === item.login) logCheck = userLogin;
    });

    if (logCheck === '') {
      alert('Пользователя с таким логином не сущесвует');
      signin();
    } else {
      const signinPass = function () {
        let userPass = prompt('Введите пароль');

        if (userPass !== null) {
          let passCheck = '';

          user.forEach(function (item) {
            if (userPass === item.password && userLogin === item.login) passCheck = userPass;
          });

          if (passCheck === '') {
            alert('Пароль не подходит');
            signinPass();
          } else {
            user.forEach(function (item) {
              if (userPass === item.password && userLogin === item.login) {
                item.auth = !item.auth;
                localStorage.setItem('user', JSON.stringify(user));
              } else {
                if (item.auth) {
                  item.auth = !item.auth;
                  localStorage.setItem('user', JSON.stringify(user));
                }
              }
            });

            render();
          }
        }
      };

      signinPass();
    }
  }
}

reg.addEventListener('click', registration);
signIn.addEventListener('click', signin);
