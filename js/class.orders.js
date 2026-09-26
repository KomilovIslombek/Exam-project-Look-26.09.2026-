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

    async initClickedUser() {
        try {
            const res = await axios.get(API+'/users')

            if(res.data.status == 200) {
                console.log(res.data.data[0]);
                
                return res.data.data[0]
            }
        } catch (error) {
            console.error('Error init clickedUser:', error);
            return null
        }
        
    }

    async getOrdersFromBackend() {
        try {
            let clickedUserId = this.state?.clickedUser?.userId || 1

            const res = await axios.get(API+`/orders/${clickedUserId}`)
            
            if(res.data.status == 200) {
                this.saveOrdersToLocalStorage(res.data.data)
                
                // this.render()

                return res.data.data 
            }
            
        } catch (error) {
            console.error('Error fetching orders:', error);
            return []
        }
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

    saveOrdersToLocalStorage(orders) {
        localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(orders)
        )
    }

    async addOrder(order) {
        if(!order.userId) return;

        try {
            const res = await axios.post(API+'/orders', order)

            if(res.data.status == 201) {
                console.log('again render 201')
                this.render()
            }
        } catch (err) {
            alert(err.response);
            console.log('error in the post order', err.response);
            
        }

    }
    
    onFoodsFormSubmit = async (e) => {
        e.preventDefault();

        const foodId = e.target.foodId.value.trim()
        const count = e.target.count.value.trim()
        const userId = this.clientIdElement.textContent.trim() || null

        if(
            !count ||
            +count > 10 || 
            !userId
        ) return alert(`Error: count: ${count} / userId: ${userId}`)
        
        let orders = await this.getOrdersFromBackend()
        
        const order = {foodId,userId,count}
        this.addOrder(order)

    }

    bindEvents() {
        this.foodsFormElement.addEventListener('submit', this.onFoodsFormSubmit)
    }

    updateStateClickedUser(clickedUser) {
        this.state.clickedUser = clickedUser
    }

    async render(userId = this.state.clickedUser?.userId || null, userName = this.state.clickedUser?.username || null) {
        let orders = await this.getOrdersFromBackend() || null
        console.log('inside render', orders);
        
        let initClickedUser = await this.initClickedUser() || null

        if(userId) {
            this.clientNameElement.textContent = userName
            this.clientIdElement.textContent = userId
        } else {
            this.clientNameElement.textContent = initClickedUser.username
            this.clientIdElement.textContent = initClickedUser.userId
        }
        

        this.ordersListElement.innerHTML = orders?.map(order => 
            {   
            
                const foundFood = order.foods[0]
                if(!foundFood) return;

                const { food_name, food_img } = foundFood;

                return `
                <li class="order-item">
                    <img src="${API}${food_img}">
                    <div>
                        <span class="order-name">${food_name}</span>
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
        
        this.render();
    }

    async getFoodsFromBackend() {
        try {
            const res = await axios.get(API+'/foods')
            
            if(res.data.status == 200) {
                return res.data.data 
            }
            
        } catch (error) {
            alert('Error fetching foods:', error);
            return;
        }
    }

    async render() {
        const foods = await this.getFoodsFromBackend() || []
        this.menuSelectElement.innerHTML = foods.map(({foodId, food_name}) => `
        <option value="${foodId}">${food_name}</option>
        `).join('');
    }
}

new Menu()