
const usersArray = []

const userJoinHelper = (id,username, room) => {
  const user = { id,username, room }
  usersArray.push(user)
  return user
}

const userDeleteHelper = (id) => {
  const index = usersArray.findIndex(el => el.id == id)
  if (index >= 0) {
    usersArray.splice(index,1)
  }
}

module.exports = { userJoinHelper, userDeleteHelper, usersArray }