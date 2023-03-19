const formEl = document.querySelector('form');
const repositoriesEl = document.querySelector('.repositories');
const errorEl = document.querySelector('.error');
const formSearch = formEl.elements.search


formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputValue = Object.fromEntries(new FormData(e.target))
    const error = validate(inputValue.name);
    if (error) {
        errorEl.classList.add('show');
        errorEl.textContent = error;
        return;
    }
    repositoriesEl.innerHTML = "";

    const response = await fetch(`https://api.github.com/search/repositories?q=${inputValue.name}in:name&per_page=10`);

    try {
        const data = await response.json();
        console.log(data.items);
        const repositoriesElements = data.items.map((repository) =>
            createRepo({
                avatar: repository.owner.avatar_url,
                name: repository.name,
                link: repository.html_url,
                ownerLink: repository.owner.html_url,
                owner: repository.owner.login,
                description: repository.description ?? "-",
                language: repository.language ?? "-",
            })
            
        );
        console.log(repositoriesElements.name);
        if (repositoriesElements.length === 0) {
            repositoriesEl.innerHTML = `<li class="not-found">Ничего не найдено...</li>`;
        } else {
            repositoriesEl.append(...repositoriesElements);
            
        }
    } catch (error) {
        console.log(error);
        repositoriesEl.innerHTML = `<li class="error">Что-то пошло не так..</li>`;
    }


})

function createRepo({ avatar, name, link, ownerLink, owner, description, language }) {
    const repository = document.createElement('li')
    repository.className = 'repositoryes__item';
    repository.innerHTML = `
    <div class= 'wrapper'>
    <div class = 'repositoryes__avatar'>
    <img class="avatar"src=${avatar}/>
    </div>
    <div class = 'repositoryes__card'>
    <a class="linkName" target="_blank" href=${link}>${name}</a>
    <p><b></b>Пользователь:<a href=${ownerLink} target="_blank"> ${owner}</a></p>
    <p><b>Язык программирования:</b> ${language}</p>
    <p><b>Описание:</b> ${description}</p>
        </div>
        </div>
    `
    return repository;
}


function validate(value) {
    let errorText = "";
    if (value.length <= 2) {
        errorText = "Введите больше двух симоволов";
    }
    return errorText;
}


formSearch.addEventListener('input', () => {
    if (errorEl.classList.contains("show")) {
        errorEl.classList.remove("show");
        errorEl.textContent = "";
    }
})