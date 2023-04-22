import React from "react";
import './Card.css'

const Card = ({image}) => {

    return <img className="Card"
        alt="your card"
        src={image}
        />;
}

export default Card;