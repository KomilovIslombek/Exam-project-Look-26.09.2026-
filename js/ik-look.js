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

        this.render()
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

    saveUsersToLocalStorage() {
        localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.state.users)
        )
    }

    render() {
        const users = this.state.users

        this.customersListElement.innerHTML = users.map(({userId, username, contact}) => {
            return `<li class="customer-item" data-user-id="${userId}" data-user-name="${username}">
						<span class="customer-name">${username}</span>
						<a class="customer-phone" href="tel:${contact}">${contact}</a>
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

    addUser(newUser) {
        if(!newUser.contact) return 'new User is not defined!'
        
        this.state.users.push(newUser)
        this.saveUsersToLocalStorage();
        this.render()
    }

    onAdFormSubmit = (event) => {
        event.preventDefault()

        const username = event.target.username.value.trim()
        const contact = event.target.contact.value.trim()

        if(!username || username.length > 30){
            return alert('Invalid username!')
        }
        if(!(/^998(9[0123456789|3[3]|7[1]|8[8])[0-9]{7}$/).test(contact)){
            return alert('Invalid contact!')
        }

        const newUser = {
            userId: crypto.randomUUID(),
            username: username ?? '',
            contact: contact ?? ''
        }

        this.addUser(newUser)
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