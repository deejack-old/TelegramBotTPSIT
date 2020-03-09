document.addEventListener('DOMContentLoaded', async () => {
    registerMessageForm()

    showEvents()

    showUsers()

    showAdmins()
})

async function showUsers() {
    let usersTable = document.querySelector('#users')
    let users = await (await fetch('/administration/api/info/users')).json()
    console.log(users)
    users.forEach((user) => {
        let row = fillRow([user.name, user.roleID])
        let searchEvents = createButton('Search', () => {})
        let ban = createButton('Ban', () => {
            fetch('administration/ban', { body: JSON.stringify({ id: user.id }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        })
        let kick = createButton('Kick', () => {
            fetch('administration/kick', { body: JSON.stringify({ id: user.id }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        })
        let promote = createButton('Promote', () => {
            fetch('administration/promote', { body: JSON.stringify({ id: user.id }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        })
        row.append(createCell(searchEvents), createCell(ban), createCell(kick), createCell(promote))
        usersTable.appendChild(row)
    })
}

async function showAdmins() {
    let adminsTable = document.querySelector('#admins')
    let admins = await (await fetch('/administration/api/info/admins')).json()
    console.log(admins)
    admins.forEach((admin) => {
        let row = fillRow([admin.name, admin.roleID])
        let searchEvents = createButton('Search', () => {})
        let promote = createButton('Promote', () => {
            fetch('administration/promote', { body: JSON.stringify({ id: admin.id }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        })
        let demote = createButton('Demote', () => {
            fetch('administration/demote', { body: JSON.stringify({ id: admin.id }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        })
        row.append(createCell(searchEvents), createCell(promote), createCell(demote))
        adminsTable.appendChild(row)
    })
}

function createButton(text, callback) {
    let button = document.createElement('button')
    button.textContent = text
    button.classList.add('btn', 'btn-primary')
    button.addEventListener('click', callback)
    return button
}

function createCell(childs) {
    let cell = document.createElement('td')
    cell.append(childs)
    return cell
}

function registerMessageForm() {
    let form = document.querySelector('#sendMessage')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let text = document.querySelector('#text').value
        let result = await fetch('administration/send', { body: JSON.stringify({ text: text }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        if (result.status === 200) {
            alert('Messaggio inviato')
        } else alert('Errore')
    })
}

async function showEvents() {
    let banTable = document.querySelector('#ban')
    let kickTable = document.querySelector('#kick')
    let muteTable = document.querySelector('#mute')
    let warnTable = document.querySelector('#warn')
    let request = await fetch('/administration/api/events')
    let events = await request.json()
    // events.bans.forEach(ban => banTable.appendChild(fillRow([`${ban.userName} (${ban.userID})`, `${ban.adminName} (${ban.adminID})`,
    //     new Date(ban.createdAt).toLocaleString(), new Date(ban.untilDate).toLocaleString(),
    //     ban.reason])))
    // events.kicks.forEach(kick => kickTable.appendChild(fillRow([`${kick.userName} (${kick.userID})`, `${kick.adminName} (${kick.adminID})`,
    //     new Date(kick.createdAt).toLocaleString(), kick.reason])))
    events.mutes.forEach(mute => muteTable.appendChild(fillRow([`${mute.userName} (${mute.userID})`, `${mute.adminName} (${mute.adminID})`,
        new Date(mute.createdAt).toLocaleString(), new Date(mute.untilDate).toLocaleString(),
        mute.reason])))
    events.warns.forEach(warn => warnTable.appendChild(fillRow([`${warn.userName} (${warn.userID})`, `${warn.adminName} (${warn.adminID})`,
        new Date(warn.createdAt).toLocaleString(), warn.reason])))
}

function fillRow(values) {
    let row = document.createElement('tr')
    values.forEach(value => {
        let cell = document.createElement('td')
        cell.textContent = value
        row.appendChild(cell)
    })
    return row
}