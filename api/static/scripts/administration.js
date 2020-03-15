document.addEventListener('DOMContentLoaded', async () => {
    registerMessageForm()
})

async function unban(banID, button) {
    let response = await executeRequest('/administration/api/events/ban', 'DELETE', { id: banID })
    if (response.status === 200) {
        button.style.display = 'none'
        let enabled = button.parentElement.previousElementSibling.children[0]
        enabled.className = 'icon-remove'
    } else {
        alert('Errore')
    }
}

async function unmute(muteID, button) {
    let response = await executeRequest('/administration/api/events/mute', 'DELETE', { id: muteID })
    if (response.status === 200) {
        button.style.display = 'none'
        let enabled = button.parentElement.previousElementSibling.children[0]
        enabled.className = 'icon-remove'
    } else {
        alert('Errore')
    }
}

async function unwarn(warnID, button) {
    let response = await executeRequest('/administration/api/events/warn', 'DELETE', { id: warnID })
    if (response.status === 200) {
        button.style.display = 'none'
        let enabled = button.parentElement.previousElementSibling.children[0]
        enabled.className = 'icon-remove'
    } else {
        alert('Errore')
    }
}

async function ban(id, userID, button) {
    let response = await executeRequest('/administration/api/events/ban', 'POST', { id: id, userID: userID })
    if (response.status === 200) {
        alert('Utente bannato per 1 giorno')
    } else {
        alert('Errore')
    }
}

async function kick(id, userID, button) {
    let response = await executeRequest('/administration/api/events/kick', 'POST', { id: id, userID: userID })
    if (response.status === 200) {
        alert('Utente kickato')
    } else {
        alert('Errore')
    }
}

async function promote(id, button) {
    let response = await executeRequest('/administration/api/admins/promote', 'POST', { id: id })
    if (response.status === 200) {
        alert('Utente promosso')
    } else {
        alert('Errore')
    }
}

async function demote(id, button) {
    let response = await executeRequest('/administration/api/admins/demote', 'POST', { id: id })
    if (response.status === 200) {
        alert('Utente degradato')
    } else {
        alert('Errore')
    }
}

function executeRequest(url, method, body) {
    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })
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