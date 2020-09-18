"use strict";

const proxyurl = "https://cors-anywhere.herokuapp.com/";
const url = "https://www.ecosim.hu/frontend_job/";

const eventName = document.getElementById("eventName");
const cardContainer = document.getElementById("cardContainer");
const card = document.getElementById("cardTemplate");
const submit = document.getElementsByClassName("button")[0];
const message = document.getElementById("message");

var globalData;

submit.addEventListener("click", sendData);
requestData();

function requestData() {
    var urlencoded = new URLSearchParams();
    urlencoded.append("process", "get");
    urlencoded.append("token", "meszaros_adel");

    var requestOptions = {
        method: 'POST',
        body: urlencoded,
        redirect: 'follow'
    };

    fetch(proxyurl + url, requestOptions)
        .then(response => response.text())
        .then(result => setData(JSON.parse(result).response.data))
        .catch(error => console.log('error', error));
}

function setData(data) {
    globalData = data;
    eventName.innerText = data.event.name;

    for (var i = 0; i < data.factors.length; i++) {
        var newCard = card.cloneNode(true);

        newCard.id = "";
        var sliderValue = newCard.getElementsByClassName("sliderValue")[0];
        var cardTitle = newCard.getElementsByClassName("cardTitle")[0];
        var slider = newCard.getElementsByTagName("input")[0];

        cardTitle.innerText = data.factors[i].name;
        slider.min = data.factors[i].min;
        slider.max = data.factors[i].max;
        slider.step = data.factors[i].step;

        slider.value = slider.min;
        sliderValue.innerText = slider.min;

        slider.addEventListener("input", function (e) {
            var parent = e.target.parentNode;
            var sliderValue = parent.getElementsByClassName("sliderValue")[0];

            sliderValue.innerText = e.target.value;
        })

        cardContainer.appendChild(newCard);
    }
}

function sendData() {
    var data = {}, factors;
    var sliders = document.getElementsByClassName("sliderValue");

    data["userId"] = globalData.user.id;
    data["eventID"] = globalData.event.id;
    data["factors"] = Array(0);

    factors = globalData.factors;
    for(var i = 0; i < factors.length; i++){
        data.factors.push({"id" : factors[i].id, "value" : sliders[i+1].innerText});
    }

    var urlencoded = new URLSearchParams();
    urlencoded.append("process", "set");
    urlencoded.append("token", "meszaros_adel");
    urlencoded.append("data", JSON.stringify(data));

    var requestOptions = {
        method: 'POST',
        body: urlencoded,
        redirect: 'follow'
    };

    fetch("https://www.ecosim.hu/frontend_job/", requestOptions)
        .then(response => response.text())
        .then(result => sendMessage(result))
        .catch(error => console.log('error', error));
}

function sendMessage(result){
    message.innerText = JSON.parse(result).response.msg;

    setTimeout(() => {
        message.innerText = " ";
    }, 3000);
}