/*
Author: Ing(c) Mateo Giraldo Arboleda
Primer Bootcamp "piscina-42" UTP sobre fullstack
Date: 2023-01-13
*/

//Start at the top
window.scrollTo(0, 0);


//Shuffle an array's content
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

//Array containing all possible cards
let pairs = ["maria", "maria", "jose", "jose", "jesus", "jesus", "melchor", "melchor", "gaspar", "gaspar", "baltazar", "baltazar", "pastor", "pastor", "mula", "mula"];
shuffle(pairs);

//--------------------------------------------------------
const startBtn = document.getElementById("btn-comenzar");//Object that takes the btn "comenzar"
//Using both the object a bunch of events we get that...
startBtn.addEventListener('click', ()=> {
    //Important info: classList.toggle either adds or deletes (if existing) a class to an object
    startBtn.parentNode.parentNode.parentNode.classList.toggle('hide-modal');//Getting the div that contains the whole modal from the button, so this way we can hide it once the "comenzar" button is clicked 
    document.querySelector('body').classList.toggle('no-scroll')//Once startbtn is clicked we let the user scroll by deleting "no-scroll" class
    playAudio('intro')//plays background audio
});
//--------------------------------------------------------


//--------------------------------------------------------
const gameBtn = document.getElementById("btn-juego");//Object that takes the btn "juego"
gameBtn.addEventListener('click', ()=> {
    if (counter == 8) location.reload();//makes sure the game hasn't finished, if it has, then the click makes a reload
    gameBtn.parentNode.parentNode.parentNode.parentNode.parentNode.classList.toggle('hide-modal');//we get to the top by entering on gameBtn and we take out the hide modal class
    document.querySelector('body').classList.toggle('no-scroll')//After clickling on the button it lets the user to scroll again
    beat.pause();//music stops
});
//--------------------------------------------------------
const gameModal = document.getElementById("modal-juego");//Object that takes the modal "juego"
const textModal = document.getElementById("texto");//Object that at the beggining it's just a p label without any text
const finalModal = document.getElementById("modal-final");//Object that takes the final modal 

//--------------------------------------------------------
const finalBtn = document.getElementById("btn-final");//Object that takes the final btn to reload the page
finalBtn.addEventListener('click', ()=> {
    if (counter == 8) location.reload();//makes sure the game hasn't finished, if it has, then the click makes a reload
    
});
//--------------------------------------------------------
const game = document.getElementById("game");//Object that grabs the whole game for later use
let counter = 0;//Global counter used to know when the game has finished
let beat = new Audio('');//Variable of different audios that will be played
let templateCard = document.getElementById("template-card").content;//grabs the template on html to re-set it later on so the template appears in the screen
let state = [0, null];//Global array, index 0, let's the next fonctions know what click are we on, and index 1, saves the target that was clicked

//Spawns 16 cards with their respective class
function createCards(){
    let clone;//clones what is needed to make the fonction work...
    //a cicle that generates 16 cards
    for (let i=0; i<16; i++){
        clone = templateCard.cloneNode(true);//clone now, clones a node from templateCard
        clone.querySelector('.carta').id = 'carta-' + i;//Now, since clone is teh template, we select from this template, class .carta we get the id "carta-" and add the number "i" is on, so this way we give a number between 1-16 to each card
        clone.querySelector(".card-back").classList.add(pairs[i]);//from clone we add a class to the ".card-black"'s labels. The class it is adding is basically the name of the card since all of them have different images
        document.getElementById(Math.ceil((i+1)/4)).appendChild(clone);//Math.ceil rounds a number to it's closest integer, we add the new child "clone" to a respective row gotten from the operation
        let carta = document.getElementById('carta-' + i);//Now we get the respective card for each i
        setTimeout(() => {
            carta.classList.toggle("hide-modal");//adds the class "hide-modal" if it doesn't exist or deletes it if existing
        }, 200 + (150 * i));//from first card to the last card, the animation each time takes longer so we can se the effect

        setTimeout(() => {
            carta.classList.toggle("cardAnimation");//adds the class so the card makes the animation created in css
        }, 200 + (150 * i));//from first card to the last card, the animation each time takes longer so we can se the effect
    }
}

//Flips the card (animation)
const flipCard = card => card.parentNode.classList.toggle('is-flipped');

//Game functionality
function checkState(state, target){
    //which click are we on
    switch (state[0]){
        //first click
        case 1:
            playAudio('incorrecta');//each time we click on a card an audio is played by using this simple fonction 
            state[1] = target;//Asignning the target to the index 1 from the array
            break;
        //second click
        case 2:
            setTimeout(() => {
                if (state[1].classList[3] == target.classList[3]){//checking if both cards are the same
                    counter++;//counter = counter + 1
                    playAudio('correcta');//plays the audio that represents the right answer
                    state[0] = 0;//resets the array
                    if (counter == 8){//makes sure if user has won or not
                        winnerModal(state[1].classList[3]);//invokes the winnermodal fonction so like that it appears on screen when winning
                    } else{
                        setTimeout(()=>playAudio(state[1].classList[3]), 300)//if user hasn't win, it just plays an audio due to 2 cards guessed
                        updateModal(state[1].classList[3]);//invokes the modal that corresponds to each card
                    }
                    return;
                }
                playAudio('incorrecta');//if both cards clicked aren't the same plays the audio that corresponds to the wrong answer
                flipCard(state[1]);//flips card back again
                flipCard(target);//flips the first card again
                state[0] = 0;//resets the array
            }, 800)//all of this happens in a matter of 0,8s for better experience
            break;
    }
}

//Modal funcitonality (appears on screen)
function updateModal(objectClass){
    window.scrollTo(0, 0);//Goes to the top of the window
    gameModal.classList.toggle("hide-modal");//adds the class "hide-modal" if it doesn't exist or deletes it if existing
    document.querySelector('body').classList.toggle('no-scroll');//doesn't let the user scroll
    document.querySelector('.modal-'+ objectClass).classList.toggle('show-item');//shows modal if not existing
    textModal.innerText = setModalText(objectClass);//by calling the fonction setModalText it sets the different text for each modal
    //The following part, by giving 3s to the animation to happen takes out the silhoutte from the pesebre
    setTimeout(() => {
        document.querySelector('.modal-' + objectClass).classList.toggle('show-item');
        document.querySelector('.modal-' + objectClass).classList.toggle('hide-modal');
    }, 3000);
    
}

//Winner modal (appears on screen)
function winnerModal(objectClass){
    window.scrollTo(0, 0);//Goes to the top of the window
    playAudio('final');//plays the audio for the end of the game
    //lets the user see the animation by deleting the class that already exists and hiding
    document.querySelector('.modal-'+ objectClass).classList.toggle('show-item');
    finalModal.classList.toggle("hide-modal");
    document.querySelector('body').classList.toggle('no-scroll');//doesn't let the user scroll the page
}

//Sets some text according to the class
function setModalText(objectClass){
    let string = ''//variable used to save the string that is needed
    //basically sets the text for each card that has a class
    switch(objectClass){
        case 'melchor':
            string = 'El villancico es un género de cancion cuya letra hace referencia a la navidad.';
            break;
        case 'baltazar':
            string = 'A la nanita nana es un villancio compuesto por Jeremías Quintero, oriundo de Barbacoas, Nariño.';
            break;
        case 'gaspar':
            string = 'La palabra tutaina es utilizada en Perú para referirse coloquialmente a una fiesta pequeña, por lo que el título de este villancico se refiere a la celebración de la tradicional novena de aguinaldos.';
            break;
        case 'jose':
            string = 'En Ecuador, México, Colombia, Guatemala, El Salvador, Venezuela, Perú, Argentina, Chile y Canarias, la figura del niño Jesús se coloca despúes de la llegada de la navidad.';
            break;
        case 'pastor':
            string = 'A las novenas se les llama "Las posadas" y son fiestas populares de Mexico, Honduras, Guatemala, El Salvador, Costa Rica, Nicaragua y Panamá.';
            break;
        case 'mula':
            string = 'En las posadas, cada uno de los nueve días representa un valor, como humildad, fortaleza, desapego, caridad, confianza, justicia, pureza, alegría y generosidad.';
            break;
        case 'jesus':
            string = 'El villancico es un género de canción cuya letra hace referencia a la navidad.';
            break;
        case 'maria':
            string = 'La primera celebración navideña en la que se montó un pesebre para la conmemoraciónd del nacimiento de Jesús fue en la nochebuena del año 1223, realizada por San Francisco de Asís.';
            break;
    }
    return string;
}

//Loads each audio to the beat
const playAudio = (string) => {
    beat = new Audio('./Audio/' + string + '.mp3');//since the audios have the name of each card, what this does is saving the respective audio to the variable beat
    beat.play();//plays audio
};

//Detects when a card is clicked and apllies game functionality
game.addEventListener('click', event =>{
    const target = event.target;//sets to the variable target, the respective target that had been clicked
    const card = target.parentNode.children[1];//Since the click is completely random, it is necessary to go to its parent and then select the respective child we want to select 

    if (state[1] != null && state[0] == 2) return;//In case user clicked on something else and then on a card (saving user from his own stupidity)
    if (!(target.classList.contains('card-face'))) return;//reconizes if the click wasn't on a target
    if ((target.parentNode.classList.contains('is-flipped'))) return;//if a card is flipped it doesn't let to click at all, at least doesn't do anything with the click
    
    flipCard(target);//flips the target that was clicked by calling this fonction
    state[0]++;//additions a click to the array
    checkState(state, card);//checks if the card is avaible to click, or if user guessed two pairs
    event.stopPropagation();//just a code mistake that happens when a click is on a child and it propagates to it's parents
});

createCards();//making the game work
