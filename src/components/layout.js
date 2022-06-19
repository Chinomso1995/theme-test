/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui"



const Layout = ({children}) => {
  return (
    <div
    sx={{
        width: "100%",
        maxWidth: "1440px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "32px",
        paddingRight: "32px",
    }}
    >
        {children}
    </div>
  )
}

export default Layout