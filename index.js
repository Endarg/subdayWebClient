import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.5/+esm'

const COLUMNS_COUNT = 7;

let isOn = false;
let channel = "honeymad";
let winnersMessages = [];
let winner;
let countDownDate;

document.body.onload = init;

let gamesRaw;
let gamesProcessed;
let chattersCount;

let mainpageRoot;
let mainpageFormHeader;
let mainpageStatus;
let mainpageChattersCountLabel;

let mainpageButton;
let mainpageGamesPanel;
let mainpageGamesPanelColumns = [];

let winpageRoot;
let winpageFormHeader;
let winpageWinner;
let winpageChattersAnouncement;
let winpageChatters;
let winpageBackButton;
let winpageAgainButton;
let winpageWinnersMessagesPanel;
let winpageTimer;


function init()
{    
    buildMainpage();   
    buildWinnwerpage();

    mountMainpage();

    getInit();
    getUpdate();
    getWinnerMessages();
    resetTimer();
}

function buildMainpage()
{
    mainpageRoot = document.createElement("div");
    mainpageRoot.className = "mainpage-root";

    const mainpageHeader = document.createElement("div");
    mainpageHeader.className = "mainpage-header";

    mainpageFormHeader = document.createElement("div");
    mainpageFormHeader.className = "mainpage-form-header";
    mainpageFormHeader.textContent = "!КОМП";

    const mainpageStatusLabel = document.createElement("div");
    mainpageStatusLabel.className = "mainpage-label"
    mainpageStatusLabel.textContent = "Статус приема заявок:";

    mainpageChattersCountLabel = document.createElement("div");
    mainpageChattersCountLabel.className = "mainpage-label-chatterscount"
    mainpageChattersCountLabel.textContent = "Количество участников: ";
    
    mainpageStatus = document.createElement("div");
    updateStatus();

    mainpageButton = document.createElement("button");
    mainpageButton.className = "mainpage-button";
    mainpageButton.textContent = "Выбрать победителя";
    mainpageButton.onclick = mainpageButtonOnClick;

    const mainpageHr01 = document.createElement("hr");

    mainpageGamesPanel = document.createElement("div");
    mainpageGamesPanel.className = "mainpage-games-panel";
    

    for (let i = 0; i < COLUMNS_COUNT; ++i)
    {
        let mainpageGamesColumn = document.createElement("div");
        mainpageGamesColumn.className = "mainpage-games-panel-column";
        mainpageGamesPanelColumns.push(mainpageGamesColumn);
        mainpageGamesPanel.appendChild(mainpageGamesColumn);
    }

    mainpageRoot.appendChild(mainpageHeader);
    mainpageHeader.appendChild(mainpageFormHeader);
    //mainpageRoot.appendChild(mainpageStatusLabel);
    //mainpageRoot.appendChild(mainpageStatus);
    mainpageRoot.appendChild(mainpageChattersCountLabel);
    mainpageRoot.appendChild(mainpageButton);
    mainpageRoot.appendChild(mainpageHr01);
    mainpageRoot.appendChild(mainpageGamesPanel);

}

function mountMainpage()
{
    document.body.appendChild(mainpageRoot);
}

function dismountMainpage()
{
    mainpageRoot.remove();
}

function buildWinnwerpage()
{
    winpageRoot = document.createElement("div");
    winpageRoot.className = "mainpage-root";

    const winpageHeader = document.createElement("div");
    winpageHeader.className = "mainpage-header";

    winpageFormHeader = document.createElement("div");
    winpageFormHeader.className = "mainpage-form-header";
    winpageFormHeader.textContent = "Subday";

    const winnerpageLabel01 = document.createElement("div");
    winnerpageLabel01.className = "winpage-label01";
    winnerpageLabel01.textContent = "Победитель розыгрыша";

    winpageWinner = document.createElement("div");
    winpageWinner.className = "winpage-winner";
    winpageWinner.textContent = "Победитель";

    winpageChattersAnouncement = document.createElement("div");
    winpageChattersAnouncement.className = "winpage-label01";
    winpageChattersAnouncement.textContent = "варик предложили";

    /*winpageChatters = document.createElement("div");
    winpageChatters.className = "winpage-label02";
    winpageChatters.textContent = "honeymad, endargemp, zhmil";*/

    const winpageButtonsPanel = document.createElement("div");
    winpageButtonsPanel.className = "wingape-buttons-panel";

    winpageBackButton = document.createElement("button");
    winpageBackButton.className = "winpage-button-left";
    winpageBackButton.textContent = "Назад";
    winpageBackButton.onclick = wingapeBackButtonOnClick;

    winpageAgainButton = document.createElement("button");
    winpageAgainButton.className = "winpage-button-right";
    winpageAgainButton.textContent = "Еще раз";
    winpageAgainButton.onclick = winpageAgainButtonOnClick;

    const winnerpageHr01 = document.createElement("hr");

    winpageTimer = document.createElement("div");
    winpageTimer.className = "winpage-timer";

    const winnerpageHr02 = document.createElement("hr");

    const winpageChatLabel = document.createElement("div");
    winpageChatLabel.className = "winpage-label01";
    winpageChatLabel.textContent = "Чат с победителем";

    winpageWinnersMessagesPanel = document.createElement("div");
    winpageWinnersMessagesPanel.className = "winpage-winnerchat-panel";

    winpageRoot.appendChild(winpageHeader);
    winpageHeader.appendChild(winpageFormHeader);
    winpageRoot.appendChild(winnerpageLabel01);
    winpageRoot.appendChild(winpageWinner);
    //winpageRoot.appendChild(winpageChattersAnouncement);
    //winpageRoot.appendChild(winpageChatters);
    winpageRoot.appendChild(winpageButtonsPanel);
    winpageButtonsPanel.appendChild(winpageBackButton);
    winpageButtonsPanel.appendChild(winpageAgainButton);
    winpageRoot.appendChild(winnerpageHr01);
    winpageRoot.appendChild(winpageTimer);
    winpageRoot.appendChild(winnerpageHr02);
    winpageRoot.appendChild(winpageChatLabel);
    winpageRoot.appendChild(winpageWinnersMessagesPanel);
}

function mountWinnerpage()
{
    document.body.appendChild(winpageRoot);
}

function dismountWinnerpage()
{
    winpageRoot.remove();
}

function updateStatus()
{
    if (isOn)
    {
        mainpageStatus.textContent = "Заявки принимаются";
        mainpageStatus.className = "mainpage-status-on";
    }
    else
    {
        mainpageStatus.textContent = "Заявки не принимаются";
        mainpageStatus.className = "mainpage-status-off";
    }
}

function updateGamesPanel()
{
    mainpageChattersCountLabel.textContent = "Количество участников: "+ gamesProcessed.length;

    for (let i = 0; i < COLUMNS_COUNT; ++i)
    {
        removeAllChildNodes(mainpageGamesPanelColumns[i]);
    }
    let currentColumn = 0;
    for (let i = 0; i < gamesProcessed.length; ++i)
    {
        let game = document.createElement("div");
        let gameName = document.createElement("div");
        gameName.className = "mainpage-label";
        gameName.textContent = gamesProcessed[i].chatter;
        game.appendChild(gameName);
        mainpageGamesPanelColumns[currentColumn].appendChild(game);
        
        currentColumn++;
        if (currentColumn == COLUMNS_COUNT)
            currentColumn = 0;

    }

    chattersCount = gamesProcessed.length;
    //mainpageStatusLabel.textContent = "Количество участников: "+chattersCount;
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function chooseWinner()
{
    let winnerID = Math.floor(Math.random() * (gamesRaw.length));
    winner = gamesRaw[winnerID];
    winpageWinner.textContent = winner.chatter;

    const postData = {
        winner: winner.chatter
    }
    const responce = axios.post('https://subday.fun/set-winner', postData);

    resetTimer();
    //winnersMessages = [];
    updateWinnersMessages();

    /*let chatters = winner.chatter;
    let id = 0;
    for (let i = 0; i < gamesRaw.length; ++i)
    {
        if (gamesRaw[i].name == winner.name)
        {
            if (gamesRaw[i].chatter != winner.chatter)
            chatters += ", " + gamesRaw[i].chatter;
            id++;
        }
    }

    if (id > 1)
    {
        winpageChattersAnouncement.textContent = "варик предложили";
    }
    else
    {
        winpageChattersAnouncement.textContent = "варик предложил";
    }

    winpageChatters.textContent = chatters;*/
}

function mainpageButtonOnClick()
{
    chooseWinner();
    dismountMainpage();
    mountWinnerpage();
}

function wingapeBackButtonOnClick()
{
    dismountWinnerpage();
    mountMainpage();
}

function winpageAgainButtonOnClick()
{
    let winpageWinnerIndex = Array.prototype.indexOf.call(winpageRoot, winpageWinner);
    winpageRoot.removeChild(winpageWinner);
    winpageRoot.insertBefore(winpageWinner,winpageRoot.childNodes[2]);
    chooseWinner();
}

function processGames(games)
{
    gamesProcessed = gamesRaw;
    gamesProcessed = quickSort(gamesProcessed);
}

function updateWinnersMessages()
{
    removeAllChildNodes(winpageWinnersMessagesPanel);
    for (let i = 0; i < winnersMessages.length; ++i)
    {
        let winnersMessage = document.createElement("div");
        winnersMessage.className = "winpage-chat-label";
        winnersMessage.textContent = winner.chatter+": "+winnersMessages[i];
        winpageWinnersMessagesPanel.appendChild(winnersMessage);
    }
}

function resetTimer()
{
    countDownDate = new Date().getTime() + 60000;
    timerTick();
}


// Update the count down every 1 second
async function timerTick() 
{

    var now = new Date().getTime();
    var distance = countDownDate - now;

    // Time calculations for minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    var secText = "";
    console.log(seconds);

    if (seconds < 10)
    {
        secText = "0";
    }

    var minText = "";
    if (minutes < 10)
    {
        minText = "0";
    }


    if (distance < 0) {
    winpageTimer.textContent = "00:00";
    }
    else
    {
    winpageTimer.textContent = minText + minutes + ":" + secText + seconds;
    }

    setTimeout ( () => {
    timerTick() 
    }, 1000)

};

function quickSort(arr) {
    
    if (arr.length < 2) return arr;

    let pivot = arr[0].votes;
    let left = [];
    let right = [];
      
    for (let i = 1; i < arr.length; i++) {
      if (pivot < arr[i].votes) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    };

    return quickSort(left).concat(arr[0], quickSort(right));
}

async function getInit()
{
    await axios.get('https://subday.fun/get-init').then (res =>{
        gamesRaw = res.data.games;
        isOn = res.data.isOn;
        processGames();
        updateGamesPanel();
        console.log('Status: '+isOn);
        updateStatus();
        if (res.status == 200)
            console.log('Got init config');
    });
    
}

async function getUpdate()
{

    try {
        console.log('Getting update');
        
        await axios.get('https://subday.fun/get-update').then (res => {
            console.log('Update comleted');
            gamesRaw = res.data.games;
            isOn = res.data.isOn;
            processGames();
            updateGamesPanel();
            console.log('Status: '+isOn);
            updateStatus();
        });
        
        await getUpdate()
    } catch (e) {
        setTimeout ( () => {
            console.log('Something went wrong, restarting update');
            getUpdate()
        }, 500)
    }
}

async function getWinnerMessages()
{
    try {
        console.log('Getting winners messages');
        
        await axios.get('https://subday.fun/get-winner-msg').then (res => {
            console.log('Got winners messages');
            winnersMessages = res.data.winnerMsgs;
            console.log(winnersMessages);
            updateWinnersMessages();
        });
        
        await getWinnerMessages()
    } catch (e) {
        setTimeout ( () => {
            console.log(e);
            console.log('Something went wrong, restarting winners messages update');
            getWinnerMessages()
        }, 500)
    }
}