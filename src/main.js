import "./css/index.css"
import IMask from 'imask'

                            //Query selector = Busca do seletor
const ccBgColor01 = document.querySelector(".cc svg > g g:nth-child(1) path") 
const ccBgColor02 = document.querySelector(".cc svg > g g:nth-child(2) path") 


ccBgColor01.setAttribute('fill', "green") 
// ^ Define a cor do primeiro elemento "g" que está na classe "cc" dentro do "svg" ^
ccBgColor02.setAttribute('fill', "yellow")
// ^ Define a cor do segundo elemento "g" que está na classe "cc" dentro do "svg" ^
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img") 
// ^ Define a bandeira do cartão que está na classe "cc-logo" dentro da tag "img" ^

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    nubank: ["#9966cc", "#4c3366"],
    elo: ["#ffff00", "#5fdaff",],
    default: ["black", "gray"],
  } 
  
  ccBgColor01.setAttribute('fill', colors[type][0]) 
  ccBgColor02.setAttribute('fill', colors[type][1])
  ccLogo.setAttribute('src', `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

//CVC
const securityCode = document.querySelector('#security-code')
const securityCodePatern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePatern)

// EXP - DATE
const expirationDate = document.querySelector('#expiration-date')
const expirationDatePatern = {
  mask: "MM{/}YY",
  blocks: {
  YY: {
    mask: IMask.MaskedRange,
    from: String(new Date().getFullYear()).slice(2), //Puxa a data, recorta os dois ultimos numeros e converte para string
    to: String(new Date().getFullYear() + 10 ).slice(2)//Puxa a data, recorta os dois ultimos numeros e converte para string, o "+ 10" define o limite maximo de ano para 10 anos
  },  
  MM: {
    mask: IMask.MaskedRange,
    from: 1,
    to: 12
    }
  }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePatern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPatern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/, 
//Inicia com 4 e vai de 0 a 15 digitos
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
// 1° Dig: "^5" |2° Dig: [1-5] entre 1 e 5 |3° Dig: \d{0,2} de 0 a 2| 4° Dig: Começa com 22...
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[0-3]\d{0,2})/,
// 1° Dig: "^5" |2° Dig: [0-3] entre 0 a 2 |3° Dig: [1-3] entre 1 e 3 |4° Dig: de 0 a 2
      cardtype: "nubank"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^6[0-5][1-5])/,
// 1° Dig: "^6" |2° Dig: [0-3] entre 0 e 3 |3° Dig: [1-5] entre 1 e 5 |4° Dig: de 0 a 3
      cardtype: "elo"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  dispatch: function(appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMasks.find(function(item){
      return number.match(item.regex)
    })

    console.log(foundMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPatern)

const addButton = document.querySelector("#add-card") 
addButton.addEventListener("click", () => {
  alert('Você adicionou o cartão')
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() 
//Define que o navegador não atualize quando clicar em adicionar
})

const cardHolder = document.querySelector("#card-holder")
//Observa quando a caixa de texto recebe algum comando v^
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")
  
  ccHolder.innerText = cardHolder.value.length === 0 ?  "FULANO DA SILVA" : cardHolder.value

}) 

securityCodeMasked.on("accept", () => {
 updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code

}

cardNumberMasked.on("accept", () => {
  const cardtype = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardtype)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number){
  const ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpDateNumber(expirationDateMasked.value)
})

function updateExpDateNumber(expiration){
  const expDate = document.querySelector(".cc-extra .cc-expiration .value")
  expDate.innerText = expiration.length === 0 ? "01/22" : expiration
}