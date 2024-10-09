import { HVM } from "./hvm";
import { ASCII_COLOR_ICON } from "./assets";

window.addEventListener("load", () => {
    HVM.display.init();
    HVM.display.textmode_buffer.pushChars(ASCII_COLOR_ICON + "\n" + "\x1b[107m\x1b[30m");

    const welcome = "With Love! <3 - GetAGripGal\n";
    const loop = (index) => {
        if (index > welcome.length) {
            HVM.display.textmode_buffer.pushChars("\x1b[40m\x1b[90mhttps://github.com/GetAGripGal/HoneyOS")
            return;
        }

        const char = welcome.charAt(index);
        HVM.display.textmode_buffer.pushChars(char)
        setTimeout(() => loop(index + 1), 50);
    }
    loop(0);
});