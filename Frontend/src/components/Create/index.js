import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles(() => ({
  button: {
    border: 0,
    borderRadius: "20px",
    backgroundColor: "#22c13d",
    color: "#fff",
    padding: "5px",
    cursor: "pointer"
  }
}));
export default function Create() {
  const classes = useStyles();

  return (
    <button className={classes.button}>
      <AddCircleOutlineIcon />
    </button>
  );
}
