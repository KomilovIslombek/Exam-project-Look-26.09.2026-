import FS from "../utils/FS.js"
import JWT from "jsonwebtoken"

export const getUsers = async (req, res) => {
    let data = await FS.readFile('users.json')
    data = JSON.parse(data) 

    res.status(200).json({
        message: 'Fetched successfully',
        status: 200,
        data,
    })
}

export const createUser = async (req, res) => {
    let { username, telephone } = req.body

    let usersData = await FS.readFile('users.json')
    usersData = JSON.parse(usersData) 

    let newUser = {
        userId: usersData.length > 0 ? (usersData.at(-1).userId + 1) : 1,
        username,
        telephone
    }

    usersData.push(newUser)

    FS.writeFile('users.json', usersData)

    return res.status(201).json({
        status: 201,
        message: 'User efficiently created!',
        data: newUser,
        token: JWT.sign(newUser, process.env.SECRET_KEY, {expiresIn: "1h"})
    })
}