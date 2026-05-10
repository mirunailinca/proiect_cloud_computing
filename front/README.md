# PlantApp - Aplicație Cloud pentru Gestionarea Plantelor

PlantApp este o aplicație web dezvoltată cu Next.js care permite utilizatorilor să își gestioneze colecția de plante și să primească sfaturi de îngrijire personalizate de la un asistent AI. Aplicația utilizează 3 servicii cloud: Firebase Authentication, MongoDB Atlas și Together AI.

---

## Tehnologii folosite

 Next.js 16 - Framework full-stack (frontend + backend API routes) 
 React 19 - Librărie UI 
 Firebase Authentication - Autentificare utilizatori 
 MongoDB Atlas - Bază de date în cloud pentru stocarea plantelor 
 Together AI (Llama 3) - Model AI pentru sfaturi de îngrijire plante 
 TailwindCSS - Stilizare CSS 


## Servicii Cloud utilizate

 1. Firebase Authentication
Firebase este un serviciu cloud oferit de Google, utilizat în această aplicație pentru autentificarea utilizatorilor cu email și parolă. Firebase gestionează sesiunile și persistența autentificării la refresh prin funcția onAuthStateChanged.

 2. MongoDB Atlas
MongoDB Atlas este o bază de date NoSQL în cloud. Aplicația se conectează la un cluster Atlas și stochează datele plantelor într-o colecție numită records. Fiecare document din colecție conține: numele plantei, specia, data adăugării și ID-ul utilizatorului.

 3. Together AI
Together AI oferă acces la modele de limbaj (LLM) prin API. Aplicația utilizează modelul meta-llama/Meta-Llama-3-8B-Instruct-Lite pentru a genera sfaturi personalizate despre îngrijirea plantelor, în funcție de planta selectată de utilizator.

## Endpoint-uri API

GET /api/plants -> returnează toate plantele din baza de date

Response:
```json
[
  {
    "_id": "6a00a7f52aa8fec69ae58140",
    "name": "Ficusul meu",
    "species": "Ficus Elastica",
    "date": "2025-05-10T14:00:00.000Z",
    "userId": "firebase_uid_123"
  }
]
```



POST /api/plants -> adaugă o plantă nouă în baza de date

Request body:
```json
{
  "name": "Ficusul meu",
  "species": "Ficus Elastica",
  "date": "2025-05-10T14:00:00.000Z",
  "userId": "firebase_uid_123"
}
```

Response: `201 Created` cu documentul inserat.



GET /api/plants/[id] -> returnează detaliile unei plante după ID-ul MongoDB

Response:
```json
{
  "_id": "6a00a7f52aa8fec69ae58140",
  "name": "Ficusul meu",
  "species": "Ficus Elastica",
  "userId": "firebase_uid_123"
}
```



DELETE /api/plants/[id] -> sterge o plantă din baza de date după ID

Response:
```json
{ "message": "Deleted successfully" }
```



POST /api/chat -> trimite un mesaj către modelul AI și returnează un răspuns cu sfaturi despre îngrijirea plantei selectate

Request body:
```json
{
  "messages": [
    { "role": "user", "content": "Cât de des ud ficusul?" }
  ],
  "plant": {
    "name": "Ficusul meu",
    "species": "Ficus Elastica"
  }
}
```

Response:
```json
{
  "reply": "Ficusul Elastica preferă un sol ușor umed. Udă-l la fiecare 7-10 zile vara și mai rar iarna, când pământul se usucă complet."
}
```


Capturi ecran

