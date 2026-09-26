class Users {
    selectors = {
        userAdForm: '#userAdd',
        customersList: '.customers-list',
        customerItem: '.customer-item',
    }

    localStorageKey = 'users' || 'look:customers';

    constructor() {
        this.userAdFormElement = document.querySelector(this.selectors.userAdForm)
        this.customersListElement = document.querySelector(this.selectors.customersList)
        this.state = {
            users: this.getUsersFromLocalStorage()
        }

        this.getUsersFromBackend()
        this.bindEvents()
    }


    getUsersFromLocalStorage() {
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

    async getUsersFromBackend() {
        try {
            const res = await axios.get(API+'/users')
            
            if(res.data.status == 200) {
                this.saveUsersToLocalStorage(res.data.data)
                
                this.render()

                return res.data.data 
            }
            
        } catch (error) {
            console.error('Error fetching users:', error);
            return []
        }
    }

    saveUsersToLocalStorage(users) {
        localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(users)
        )
    }

    render() {
        const users = this.getUsersFromLocalStorage()

        this.customersListElement.innerHTML = users.map(({userId, username, telephone}) => {
            return `<li class="customer-item" data-user-id="${userId}" data-user-name="${username}">
						<span class="customer-name">${username}</span>
						<a class="customer-phone" href="tel:${telephone}">${telephone}</a>
					</li>`
        }).join('')

        this.customersListElement
            .querySelectorAll(this.selectors.customerItem)
            .forEach((customerItem) => {
                customerItem.addEventListener('click', this.onCustomersListClick)
            })

        if(users.length < 1) {
            this.customersListElement.innerHTML = `<h3 class="empty-users">There are no users yet.</h3>`
        }
    }

    onAdFormSubmit = async (event) => {
        event.preventDefault()

        const username = event.target.username.value.trim()
        const telephone = event.target.contact.value.trim()

        if(!username || username.length > 30){
            return alert('Invalid username!')
        }
        if(!(/^998(9[0123456789|3[3]|7[1]|8[8])[0-9]{7}$/).test(telephone)){
            return alert('Invalid contact!')
        }

        try {
            const res = await axios.post(API+'/users', {username, telephone})
            console.log();
            if(res.data.status == 201) {
                this.getUsersFromBackend()
            }
        } catch (err) {
            alert(err.response);
            console.log(err.response);
            
        }
        

        event.target.username.focus();
        event.target.username.value = ''
        event.target.contact.value = ''
    }

    onCustomersListClick(event) {
        const customerItem = event.currentTarget
        const userId = customerItem.dataset.userId
        const userName = customerItem.dataset.userName


        // document.querySelector('.customer-name').textContent = userName
        // document.querySelector('#clientId').textContent = userId

        window.localStorage.setItem('clickedUser', JSON.stringify({userId, username: userName}))
        ordersManager.updateStateClickedUser(userId ? {userId, username: userName} : null)
        ordersManager.render(userId, userName)
    }

    bindEvents() {
        this.userAdFormElement.addEventListener('submit', this.onAdFormSubmit)
    }
}

new Users()

// userId && (clientId.textContent = userId)
// username && (customerName.textContent = username)

// document.querySelector('.customer-name').textContent = userName
// document.querySelector('#clientId').textContent = userId

// document.querySelector('.customer-name')