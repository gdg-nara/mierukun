document.getElementById("startBtn").addEventListener("click",function(){
  chrome.tabs.create({url: "./index.html"});
});