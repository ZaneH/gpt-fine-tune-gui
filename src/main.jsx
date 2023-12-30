import { render } from "preact";
import App from "./App";
import "./styles.css";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
    /** Put your mantine theme overrides here */
});

render(
    <MantineProvider theme={theme} defaultColorScheme="dark">
        <App />
    </MantineProvider>,
    document.getElementById("root")
);
