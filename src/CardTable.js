import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';
import Card from "./Card"
import "./CardTable.css"

const API_URL = "https://deckofcardsapi.com/api/deck/"

const CardTable = () => {
    const [deck, setDeck] = useState(null);
    const [cards, setCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerRef = useRef(null);
    
    // load deck of cards.
    useEffect(() =>
        async function loadDeck() {
            console.log('adding deck to state')
            const res = await axios.get(`${API_URL}/new/shuffle`)
            setDeck(res.data);
        }, [setDeck]
    );
    
    // add cards to the cards state.
    useEffect(() => {
        async function drawCards() {
            let { deck_id } = deck;
            const newCard = await axios.get(`${API_URL}${deck_id}/draw/`);
            if (newCard.data.remaining === 0) {
                setAutoDraw(false);
                alert('out of cards!')
            }
            const card = newCard.data.cards[0];
            setCards(cards => [
                ...cards,
                {
                    id: card.code,
                    image: card.image
                }
            ])
        }
        // check for autodraw toggle = true.
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await drawCards();
            }, 500);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);
        
    // make an array of cards to present on page.
    const cardsOnPage = cards.map(c =>
        <Card key={c.id} image={c.image} />
    )
    
    // turn on or off auto-draw
    const toggleAuto = () => {
        setAutoDraw(c => !c)
    }
    
    console.log(cards.map(c => c.id));
    
    return (
        <div className="CardTable">
            <button onClick={toggleAuto}>
                {autoDraw ? "Stop" : "Keep"} Drawing Cards!
            </button>
            <div className='CardTable-Cards'>
                {cardsOnPage}
            </div>
        </div>
    )
}

export default CardTable;