var btnLeetcode = document.querySelector("#btnLeetcode");
var btnAllContests = document.querySelector("#btnAllContests");
var btnPlatforms = document.querySelector("#btnPlatforms");

var AllContests = document.querySelector("#AllContests");
var Setting = document.querySelector("#Setting");
var LeetCode = document.querySelector("#Leetcode");

var calendertable = document.querySelector(".tableCon");
var todaybtn = document.querySelector("#today");
var upcomingbtn = document.querySelector("#upcoming");
var fil = document.querySelector("#filter");

var host_sites=['codeforces.com','codechef.com','atcoder.jp','leetcode.com','codingninjas.com/codestudio','hackerearth.com','geeksforgeeks.org','topcoder.com'];
var hosts = `codechef.com%2Ccodeforces.com%2Cgeeksforgeeks.org%2Chackerearth.com%2Cleetcode.com%2Ctopcoder.com%2Catcoder.jp%2Ccodingninjas.com/codestudio`;

var today = false;
const iddata = new Map();
var apiData;
let dur = 24*60*60; 


fil.addEventListener('change',()=>{
    var temp = fil.value;
	if(temp === "dur3")
	  dur = 3*60*60;
	if(temp === "dur24")
	  dur = 24*60*60; 
	if(temp === "durg24")
	   dur = 365*24*60*60; 
    render();
    // console.log(dur);
})

btnAllContests.addEventListener('click',()=>{
    Setting.classList.add("hidden");
    AllContests.classList.remove("hidden");
    btnLeetcode.classList.remove("landing");
	btnAllContests.classList.add("landing");
	btnPlatforms.classList.remove("landing");
})

btnPlatforms.addEventListener('click',()=>{
    AllContests.classList.add("hidden");
    Setting.classList.remove("hidden");
    btnLeetcode.classList.remove("landing");
	btnAllContests.classList.remove("landing");
	btnPlatforms.classList.add("landing");
})
btnLeetcode.addEventListener('click',()=>{
    AllContests.classList.add("hidden");  
    Setting.classList.add("hidden");
	LeetCode.classList.remove("hidden");
	btnLeetcode.classList.add("landing");
	btnAllContests.classList.remove("landing");
	btnPlatforms.classList.remove("landing");
})

todaybtn.addEventListener('click',()=>{
    today=true;
    todaybtn.classList.add("landing");  
    upcomingbtn.classList.remove("landing");
    render();
})

upcomingbtn.addEventListener('click',()=>{
    today=false;
    todaybtn.classList.remove("landing"); 
    upcomingbtn.classList.add("landing");
    render();
})


const logo = new Map();
logo.set('atcoder.jp', 'atcoder.png');
logo.set('leetcode.com', 'leetcode.png');
logo.set('topcoder.com', 'topcoder.png');
logo.set('codechef.com', 'codechef.png');
logo.set('codeforces.com', 'codeforces.png');
logo.set('hackerearth.com', 'HackerEarth.png');
logo.set('geeksforgeeks.org', 'GeeksforGeeks.png');
logo.set('codingninjas.com/codestudio', 'codingNinja.png');

var host;
if (localStorage.getItem('host-sites') === null) { host = host_sites; localStorage.setItem('host-sites', JSON.stringify(host_sites));} 
else { host = JSON.parse(localStorage.getItem('host-sites'));}
    host.forEach(function(host_site) {
		document.getElementsByName(`${host_site}`)[0].checked = true;
	})

var curr_time = new Date();
const curr_time_api_temp = curr_time.toISOString().substring(0, 11) + curr_time.toISOString().substring(11, 19);
var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(00, 00, 00);
var day15back = new Date();
day15back.setDate(day15back.getDate() - 15); 
day15back.setHours(00, 00, 00);
var day15back_time_api_temp = day15back.toISOString().substring(0, 11) + day15back.toISOString().substring(11, 19);

const apiUrl=`https://cp-calendar-server.vercel.app/upcomingContests/?`;
 async function FetchAPI() {
	try {
		const response = await fetch(`${(apiUrl + `&resource=${hosts}&end__gt=${curr_time_api_temp}&start__gt=${day15back_time_api_temp}`)}`);
		if (response.ok){
			const data = (await response.json());
			// console.log(data);
			console.log("Api Working Successfully");
			
			return data
		}
		throw new Error('Network response was not ok.')
	} catch 
    {
        calendertable.innerHTML=`<div class="emptyAlarm red-alert">Unable to find contests!<br>This may be due to a Fail API Connection or you may be offline.</div>`;
		console.log("Api Fetching failed");
		document.querySelector(".loader").style.display="none"; 
		document.querySelector(".main-div").classList.remove("hidden"); 
	}
}

function plateform_localstorage() {
	for (var i = 1; i <= 8; i++) {
        document.querySelector(`#host${i}`).addEventListener("click", (btn) => {
			if (btn.target.checked) {
				if (!host.includes(btn.target.name)) 
					host.push(btn.target.name); } 
            else {
				const index = host.indexOf(btn.target.name);
				if (index > -1) 
					host.splice(index, 1);
			}
			render();
			localStorage.setItem('host-sites', JSON.stringify(host));
		});
	}
}

plateform_localstorage();

var todayStart = new Date();
todayStart.setHours(00, 00, 00);
const lastfetch = new Date(localStorage.getItem("timeUpdate"));
if (localStorage.getItem("contests") === null || localStorage.getItem("contests") === 'undefined' || lastfetch < todayStart) {
	FetchAPI().then(data => {
			apiData = data;		
			localStorage.setItem("contests", JSON.stringify(data));
			localStorage.setItem("timeUpdate", new Date());
			render();
				document.querySelector(".loader").style.display="none"; 
				document.querySelector(".main-div").classList.remove("hidden"); 
		})
} else {
	apiData = JSON.parse(localStorage.getItem("contests"));
	render();
	document.querySelector(".loader").style.display="none"; 
	document.querySelector(".main-div").classList.remove("hidden"); 
}
var alarm_object=[];
var alarm_id=[];

function render() {
	var tableItem = ``;
	apiData.objects.forEach(function (contest) {
		var start_time = new Date(contest.start + `.000Z`);
		var end_time = new Date(contest.end  + `.000Z`);
		if (today) {
			if (host.includes(contest.resource) && start_time < tomorrow && end_time > curr_time && contest.duration <= dur) {
				var timeDuration = fetchTime(contest);
				var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
				const time = start.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var conEvent = ""+contest.event;
				if(conEvent.length>42)
                conEvent = conEvent.substring(0,42)+"....";
				var temp = `
				<div class="tableitem">
				<a href="${contest.href}" target="_blank">
				 <div class="details">
                      <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
					  <div class="detailstext">
                         <span>${conEvent}</span>
                         <p>Started At: <strong>${date} ${time[1]}</strong></p>
                         <p>Duration: ${timeDuration} </p>
					  </div>
				  </div>
				</a>
					<div class="alarm">
						<div class="reminder">
						Reminder on
						</div>
					</div>
                </div>
				`;
				tableItem += temp;
			}
		} else {
			if (host.includes(contest.resource) && contest.duration <= dur) {
				var timeDuration = fetchTime(contest);
				var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
				const time = start.split(', ');
				var date = time[0].split('/');

				date = `${date[1]}/${date[0]}/${date[2]}`;
				var conEvent = ""+contest.event;
				if(conEvent.length>42)
                conEvent = conEvent.substring(0,42)+"....";
				var temp = `
				<div class="tableitem">
				<a href="${contest.href}" target="_blank">
				 <div class="details">
                      <img class="logo" src="images/${logo.get(contest.resource)}" alt="png">
					  <div class="detailstext">
                         <span>${conEvent}</span>
                         <p>Date: <strong>${date}</strong> </p> 
						 <p>Time: <strong>${time[1]}</strong></p>
                         <p>Duration: <strong>${timeDuration} </strong></p>
					  </div>
				  </div>
				</a>
					<div class="alarm">
					    <div class="reminder">
							Reminder on
						</div>
						
					</div>
                </div>
				`;
				tableItem += temp;
			}
		}
	})
			fetch_idddata();
	        calendertable.innerHTML = tableItem;
	        alarm_object=[];
            alarm_id.forEach((id)=>{
		    var temp = document.getElementById(`id${id}`);
		    alarm_object.push(temp);
		    temp.addEventListener('click',()=>{
			var alarmArray=[];
			 alarmArray = JSON.parse(localStorage.getItem("alarms"));
            if(!alarmArray.includes(id))
			  alarmArray.push(id);
			localStorage.setItem('alarms',JSON.stringify(alarmArray));
			fetchAlarm();
			render();
		})
	})
		
}
function fetchTime(contest){
	const minutes = (parseInt(contest.duration) / 60) % 60;
	const hours = parseInt((parseInt(contest.duration) / 3600) % 24);
	const days = parseInt((parseInt(contest.duration) / 3600) / 24);
	var timeDuration = ``;
	if (days > 0)
		timeDuration += `${days} days `;
	if (hours > 0) 
		timeDuration += `${hours} hours `;
	if (minutes > 0)
		timeDuration += `${minutes} minutes `;
	return timeDuration;
}
function fetch_idddata(){
	iddata.clear();
    apiData.objects.forEach(function (contest) {
		var timeDuration = fetchTime(contest);
		var start = new Date(contest.start + `.000Z`).toLocaleString('en-US');
		const time = start.split(', ');
		var date = time[0].split('/');
		date0 = `${date[1]}/${date[0]}/${date[2]} ${time[1]}`;
		date = `${date[2]}-${date[0]}-${date[1]}`;
		var conEvent = ""+contest.event;
		if(conEvent.length>42)
        conEvent = conEvent.substring(0,42)+"....";
		iddata.set(contest.id,[conEvent,contest.href,`${date0}`,timeDuration,contest.resource,new Date(`${date} ${time[1]}`)]);
	});
}



function createalarm(id){
	// chrome.alarms.getAll((e)=>{console.log(e)});
	chrome.alarms.create(iddata.get(id)[1], { when:(new Date(iddata.get(id)[5]).getTime() - 2*60*1000)});
	// console.log(new Date((iddata.get(id)[5]).getTime() - 2*60*1000));
}

function createnotification(id){
	chrome.notifications.create(""+id, {
		type: 'basic',
		iconUrl: `images/${logo.get(iddata.get(id)[4])}`,
		title: iddata.get(id)[4],
		message: iddata.get(id)[0],
		priority: 2,
		eventTime: Date.now(),
		buttons: [
			{
				title: 'Visit Now'
			},
			{
				title: 'Later'
			}
		]
	});
}

{
	var genUserID = "";
	var isNewUser = false;
	var isUnique = false;
	chrome.storage.local.get(["NCPCID"]).then((result) => {
		genUserID = result.NCPCID;
		// console.log(genUserID);
		if(localStorage.getItem("NCPCID") === null)
		{
			isNewUser = true;
			localStorage.setItem("NCPCID",genUserID);
		}else{
			genUserID = localStorage.getItem("NCPCID");
		}
		var currDay = new Date();
		var year = currDay.getFullYear();
		var month = String(currDay.getMonth() + 1).padStart(2, '0');
		var day = String(currDay.getDate()).padStart(2, '0'); 
		var currDay = `${year}-${month}-${day}`;
		if(localStorage.getItem("currDay") === null || localStorage.getItem("currDay") != currDay)
		{
			isUnique = true;
			localStorage.setItem("currDay",currDay);
		}

		fetch("https://extensions-info-api.vercel.app/api/collect", {
		method: "POST",
		body: JSON.stringify({
			"extension": "CPCalendar",
			"isNewUser": isNewUser,
			"userID": genUserID,
			"isUnique": isUnique,
			"day": currDay
		}),
		headers: {
			"Content-type": "application/json; charset=UTF-8"
		}
		});
   });
}


//--------------------------------------------------------------------