// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBLqH1dA1-m-bv0-xuld1-U-CG7YZtPi2k",
  authDomain: "tfplusplus.firebaseapp.com",
  projectId: "tfplusplus",
  storageBucket: "tfplusplus.firebasestorage.app",
  messagingSenderId: "552430845365",
  appId: "1:552430845365:web:9485213665d1ede16f6dfc",
  measurementId: "G-J1H8W799SK"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
let processedInitialSnapshot = false;

// Keep local submitted document ids to detect external submissions
let localIds = JSON.parse(localStorage.getItem('qpid_local_ids') || '[]');
function saveLocalId(id){
  localIds.push(id);
  localStorage.setItem('qpid_local_ids', JSON.stringify(localIds));
}

// Request notification permission on load (best-effort)
if('Notification' in window && Notification.permission === 'default'){
  Notification.requestPermission().catch(() => {});
}

// Handle form submission
document.getElementById('dataForm').addEventListener('submit', function(e){
  e.preventDefault();
  const v1 = document.getElementById('input1').value.trim();
  const v2 = document.getElementById('input2').value.trim();
  const v3 = document.getElementById('input3').value.trim();
  if(!(v1 && v2 && v3)) {
    alert('Please answer all questions before submitting.');
    return;
  }
  const docId = new Date().toISOString();
  db.collection('Qpid').doc(docId).set({field1:v1,field2:v2,field3:v3, createdAt: firebase.firestore.FieldValue.serverTimestamp()})
    // .then(() => saveLocalId(docId))
    .catch(err => console.error('Firestore write failed', err));
  document.getElementById('dataForm').reset();
  alert('Submitted!');
});

// Event listeners
function openDetails(data, id){
  document.getElementById('detailField1').textContent = `${data.field1 || ''}`;
  document.getElementById('detailField2').textContent = `${data.field2 || ''}`;
  document.getElementById('detailField3').textContent = `${data.field3 || ''}`;
  const details = document.getElementById('details');
  details.hidden = false;
  details.dataset.id = id;
  document.getElementById('archive').hidden = true;
}

document.getElementById('viewArchive').addEventListener('click', function(){
  document.getElementById('archive').hidden = false;
  document.getElementById('dataForm').hidden = true;
});

document.getElementById('closeArchive').addEventListener('click', function(){
  document.getElementById('archive').hidden = true;
  document.getElementById('dataForm').hidden = false;
});

document.getElementById('closeDetails').addEventListener('click', function(){
  document.getElementById('details').hidden = true;
  document.getElementById('archive').hidden = false;
});

// Notification helper
function triggerNotification(title, body){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'granted'){
    try{ new Notification(title, { body }); }catch(e){ console.warn('Notification failed', e); }
  } else if(Notification.permission !== 'denied'){
    Notification.requestPermission().then(perm => { if(perm === 'granted') new Notification(title, { body }); });
  }
}

// Listen for recent submissions and render them
db.collection('Qpid').orderBy('createdAt','asc').limit(20)
  .onSnapshot(function(snapshot){
    snapshot.docChanges().forEach(function(change){
      if(change.type === 'added'){
        const data = change.doc.data() || {};
        const id = change.doc.id;
        const li = document.createElement('li');
        li.textContent = id;
        li.dataset.id = id;
        li.addEventListener('click', () => openDetails(data, id));
        const list = document.getElementById('messages');
        if(list) list.prepend(li);

        // If we've already processed the initial snapshot and this id isn't one we created locally,
        // treat it as a new submission from another user and notify.
        if(processedInitialSnapshot && !localIds.includes(id)){
          triggerNotification('New Qpid submission', data.field1 || 'A new submission was added');
        }
      }
    });
    processedInitialSnapshot = true;
  });
