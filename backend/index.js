const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const path = require('path')
const dbPath = path.join(__dirname, 'usersRegister.db')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const PORT = process.env.PORT || 5000

let db = null

const intializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        app.listen(PORT, () => {
            console.log('Server running on http://localhost:5000')
        })
    } catch (e) {
        console.log(`DB Error: ${e}`)
    }
}

intializeDBAndServer()

// Add User API
app.post('/users', async (request, response) => {
    const {firstName, lastName, email, department} = request.body

    const getUserQuery = `
        SELECT
            *
        FROM
            users
        WHERE
            email='${email}';
    `

    const isEmailPresent = await db.get(getUserQuery)

    if (isEmailPresent === undefined) {
        const addUserQuery = `
            INSERT INTO users
            (first_name, last_name, email, department)

            VALUES
            ('${firstName}', '${lastName}', '${email}', '${department}');
    `

        try {
            await db.run(addUserQuery)
            response.status(200)
            response.json('Added User successfully')
        } catch (error) {
            response.status(400)
            response.json(error.message)
        }
    } else {
        response.status(400)
        response.json('Email already exists')
    }
})

//Get all Users API
app.get('/users', async (request, response) => {
    const getAllUsersQuery = `
        SELECT
            *
        FROM
            users;
    `

    const allUsers = await db.all(getAllUsersQuery)

    response.status(200)
    response.json({'data': allUsers})
})

//Edit User API
app.put('/users/:id', async (request, response) => {
    const {id} = request.params

    const getUserQuery = `
        SELECT
            *
        FROM
            users
        WHERE
            id=${id};
    `
    const user = await db.get(getUserQuery)

    const {firstName=user.first_name, lastName=user.last_name, email=user.email, department=user.department} = request.body

    const updateExistingUser = `
        UPDATE
            users
        SET
            first_name='${firstName}',
            last_name='${lastName}',
            email='${email}',
            department='${department}'
        WHERE
        id=${id};
    `
    try {
        await db.run(updateExistingUser)

        response.status(200)
        response.json('User details updated successfully')
    } catch (error) {
        response.status(400)
        response.json(error.message)
    }
})

//Delete User details API
app.delete('/users/:id', async (request, response) => {
  const {id} = request.params

  const deleteUserQuery = `
    DELETE FROM 
      users
    WHERE
      id=${id};
  `

  try{
    await db.run(deleteUserQuery)
    response.status(200)
    response.json('Deleted user details successfully')
  } catch (error) {
    response.status(400)
    response.json(error.message)
  }
})