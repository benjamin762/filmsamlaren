# FilmSamlaren
FilmSamlaren är en webbapplikation som låter användaren söka efter filmer, visa mer information om filmerna och spara dem i en favoritlista.

## Instruktioner 
1. Ladda ner från github.
2. Lägg in en omdb api-nyckel som en sträng i en fil api-keys.json.
https://www.omdbapi.com/
3. Öppna med live server i vscode.

## Användning
Applikationen har fyra funktionen med allt som en filmsamlare behöver.

### A) Söka efter en film
1. Skriv in sökord i sökrutan.
2. Klicka på sök.
3. Titta på sökresultaten.

### B) Visa mer information om en film
1. Välj vilken av filmerna på skärmen du vill veta mer om.
2. Klicka på den.

Klicka på filmens titel igen för att fälla ihop rutan med mer information.

Det går visa flera filmers information samtidigt, t. ex. om du vill jämföra två filmer eller skriva ut information om flera av dina favoritfilmer.

### C) Spara film som favorit
För att spara en av filmerna som du hittat enligt instruktion A:
1. Klicka på en film likt instruktion B ovan.
2. Klicka på favorit-knappen.

Filmen finns nu även under favorit-rubriken längre ner eller till höger på sidan och är sparad som favoritfilm.

### D) Ta bort favorit
1. Välj vilken av dina favoritfilmer som inte längre känns som en favorit.
2. Klicka på filmen.
3. Klicka på ta bort-knappen.

### Ändra textstorlek
För göra texten och bilderna större eller mindre: sätt två fingrar på din pekskärm eller musplatta och för isär eller dra ihop dem tills önskad storlek visas.

## Figma
https://www.figma.com/design/zROFnkrxyiUVQpbon5Uh8s/Filmsamlaren?node-id=0-1&t=TogBX5AZ8BUA1Juf-1

## Kraven
JSON Applikationen hämtar json-data från omdb api och presenterar den både som listor med filmer och tabeller och bilder när man visa mer information.

ASYNC Applikationen är skriven med asyknron kod och använder async await för att hämta data med fetch-anropen. Try catch används för felhantering. Det finns både felprevention och felhantering. Det går inte söka med tom sökruta och olika fel med nätverk, api och api-nycklar hanteras med felmeddelanden och utan att sidan blir trasig.

UI Det finns en mockup i figma. UIUX är gjort för att fokusera på applikationens huvudsakliga funktion för att vara lätt att använda utan distraktioner. Det är en ren minimalistisk design med bra kontrast som är lätt att överblicka och använda. Bilderna har alt-text, sidan har struktur i html och länkar och knappar är både semantiska så de funkar med hjälpmedel och konsekventa och igennkännbara för användaren. Användaren får återkoppling när mer data laddas om filmerna och ett felmeddelande om det misslyckas. Felmeddelandet visas under filmen där felet uppstod.

## Data från API
Hur applikaitonen använder data från från API:

1. Sökning - Användaren söker efter en film. Fetch http://www.omdbapi.com/?s= som ger en lista med filmtitlar och bilder 
2. Visa detaljer - när en filmruta fälls ut för att visa detajerad information så anropas nästa endpoint http://www.omdbapi.com/?i= med filmens id och applikationen får mer inforamtion om den specifika filmen.
3. Favorit - favoriterna sparas i localstorage med hela informationen som redan finns laddad så inga ytterligare api-anrop görs.

(Filmerna som visas från början är samma som en sökning som bara är förinställd.)
