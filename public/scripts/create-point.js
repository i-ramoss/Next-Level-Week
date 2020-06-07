
function populateUFs() {
  const ufSelect = document.querySelector( "[name=uf]" )

  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome")
    .then( res =>  res.json() )
    .then( states => {

      for (state of states) {
        ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
      }
    })
}

function getCities(event) {
  const citySelect = document.querySelector( "[name=city]" )
  const stateInput = document.querySelector( "[name=state]" )

  const ufValue = event.target.value

  const indexOfSelectedState = event.target.selectedIndex
  stateInput.value = event.target.options[indexOfSelectedState].text

  const url =`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

  citySelect.innerHTML = "<option value>Selecione a Cidade</option>"
  citySelect.disabled = true

  fetch(url)
    .then( res =>  res.json() )
    .then( cities => {

      for (city of cities) {
        citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
      }

      citySelect.disabled = false

    })
}

document
  .querySelector( "select[name=uf]" )
  .addEventListener( "change", getCities)


// executa a função para preencher os Estados
populateUFs()

// ####### Itens de coleta #######

//pegar todos os li's
const itemsToCollect = document.querySelectorAll(".items-grid li")

// executa a função para item clicado na página
for (item of itemsToCollect) {
  item.addEventListener("click", handleSelectedItem)
}

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event) {
  const itemLi = event.target

  // adicionar ou remover uma classe com js
  itemLi.classList.toggle("selected")

  // guards o id de um item, de um tipo reciclável
  const itemId = itemLi.dataset.id

  console.log("ITEM ID:", itemId)
  
  //verificar se existemítens selecionados, se sim, pegar os ítens selecionados
  const alreadySelected = selectedItems.findIndex( item => {
    const itemFound = item == itemId // será true ou false
    return itemFound
  })

  // se selecionado
  if (alreadySelected != -1) { // o .findIndex retorna -1 quando não encontra o elemento no array

    //tirar da seleção
    const filteredItems = selectedItems.filter( item => {
      const itemIsDifferent = item != itemId
      return itemIsDifferent
    }) 

    selectedItems = filteredItems
  }

  // se não, adicionar à seleção
  else 
    selectedItems.push(itemId)

    
  console.log("Selected ITEM:", selectedItems)
  

  // atualizar o campo escondido com os items selecionados
  collectedItems.value = selectedItems
}