import { Icon } from "@iconify/react/dist/iconify.js";
import { IconButton } from "@mui/material";

function SwitchThemeButton({ theme, setTheme }) {
  return (
    <IconButton
      onClick={function () {
        if (theme === "light") setTheme("dark");
        else setTheme("light");
      }}
      aria-label="delete"
      color="primary"
    >
      <Icon
        icon={
          theme === "light"
            ? "si:light-mode-line"
            : "material-symbols:dark-mode-outline"
        }
        width="30px"
        height="30px"
      />
    </IconButton>
  );
}

export default SwitchThemeButton;
