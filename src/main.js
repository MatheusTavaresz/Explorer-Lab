import "./css/index.css"
import IMask from 'imask'

const ccBgColor01 = document.querySelector(".cc svg > g g:nth-child(1) path") 
const ccBgColor02 = document.querySelector(".cc svg > g g:nth-child(2) path") 

ccBgColor01.setAttribute('fill', "green") 
ccBgColor02.setAttribute('fill', "yellow")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img") 

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

const securityCode = document.querySelector('#security-code')
const securityCodePatern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePatern)

const expirationDate = document.querySelector('#expiration-date')
const expirationDatePatern = {
  mask: "MM{/}YY",
  blocks: {
  YY: {
    mask: IMask.MaskedRange,
    from: String(new Date().getFullYear()).slice(2),
    to: String(new Date().getFullYear() + 10 ).slice(2)
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
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^5[0-3]\d{0,2})/,

      cardtype: "nubank"
    },
    {
      mask: "0000 0000 0000 0000",
      regex:/(^6[0-5][1-5])/,
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
  alert('Você adicionou um cartão')
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() 
})

const cardHolder = document.querySelector("#card-holder")
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