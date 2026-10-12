import FS from "../utils/FS.js"

export const getFoods = async (req, res) => {
    let foods = await FS.readFile('foods.json')
    foods = JSON.parse(foods)

    return res.status(200).json({
        status: 200,
        message: 'Foods fetched successfully',
        data: foods
    })
}

export const getFoodById = async (req, res) => {
    let foodId = Number(req.params.id) 

    let foods = await FS.readFile('foods.json')
    foods = JSON.parse(foods)

    let foundFood = foods.find(({id}) => id === foodId)

    return res.status(200).json({
        status: 200,
        message: 'Food by id fetched properly',
        data: foundFood
    })
}