const repoNameValue = document.querySelector('.repo-name')
const autocompleteList = document.querySelector('.autocomplete-list')
let autocompleteListItem = document.querySelector('.autocomplete-list__item')
const repoListWrapper = document.querySelector('.repos-list-wrapper')
let resultItems

async function searchRepo (input) {
    if (input.value) {
        clearRepoList ()
        return await fetch(`https://api.github.com/search/repositories?q=${repoNameValue.value}&per_page=5`).then(res => {
          if (res.ok) {
            res.json().then(res =>{
             resultItems = res.items
             resultItems.forEach(item => {
                createAutocompleteListItem (item)
            });
            })
          }
        }).catch(err => console.log(err))
    } else {
        clearRepoList ()
    }
}

function createRepoListItem (item) {
    const repoListItem = document.createElement("li")
   
    repoListItem.classList.add('repos-list__item')
    const currentRepo = resultItems.find(elem => elem.name === item)
    
    const repoInfo = document.createElement("div")
    repoInfo.classList.add('repo-info')
    const name = document.createElement("p")
    name.textContent = `Name: ${currentRepo.name}`
    const owner = document.createElement("p")
    owner.textContent = `Owner: ${currentRepo.owner.login}`
    const stars = document.createElement("p")
    stars.textContent = `Stars: ${currentRepo.stargazers_count}`
    const deleteButton = document.createElement("button")
    deleteButton.classList.add('delete-repo')

    
    repoInfo.append(name, owner, stars)
    repoListItem.append(repoInfo, deleteButton)
    repoListWrapper.append(repoListItem);
     
}

function createAutocompleteListItem (item) {
  
  
  const autocompleteListItem = document.createElement("li")
  autocompleteListItem.classList.add('autocomplete-list__item')
  autocompleteListItem.textContent = `${item.name}`
  autocompleteList.append(autocompleteListItem)

    
}

function clearRepoList () {
    autocompleteList.innerHTML = ''
}

function debounce (fn, ms) {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), ms)
  }
}
const searchRepos = debounce(searchRepo, 500)
repoNameValue.addEventListener('input', (event) => {
  searchRepos (event.target)
  
} )

autocompleteList.addEventListener('click', (event) => {
    createRepoListItem (event.target.textContent)
    clearRepoList ()
    repoNameValue.value = ''
    }
)

repoListWrapper.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-repo')) {
    event.target.parentElement.remove()
  }
})
