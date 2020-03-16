const Event = require('./event')
const TelegramBot = require('node-telegram-bot-api')
const botService = require('../services/bot')
const GroupModel = require('../../database/models/Group')
const GroupOptions = require('../../database/models/GroupOptions')
const GroupMemberModel = require('../../database/models/GroupMember')
const Captcha = require('../../database/models/Captcha')
const groupService = require('../../database/services/group')
const userService = require('../../database/services/users')

class TextEvent extends Event {
    constructor() {
        super('left_chat_member', 'When a user leaves the group')
    }

    /** @param {TelegramBot.Message} message */
    async onEvent(event) {
        console.log({ leave: event })
        let user = event.left_chat_member
        let member = await userService.getGroupMember(user.id, event.chat.id)
        if (member.roleID < 3) {
            userService.updateRole(user.id, event.chat.id, 3)
        }
    }
}

module.exports = TextEvent