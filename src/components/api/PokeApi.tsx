import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from "@ionic/react";
import TCGdex from "@tcgdex/sdk";
// Instantiate the SDK
const tcgdex = new TCGdex("en");

// go into an async context
(async () => {
  // Card will be Furret from the Darkness Ablaze Set
  const card = await tcgdex.fetch("cards", "swsh3-136");
})();

const PokeApi: React.FC = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchRandomCards = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.tcgdex.net/v2/en/cards/");
      const allCards = await response.json();
      console.log("API Response:", allCards);

      const cardIds = Object.keys(allCards);
      const randomCardIds = cardIds.sort(() => 0.6 - Math.random()).slice(0, 6);
      const cardDetails = randomCardIds.map((id) => allCards[id]);

      console.log("Selected Cards:", cardDetails);
      setCards(cardDetails);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomCards();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Cartas Pokémon Aleatorias</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={fetchRandomCards} disabled={loading}>
          {loading ? "Buscando Cartas..." : "Seleccionar Cartas Aleatorias"}
        </IonButton>

        <IonGrid>
          <IonRow>
            {cards.map((card, index) => (
              <IonCol
                size="12" // Pantallas pequeñas y móviles (1 carta por fila)
                sizeMd="6" // Pantallas medianas como tabletas (2 cartas por fila)
                sizeLg="4" // Pantallas grandes como escritorio (3 cartas por fila)
                key={index}
                className="card-container"
              >
                <p style={{textAlign:"center", fontSize:"24px", fontFamily:"cascadia"}}>{card.name}</p>
                <IonImg
                  src={
                    card.image + "/high.webp" ||
                    "https://assets.tcgdex.net/en/sm/sm10/103/high.webp"
                  }
                  alt={card.name || "Unknown Card"}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        {cards.length === 0 && !loading && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No cards available. Please try again.
          </p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PokeApi;
