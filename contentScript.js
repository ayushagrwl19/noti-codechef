console.log("connection is live");
 
let problem_name = document.querySelectorAll(".breadcrumb a")[2].innerText;
//console.log(problem_name);

let problem_id = document.getElementsByClassName("run-details-info")[0].children[1].children[1].children[0].innerHTML;

//console.log(problem_id);

const problem = {
name : problem_name,
id : problem_id
};

document.querySelector(".submit-run .ns-button").addEventListener("click",function(){
  console.log("dsdsds");
  chrome.runtime.sendMessage({problem_name: problem.name,problem_id:problem.id}, function(response) {
    console.log(response.farewell);
  });
});




  

 