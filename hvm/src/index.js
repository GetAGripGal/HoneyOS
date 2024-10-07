import { HVM } from "./hvm";
import { ASCII_COLOR_ICON } from "./assets";

window.addEventListener("load", () => {
    HVM.display.init();
    HVM.display.textmode_buffer.push_chars(ASCII_COLOR_ICON + "\n" + "\x1b[107m\x1b[30mWith Love! <3 - GetAGripGal\n\x1b[40m\x1b[37m");

    const loop = (sec) => {
        HVM.display.textmode_buffer.push_chars(".." + sec)
        setTimeout(() => loop(sec + 1), 10);
    }
    loop(0);
});

