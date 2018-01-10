const app = {
    URL: '',
    DATA: null,
    init: function(){
        //fetch the data
        app.getData();
        //add event listeners 
        app.addListeners();
        //fix the current url
        history.replaceState({}, "List", "#list");
        document.title = 'List of Items';
    },
    addListeners: function(){
        //back button on second page
        let backBtn = document.querySelector('#details-page header a');
        backBtn.addEventListener('click', app.backHome);
        //listen for the browser back button
        window.addEventListener('popstate', app.browserBack);
    },
    getData: function(){
        let xhr = new XMLHttpRequest();
    xhr.open('GET', './js/data.json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        console.log(xhr.status, xhr.statusText);
        app.DATA = JSON.parse(xhr.responseText);
        console.log(app.DATA);
        //pass the data to a function that builds the first page  
        app.showThings();
      }
    };
    xhr.send(null);
    },
    showThings: function(){
        //loop through the array and display the cards
        //add the click listener on each title
        let list = document.getElementById('itemlist');
        list.innerHTML = '';
        list.appendChild(app.buildCard(app.DATA.currency));
        let titles = document.querySelectorAll('#list-page .item-title');
        [].forEach.call(titles, (h2)=>{
            h2.addEventListener('click', app.navDetails);
        });
    },
    buildCard: function(arr){
        let df = new DocumentFragment();
        arr.forEach((curr) => {
            let card = document.createElement('div');
            card.className = 'item-card';
            let img = document.createElement('img');
            img.className = 'icon';
            img.src = curr.imgurl;
            img.alt = 'logo';
            let title = document.createElement('h2');
            title.className = 'item-title';
            title.setAttribute("data-key", curr.id);
            title.innerHTML = curr.name;
            let type = document.createElement('p');
            type.className = 'item-desc';
            type.textContent = curr.type;
            let desc = document.createElement('p');
            desc.className = 'item-desc';
            desc.textContent = curr.description;
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(type);
            card.appendChild(desc);
            df.appendChild(card);
        });
        return df;
    },
    navDetails: function(ev){
        ev.preventDefault();
        window.scrollTo(0,0);
        let h2 = ev.currentTarget;
        //extract the id from the heading
        let id = h2.getAttribute('data-key');
        //change the url and save the id in the history.state
        console.log(`#details/${id}`);
        history.pushState({"id":id}, "Details", `#details/${id}`);
        document.title = `Details for Item ${id}`;
        //get the info about this item
        let obj = app.getItem(id);
        //pass it to a function to display those details
        
        app.showDetails(obj);
    },
    getItem: function(id){
        //retrieve an object from our JSON data
        //where the id matches the one passed to this function
        
        //dummy data for demonstration purposes
        return app.DATA.currency[parseInt(id)-1];
    },
    showDetails: function(obj){
        //navigate to the second page
        document.getElementById('list-page').classList.remove('active');
        document.getElementById('details-page').classList.add('active');
        //set the title of the selected property
        let span = document.querySelector('.details-title');
        span.textContent = obj.name;
        //loop through the obj properties with a for in loop
        //create some HTML for each property...
        let df = new DocumentFragment();
        obj.developers.forEach((dev)=>{
            let card = document.createElement('div');
            card.className = 'item-card';
            let img = document.createElement('img');
            img.className = 'icon';
            img.src = dev.imgurl;
            img.alt = 'logo';
            let title = document.createElement('h2');
            title.className = 'item-title';
            title.setAttribute("data-key", dev.id);
            title.innerHTML = dev.name;
            let desc = document.createElement('p');
            desc.className = 'item-desc';
            desc.innerHTML = 'Developer';
            card.appendChild(img);
            card.appendChild(title);
            card.appendChild(desc);
            df.appendChild(card);
            let devlist = document.getElementById('devlist');
            devlist.appendChild(df);
        });
    },
    backHome: function(ev){
        if(ev){
            ev.preventDefault();
            //only add to the pushState if the user click OUR back button
            //don't do this for the browser back button
            history.pushState({}, "List", `#list`);
            document.title = 'List of Items';
        }
        document.getElementById('list-page').classList.add('active');
        document.getElementById('details-page').classList.remove('active');
        let devlist = document.getElementById('devlist');
        devlist.innerHTML = '';
    },
    browserBack: function(ev){
        console.log('user hit the browser back button');
        //the browser will change the location hash.
        //use the updated location.hash to display the proper page
        if(location.hash == '#list'){
            console.log('show the list page');
            //we want to show the list page
            app.backHome();
            //NOT passing the new MouseEvent('click')
        }else{
            //we want to display the details
            console.log('show the details');
            let id = location.hash.replace("#details/", "");
            //use the id number from the hash to fetch the proper data
            let obj = app.getItem(id);
            //pass it to a function to display those details
            app.showDetails(obj);
        }
    }
};

let loadEvent = ('deviceready' in document)?'deviceready':'DOMContentLoaded';
document.addEventListener(loadEvent, app.init);