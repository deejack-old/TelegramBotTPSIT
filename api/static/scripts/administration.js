document.addEventListener('DOMContentLoaded', async () => {
    let banTable = document.querySelector('#ban')
    let kickTable = document.querySelector('#kick')
    let muteTable = document.querySelector('#mute')
    let warnTable = document.querySelector('#warn')
    let events = await (await fetch('/administration/api/events')).json()
    console.log(events)
    events.bans.forEach(ban => banTable.appendChild(fillRow([` (${ban.userID})`, ` (${ban.adminID})`,
        new Date(ban.createdAt).toLocaleString(), new Date(ban.untilDate).toLocaleString(),
        ban.reason])))
    events.kicks.forEach(kick => kickTable.appendChild(fillRow([` (${kick.userID})`, ` (${kick.adminID})`,
        new Date(kick.createdAt).toLocaleString(), kick.reason])))
    events.mutes.forEach(mute => muteTable.appendChild(fillRow([` (${mute.userID})`, ` (${mute.adminID})`,
        new Date(mute.createdAt).toLocaleString(), new Date(mute.untilDate).toLocaleString(),
        mute.reason])))
    events.warns.forEach(warn => warnTable.appendChild(fillRow([` (${warn.userID})`, ` (${warn.adminID})`,
        new Date(warn.createdAt).toLocaleString(), warn.reason])))

    // console.log(events)
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