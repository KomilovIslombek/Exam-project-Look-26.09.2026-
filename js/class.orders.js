class Orders {
    selectors = {
        ordersList: '.orders-list',
        foodsForm: '#foodsForm',
        clientName: '.customer-name',
        clientId: '#clientId'
    } 

    localStorageKey = 'orders' || 'look:orders'
    localStorageClickedUserKey = 'clickedUser'

    constructor() {
        this.ordersListElement = document.querySelector(this.selectors.ordersList)
        this.foodsFormElement = document.querySelector(this.selectors.foodsForm)
        this.clientIdElement = document.querySelector(this.selectors.clientId)
        this.clientNameElement = document.querySelector(this.selectors.clientName)
        this.state = {
            orders: this.getOrdersFromLocalStorage(),
            clickedUser: JSON.parse(window.localStorage.getItem(this.localStorageClickedUserKey)) || null
        }
        
        this.render(this.state?.clickedUser?.userId)
        this.bindEvents()
    }

    getOrdersFromLocalStorage() {
        const rawData = localStorage.getItem(this.localStorageKey)

        if (!rawData) {
            return []
        }

        try {
            const parsedData = JSON.parse(rawData)
            return Array.isArray(parsedData) ? parsedData : []
        } catch {
            console.error('Todo items parse error')
            return []
        }
    }

    saveOrdersToLocalStorage() {
        localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.state.orders)
        )
    }

    addOrder(order) {
        this.state.orders.push(order)
        this.saveOrdersToLocalStorage()
        this.render()
    }
    
    onFoodsFormSubmit = (e) => {
        e.preventDefault();

        const foodId = e.target.foodId.value.trim()
        const count = e.target.count.value.trim()
        const userId = this.clientIdElement.textContent.trim() || null

        if(
            !count ||
            +count > 10 || 
            !userId
        ) return alert(`Error: count: ${count} / userId: ${userId}`)
        
        let order = this.state.orders.find(el => el.foodId == foodId && el.userId == userId)
        
        if(order){
            order.count = +count + +order.count
        }
        else{
            const order = {foodId,userId,count}
            this.addOrder(order)
        }

    }

    bindEvents() {
        this.foodsFormElement.addEventListener('submit', this.onFoodsFormSubmit)
    }

    updateStateClickedUser(clickedUser) {
        this.state.clickedUser = clickedUser
    }

    render(userId = this.state.clickedUser.userId, userName = this.state.clickedUser.username) {
        let orders = this.state.orders

        if(userId) {
            orders = this.state.orders.filter((generalOrder) => generalOrder.userId === userId);
            
            console.log('newUsername', this.state.clickedUser.username);
            
            this.clientNameElement.textContent = userName
            this.clientIdElement.textContent = userId
        }
        

        this.ordersListElement.innerHTML = orders.map(order => 
            {   
            
                const foundFood = foods.find(({foodId}) => foodId == order.foodId)
                if(!foundFood) return;

                const { foodName, foodImg } = foundFood;

                return `
                <li class="order-item">
                    <img src="${foodImg}">
                    <div>
                        <span class="order-name">${foodName}</span>
                        <span class="order-count">${order.count}</span>
                    </div>
                </li>`
            }
        ).join('')
        
    }

}

const ordersManager = new Orders()



class Menu {
    selectors = {
        menuSelect: '#foodsSelect'
    }

    constructor() {
        this.menuSelectElement = document.querySelector(this.selectors.menuSelect)
        this.state = {
            foods: foods || null
        }
        this.render();
    }

    render() {

        this.menuSelectElement.innerHTML = this.state.foods.map(({foodId, foodName}) => `
        <option value="${foodId}">${foodName}</option>
        `).join('');
    }
}

new Menu()