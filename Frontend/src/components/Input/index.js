import React, { useState } from "react";
// import { View } from "react-native";

// // import { Container } from './styles';

export default function InputPrazo({ c }) {
  const [valor, setValor] = useState("");
  return (
    <input
      type="text"
      value={valor}
      onFocus={() => {
        setValor(c);
        console.log("Valoe", valor);
      }}
    />
  );
}
