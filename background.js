console.log("Background is running");

 var problemName;
 var problemId;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
   
    if(sender.tab)
    {
      console.log(sender.tab.url);
      problemName=request.problem_name;
      //console.log(request.problem_name);
     problemId=request.problem_id;
      //console.log(problemId);
      sendResponse({farewell: "goodbye"});
    }
});


function checkResult(url,id,xcsrf,problemName,problemId)
{

  $.ajax({
 
    url: url,
    dataType: "json",
    headers: {
      "x-csrf-token" : xcsrf
    },

    /*
    * function to handle success of XHR request
    * check if the response shows verdict available
    * if verdict available then notify user else
    * user setTimeout function to do recursive call
    * to this function after some seconds.
    */
    success: function(data, status, XHR){
        console.log(status, data.result_code);

        if(data.result_code == "wait"){
           checkResult(url, id, xcsrf, problemName, problemId);
        }
        else{
           var notify_details  = {
            type: "list",
            title: "Problem Name: "+problemName,
            message: "Verdict: "+data.result_code+".",
            iconUrl: "logo.jpg",
            items: [{title: "Verdict:", message:""+data.result_code+""},
                    { title: "Id: ", message: ""+problemId+""},
                    { title: "Time: ", message: ""+data.time+""}]
           }

           chrome.notifications.create(notify_details);

          //  chrome.notifications.onButtonClicked.addListener(function(problem_url){
          //   console.log(problem_url);
          //   chrome.tabs.create({
          //     url : problem_url
          //   });
          //  });
       }

     },

    /* function to handle errors*/
    error: function(XHR, status, error){
      console.log(error, status, XHR);
    }
});

}

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    const data=details;
   // console.log(data);
    const url=new URL(data.url);
    //console.log(url);
    const id = url.searchParams.get('solution_id');
    if(id){
    //console.log(id);
    //console.log(data.requestHeaders);
    const xcsrf =  data.requestHeaders[2].value;
      //console.log(xcsrf) ;
      var store={};
      store[id]=id;
      chrome.storage.sync.get(id,function(key_values){
           if(Object.keys(key_values).length!=0)
                 {
                  //console.log('submission id already saved',key_values[id]);
                 }
           else{
                 chrome.storage.sync.set(store, function() {
                 //console.log('Value is now set to ' + id);
                  });
                  //sendMessagetToGetInfo(url, id, xcsrf);
                  checkResult(url,id,xcsrf,problemName,problemId);
              }
          });
    }
      
  },
  {
   urls : ["https://www.codechef.com/api/ide/submit*"],
   types : ["xmlhttprequest"]
  },
  ["requestHeaders"]
  );

