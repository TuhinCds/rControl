const switch_toggle = document.getElementById("switch_toggle")
const StartInput = document.getElementById("StartInput")
const EndInput = document.getElementById("EndInput")
const DelayTimeInput = document.getElementById("DelayTimeInput")
const btns_handle_display = document.querySelector(".btns_handle_display")
const allBtns = btns_handle_display.querySelectorAll(".btn")
const DoneBtn = document.getElementById("DoneBtn")
const autoBtn = document.getElementById("autoBtn")



let switch_toggle_status = false;
switch_toggle.addEventListener("click", () => {
    if(switch_toggle_status == false){
        switch_toggle_status = true;
        toggleBtn(true);
    } else {
        switch_toggle_status = false;
        toggleBtn(false);
    }
})

function toggleBtn(toggle){
    if(toggle === true){
        switch_toggle.classList.add("on");
    } else {
        switch_toggle.classList.remove("on");
    }
}


async function showDisplay(showNumber){
    let display = await fetch(`http://192.168.10.98/display?show=${showNumber}`)
    if(!display.ok) return 
    let displayResponse = await display.json()
    console.log(displayResponse)
}
async function timerDisplay(start=0, end=9, delay=1, isBuzzOnEnd=false) {
    let display = await fetch(`http://192.168.10.98/display/timer?s=${start}&e=${end}&d=${delay*1000}&bE=${isBuzzOnEnd}`);
    if(!display.ok) return
    let response = await display.json()
    console.log(response)
}


allBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        showDisplay(btn.textContent)
    })
})

DoneBtn.addEventListener("click", () => {
    let startValue;
    let endValue;
    let delayValue;

    try{
        startValue = Number(StartInput.value)
        endValue = Number(EndInput.value)
        delayValue = Number(DelayTimeInput.value)
        
    } catch (err){
        alert(err)
        startValue = 0;
        endValue = 9;
        delayValue = 1;
    }
    if(startValue > endValue || (startValue < 0 || endValue > 9)) return 
    // call timer display
    let allBtnsLen = startValue;
    allBtns[allBtnsLen-1].classList.add("active")
    let timer = setInterval(() => {
        if(allBtnsLen == endValue){
            allBtnsLen = 0;
            clearInterval(timer);
            toggleBtn(false);
        }
        allBtns.forEach((b) => {
            b.classList.remove("active")
        })
        autoBtn.classList.remove("active");
        if(allBtnsLen == 0){
            autoBtn.classList.add("active")
        } else {
            allBtns[allBtnsLen].classList.add("active")
        }
        allBtnsLen++;
    }, (delayValue * 1000)+210)
    timerDisplay(startValue, endValue, delayValue, (switch_toggle_status?"true":"false"));
    autoBtn.classList.remove("active")
})

autoBtn.addEventListener("click", () => {
    showDisplay(0);
    toggleBtn(false);
})

// end