// Routing and collection selection based on URL path
const rawPath = (window.location.pathname || '/').toLowerCase();
let thisName, otherName;
switch (rawPath) {
  case '/fifi':
    thisName = 'Fifi';
    otherName = 'Totoro';
    document.querySelector('.container').hidden = false;
    break;
  case '/totoro':
    thisName = 'Totoro';
    otherName = 'Fifi';
    document.querySelector('.container').hidden = false;
    break;
}
const thisCollection = `Qpid-${thisName}`;
const otherCollection = `Qpid-${otherName}`;
const archiveTitle = document.getElementById('archiveTitle');
archiveTitle.textContent = `${otherName}'s Archive`;

// Swap collection button logic
const swapBtn = document.getElementById('swapCollection');
swapBtn.textContent = `Go to ${thisName}'s Archive`;
swapBtn.addEventListener('click', function(){
  swapBtn.textContent = swapBtn.textContent == `Go to ${otherName}'s Archive` ? `Go to ${thisName}'s Archive` : `Go to ${otherName}'s Archive`;
  archiveTitle.textContent = archiveTitle.textContent == `${thisName}'s Archive` ? `${otherName}'s Archive` : `${thisName}'s Archive`;
  renderArchiveList(archiveTitle.textContent.includes(thisName) ? thisCollection : otherCollection);
});

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
  db.collection(collectionName).doc(docId).set({field1:v1,field2:v2,field3:v3,createdAt:firebase.firestore.FieldValue.serverTimestamp()})
    .then(() => saveLocalId(docId))
    .catch(err => console.error('Firestore write failed', err));
  document.getElementById('dataForm').reset();
  alert('Submitted!');
});

// Event listeners
function openDetails(data, id){
  document.getElementById('detailField1').textContent = `${data.field1 || ''}`;
  document.getElementById('detailField2').textContent = `${data.field2 || ''}`;
  document.getElementById('detailField3').textContent = `${data.field3 || ''}`;
  document.getElementById('detailsTitle').textContent = `${archiveTitle.textContent} - ${id}`;
  document.getElementById('details').hidden = false;
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

// Keep local submitted document ids to detect external submissions (scoped per collection)
function fetchCollection(collectionName){
  let localCollection = [];
  db.collection(collectionName).orderBy('createdAt', 'desc').get().then(snapshot => {
    snapshot.forEach(doc => {
      localCollection.push({id: doc.id, data: doc.data()});
    });
    localStorage.setItem(`local_${collectionName}`, JSON.stringify(localCollection));
  }).catch(err => console.error('Error fetching initial documents', err));
}
fetchCollection(thisCollection);
fetchCollection(otherCollection);

// Render archive list from localStorage (which is updated on the initial fetch)
function renderArchiveList(collectionName) {
  const list = document.getElementById('archiveList');
  if(!list) return;
  list.innerHTML = '';
  const localData = JSON.parse(localStorage.getItem(`local_${collectionName}`)) || [];
  localData.sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));
  localData.forEach(({id, data}) => {
    const li = document.createElement('li');
    li.textContent = id;
    li.dataset.id = id;
    li.addEventListener('click', () => openDetails(data, id));
    list.appendChild(li);
  });
}
renderArchiveList(otherCollection);
