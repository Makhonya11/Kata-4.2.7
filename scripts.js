const repoNameValue = document.querySelector('.repo-name')
const autocompleteList = document.querySelector('.autocomplete-list')
let autocompleteListItem = document.querySelector('.autocomplete-list__item')
const repoListWrapper = document.querySelector('.repos-list-wrapper')
let resultItems

async function searchRepo () {
    if (repoNameValue.value) {
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
    
    repoListItem.insertAdjacentHTML('afterbegin', `<div class="repo-info">
                                                   <p>Name: ${currentRepo.name}</p>
                                                   <p>Owner: ${currentRepo.owner.login}</p>
                                                   <p>Stars: ${currentRepo.stargazers_count}</p>
                                                   </div><button class="delete-repo"></button>`)
    repoListWrapper.append(repoListItem);
}

function createAutocompleteListItem (item) {
    
     autocompleteList.insertAdjacentHTML('afterbegin', `<li class="autocomplete-list__item">${item.name}</li>`)
}

function clearRepoList () {
    autocompleteList.innerHTML = ''
}

function debounce (fn, ms) {
  let timeoutId
  return () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(), ms)
  }
}
const searchRepos = debounce(searchRepo, 500)
repoNameValue.addEventListener('keyup', searchRepos)

autocompleteList.addEventListener('click', (event) => {
    createRepoListItem (event.target.textContent)
    }
)

repoListWrapper.addEventListener('click', (event) => {
  if (event.target.classList.contains('delete-repo')) {
    event.target.parentElement.remove()
  }
})
