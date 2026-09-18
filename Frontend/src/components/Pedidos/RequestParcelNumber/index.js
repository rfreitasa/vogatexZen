/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import ReceiptIcon from "@material-ui/icons/Receipt";

const useStyles = makeStyles(theme => ({
  modal: {
    display: "flex",
    alignItems: "bottom",
    justifyContent: "bottom"
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    maxHeight: "80%"
  },
  button: {
    border: 0,
    borderRadius: "20px",
    color: "#00acc1",
    background: "transparent",
    padding: "10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  number: {
    // position: "absolute",
    top: "-10px",
    left: "10px",
    // marginRight: "8px",
    borderRadius: "50px",
    // padding: "5px",

    backgroundColor: "#fff",
    index: 999
  }
}));

const StyledBadge = withStyles(theme => ({
  badge: {
    right: 4,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px"
  }
}))(Badge);

// export default function RequestParcelNumber({ paymentTerm }) {
//   const parcelNumber = paymentTerm.split("/");
//   console.log(">>>> RequestParcelNumber", parcelNumber);
//   return (
//     <div>
//       <StyledBadge badgeContent={parcelNumber} color="secondary">
//         <ReceiptIcon />
//       </StyledBadge>
//     </div>
//   );
// }

// RequestParcelNumber.propTypes = {
//   paymentTerm: PropTypes.string.isRequired
// };

class RequestParcelNumber extends React.Component {
  static propTypes = {
    paymentTerm: PropTypes.string.isRequired
  };
  render() {
    // const parcelNumber = this.props.paymentTerm.split("/").length - 1;
    const parcelNumber = this.props.paymentTerm;
    return (
      <div >
        <StyledBadge badgeContent={'x'+parcelNumber} color="secondary">
          <ReceiptIcon />
        </StyledBadge>
      </div>
    );
  }
}

export default RequestParcelNumber;