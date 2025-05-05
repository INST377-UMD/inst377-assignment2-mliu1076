const dogCommands = {
    'Load Dog Breed *breed': (breed) => {
        breedInfoArea.innerHTML = '';
        const breedArea = document.createElement('div')
        breedArea.setAttribute('id', `container-${breed.id}`)

        const name = document.createElement('h2')
        name.textContent = 'Name: ' + breed.attributes.name

        const description = document.createElement('h3')
        description.textContent = 'Description: ' + breed.attributes.description

        const minLife = document.createElement('h3')
        minLife.textContent = 'Min Life: ' + breed.attributes.life.min

        const maxLife = document.createElement('h3')
        maxLife.textContent = 'Max Life: ' + breed.attributes.life.max

        breedArea.appendChild(name)
        breedArea.appendChild(description)
        breedArea.appendChild(minLife)
        breedArea.appendChild(maxLife)
        breedInfoArea.appendChild(breedArea)
    },
};

function loadDogAPI() { // loads random dog images from API
    return fetch('https://dog.ceo/api/breeds/image/random').then((data) =>
        data.json()
    )
};

window.onload = function () {
    if (annyang) {
        annyang.addCommands(dogCommands); // adds new dog command
    }
    loadCarousel();
    loadBreedAPI();
};

async function loadCarousel() { // Get 10 images and add to carousel
    carousel = document.getElementById('dogCarousel')
    carousel.innerHTML = '';

    let dogImages = []
    for (let i = 0; i < 10; i++) {
        const dogImage = await loadDogAPI();
        console.log(dogImage['message'])
        const image = document.createElement('img');
        image.src = dogImage['message']
        dogImages.push(image)

    }
    dogImages.forEach((i) => carousel.appendChild(i))
    simpleslider.getSlider();
}

async function loadBreedAPI() { // generates 10 random dog breed buttons and adds their information when clicked
    const selectedBreed = [];
    try {
        for (let i = 0; i < 10; i++) {
            const randomNum = Math.floor(Math.random() * 29) + 1;
            const response = await fetch(`https://dogapi.dog/api/v2/breeds?page[number]=${randomNum}`);
            const data = await response.json();
            const breeds = data.data;
            const randomDog = Math.floor(Math.random() * breeds.length);
            selectedBreed.push(breeds[randomDog]);
        }
        const buttonArea = document.getElementById('buttons-container');
        const breedInfoArea = document.getElementById('breed-info');


        selectedBreed.forEach(breed => {
            const button = document.createElement('button')
            button.textContent = breed.attributes.name
            button.className = 'button-7'
            button.setAttribute('breed-id', breed.id)

            button.addEventListener('click', () => {
                const breedInfo = document.getElementById('breed-info');
                breedInfo.style.border = '3px solid white';
                breedInfoArea.innerHTML = '';
                const breedArea = document.createElement('div')
                breedArea.setAttribute('id', `container-${breed.id}`)

                const name = document.createElement('h2')
                name.textContent = 'Name: ' + breed.attributes.name

                const description = document.createElement('h3')
                description.textContent = 'Description: ' + breed.attributes.description

                const minLife = document.createElement('h3')
                minLife.textContent = 'Min Life: ' + breed.attributes.life.min

                const maxLife = document.createElement('h3')
                maxLife.textContent = 'Max Life: ' + breed.attributes.life.max

                breedArea.appendChild(name)
                breedArea.appendChild(description)
                breedArea.appendChild(minLife)
                breedArea.appendChild(maxLife)
                breedInfoArea.appendChild(breedArea)

            })
            buttonArea.appendChild(button)

        });

    } catch (error) {
        console.error('Error fetching dog breeds: ', error)
    }
};


