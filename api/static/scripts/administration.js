document.addEventListener('DOMContentLoaded', async () => {
    let form = document.querySelector('#sendMessage')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        let text = document.querySelector('#text').value
        let result = fetch('administration/send', { body: JSON.stringify({ text: text }), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
        if (result) {
            alert('Messaggio inviato')
        } else alert('Errore')
    })

    let banTable = document.querySelector('#ban')
    let kickTable = document.querySelector('#kick')
    let muteTable = document.querySelector('#mute')
    let warnTable = document.querySelector('#warn')
    let events = await (await fetch('/administration/api/events')).json()
    events.bans.forEach(ban => banTable.appendChild(fillRow([`${ban.userName} (${ban.userID})`, `${ban.adminName} (${ban.adminID})`,
        new Date(ban.createdAt).toLocaleString(), new Date(ban.untilDate).toLocaleString(),
        ban.reason])))
    events.kicks.forEach(kick => kickTable.appendChild(fillRow([`${kick.userName} (${kick.userID})`, `${kick.adminName} (${kick.adminID})`,
        new Date(kick.createdAt).toLocaleString(), kick.reason])))
    events.mutes.forEach(mute => muteTable.appendChild(fillRow([`${mute.userName} (${mute.userID})`, `${mute.adminName} (${mute.adminID})`,
        new Date(mute.createdAt).toLocaleString(), new Date(mute.untilDate).toLocaleString(),
        mute.reason])))
    events.warns.forEach(warn => warnTable.appendChild(fillRow([`${warn.userName} (${warn.userID})`, `${warn.adminName} (${warn.adminID})`,
        new Date(warn.createdAt).toLocaleString(), warn.reason])))
})

function fillRow(values) {
    let row = document.createElement('tr')
    values.forEach(value => {
        let cell = document.createElement('td')
        cell.textContent = value
        row.appendChild(cell)
    })
    return row
}