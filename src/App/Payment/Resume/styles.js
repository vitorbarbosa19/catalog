import { fontTitle, gradient, primaryColor } from "@ziro/theme";

export const container = {
        display: "grid",
        alignContent: "start",
        justifyItems: "center",
        gridGap: "25px 0"
    },
    illustrationContainer = {},
    proposeContainer = {
        display: "grid",
        gridRowGap: "4px",
        marginTop: "-15px"
    },
    infoContainer = {
        display: "grid",
        gridGap: "5px 0",
        width: "100%",
        padding: "25px 15px",
        boxSizing: "border-box",
        border: "1px solid #EEE",
        borderRadius: "8px",
        boxShadow: `rgba(34, 34, 34, 0.35) 0px 4px 14px -5px`,
    },
    header = {
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        alignItems: "center",
        margin: "0 0 6px"
    },
    summary = {
        display: "grid",
        gridTemplateColumns: "auto auto",
        alignItems: "center",
        gridColumnGap: "5px",
        fontFamily: fontTitle
    },
    modalMessage = {
      fontSize: '1.5rem'
    },
    buttonsContainer = {
        display: "grid",
        width: "100%",
        justifyItems: "center",
        gridGap: "10px 0",
    },
    titleText = {
        fontFamily: fontTitle,
        textTransform: "uppercase",
        color: primaryColor,
        textAlign: "center",
    },
    bodyText = {
        textAlign: "center",
        fontSize: "1.5rem",
    },
    infoTitle = {
        fontSize: "1.5rem",
        fontFamily: fontTitle,
    },
    sellerText = {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        gridColumnGap: "30px",
    },
    payInfo = {
        alignSelf: "end",
        fontSize: "1.5rem",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis"
    },
    highlightedButton = {
        WebkitAppearance: "none",
        WebkitTapHighlightColor: "rgba(0,0,0,0)",
        MozAppearance: "none",
        display: "grid",
        width: "100%",
        maxWidth: "80%",
        margin: "0 auto",
        padding: "8px 0px",
        fontFamily: fontTitle,
        fontSize: "1.3rem",
        color: "#FFF",
        textAlign: "center",
        outline: "none",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        background: gradient,
        boxShadow: `0px 3px 8px -3px rgba(34,34,34,0.65)`,
    },
    loginText = {
        fontFamily: fontTitle,
        fontSize: "1.3rem",
        color: primaryColor,
        textDecoration: "underline",
        cursor: "pointer",
    };
