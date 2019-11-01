let currentPage = 1
const forwardButton = document.querySelector('#forward')
const backButton = document.querySelector('#back')
const newMonsterForm = document.querySelector('#new-monster-form')

// perform intial request to load monsters
getMonsters()
forwardButton.addEventListener('click', (event) => {
  updateMonsterByAmount(1)
})

backButton.addEventListener('click', (event) => {
  if (currentPage > 1) {
    updateMonsterByAmount(-1)
  }
})

newMonsterForm.addEventListener('submit', (event) => {
  event.preventDefault()
  const monster = { 
    name: event.target.name.value,
    age: event.target.age.value,
    description: event.target.description.value
  }
  const config = postMonsterConfig(monster)
  fetch('http://localhost:3000/monsters', config) //eslint-disable-line
  event.target.name.value = ''
  event.target.age.value = ''
  event.target.description.value = ''
})
function updateMonsterByAmount (amount) {
  currentPage += amount
  getMonsters()
  scrollTo(0,0) //eslint-disable-line
}
function getMonsters () {
  fetch(`http://localhost:3000/monsters?_limit=50&_page=${currentPage}`) //eslint-disable-line
    .then(response => response.json())
    .then(processMonstersFromRequest)
}

function processMonstersFromRequest (monsters) {
  const monsterDivContainer = document.querySelector('#monster-container')
  monsterDivContainer.innerHTML = ''
  for (const monster of monsters) {
    addOneMonsterToParent(monster, monsterDivContainer)
  }
}

function addOneMonsterToParent (monster, container) {
  const monsterDiv = createAndAppendWithCallback('div', container)
  createAndAppendWithCallback('h2', monsterDiv, (element) => {
    element.innerText = monster.name
  })

  createAndAppendWithCallback('h4', monsterDiv, (element) => {
    element.innerText = monster.age
  })

  createAndAppendWithCallback('p', monsterDiv, (element) => {
    element.innerText = monster.description
  })
}

function postMonsterConfig (monster) {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(monster)
  }
}

function createAndAppendWithCallback (tag, parent, callback) {
  const element = document.createElement(tag)
  parent.append(element)
  if (callback !== undefined) {
    callback(element)
  }
  return element
}
