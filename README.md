# Nedsläpp (hemsida)

SHL-schema med favoritlag. Schemat hämtas automatiskt varje natt från SHL:s kalender.

## Lägg upp på GitHub (en gång)

1. Skapa ett nytt arkiv (repository) på github.com. Kalla det till exempel `nedslapp`. Välj **Public**.
2. Klicka **Add file → Upload files** och dra in **allt** i den här mappen, inklusive mappen `.github`.
   (Den börjar med punkt och kan vara dold. Visa dolda filer om du inte ser den. Alternativt: använd GitHub Desktop eller `git push`.)
3. Gå till **Settings → Pages**. Under *Build and deployment*, välj **Deploy from a branch**, branch **main**, mapp **/ (root)**, och spara.
4. Efter någon minut visas adressen högst upp på samma sida, ungefär `https://DITTANVÄNDARNAMN.github.io/nedslapp/`.

## Slå på nattuppdateringen

1. Gå till fliken **Actions**. Om GitHub frågar, klicka på knappen som tillåter workflows.
2. Öppna **Uppdatera schema**, klicka **Run workflow** och kontrollera att den blir grön. Då fungerar uppdateringen.
3. Därefter körs den av sig själv varje natt. Ändras schemat sparas det som en ny version av `data/schedule.json`.

Om sidan inte visar ett uppdaterat schema efter en körning: kolla under **Actions** att både "Uppdatera schema" och "pages build and deployment" blivit gröna, och ladda om sidan.

## Genväg på telefonen

- **iPhone (Safari):** dela-knappen → **Lägg till på hemskärmen**.
- **Android (Chrome):** menyn (⋮) → **Lägg till på startskärmen** eller **Installera app**.

## Bra att veta

- GitHub kan stänga av schemalagda körningar om arkivet är helt inaktivt under lång tid. Då slår du på dem igen under **Actions**.
- Kalenderlänken ligger i `scripts/update.mjs`. Slutar den fungera ser du att körningen blir röd, och sidan visar då det senast sparade schemat.
- Vill du byta ikon: ersätt filerna i `icons/` (samma namn och storlekar).
