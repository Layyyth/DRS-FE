import { useTheme } from "../../features/themeContext";
import SwitchThemeButton from "../../ui/SwitchThemeButton";

function SignHeader() {
  const [theme, setTheme] = useTheme();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "end",
        borderBottom: "1px solid rgba(23, 42, 57, 0.214)",
      }}
    >
      <SwitchThemeButton theme={theme} setTheme={setTheme} />
    </header>
  );
}

export default SignHeader;
