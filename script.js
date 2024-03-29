// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCcTGiaSu-1MVRs6_dX2k0ZAYDSYysOY5Q",
  authDomain: "my-birthday-666b2.firebaseapp.com",
  databaseURL: "https://my-birthday-666b2.firebaseio.com",
  projectId: "my-birthday-666b2",
  storageBucket: "",
  messagingSenderId: "892038861110",
  appId: "1:892038861110:web:300e01b050b0c381"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var wishbtn, wishcontainer, snackbar, wishcountdis;
var wishdb = db.collection('Wishes');
$(document).ready(() => {
  wishbtn = $('#submit');
  wishcontainer = $('#wishcontainer')[0];
  snackbar = $('#snackbar')[0];
  wishcountdis = $('#wishcount');
  wishbtn.click(addWish);
  showWishes();
})

function addWish() {
  makesnack('Wishing');
  let name = $('#name').val();
  let wish = $('#wish').val();
  let wishdata = {
    sender: name,
    wish: wish
  }
  if(checkBadwords(name) && checkBadwords(wish)) {
    wishdb.add(wishdata).then(docRef => {
      wishdb.doc(docRef.id).update({
        docid: docRef.id,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        let feedback = $('#feedback');
        feedback[0].textContent = `Thank you so much, ${name}`
        feedback.css('visibility', 'visible');
        showWishes();
      });
    }).catch(error => console.log('an error occured', error));
  } else {
    console.log('This is a birthday celebration code for a kid. Why ruin it for fun Please leave this code alone for a day and spoil it later.')
  }
}

function showWishes() {
  makesnack('Wishes are Loading');
  wishdb.orderBy('timestamp', 'desc').get().then((querySnapshot) => {
    while(wishcontainer.firstChild) wishcontainer.removeChild(wishcontainer.firstChild);
    let wishcount = querySnapshot.docs.length;
    wishcountdis[0].innerHTML = `${wishcount} wishes and still counting!`
    wishcountdis.css('visibility', 'visible');
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      let json = doc.data();
      let wishhtml = `
      <div class="onewish">${json.wish} <br> <p class="sender">-- ${json.sender}</p></div>
      `
      wishcontainer.innerText += wishhtml;
    })
  }).then(() => makesnack("Thanks for all these Wishes")).catch(error => console.error(error))
}

function makesnack(msg) {
  snackbar.innerHTML = msg;
  snackbar.className = 'show';
  setTimeout(function() {
    snackbar.className = snackbar.className.replace('show', '');
  }, 3000);
}

function checkBadwords(words) {
  words = words.toLowerCase();
  let wordarray = words.split(' ');
  let foundbadwords = wordarray.filter(el => badWords.includes(el));
  if(foundbadwords.length > 0) {
    return false
  } else {
    return true
  }
}
