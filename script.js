// Replace the firebaseConfig object with your Firebase project config.
// If you prefer a different SDK version, include its scripts in index.html.
var firebaseConfig = {
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

document.getElementById('dataForm').addEventListener('submit', function(e){
  e.preventDefault();
  const v1 = document.getElementById('input1').value.trim();
  const v2 = document.getElementById('input2').value.trim();
  const v3 = document.getElementById('input3').value.trim();
  if(!v1 && !v2 && !v3) return;
  db.collection('submissions').add({field1:v1,field2:v2,field3:v3, createdAt: firebase.firestore.FieldValue.serverTimestamp()})
    .catch(err => console.error('Firestore write failed', err));
  document.getElementById('dataForm').reset();
});

// Show recent submissions (live)
db.collection('submissions').orderBy('createdAt','desc').limit(20)
  .onSnapshot(function(snapshot){
    snapshot.docChanges().forEach(function(change){
      if(change.type === 'added'){
        const data = change.doc.data();
        const li = document.createElement('li');
        li.textContent = `${data.field1 || ''} — ${data.field2 || ''} — ${data.field3 || ''}`;
        const list = document.getElementById('messages');
        list.prepend(li);
      }
    });
  });
