import chalk from "chalk"
import FS from "../utils/FS.js"

export const getOrders = async (req, res) => {
    let orders = await FS.readFile('orders.json')
    orders = JSON.parse(orders)
    
    return res.status(200).json({
        status: 200,
        message: 'Orders fetched successfully!',
        data: orders
    })
}

export const getUserOrders = async (req, res) => {
    let id = Number(req.params.id)

    let ordersData = await FS.readFile('orders.json')
    ordersData = JSON.parse(ordersData)

    let userOrders = ordersData.filter((order) => order.userId === id)

    if(!userOrders.length) {
        return res.status(404).json({
            status: 404,
            message: 'User\'s orders not found',
            data: []
        })
    }

    let foods = await FS.readFile('foods.json')
    foods = JSON.parse(foods)

    userOrders = userOrders.map((userOrder) => {
        let foundFood = foods.find((food) => food.foodId === userOrder.foodId)
        
        return {...userOrder, foods: [foundFood]}
    })


    return res.status(200).json({
            status: 200,
            message: `orders of the userId: ${id} fetched successfully`,
            data: userOrders
        })
}


export const createOrder = async (req, res) => {
    let {userId, foodId, count} = req.body
    userId = Number(userId) 
    foodId = Number(foodId) 
    count = Number(count) 

    let orders = await FS.readFile('orders.json')
    orders = JSON.parse(orders)
    
    let isOrderCreated = orders.find((order) => order.foodId === foodId && userId === order.userId) 

    if(isOrderCreated) {
        isOrderCreated.count = count
        FS.writeFile('orders.json', orders)

        return res.status(201).json({
            status: 201,
            message: 'Updated successfully',
            data: isOrderCreated
        })
    }

    let newOrder = {
        id: orders.length ? (orders.at(-1).id + 1) : 1,
        userId,
        foodId,
        count
    }

    orders.push(newOrder)

    FS.writeFile('orders.json', orders)

    return res.status(201).json({
        status: 201,
        message: 'Created successfully',
        data: newOrder
    })
}