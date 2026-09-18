import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  searchBar: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  cardGrid: {
    flexGrow: 1,
    paddingTop: 16,
  },
  card: {
    flex: 1,
    height: "100%",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    boxShadow: theme.shadows[3],
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: theme.shadows[8],
    },
    padding: theme.spacing(2),
  },
  icon: {
    fontSize: 50,
    color: theme.palette.primary.main,
    verticalAlign: "middle",
    marginRight: theme.spacing(1),
  },
  titleContainer: {
    display: "flex",
    alignItems: "center",
  },
}));



export default useStyles;
