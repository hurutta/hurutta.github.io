 $('div').terminal(
 {
        help: function(){ this.echo('this is an interactive site, type "list" to see full command list 📜');},
	list: function(){ this.echo('   |── "name"\t\t\t\t   |── "mail"\n   |── "phone"\t\t\t\t   |── "photo"\n   |── "linkedin"\t\t\t   |── "address"\n');
	this.echo('💡Just type any keyword from above to know that information.'); 
	this.echo('💥To discover more exciting commands, type "list2"');
	},
	
	list2: function(){ this.echo('😎 Thanks for showing interest! Heres the list2 -');
	this.echo('   |── "time"\t\t\t\t   |── "weather"\n   |── "screen"\t\t\t\t   |── "location"\n   |── "os"\t\t\t\t\t   |── "battery"\n   |── "core"\t\t\t\t   |── "ram"\n   |── "pacman"\t\t\t\t   |── "view"\n   |── "cj"\t\t\t\t\t   |── "cat"\n');
	this.echo('💥To discover more educative and interesting commands, type "list3" !!!'); 
	this.echo('<p style="color:red;">'+"WOWOWOW"+'</p>',
     { raw:true,
       finalize: function(div) {
          div
         
         .css("text-align", "right")
         .css("margin-top", "-1em")
         .css("font-family", "courier")
         .css("text-color", "red")
         ;
       }
     });
	},
	
  list3: function(){ this.echo('   |── "country" `anything`\t\t   |── "add" `a` `b`\n   |── "d" `anyword`\t\t\t   |── "sub" `a` `b`\n   |── "dd" `anyword`\t\t\t   |── "div" `a` `b`\n');
  this.echo('💡Just type any keyword from above to know that information.'); 
  this.echo('💥To discover more exciting commands, type "list3"');
  },
	
	 
        hi: function(name) {this.echo('Hi, ' + name +'. Wellcome to my site.');},
		    name: function(){ this.echo('Abid Mohammad Jawad\nআবিদ মোহাম্মদ জাওয়াদ');},
		    nick: function(){ this.echo('JAWAD');},
		    nation: function(){ this.echo('BANGLADESH 🇧🇩️ বাংলাদেশ');},
      	mail: function(){ this.echo('abidmohammadjawad@gmail.com');},
      	email: function(){ this.echo('abidmohammadjawad@gmail.com');},
       	photo: function(){ this.echo($('<img src="https://i.pinimg.com/originals/c8/6c/d4/c86cd4795af2bd7a68cf11728ec0f917.jpg" length=100 height=100>'));},
       	address: function(){ this.echo('Sreemangal');},
       	
       	
       	time: function(){ const current = new Date();const time = current.toLocaleTimeString("en-US");
       	this.echo(current);},
       	cat: function() {this.echo($('<img src="https://placekitten.com/408/287"length=100 height=100>'));},
       	cj: function() {this.echo($('<img src="https://c.tenor.com/grK7jtRobfMAAAAS/grand-theft-auto-carl-johnson.gif"length=100 height=100>'));},
       	ok: function(){ this.echo('ok');document.write("<h1>okidoki</h1>");
       			window.setTimeout(function () {window.location.reload();}, 500)},
       	pass: function(what){ if(what==123) this.echo('wow how do you know?');
       	else this.echo('WRONG PASSWORD');},
       	add: function(a,b){ this.echo(a+b);},
       	sub: function(a,b){ this.echo(a-b);},
       	mul: function(a,b){ this.echo(a*b);},
       	div: function(a,b){ this.echo(a/b);},
       	mod: function(a,b){ this.echo(a%b);},
       	git: function(){ this.echo('https://github.com/hurutta')},
       	open: function() {
        this.echo('you try to open').exec('close');
        setTimeout(function(){ alert("After 5 seconds!"); }, 5000);
        this.echo('you try to open').exec('close');
    },
    close: function() {
        this.echo('you closed');
    },
       	
       	
       	weather: function(){ 
       	const apiKey = "4d8fb5b93d4af21d66a2948710284366";
       	let inputVal = 0;
       	const url = `https://api.openweathermap.org/data/2.5/weather?q=${'sreemangal,bd'}&appid=${apiKey}&units=metric`;
       	fetch(url).then(response => response.json()).then(data => {const {main,name,sys,weather}=data;
      	this.echo("Location : "+name+"\t Temperature : "+Math.round(main.temp)+"°C \t"+weather[0]["description"]);
      	});
       	const url2 = `https://api.openweathermap.org/data/2.5/weather?q=${'dhaka,bd'}&appid=${apiKey}&units=metric`;
       	fetch(url2).then(response => response.json()).then(data => {const {main,name,sys,weather}=data;
      	this.echo("Location : "+name+"\t\t Temperature : "+Math.round(main.temp)+"°C \t"+weather[0]["description"]);
      	});
       	const url3 = `https://api.openweathermap.org/data/2.5/weather?q=${'sylhet,bd'}&appid=${apiKey}&units=metric`;
       	fetch(url3).then(response => response.json()).then(data => {const {main,name,sys,weather}=data;
      	this.echo("Location : "+"Sylhet"+"\t\t Temperature : "+Math.round(main.temp)+"°C \t"+weather[0]["description"]);
      	});
      	const url4 = `https://api.openweathermap.org/data/2.5/weather?q=${'chittagong,bd'}&appid=${apiKey}&units=metric`;
       	fetch(url4).then(response => response.json()).then(data => {const {main,name,sys,weather}=data;
      	this.echo("Location : "+name+"\t Temperature : "+Math.round(main.temp)+"°C \t"+weather[0]["description"]);
      	});
      	const url5 = `https://api.openweathermap.org/data/2.5/weather?q=${'khulna,bd'}&appid=${apiKey}&units=metric`;
       	fetch(url5).then(response => response.json()).then(data => {const {main,name,sys,weather}=data;
      	this.echo("Location : "+name+"\t\t Temperature : "+Math.round(main.temp)+"°C \t"+weather[0]["description"]);
      	});
      	const url6 = `https://api.openweathermap.org/data/2.5/weather?q=${'rajshahi,bd'}&appid=${apiKey}&units=metric`;
       	fetch(url6).then(response => response.json()).then(data => {const {main,name,sys,weather}=data;
        this.echo("Location : "+name+"\t\t Temperature : "+Math.round(main.temp)+"°C \t"+weather[0]["description"]);
      	
        this.echo("Try - `weather2`");

      	});
       	},
       	
       	
       	pacman: function(){this.echo($('<img src="https://i.imgur.com/xEVKclT.gif" width=100% height=30px>'));},
       	ip: function(){
		fetch('https://api.ipify.org/?format=json').then(res => res.json()).then((out) => {
        this.echo('your ip address : '+JSON.stringify(out, null, 0));});},
        
        
       	view: function() {this.echo('total view of this site : ');this.echo($('<img src="https://www.counter12.com/img-8Y8wZY7d2CCA6Ab2-50.gif">'));},
       	
       	d: function(word){
       			const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
				const result = document.getElementById("result");
				let input_word = word;
				fetch(`${url}${input_word}`)
					.then((response) => {return response.json();})
						.then((data) => {
						this.echo("PART OF SPEECH:\t"+data[0].meanings[0].partOfSpeech);
						this.echo("\nDEFINITION:\t"+data[0].meanings[0].definitions[0].definition);
						this.echo("\nEXAMPLE: "+data[0].meanings[0].definitions[0].example);
						}).catch((error) => {
			this.echo("Can't find or wrong input, search different word");
		});
		;},
		
       		matrix: function() {this.echo($('<img src="https://cdn140.picsart.com/321303280218201.gif?to=min&r=640"length=100% height=100%>'));},
       		cat2: function() {this.echo($('<img src="https://i.imgur.com/K0aZ9ID.gif" "length=100% width=100%>'));},
       		
       	
       		send: function(){
       		
       			
       			var name = prompt("PLEASE ENTER YOUR NAME or MAIL-ID: \n(as your wish/so that you can send anything effortlessly :D)");
       			var text = prompt("WRITE YOUR TEXT MESSAGE: ");
       			
       			var dt =  "&name="+name+"&message="+text;
				request = $.ajax({
				url: "https://script.google.com/macros/s/AKfycbwZ4TiqPsOnG8ViSZ8liG05gwV0Hxif4ODCijEJLyXUhpb1mZjMh419vOHz5OA7j9lMNQ/exec",
				type: "post",
				data: dt
				}); 
				this.echo("🎉🎉🎉 YOUR TEXT MESSANGE HAS BEEN SUCCESSFULLY SENT 🎉🎉🎉\nbtw if you need any feedback, I need your mail-id, right? Did you write that when it was promt? 🤔😕😃");  		
       		},
       		
       	location: function(){ 
       	
		let gc = "https://maps.googleapis.com/maps/api/geocode/json?latlng=",
		gk = "&key=AIzaSyAGUlxBFrsJbst5nEvwx3QfNOomE8Csrjc";
	  	var address;
	   if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position){
		  latitude = position.coords.latitude;
		  longitude = position.coords.longitude;
		  let g_url = gc+latitude+ "," +longitude+gk;
		$.ajax({
		  type: 'GET',url: g_url,cache: false,dataType: 'JSON',
		  success: function (location) 
		  {
			address=""+location.results[0].address_components[2].long_name;
			alert(address);
		  }
		  }); 
		}); 
	   }
       	 },
       	country: function(name){ 
       		var url = "https://restcountries.com/v2/name/";
  			var countryName = "bangladesh";
    		
				const result = document.getElementById("result");
				let input_word = name;
				fetch(`${url}${input_word}`)
					.then((response) => {return response.json();})
						.then((data) => {
						this.echo("NAME:\t"+data[0].name);
						this.echo("capital:\t"+data[0].capital);
						this.echo("topLevelDomain:\t"+data[0].topLevelDomain);
						this.echo("callingCodes:\t"+data[0].callingCodes);
						this.echo("region:\t"+data[0].region);
						this.echo("population:\t"+data[0].population);
						this.echo("area:\t"+data[0].area);
						this.echo("timezones:\t"+data[0].timezones);
						this.echo("borders:\t"+data[0].borders);
						this.echo("currencies:\t"+data[0].currencies[0].code+" "+data[0].currencies[0].symbol);
						this.echo("languages:\t"+data[0].languages[0].nativeName);
						var flag=data[0].flag;
						this.echo($('<img src="'+flag+'"length=100 height=100>'));
						}).catch((error) => {
			this.echo("Can't find or wrong input, search different country");
		});
       	},
       	ram: function(){
       		let ram = navigator.deviceMemory;
       		if (typeof ram == 'undefined') this.echo('browser not supported');
       		else this.echo('Your device ram : '+ram+'GB');
       	 },
       	core: function(){
       		let cr = navigator.hardwareConcurrency;
       		if (typeof cr == 'undefined') this.echo('browser not supported');
       		else this.echo(cr+' cores');
       	 },
       	 battery: function(){
		   		if ('getBattery' in navigator) {
					navigator.getBattery().then(function(battery) {
		  			var status = (battery.charging) ? 1 : 0;
		  			var percent = Math.round(battery.level * 100);
	  				if(status) status='battery is charging';
	  				else status='battery is discharging';
	  				alert('BATTERY : '+percent+'%\n'+status);
	  				});
	  			}
       	 },
		
		os: function(){ this.echo(navigator.platform)},       	
       	screen: function(){ this.echo('width : '+window.screen.width+'\theight : '+window.screen.height
       	+'\tcolor depth : '+window.screen.colorDepth)},
       

        dd: function(word)
        { 
            const url = "https://raw.githubusercontent.com/MinhasKamal/BengaliDictionary/master/BengaliDictionary.json";
                const result = document.getElementById("result");
                let input_word = word;
                fetch(`${url}`)
                    .then((response) => {return response.json();})
                        .then((data) => {


                        var index = -1;
                        var val = word;
                        var filteredObj = data.find(function(item, i){
                          if(item.en === val){
                            index = i;
                            return i;
                          }
                        });
                        this.echo("Bangla : "+filteredObj.bn);
                        this.echo("Pronunciation : "+filteredObj.pron);
                        this.echo(filteredObj.bn_syns);
                        this.echo(filteredObj.en_syns);
                        this.echo(filteredObj.sents);
                        

                        }).catch((error) => {
            this.echo("Can't find or wrong input, search different word");
        });
        },




        salat: function(){ 
          this.echo('Calc method : Mecca - Umm al-Qura, Juristic method : Hanafi');
          this.echo('<iframe src="https://timesprayer.com/widgets.php?frame=1&amp;lang=en&amp;name=dhaka&amp;avachang=true&amp;asr=1" style="border: none; overflow: hidden; width: 100%; height: 175px;"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

        net: function() {
        this.echo('').exec('speed');
        },
        speed: function(){ 
        this.echo('<div style="width:300px;text-align:right;"><iframe style="border:none;overflow:hidden !important;width:100%;height:320px;" src="https://www.metercustom.net/plugin/"></iframe></div>',
        { raw:true,
        finalize: function(div) {}});
        },

        weather2: function(){ 
        this.echo('<img src="https://www.theweather.com/wimages/foto6074c1dbf468c0125131c5a4cae4c74f.png">',
        { raw:true,
        finalize: function(div) {}});
        },

        news: function(){ 
        //this.echo('<div id="widgetmain" style="text-align:left;overflow-y:auto;overflow-x:hidden;width:650px;background-color:#FFFFFF; border:1px solid #333333;"><div id="rsswidget" style="height:300px;"><iframe src="http://us1.rssfeedwidget.com/getrss.php?time=1644588204713&amp;x=https%3A%2F%2Fnews.google.com%2Frss%2Ftopics%2FCAAqIQgKIhtDQkFTRGdvSUwyMHZNREUyTW1JU0FtSnVLQUFQAQ%3Fhl%3Dbn%26gl%3DBD%26ceid%3DBD%253Abn&amp;w=650&amp;h=300&amp;bc=333333&amp;bw=1&amp;bgc=FFFFFF&amp;m=20&amp;it=true&amp;t=(default)&amp;tc=333333&amp;ts=15&amp;tb=transparent&amp;il=true&amp;lc=0000FF&amp;ls=14&amp;lb=false&amp;id=true&amp;dc=333333&amp;ds=14&amp;idt=true&amp;dtc=284F2D&amp;dts=12" border="0" hspace="0" vspace="0" frameborder="no" marginwidth="0" marginheight="0" style="border:0; padding:0; margin:0; width:650px; height:300px;" id="rssOutput">Reading RSS Feed ...</iframe></div><div style="text-align:right;margin-bottom:0;border-top:1px solid #333333;" id="widgetbottom"><span style="font-size:70%"><a href="http://www.rssfeedwidget.com">rss feed widget</a>&nbsp;</span><br></div></div>',
        //https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNREUyTW1JU0FtSnVLQUFQAQ?hl=bn&gl=BD&ceid=BD%3Abn
        //this.echo('This might take ~ 30 seconds to load 😬 🐢 🐢 ');
        this.echo('<iframe src="https://www.feedgrabbr.com/inframe/?widgetid=3d7e467be5a3422fec6ee5eee" allowtransparency="true" style="border:0;background-color: transparent;width:650px;height:340px" ></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

        calculator: function(){ 
          this.echo('<iframe src="https://www.desmos.com/testing/virginia/scientific" width="650" height="400"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },
       	
        graph: function(){ 
          this.echo('<iframe src="https://www.desmos.com/calculator/g7izucn6nn" width="100%" style="min-height:300px"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

        football: function(){ 
          this.echo('<div id="scoreaxis-widget-10766" style="border-width:0px;border-color:rgba(0, 0, 0, 0.15);border-style:solid;border-radius:8px;padding:10px;background:rgb(255, 255, 255);width:95%" data-reactroot=""><iframe id="Iframe" src="https://www.scoreaxis.com/widget/standings-widget/8?links=1&amp;removeBorders=1&amp;widgetHomeAwayTabs=1&amp;inst=10766" style="width:100%;border:none;transition:all 300ms ease"></iframe><script>window.addEventListener("DOMContentLoaded",event=>{window.addEventListener("message",event=>{if(event.data.appHeight&&"10766"==event.data.inst){let container=document.querySelector("#scoreaxis-widget-10766 iframe");container&&(container.style.height=parseInt(event.data.appHeight)+"px")}},!1)});</script></div>',
         { raw:true,
        finalize: function(div) {}}).exec('football2');
        },
        football2: function(){ 
          this.echo('<div id="scoreaxis-widget-881ce" style="border-width:0px;border-color:rgba(0, 0, 0, 0.15);border-style:solid;border-radius:8px;padding:10px;background:rgb(255, 255, 255);width:95%" data-reactroot=""><iframe id="Iframe" src="https://www.scoreaxis.com/widget/standings-widget/564?links=1&amp;removeBorders=1&amp;widgetHomeAwayTabs=1&amp;inst=881ce" style="width:100%;border:none;transition:all 300ms ease"></iframe><script>window.addEventListener("DOMContentLoaded",event=>{window.addEventListener("message",event=>{if(event.data.appHeight&&"881ce"==event.data.inst){let container=document.querySelector("#scoreaxis-widget-881ce iframe");container&&(container.style.height=parseInt(event.data.appHeight)+"px")}},!1)});</script></div>',
         { raw:true,
        finalize: function(div) {}});
        },

        timer: function(){ 
          this.echo('<iframe style="background-color:white;width:650px;height:190px" src="https://beepmyclock.com/widget/timer" frameborder="0" style="border:0;height:175px;"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },
        stopwatch: function(){ 
          this.echo(' <iframe src="https://beepmyclock.com/widget/stopwatch" frameborder="0" style="border:0;width:650px;height:175px;"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

        pacman: function(){ 
          this.echo('press `shift` then `enter`');
          this.echo('<div><iframe src="https://www.retrogames.cc/embed/9409-pac-man-plus.html" width="500" height="350" frameborder="no" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no"></iframe></div>',
         { raw:true,
        finalize: function(div) {}});
        },

        chat: function(){ 
          this.echo('<div><iframe src="https://textweb.herokuapp.com/" width="650" height="350"></iframe></div>',
         { raw:true,
        finalize: function(div) {}});
        },

        currency: function(){ 
          this.echo('<iframe width="650" height="280" src="https://www.cashbackforex.com/en/widgets/currency-converter"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

        moon: function(){ 
          this.echo('<!-- // Begin Current Moon Phase HTML (c) MoonConnection.com // --><table cellpadding="0" cellspacing="0" border="0" width="212"><tr><td align="center"><a href="https://www.moonconnection.com" target="mc_moon_ph"><img src="https://www.moonmodule.com/cs/dm/hn.gif" width="350" height="200" border="0" alt="" /></a><div style="position:relative;width:200px;"><div style="position:absolute;top:-20px;left:6px;background:#000000;width:116px;text-align:center;"><a href="https://www.moonconnection.com/moon_cycle.phtml" target="mc_moon_ph"><font color="#7F7F7F" size="1" face="arial,helvetica,sans-serif"><span style="color:#7F7F7F;font-family:arial,helvetica,sans-serif;font-size:10px;">moon cycles</span></a></font></div></div></td></tr></table><!-- // end moon phase HTML // -->',
         { raw:true,
        finalize: function(div) {}});
        },

        calender: function(){ 
          this.echo('<iframe src="https://calendar.google.com/calendar/embed?height=350&wkst=7&bgcolor=%23ffffff&ctz=Asia%2FDhaka&hl=bn&title=%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%B2%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20&src=ZW4uYmQjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&src=ZW4uaXNsYW1pYyNob2xpZGF5QGdyb3VwLnYuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=aHQzamxmYWFjNWxmZDYyNjN1bGZoNHRxbDhAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%230B8043&color=%234285F4&color=%23B39DDB" style="border-width:0" width="660" height="350" frameborder="0" scrolling="no"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

         wiki: function(){ 
          this.echo('<iframe width="660px" height="350px" id="wiki" src="https://bn.m.wikipedia.org/wiki/%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A6%A7%E0%A6%BE%E0%A6%A8_%E0%A6%AA%E0%A6%BE%E0%A6%A4%E0%A6%BE"></iframe>',
         { raw:true,
        finalize: function(div) {}});
        },

        windows: function(){ 
          this.echo('<div><iframe src="https://98.js.org/" width="660" height="355"></iframe></div>',
         { raw:true,
        finalize: function(div) {}});
        },
        radio: function(){ 
          this.echo('<iframe src="https://tunein.com/embed/player/s122537/" style="width:100%; height:100px;" scrolling="no" frameborder="no"></iframe></br><strong>radio-foorti-88-0</strong>',
         { raw:true,
        finalize: function(div) {}});
        },
        tv: function()
        {
            this.echo('type the name from the chart given below -<br><br><strong style="color:red;font-size:1.5em">somoy&nbsp;&nbsp;&nbsp;&nbsp;channeli&nbsp;&nbsp;&nbsp;&nbsp;rtv&nbsp;&nbsp;&nbsp;&nbsp;channel24&nbsp;&nbsp;&nbsp;&nbsp;gtv</strong>',
            { raw:true, finalize: function(div) {}});
        },
        somoy : function() { this.echo('<iframe width="660" height="360" src="https://www.youtube.com/embed/b37nXCRrvW0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',{ raw:true,finalize: function(div) {}}); },
        channeli : function() { this.echo('<iframe width="660" height="360" src="https://www.youtube.com/embed/gQNeEz9odtM" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',{ raw:true,finalize: function(div) {}}); },
        rtv : function() { this.echo('<iframe width="660" height="360" src="https://www.youtube.com/embed/Wne6AWA6xLI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',{ raw:true,finalize: function(div) {}}); },
        channel24 : function() { this.echo('<iframe width="660" height="360" src="https://www.youtube.com/embed/FkJJG3jNvJs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',{ raw:true,finalize: function(div) {}}); },
        gtv : function() { this.echo('<iframe width="660" height="360" src="https://www.youtube.com/embed/vSHelsYpvkc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',{ raw:true,finalize: function(div) {}}); },



      },
      	
       {
       
      
          greetings: '👋 WELCOME TO MY PERSONAL SITE! Type "help" (without quote) to proceed. Need to contact me? just type "send".📨📬\njawad:~$'
          

      });
      
     
