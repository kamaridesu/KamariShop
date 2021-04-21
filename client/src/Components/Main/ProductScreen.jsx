import React from "react";
import { useParams } from "react-router";

export const ProductScreen = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};
