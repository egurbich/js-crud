// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class User {
  static #list = []

  constructor(email, login, password) {
    this.email = email
    this.login = login
    this.password = password
    this.id = new Date().getTime()
  }

  static add = (user) => {
    this.#list.push(user)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((user) => user.id === id)
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (user) => user.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }

  static updateById = (id, email) => {
    const user = this.getById(id)

    if (user) {
      if (email) {
        user.email = email
      }
      return true
    } else {
      return false
    }
  }
}

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()

  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password } = req.body

  const user = new User(email, login, password)

  User.add(user)

  console.log(User.getList())

  res.render('success-info', {
    style: 'index',
    info: 'User created',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  console.log(id)

  User.deleteById(Number(id))

  res.render('success-info', {
    style: 'index',
    info: 'User deleted',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, id } = req.body

  const result = User.updateById(Number(id), email)

  res.render('success-info', {
    style: 'index',
    info: result ? 'Email updated' : 'Error',
  })
})
// Підключаємо роутер до бек-енду
module.exports = router
