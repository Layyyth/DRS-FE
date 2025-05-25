import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

:root {
  --color-grey-0: #fff;
  --color-grey-50: #f9fafb;
  --color-grey-100: #f3f4f6;
  --color-grey-500: #6b7280;

  --color-green-100: #dcfce7;
  --color-green-700: #15803d;

  --color-yellow-100: #fef9c3;
  --color-yellow-400: #ca8a04;
  --color-yellow-700: #a16207;

  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;

  --backdrop-color: rgba(0, 0, 0, 0.5);

  --border-radius-md: 7px;

}

* {
margin: 0;
padding: 0;
}

*,
*::after,
*::before {
box-sizing: inherit;

}

html {
font-family: 'Inter', sans-serif;
/* box-sizing: border-box; */
/* font-size: 62.5%; */
}

body {
height: 100dvh;
}

a {
color: inherit;
text-decoration: inherit;
}

ul.MuiList-padding {
display: grid;
gap: .2rem;
}

.switchLogin {
 & a {
    &:hover {
     opacity: .9;
     text-decoration: underline;
    } 
  }
}
`;

export default GlobalStyle;
